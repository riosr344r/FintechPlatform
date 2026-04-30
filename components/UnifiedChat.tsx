import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Image as ImageIcon, Mic, Paperclip, FastForward, Brain, Zap, Settings, AlignLeft, AlignCenter, AlignRight, Play, Square, Loader2, Volume2, VolumeX, X, FileText } from 'lucide-react';
import type { BotPersonality } from '../types';
import { GoogleGenAI, Modality, Content, Part } from '@google/genai';
import { extractTextFromWord, fileToBase64 } from '../utils/fileUtils';
import { decode, decodeAudioData } from '../utils/audioUtils';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

interface UnifiedChatProps {
  courseSystemPrompt: string;
  userName: string;
  knowledgeBase?: string;
  botPersonality: BotPersonality;
  courseTitle: string;
}

type DetailMode = 'detailed' | 'balanced' | 'concise';
type SpeedMode = 'thinking' | 'fast' | 'normal';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isError?: boolean;
}

interface AttachedFile {
  file: File;
  text?: string;
  base64?: string;
  isPdf?: boolean;
  isLoading?: boolean;
}

export const UnifiedChat: React.FC<UnifiedChatProps> = ({ courseSystemPrompt, userName, knowledgeBase, botPersonality, courseTitle }) => {
  const [input, setInput] = useState('');
  const [detailMode, setDetailMode] = useState<DetailMode>('balanced');
  const [speedMode, setSpeedMode] = useState<SpeedMode>('normal');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `أهلاً يا ${userName}! 👋 أنا ${botPersonality === 'bakkar' ? 'بكار' : 'هنية'}، مساعدك الذكي في مادة ${courseTitle}. إزاي أقدر أساعدك؟` }
  ]);
  const [geminiHistory, setGeminiHistory] = useState<Content[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentAudioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const botName = botPersonality === 'bakkar' ? 'بكار الذكي' : 'هنية الذكية';
  const botAvatar = botPersonality === 'bakkar' 
    ? 'https://j.top4top.io/p_37593ndpq1.png' 
    : 'https://h.top4top.io/p_3759u2ov61.png';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, attachedFiles, isLoading]);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      for (const file of files) {
        const fileObj: AttachedFile = { file, isLoading: true };
        setAttachedFiles(prev => [...prev, fileObj]);
        
        try {
          if (file.name.endsWith('.pdf')) {
             const base64 = await fileToBase64(file);
             setAttachedFiles(prev => prev.map(f => f.file === file ? { ...f, base64, isPdf: true, isLoading: false } : f));
          } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
             const text = await extractTextFromWord(file);
             setAttachedFiles(prev => prev.map(f => f.file === file ? { ...f, text, isLoading: false } : f));
          } else {
             const base64 = await fileToBase64(file);
             setAttachedFiles(prev => prev.map(f => f.file === file ? { ...f, base64, isLoading: false } : f));
          }
        } catch (error) {
             console.error("Error reading file", error);
             setAttachedFiles(prev => prev.filter(f => f.file !== file)); 
        }
      }
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (fileToRemove: File) => {
    setAttachedFiles(prev => prev.filter(f => f.file !== fileToRemove));
  };

  const stopAudio = () => {
    if (currentAudioSourceRef.current) {
        currentAudioSourceRef.current.stop();
        currentAudioSourceRef.current = null;
    }
  };

  const playTTS = async (text: string) => {
    try {
        stopAudio();
        const response = await ai.models.generateContent({
           model: "gemini-3.1-flash-tts-preview",
           contents: [{ parts: [{ text }] }],
           config: {
               responseModalities: [Modality.AUDIO], 
               speechConfig: {
                   voiceConfig: {
                     prebuiltVoiceConfig: { voiceName: botPersonality === 'bakkar' ? 'Puck' : 'Kore' },
                   },
               },
           },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (base64Audio) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            if (audioContextRef.current.state === 'suspended') {
                 await audioContextRef.current.resume();
            }
            const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start();
            currentAudioSourceRef.current = source;
        }
    } catch (e) {
        console.error("TTS error:", e);
    }
  };

  const handleSend = async () => {
    if (!input.trim() && attachedFiles.length === 0) return;
    
    if (attachedFiles.some(f => f.isLoading)) {
       return; 
    }

    setIsLoading(true);
    stopAudio();

    const currentUserInput = input;
    const currentFiles = [...attachedFiles];
    
    setInput('');
    setAttachedFiles([]); 
    
    let userMsgDisplay = currentUserInput;
    if (currentFiles.length > 0) {
        const fileNames = currentFiles.map(f => f.file.name).join('، ');
        userMsgDisplay += userMsgDisplay ? `\n(مرفق: ${fileNames})` : `(مرفق: ${fileNames})`;
    }
    
    setMessages(prev => [...prev, { role: 'user', content: userMsgDisplay }]);
    
    let newParts: Part[] = [];
    if (currentUserInput) {
       newParts.push({ text: currentUserInput });
    }
    
    for (const file of currentFiles) {
        if (file.isPdf && file.base64) {
             newParts.push({ inlineData: { mimeType: 'application/pdf', data: file.base64 } });
        } else if (file.text) {
             newParts.push({ text: `\n[محتوى الملف المرفق ${file.file.name}]:\n${file.text}` });
        } else if (file.base64) {
             const mimePrefix = file.file.type || 'image/jpeg';
             newParts.push({ inlineData: { mimeType: mimePrefix, data: file.base64 } });
        }
    }

    const detailInstruction = detailMode === 'detailed' 
        ? "أجب بتفصيل شديد وركز على الشرح العميق." 
        : detailMode === 'concise' 
        ? "أجب باختصار شديد ومباشرة." 
        : "أجب بشكل متوازن ومناسب للفهم.";

    const sysInst = `${courseSystemPrompt}
    أنت تتحدث اللهجة المصرية العامية.
    اسم المستخدم: ${userName}
    معلومات المنهج: ${knowledgeBase || 'لا يوجد'}
    أسلوبك: ${botPersonality === 'bakkar' ? 'ولد محترم ومرح' : 'بنت هادية وذكية'}
    ${detailInstruction}
    هام جداً: استخدم تنسيق Markdown لتنظيم إجاباتك وجعلها سهلة القراءة.
    `;

    const modelName = speedMode === 'thinking' ? 'gemini-3.1-pro-preview' : 'gemini-3-flash-preview';
    
    try {
        const response = await ai.models.generateContent({
            model: modelName,
            contents: [...geminiHistory, { role: 'user', parts: newParts }],
            config: {
                systemInstruction: sysInst,
            }
        });
        
        const responseText = response.text || "";
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
        setGeminiHistory(prev => [
            ...prev, 
            { role: 'user', parts: newParts }, 
            { role: 'model', parts: [{ text: responseText }] }
        ]);

        if (isVoiceActive) {
            playTTS(responseText);
        }

    } catch (e: any) {
        console.error("GenAI Error", e);
        setMessages(prev => [...prev, { role: 'assistant', content: "للأسف حصل خطأ في الاتصال. حاول تاني.", isError: true }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent text-gray-900 dark:text-gray-100 font-sans">
      <div className="p-3 border-b border-gray-200 dark:border-[#1e293b] flex items-center bg-white/50 dark:bg-[#131b2f]/50 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
            <div className="relative">
                <img src={botAvatar} alt="Bot Avatar" className="w-12 h-12 rounded-full border border-gray-200 dark:border-[#3b465e] bg-gray-50 dark:bg-[#0b1021] object-cover shadow-sm" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#131b2f]"></div>
            </div>
            <div className="text-right">
                <h2 className="text-xl font-black text-gray-900 dark:text-white mb-0.5 tracking-tight">{botName}</h2>
                <p className="text-gray-500 dark:text-[#64748b] text-[11px] uppercase tracking-wider font-bold">{courseTitle}</p>
            </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} w-full group`}>
            {msg.role === 'assistant' && (
                <div className="flex flex-col items-center gap-2 shrink-0 ml-4">
                    <img src={botAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 dark:border-[#3b465e] bg-gray-50 dark:bg-[#0b1021] object-cover shadow-sm" />
                    <button 
                        onClick={() => playTTS(msg.content)} 
                        className="opacity-0 group-hover:opacity-100 mt-2 p-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full border border-gray-200 dark:border-gray-700 transition-all shadow-sm"
                        title="استمع للإجابة"
                    >
                        <Volume2 size={14} />
                    </button>
                </div>
            )}
            <div className={`p-4 rounded-2xl max-w-[85%] md:max-w-[70%] text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                msg.role === 'user' 
                ? 'bg-gradient-to-br from-primary-600 to-indigo-600 text-white rounded-br-none shadow-primary-500/20' 
                : msg.isError 
                   ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-bl-none'
                   : 'bg-white dark:bg-[#1a233a] border border-gray-100 dark:border-[#2d3748] text-gray-800 dark:text-gray-100 rounded-bl-none shadow-gray-200/50 dark:shadow-none'
            }`}>
              <div className="markdown-body prose dark:prose-invert max-w-none text-[15px] leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start w-full">
                <div className="shrink-0 ml-4">
                  <img src={botAvatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-200 dark:border-[#3b465e] bg-gray-50 dark:bg-[#0b1021] object-cover shadow-sm opacity-70" />
                </div>
                <div className="p-4 rounded-2xl bg-white dark:bg-[#1a233a] border border-gray-100 dark:border-[#2d3748] text-gray-800 dark:text-gray-100 rounded-bl-none flex gap-2 items-center">
                    <span className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></span>
                    <span className="animate-pulse w-2 h-2 bg-gray-400 rounded-full delay-100"></span>
                    <span className="animate-pulse w-2 h-2 bg-gray-400 rounded-full delay-200"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-[#1e293b] bg-gray-50/80 dark:bg-[#0b1021]/80 backdrop-blur-md shrink-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
            {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 px-2">
                    {attachedFiles.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg shadow-sm text-sm">
                            {f.isLoading ? <Loader2 size={14} className="animate-spin text-primary-500" /> : <FileText size={14} className="text-primary-500" />}
                            <span className="text-gray-700 dark:text-gray-200 truncate max-w-[150px]">{f.file.name}</span>
                            <button onClick={() => removeFile(f.file)} className="text-gray-400 hover:text-red-500 transition-colors ml-1">
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-nowrap items-center gap-2 overflow-x-auto no-scrollbar pb-1 relative">
                {/* Model Mode Group */}
                <div className="flex items-center bg-gray-100 dark:bg-[#0b1021] rounded-xl p-1 border border-gray-200 dark:border-[#1e293b] shrink-0">
                    <button 
                        onClick={() => setSpeedMode('thinking')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${speedMode === 'thinking' ? 'bg-white dark:bg-[#1a233a] text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        type="button"
                    >
                        <Brain size={14} />
                        <span>تفكير</span>
                    </button>
                    <button 
                        onClick={() => setSpeedMode('fast')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${speedMode === 'fast' ? 'bg-white dark:bg-[#1a233a] text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        type="button"
                    >
                        <Zap size={14} />
                        <span>سريع</span>
                    </button>
                </div>

                {/* Verbosity Group */}
                <div className="flex items-center bg-gray-100 dark:bg-[#0b1021] rounded-xl p-1 border border-gray-200 dark:border-[#1e293b] shrink-0">
                    <button 
                        onClick={() => setDetailMode('concise')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${detailMode === 'concise' ? 'bg-white dark:bg-[#1a233a] text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        type="button"
                    >
                        <AlignRight size={14} />
                        <span>مختصر</span>
                    </button>
                    <button 
                        onClick={() => setDetailMode('balanced')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${detailMode === 'balanced' ? 'bg-white dark:bg-[#1a233a] text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        type="button"
                    >
                        <AlignCenter size={14} />
                        <span>متوازن</span>
                    </button>
                    <button 
                        onClick={() => setDetailMode('detailed')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${detailMode === 'detailed' ? 'bg-white dark:bg-[#1a233a] text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                        type="button"
                    >
                        <AlignLeft size={14} />
                        <span>مفصل</span>
                    </button>
                </div>

                <div className="w-px h-5 bg-gray-200 dark:bg-[#2d3748] shrink-0 hidden sm:block"></div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    multiple 
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                />
                <button onClick={handleFileClick} className="flex items-center shrink-0 gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a233a] hover:bg-gray-100 dark:hover:bg-[#2d3748] border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-[#a0aec0] hover:text-gray-900 dark:hover:text-white rounded-lg text-xs font-bold transition-all shadow-sm">
                    <Paperclip size={14} className="text-primary-500" />
                    <span>أرفق ملف</span>
                </button>
                <button 
                  onClick={() => setIsVoiceActive(!isVoiceActive)}
                  title="تفعيل الاستماع للإجابات تلقائياً"
                  className={`flex items-center shrink-0 gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${isVoiceActive ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/30' : 'bg-white dark:bg-[#1a233a] hover:bg-gray-100 dark:hover:bg-[#2d3748] border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-[#a0aec0] hover:text-gray-900 dark:hover:text-white'}`}
                >
                    {isVoiceActive ? <Volume2 size={14} className="animate-pulse" /> : <VolumeX size={14} />}
                    <span>صوت تلقائي</span>
                </button>
                <button 
                  onClick={stopAudio}
                  title="إيقاف المقطع الصوتي"
                  className="flex items-center shrink-0 gap-1.5 px-3 py-1.5 bg-white dark:bg-[#1a233a] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 border border-gray-200 dark:border-[#2d3748] text-gray-600 dark:text-[#a0aec0] rounded-lg text-xs font-bold transition-all shadow-sm"
                >
                    <Square size={14} />
                    <span>إيقاف الصوت</span>
                </button>
            </div>

            <div className="flex items-center gap-2 bg-white dark:bg-[#131b2f] p-2 rounded-2xl border border-gray-200 dark:border-[#2d3748] focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all shadow-inner relative">
                <input 
                    type="text" 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    disabled={isLoading}
                    placeholder="اكتب سؤالك هنا..." 
                    className="flex-grow bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white px-3 outline-none text-base placeholder-gray-400 dark:placeholder-gray-500 disabled:opacity-50"
                    dir="rtl"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || (!input.trim() && attachedFiles.length === 0)}
                    className="p-3 bg-gradient-to-r from-primary-600 to-indigo-600 text-white rounded-xl hover:from-primary-500 hover:to-indigo-500 shadow-lg shadow-primary-500/30 transition-all flex-shrink-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

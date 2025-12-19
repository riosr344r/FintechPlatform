
import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { generateChatResponse, generateSpeech, ChatMode, Verbosity } from '../services/geminiService';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { IconUser, IconSparkles, IconBolt, IconBrain, IconSend, IconSound, IconLoader, IconShortText, IconLongText, IconScale } from './icons';

interface ChatbotProps {
  courseSystemPrompt: string;
  userName: string;
  knowledgeBase?: string;
}

export const Chatbot: React.FC<ChatbotProps> = ({ courseSystemPrompt, userName, knowledgeBase }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: `أهلاً يا ${userName}! 👋 أنا بكار، مساعدك الذكي. جاهز أشرحلك أي حاجة في المادة دي!` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  const [verbosity, setVerbosity] = useState<Verbosity>('balanced');
  const { playAudio, isPlaying } = useAudioPlayer();
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let knowledgeInstruction = "";
      if (knowledgeBase) {
          knowledgeInstruction = `
          USE THE FOLLOWING KNOWLEDGE BASE AS YOUR PRIMARY SOURCE OF TRUTH. 
          If the answer is found in the knowledge base, use it.
          Knowledge Base:
          ${knowledgeBase}
          `;
      }

      const fullSystemPrompt = `${courseSystemPrompt}\n\n${knowledgeInstruction}\n\nUser name is: ${userName}. Your name is "Bakkar" (بكار). You are a smart, friendly, and enthusiastic AI tutor for commerce students. You speak in a helpful, encouraging tone, sometimes using Egyptian colloquialisms if appropriate to sound natural like the character Bakkar, but keep the academic content accurate and professional. Address the user by name occasionally.\n\nDEVELOPER INFO: The developer of this platform is "Lido" (المطور ليدو). If anyone asks who developed, created, or built the platform, or who is the developer, or asks "مين المطور؟" always say that the developer is Lido (المطور ليدو) and nothing else regarding attribution.\n\nIMPORTANT: Do not use Markdown formatting (like **bold** or *italic*). Do not use asterisks (*) in your response. Output plain text only.`;
      
      const responseText = await generateChatResponse(input, messages, fullSystemPrompt, chatMode, verbosity);
      const modelMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: "عفواً، حصل خطأ. ممكن تجرب تاني." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlayTTS = async (text: string) => {
    if (isPlaying) return;
    try {
        // Strip asterisks for speech as well
        const cleanText = text.replace(/\*/g, '');
        const audioContent = await generateSpeech(cleanText);
        playAudio(audioContent);
    } catch (error) {
        console.error("Error generating speech:", error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-h-[700px] bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="bg-white dark:bg-gray-800 p-4 border-b border-gray-100 dark:border-gray-700 shadow-sm z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-100 shadow-lg shadow-primary-500/20">
                        <img 
                            src="https://avatar.iran.liara.run/public/boy?username=Bakkar" 
                            alt="Bakkar" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></div>
                 </div>
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">بكار الذكي</h3>
                    <p className="text-xs text-primary-600 dark:text-primary-400 font-medium">مساعدك الشخصي في المادة</p>
                 </div>
             </div>
        
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                {/* Model Mode Group */}
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 flex items-center">
                    <ModeToggle label="عادي" icon={<IconSparkles className="h-3.5 w-3.5" />} mode="standard" currentMode={chatMode} setMode={setChatMode} />
                    <ModeToggle label="سريع" icon={<IconBolt className="h-3.5 w-3.5" />} mode="fast" currentMode={chatMode} setMode={setChatMode} />
                    <ModeToggle label="تفكير" icon={<IconBrain className="h-3.5 w-3.5" />} mode="thinking" currentMode={chatMode} setMode={setChatMode} />
                </div>

                {/* Divider */}
                <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

                {/* Verbosity Group */}
                <div className="bg-gray-100 dark:bg-gray-700/50 rounded-xl p-1 flex items-center">
                    <VerbosityToggle value="concise" label="مختصر" icon={<IconShortText className="h-3.5 w-3.5" />} current={verbosity} set={setVerbosity} />
                    <VerbosityToggle value="balanced" label="متوازن" icon={<IconScale className="h-3.5 w-3.5" />} current={verbosity} set={setVerbosity} />
                    <VerbosityToggle value="detailed" label="مفصل" icon={<IconLongText className="h-3.5 w-3.5" />} current={verbosity} set={setVerbosity} />
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-primary-100 border border-primary-200 shadow-sm">
                     <img 
                        src="https://avatar.iran.liara.run/public/boy?username=Bakkar" 
                        alt="Bakkar" 
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            
            <div className={`max-w-md p-4 rounded-2xl shadow-sm ${msg.role === 'user' ? 'bg-primary-600 text-white rounded-tr-none' : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-100 dark:border-gray-600'}`}>
              <p className="text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
                {msg.text.replace(/\*/g, '')}
              </p>
              {msg.role === 'model' && msg.id !== 'init' && (
                <div className="mt-2 flex items-center justify-end border-t border-gray-100 dark:border-gray-600 pt-2 gap-2">
                    <button 
                        onClick={() => handlePlayTTS(msg.text)} 
                        disabled={isPlaying} 
                        className="p-1.5 text-gray-400 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg disabled:opacity-50 transition-all"
                        title="قراءة الرد صوتياً"
                    >
                        <IconSound className="h-4 w-4" />
                    </button>
                </div>
              )}
            </div>

            {msg.role === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden"><IconUser className="h-5 w-5 text-gray-500 dark:text-gray-300" /></div>}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full overflow-hidden bg-primary-100 border border-primary-200">
                    <img 
                        src="https://avatar.iran.liara.run/public/boy?username=Bakkar" 
                        alt="Bakkar" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="p-4 rounded-2xl rounded-tl-none bg-white dark:bg-gray-700 flex items-center gap-3 border border-gray-100 dark:border-gray-600 shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-400 font-medium">بكار بيفكر...</span>
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اسأل بكار أي حاجة..."
            className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700/50 border-transparent focus:border-primary-500 focus:bg-white dark:focus:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500/20 focus:outline-none transition-all shadow-inner"
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="p-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-xl disabled:from-gray-400 disabled:to-gray-500 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 transform hover:scale-105 active:scale-95">
            <IconSend className="h-5 w-5 transform rotate-180" />
          </button>
        </form>
      </div>
    </div>
  );
};

interface ModeToggleProps {
    label: string;
    icon: React.ReactNode;
    mode: ChatMode;
    currentMode: ChatMode;
    setMode: (mode: ChatMode) => void;
}

const ModeToggle: React.FC<ModeToggleProps> = ({ label, icon, mode, currentMode, setMode }) => (
    <button 
        onClick={() => setMode(mode)} 
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
            currentMode === mode 
            ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
        }`} 
        title={label}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);

interface VerbosityToggleProps {
    label: string;
    icon: React.ReactNode;
    value: Verbosity;
    current: Verbosity;
    set: (v: Verbosity) => void;
}

const VerbosityToggle: React.FC<VerbosityToggleProps> = ({ label, icon, value, current, set }) => (
    <button 
        onClick={() => set(value)} 
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 ${
            current === value 
            ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
        }`} 
        title={label}
    >
        {icon}
        <span className="hidden sm:inline">{label}</span>
    </button>
);


import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage, Source } from '../../types';
import { IconSend, IconLoader, IconSparkles, IconUser, IconSound, IconHeadphones } from '../icons';
import { generateSpeech, generatePodcastStream } from '../../services/geminiService';
import { useAudioPlayer } from '../../hooks/useAudioPlayer';

interface ChatPanelProps {
  messages: ChatMessage[];
  sources: Source[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  userName: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, sources, onSendMessage, isLoading, userName }) => {
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { playAudio, addToQueue, stopAudio, isPlaying } = useAudioPlayer();
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(input);
    setInput('');
  };
  
  const handleQuickAction = (prompt: string) => {
    onSendMessage(prompt);
  };

  const handlePlayTTS = async (text: string) => {
    if (isPlaying) return;
    try {
        const audioContent = await generateSpeech(text);
        playAudio(audioContent);
    } catch (error) {
        console.error("Error generating speech:", error);
    }
  };

  const handleGeneratePodcast = async () => {
      if (sources.length === 0 || isGeneratingPodcast) return;
      
      // Stop any current playback
      if (isPlaying) stopAudio();
      
      setIsGeneratingPodcast(true);
      
      try {
          const stream = generatePodcastStream(sources);
          let hasStartedPlaying = false;

          for await (const audioChunk of stream) {
              addToQueue(audioChunk);
              hasStartedPlaying = true;
          }
          
          if (!hasStartedPlaying) {
             alert("لم يتم إنشاء محتوى صوتي.");
          }

      } catch (error) {
          console.error("Failed to generate podcast:", error);
          alert("فشل إنشاء الملخص الصوتي. حاول مرة أخرى.");
      } finally {
          setIsGeneratingPodcast(false);
      }
  };


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg flex flex-col h-full border border-gray-200 dark:border-gray-700">
      {/* Header with Podcast Button */}
      {sources.length > 0 && (
          <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50 rounded-t-lg">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">مرحباً {userName}</span>
              <button
                onClick={handleGeneratePodcast}
                disabled={isGeneratingPodcast || isPlaying}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {isGeneratingPodcast ? <IconLoader className="w-4 h-4" /> : <IconHeadphones className="w-4 h-4" />}
                  <span>{isGeneratingPodcast ? 'جاري التحضير...' : (isPlaying ? 'جاري التشغيل...' : 'تشغيل الملخص الصوتي (Podcast)')}</span>
              </button>
          </div>
      )}

      {/* Chat History */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 p-8 flex flex-col items-center justify-center h-full">
            <IconSparkles className="h-12 w-12 text-primary-500 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">مساعدك البحثي الذكي</h3>
            <p>أضف مصادرك وابدأ بطرح الأسئلة!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'model' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center"><IconSparkles className="h-5 w-5 text-white" /></div>}
            <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
              <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
              {msg.role === 'model' && (
                <div className="mt-2 flex items-center gap-2">
                    <button onClick={() => handlePlayTTS(msg.text)} disabled={isPlaying} className="p-1 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white disabled:opacity-50 transition-colors">
                        <IconSound className="h-4 w-4" />
                    </button>
                    {msg.citations && msg.citations.length > 0 && (
                         <div className="text-xs text-gray-500 dark:text-gray-400">
                           <span>مستند من: {msg.citations.map(c => c.title).join(', ')}</span>
                         </div>
                    )}
                </div>
              )}
            </div>
            {msg.role === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"><IconUser className="h-5 w-5 text-gray-700 dark:text-white" /></div>}
          </div>
        ))}
         {isLoading && (
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center"><IconSparkles className="h-5 w-5 text-white" /></div>
                <div className="max-w-md p-3 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center">
                    <IconLoader className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="mb-2 flex flex-wrap gap-2">
            <QuickActionButton onClick={() => handleQuickAction("أنشئ ملخصًا شاملًا لجميع المصادر المتاحة.")} disabled={sources.length === 0}>تلخيص كل المصادر</QuickActionButton>
            <QuickActionButton onClick={() => handleQuickAction("بناءً على المصادر، قم بإنشاء 5 أسئلة بصيغة اختيار من متعدد (MCQ) مع الإجابات الصحيحة.")} disabled={sources.length === 0}>توليد أسئلة اختبار</QuickActionButton>
            <QuickActionButton onClick={() => handleQuickAction("أنشئ خريطة ذهنية بصيغة Markdown توضح العلاقات بين الأفكار الرئيسية في المصادر.")} disabled={sources.length === 0}>إنشاء خريطة ذهنية</QuickActionButton>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sources.length > 0 ? "اسأل عن مصادرك..." : "أضف مصدرًا أولاً..."}
            className="flex-1 p-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:outline-none"
            disabled={isLoading || sources.length === 0}
          />
          <button type="submit" disabled={isLoading || !input.trim() || sources.length === 0} className="p-2 bg-primary-600 text-white rounded-lg disabled:bg-gray-400 dark:disabled:bg-gray-500 hover:bg-primary-500 transition-all duration-200 transform hover:scale-110">
            {isLoading ? <IconLoader className="h-5 w-5" /> : <IconSend className="h-5 w-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};

const QuickActionButton: React.FC<{onClick: () => void; disabled: boolean; children: React.ReactNode}> = ({onClick, disabled, children}) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
        {children}
    </button>
);
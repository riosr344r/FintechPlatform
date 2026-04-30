
import React, { useState } from 'react';
import type { Course, BotPersonality } from '../types';
import { UnifiedChat } from './UnifiedChat';
import { LiveConversation } from './LiveConversation';
import { MessageSquare, PhoneCall } from 'lucide-react';

interface CourseHubProps {
  course: Course;
  userName: string;
  botPersonality: BotPersonality;
}

export const CourseHub: React.FC<CourseHubProps> = ({ course, userName, botPersonality }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'call'>('chat');

  return (
    <div className="flex bg-transparent text-gray-900 dark:text-gray-100 transition-colors duration-300 relative flex-1 h-full">
      {/* Primary Interface (AI Assistant) */}
      <div className="flex-grow flex flex-col w-full h-full">
        {/* Navigation Tabs */}
        <div className="flex justify-center border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-[#131b2f]/50 backdrop-blur-md">
           <div className="flex p-2 gap-2">
               <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'chat' ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
               >
                  <MessageSquare size={16} />
                  المحادثة الكتابية
               </button>
               <button
                  onClick={() => setActiveTab('call')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all text-sm ${activeTab === 'call' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
               >
                  <PhoneCall size={16} />
                  المحادثة الصوتية
               </button>
           </div>
        </div>

        {/* Workspace Content */}
        <div className="flex-grow flex flex-col bg-white dark:bg-[#131b2f] border-l border-gray-200 dark:border-[#1e293b] shadow-xl overflow-hidden relative backdrop-blur-xl">
           {/* Inner glow inside container */}
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[80px] mix-blend-screen pointer-events-none"></div>
           <div className="absolute inset-0 z-10 flex flex-col pt-4">
               {activeTab === 'chat' ? (
                   <UnifiedChat courseSystemPrompt={course.systemPrompt} userName={userName} knowledgeBase={course.knowledgeBase} botPersonality={botPersonality} courseTitle={course.titleAr} />
               ) : (
                   <div className="flex-grow overflow-y-auto px-4 pb-12 flex justify-center items-start pt-6">
                       <div className="w-full max-w-4xl">
                           <LiveConversation 
                               userName={userName} 
                               courseName={course.titleAr} 
                               knowledgeBase={course.knowledgeBase} 
                               defaultVoice={botPersonality === 'bakkar' ? 'male' : 'female'}
                           />
                       </div>
                   </div>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};



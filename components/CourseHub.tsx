
import React, { useState } from 'react';
import type { Course, Resource } from '../types';
import { Chatbot } from './Chatbot';
import { ImageAnalyzer } from './ImageAnalyzer';
import { AudioTranscriber } from './AudioTranscriber';
import { LiveConversation } from './LiveConversation';
import { Notebook } from './Notebook';
import { deleteCourse } from '../services/firebaseService';

interface CourseHubProps {
  course: Course;
  userName: string;
}

type Tab = 'chatbot' | 'resources' | 'image-analyzer' | 'audio-transcriber' | 'live-chat' | 'notebook';

export const CourseHub: React.FC<CourseHubProps> = ({ course, userName }) => {
  const [activeTab, setActiveTab] = useState<Tab>('notebook');

  const renderContent = () => {
    switch (activeTab) {
      case 'notebook':
        return <Notebook courseId={course.id} userName={userName} />;
      case 'chatbot':
        return <Chatbot courseSystemPrompt={course.systemPrompt} userName={userName} knowledgeBase={course.knowledgeBase} />;
      case 'resources':
        return <CourseResources resources={course.resources} />;
      case 'image-analyzer':
        return <ImageAnalyzer />;
      case 'audio-transcriber':
        return <AudioTranscriber />;
      case 'live-chat':
        return <LiveConversation userName={userName} courseName={course.titleAr} knowledgeBase={course.knowledgeBase} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="mb-4 md:mb-6 pb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
            <h2 className="text-lg text-gray-600 dark:text-gray-400">{course.titleAr}</h2>
        </div>
        <button 
            onClick={async () => {
                if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
                    await deleteCourse(course.id);
                    window.location.reload();
                }
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
            حذف المادة
        </button>
      </header>

      <div className="flex-shrink-0 mb-4">
        <nav className="flex space-x-2 md:space-x-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-2">
            <TabButton name="دفتر الملاحظات" tab="notebook" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="بكار الذكي" tab="chatbot" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="المصادر" tab="resources" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="تحليل الصور" tab="image-analyzer" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="تحويل الصوت لنص" tab="audio-transcriber" activeTab={activeTab} setActiveTab={setActiveTab} />
            <TabButton name="محادثة صوتية" tab="live-chat" activeTab={activeTab} setActiveTab={setActiveTab} />
        </nav>
      </div>

      <div className="flex-grow overflow-y-auto min-h-0">
        {renderContent()}
      </div>
    </div>
  );
};

interface TabButtonProps {
    name: string;
    tab: Tab;
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
}

const TabButton: React.FC<TabButtonProps> = ({ name, tab, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-3 py-2 font-medium text-sm rounded-t-lg transition-colors duration-200 focus:outline-none whitespace-nowrap ${
            activeTab === tab 
            ? 'border-b-2 border-primary-500 text-primary-600 dark:text-white' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white'
        }`}
    >
        {name}
    </button>
);

const CourseResources: React.FC<{ resources: Resource[] }> = ({ resources }) => (
    <div className="space-y-4 max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">مصادر المادة</h3>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map(res => (
                <li key={res.id} className="py-3 flex items-center justify-between">
                    <div>
                        <p className="font-medium text-gray-800 dark:text-white">{res.title}</p>
                        <span className="text-xs text-gray-500 dark:text-gray-500 uppercase">{res.type}</span>
                    </div>
                    <a href={res.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1 text-sm bg-primary-600 hover:bg-primary-500 rounded-md text-white transition-colors">
                        افتح
                    </a>
                </li>
            ))}
        </ul>
    </div>
);

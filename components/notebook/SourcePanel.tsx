
import React, { useState } from 'react';
import type { Source } from '../../types';
import { IconPlus, IconFileText, IconLink, IconPdf, IconX } from '../icons';
import { AddSourceModal } from './AddSourceModal';

interface SourcePanelProps {
  sources: Source[];
  onAddSource: (source: Omit<Source, 'id'>) => void;
  onRemoveSource: (id: string) => void;
}

export const SourcePanel: React.FC<SourcePanelProps> = ({ sources, onAddSource, onRemoveSource }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getSourceIcon = (type: Source['type']) => {
    switch (type) {
        case 'pdf': return <IconPdf className="h-5 w-5 text-red-400" />;
        case 'link': return <IconLink className="h-5 w-5 text-blue-400" />;
        case 'text':
        default: return <IconFileText className="h-5 w-5 text-emerald-400" />;
    }
  };

  const getSourceBg = (type: Source['type']) => {
    switch (type) {
        case 'pdf': return 'bg-red-500/10 border-red-500/20';
        case 'link': return 'bg-blue-500/10 border-blue-500/20';
        case 'text':
        default: return 'bg-emerald-500/10 border-emerald-500/20';
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">المصادر ({sources.length})</h2>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-500 transition-all duration-200 transform hover:scale-110"
            title="إضافة مصدر جديد"
          >
            <IconPlus className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-3">
          {sources.length === 0 ? (
            <div className="text-center text-gray-400 p-6">
              <p>ابدأ بإضافة مصدرك الأول!</p>
              <p className="text-sm">يمكنك إضافة نصوص أو روابط أو ملفات PDF لتحليلها.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {sources.map(source => (
                <li key={source.id} className="relative group bg-gray-700/50 hover:bg-gray-700 border border-transparent hover:border-gray-600 rounded-xl p-3 transition-all duration-200 cursor-default">
                  <div className="flex gap-3">
                    {/* Icon Container */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center border ${getSourceBg(source.type)}`}>
                      {getSourceIcon(source.type)}
                    </div>
                    
                    {/* Text Content */}
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between mb-1">
                         <h4 className="text-sm font-semibold text-gray-200 truncate pr-2" title={source.title}>{source.title}</h4>
                         <span className="text-[10px] uppercase font-bold text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">{source.type}</span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed opacity-80" title={source.content}>{source.content}</p>
                    </div>
                  </div>
                   <button 
                       onClick={(e) => { e.stopPropagation(); onRemoveSource(source.id); }}
                       className="absolute -top-2 -left-2 p-1 bg-red-500 text-white rounded-full shadow-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 focus:opacity-100"
                       title="حذف المصدر"
                   >
                       <IconX className="h-3 w-3" />
                   </button>
                </li>
              ))}
            </ul>
          )}
        </div>
         <div className="p-3 text-xs text-center text-gray-500 border-t border-gray-700">
            بياناتك ومصادرك آمنة ولا تستخدم لتدريب النموذج.
        </div>
      </div>
      {isModalOpen && (
        <AddSourceModal 
          onClose={() => setIsModalOpen(false)}
          onAddSource={(source) => {
            onAddSource(source);
            setIsModalOpen(false);
          }}
        />
      )}
    </>
  );
};

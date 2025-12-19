
import React, { useState } from 'react';
import { IconClose, IconFileText, IconLink, IconPdf } from '../icons';
import type { Source } from '../../types';

interface AddSourceModalProps {
  onClose: () => void;
  onAddSource: (source: Omit<Source, 'id'>) => void;
}

export const AddSourceModal: React.FC<AddSourceModalProps> = ({ onClose, onAddSource }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<Source['type']>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onAddSource({ title, content, type });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .zoom-in-modal {
          animation: zoomIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div className="bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-2xl relative zoom-in-modal">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <IconClose className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white text-center mb-6">إضافة مصدر جديد</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Type Selector */}
          <div className="flex justify-center space-x-2 mb-4 bg-gray-700/50 p-1 rounded-lg w-fit mx-auto">
              <button
                type="button"
                onClick={() => setType('text')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${type === 'text' ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                  <IconFileText className="w-4 h-4" />
                  <span>نص</span>
              </button>
              <button
                type="button"
                onClick={() => setType('link')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${type === 'link' ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                  <IconLink className="w-4 h-4" />
                  <span>رابط</span>
              </button>
              <button
                type="button"
                onClick={() => setType('pdf')}
                className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${type === 'pdf' ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`}
              >
                  <IconPdf className="w-4 h-4" />
                  <span>PDF</span>
              </button>
          </div>

          <div>
            <label htmlFor="source-title" className="block text-sm font-medium text-gray-300 mb-1">
              عنوان المصدر
            </label>
            <input
              type="text"
              id="source-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'link' ? "مثال: مقال عن التضخم" : "مثال: الفصل الأول من الكتاب"}
              className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
          </div>
          <div>
            <label htmlFor="source-content" className="block text-sm font-medium text-gray-300 mb-1">
              {type === 'link' ? 'الرابط (URL)' : 'المحتوى'}
            </label>
            {type === 'link' ? (
                <input
                  type="url"
                  id="source-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
            ) : (
                <textarea
                  id="source-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={type === 'pdf' ? 4 : 10}
                  className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={type === 'pdf' ? "انسخ محتوى الـ PDF هنا (أو الرابط مؤقتاً)..." : "الصق محتوى المقال أو المستند هنا..."}
                  required
                />
            )}
             {type === 'pdf' && <p className="text-xs text-gray-500 mt-1">* حالياً يرجى نسخ النص من ملف الـ PDF ولصقه هنا للتحليل.</p>}
          </div>
          
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            إضافة المصدر
          </button>
        </form>
      </div>
    </div>
  );
};

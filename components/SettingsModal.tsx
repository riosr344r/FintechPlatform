
import React from 'react';
import type { Theme, FontSize, AccentColor } from '../types';
import { IconClose, IconSun, IconMoon, IconTextSize, IconSparkles } from './icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
}

const ACCENT_COLORS: { value: AccentColor; label: string; class: string }[] = [
  { value: 'indigo', label: 'أزرق نيلي', class: 'bg-indigo-500' },
  { value: 'blue', label: 'أزرق', class: 'bg-blue-500' },
  { value: 'purple', label: 'بنفسجي', class: 'bg-purple-500' },
  { value: 'emerald', label: 'زمردي', class: 'bg-emerald-500' },
  { value: 'rose', label: 'وردي', class: 'bg-rose-500' },
  { value: 'amber', label: 'كهرماني', class: 'bg-amber-500' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  theme, 
  setTheme, 
  fontSize, 
  setFontSize,
  accentColor,
  setAccentColor
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <style>{`
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .zoom-in-modal {
          animation: zoomIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl p-6 w-full max-w-md relative zoom-in-modal transition-colors duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <IconClose className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">إعدادات المنصة</h2>

        <div className="space-y-8">
          {/* Theme Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <IconSun className="w-4 h-4" />
              <span>المظهر</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('light')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'light' 
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300'
                }`}
              >
                <IconSun className="w-5 h-5" />
                <span className="font-medium">فاتح</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex items-center justify-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                  theme === 'dark' 
                    ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300' 
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-primary-300'
                }`}
              >
                <IconMoon className="w-5 h-5" />
                <span className="font-medium">داكن</span>
              </button>
            </div>
          </div>

          {/* Accent Color Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <IconSparkles className="w-4 h-4" />
              <span>لون التطبيق</span>
            </h3>
            <div className="flex flex-wrap gap-3 justify-center">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={`w-10 h-10 rounded-full ${color.class} flex items-center justify-center transition-transform duration-200 ${
                    accentColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110' : 'hover:scale-110'
                  }`}
                  title={color.label}
                >
                  {accentColor === color.value && (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <IconTextSize className="w-4 h-4" />
              <span>حجم الخط</span>
            </h3>
            <div className="flex bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
              <button
                onClick={() => setFontSize('small')}
                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                  fontSize === 'small'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                صغير
              </button>
              <button
                onClick={() => setFontSize('medium')}
                className={`flex-1 py-2 px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                  fontSize === 'medium'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                متوسط
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`flex-1 py-2 px-4 rounded-lg text-lg font-medium transition-all duration-200 ${
                  fontSize === 'large'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                كبير
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

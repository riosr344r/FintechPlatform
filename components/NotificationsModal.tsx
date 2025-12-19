
import React from 'react';
import type { Notification } from '../types';
import { IconClose, IconBell, IconCheckCircle, IconAlert } from './icons';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onMarkAsRead,
  onClearAll 
}) => {
  if (!isOpen) return null;

  const sortedNotifications = [...notifications].sort((a, b) => b.timestamp - a.timestamp);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
        case 'success': return <IconCheckCircle className="h-5 w-5 text-green-500" />;
        case 'warning': return <IconAlert className="h-5 w-5 text-amber-500" />;
        case 'alert': return <IconAlert className="h-5 w-5 text-red-500" />;
        default: return <IconBell className="h-5 w-5 text-primary-500" />;
    }
  };

  const getTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return 'الآن';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return 'منذ يوم';
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center md:justify-end p-4 pt-20 backdrop-blur-sm" onClick={onClose}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-in-modal {
          animation: slideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
      <div 
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl w-full max-w-sm relative slide-in-modal max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <IconBell className="h-5 w-5" />
                <span>الإشعارات</span>
                {notifications.filter(n => !n.read).length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {notifications.filter(n => !n.read).length} جديد
                    </span>
                )}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                <IconClose className="w-5 h-5" />
            </button>
        </div>
        
        <div className="flex-grow overflow-y-auto p-2">
            {sortedNotifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <IconBell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p>لا توجد إشعارات جديدة</p>
                </div>
            ) : (
                <ul className="space-y-2">
                    {sortedNotifications.map(notification => (
                        <li 
                            key={notification.id} 
                            onClick={() => onMarkAsRead(notification.id)}
                            className={`p-3 rounded-lg border transition-all cursor-pointer ${
                                notification.read 
                                ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-100 dark:border-gray-800 opacity-70' 
                                : 'bg-white dark:bg-gray-800 border-primary-100 dark:border-gray-700 shadow-sm hover:bg-primary-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            <div className="flex gap-3">
                                <div className="mt-1 flex-shrink-0">
                                    {getTypeIcon(notification.type)}
                                </div>
                                <div className="flex-grow">
                                    <h4 className={`text-sm font-semibold ${notification.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                        {notification.title}
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                        {notification.message}
                                    </p>
                                    <span className="text-[10px] text-gray-400 mt-2 block">
                                        {getTimeAgo(notification.timestamp)}
                                    </span>
                                </div>
                                {!notification.read && (
                                    <div className="flex-shrink-0 self-center">
                                        <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-2xl">
                <button 
                    onClick={onClearAll}
                    className="w-full py-2 text-sm text-center text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-white transition-colors"
                >
                    مسح كل الإشعارات
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
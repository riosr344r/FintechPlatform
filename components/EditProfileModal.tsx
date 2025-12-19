
import React, { useState, useRef } from 'react';
import type { User } from '../types';
import { IconUser, IconCamera, IconClose } from './icons';

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onSave }) => {
  const [name, setName] = useState(user.name);
  const [picture, setPicture] = useState<string | null>(user.picture);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      ...user,
      name,
      picture: picture || user.picture,
    });
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
      <div className="bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-8 w-full max-w-md relative zoom-in-modal">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <IconClose className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-white text-center mb-6">تعديل الملف الشخصي</h2>

        <div className="space-y-6">
          <div 
            className="relative mx-auto w-24 h-24 cursor-pointer group"
            onClick={() => fileInputRef.current?.click()}
          >
            {picture ? (
              <img src={picture} alt="الصورة الشخصية" className="w-full h-full rounded-full object-cover border-4 border-gray-600 group-hover:border-primary-500 transition-all"/>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 group-hover:border-primary-500 transition-all">
                <IconUser className="w-12 h-12 text-gray-500"/>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <IconCamera className="w-6 h-6 text-white"/>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePictureChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          <div>
            <label htmlFor="edit-name" className="sr-only">
              الاسم
            </label>
            <input
              type="text"
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-center text-lg"
            />
          </div>
          
          <button
            onClick={handleSave}
            className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/50"
          >
            حفظ التغييرات
          </button>
        </div>
      </div>
    </div>
  );
};
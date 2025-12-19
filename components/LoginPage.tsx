
import React, { useState, useRef } from 'react';
import { IconSparkles, IconArrowLeftEnter, IconUser, IconCamera } from './icons';

interface LoginPageProps {
  onLogin: (name: string, picture: string | null) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [picture, setPicture] = useState<string | null>(null);
  const [error, setError] = useState('');
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

  // Helper function to guess gender based on Arabic name characteristics
  const detectGender = (fullName: string): 'boy' | 'girl' => {
    const firstName = fullName.trim().split(' ')[0];
    
    // Check for "Teh Marbuta" at the end (Strong indicator of female)
    if (firstName.endsWith('ة')) return 'girl';

    // Check for common female names/starts that might not end in ة
    const femaleStarts = ['مريم', 'نور', 'سعاد', 'هند', 'زينب', 'سلمى', 'سلوى', 'نجوى', 'أروى', 'ضحى', 'هدى', 'منى', 'منة', 'يارا', 'مي', 'رنا', 'رشا', 'ريم', 'نهى', 'شهد', 'آية', 'إسراء', 'شيماء', 'علياء', 'وفاء', 'دعاء', 'ولاء', 'لمياء'];
    if (femaleStarts.some(f => firstName.startsWith(f))) return 'girl';

    // Specific logic for names ending in 'ا' (often female like Dina, Rana, but exclude male names like Rida)
    if (firstName.endsWith('ا') && !firstName.startsWith('رض') && !firstName.startsWith('عيس') && !firstName.startsWith('موس') && !firstName.startsWith('يحي')) return 'girl';

    // Default to boy
    return 'boy';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('من فضلك اكتب اسمك.');
      return;
    }
    setError('');

    let finalPicture = picture;

    // If no picture is uploaded, generate one based on gender
    if (!finalPicture) {
        const gender = detectGender(name);
        // Using avatar.iran.liara.run as it provides distinct Boy/Girl endpoints
        finalPicture = `https://avatar.iran.liara.run/public/${gender}?username=${encodeURIComponent(name)}`;
    }

    onLogin(name, finalPicture);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 p-4">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in-container {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
      <div className="w-full max-w-md text-center fade-in-container">
        <div className="bg-gray-800 border border-gray-700 shadow-2xl shadow-primary-500/10 rounded-2xl p-8 md:p-12">
          
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              عرفنا بنفسك
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              اختار صورة أو اكتب اسمك وهنختارلك صورة كرتونية مناسبة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div 
              className="relative mx-auto w-32 h-32 cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              {picture ? (
                <img src={picture} alt="الصورة الشخصية" className="w-full h-full rounded-full object-cover border-4 border-gray-600 group-hover:border-primary-500 transition-all"/>
              ) : (
                <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center border-4 border-gray-600 group-hover:border-primary-500 transition-all overflow-hidden relative">
                   {/* Show a preview based on name if typed, else generic icon */}
                   {name.trim() ? (
                       <img 
                            src={`https://avatar.iran.liara.run/public/${detectGender(name)}?username=${encodeURIComponent(name)}`} 
                            alt="Avatar Preview" 
                            className="w-full h-full object-cover opacity-80"
                        />
                   ) : (
                       <IconUser className="w-16 h-16 text-gray-500"/>
                   )}
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <IconCamera className="w-8 h-8 text-white"/>
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
              <label htmlFor="name" className="sr-only">
                الاسم
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="مثال: وليد محمد"
                className="w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all text-center text-lg"
                autoComplete="name"
                autoFocus
              />
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-500 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary-500/50 disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed group"
              disabled={!name.trim()}
            >
              <span>الدخول للمنصة</span>
              <IconArrowLeftEnter className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
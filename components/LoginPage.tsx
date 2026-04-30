
import React, { useState, useRef, useEffect } from 'react';
import { IconSparkles, IconArrowLeftEnter, IconUser, IconCamera, IconBook } from './icons';
import { auth, googleProvider, signInWithPopup } from '../firebase';
import type { User } from '../types';

interface LoginPageProps {
  onLogin: (name: string, picture: string | null, academicYear: 'third' | 'fourth') => void;
  incompleteUser: User | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, incompleteUser }) => {
  const [name, setName] = useState(incompleteUser?.name || '');
  const [academicYear, setAcademicYear] = useState<'third' | 'fourth' | ''>('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (incompleteUser?.name) {
      setName(incompleteUser.name);
    }
  }, [incompleteUser]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // App.tsx onAuthStateChanged will handle the rest
    } catch (err) {
      console.error(err);
      setError('فشل تسجيل الدخول بجوجل. حاول مرة أخرى.');
      setIsLoading(false);
    }
  };

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('من فضلك اكتب اسمك باللغة العربية.');
      return;
    }
    
    const arabicRegex = /[\u0600-\u06FF]/;
    if (!arabicRegex.test(name)) {
       setError('يجب كتابة الاسم باللغة العربية.');
       return;
    }

    if (!academicYear) {
      setError('من فضلك اختر الفرقة الدراسية.');
      return;
    }
    
    onLogin(name, incompleteUser?.picture || null, academicYear as 'third' | 'fourth');
  };

  if (incompleteUser) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b1021] flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden transition-colors duration-300" dir="rtl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-md w-full relative z-10">
          <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
              <img 
                src="https://i.top4top.io/p_3759frad11.png" 
                alt="Fintech Logo" 
                className="w-20 h-20 object-contain drop-shadow-2xl relative z-10 animate-[bounce_3s_infinite]"
              />
            </div>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-wide">استكمال البيانات</h2>
            <p className="text-gray-500 dark:text-[#64748b] mt-2 font-medium">أدخل اسمك باللغة العربية واختر الفرقة الدراسية</p>
          </div>

          <div className="bg-white/80 dark:bg-[#131b2f]/80 backdrop-blur-xl border border-gray-200 dark:border-[#1e293b] shadow-2xl rounded-[2rem] p-8">
            <form onSubmit={handleSubmitDetails} className="space-y-6">
              <div>
                <label className="block text-right text-gray-700 dark:text-gray-300 mb-2 font-semibold">الاسم باللغة العربية</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-[#0b1021] border border-gray-200 dark:border-[#1e293b] text-gray-900 dark:text-white py-3 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-right transition-all shadow-inner"
                  placeholder="مثال: أحمد محمد"
                />
              </div>
              <div>
                <label className="block text-right text-gray-700 dark:text-gray-300 mb-2 font-semibold">الفرقة الدراسية</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAcademicYear('third')}
                    className={`py-3 px-4 rounded-xl border transition-all font-bold shadow-sm ${academicYear === 'third' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white dark:bg-[#0b1021] border-gray-200 dark:border-[#1e293b] text-gray-500 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#1a233a] hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    الفرقة الثالثة
                  </button>
                  <button
                    type="button"
                    onClick={() => setAcademicYear('fourth')}
                    className={`py-3 px-4 rounded-xl border transition-all font-bold shadow-sm ${academicYear === 'fourth' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white dark:bg-[#0b1021] border-gray-200 dark:border-[#1e293b] text-gray-500 dark:text-[#94a3b8] hover:bg-gray-50 dark:hover:bg-[#1a233a] hover:text-gray-900 dark:hover:text-white'}`}
                  >
                     الفرقة الرابعة
                  </button>
                </div>
              </div>
              
              {error && <p className="text-rose-600 dark:text-rose-400 text-sm text-center font-bold bg-rose-500/10 py-2 rounded-lg">{error}</p>}
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 text-white font-bold py-3.5 px-6 rounded-xl hover:from-primary-500 hover:to-indigo-500 transition-all shadow-lg hover:shadow-primary-500/25 active:scale-[0.98]"
              >
                الدخول إلى المنصة
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] dark:bg-[#0b1021] flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden transition-colors duration-300" dir="rtl">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-10">
            <div className="inline-block mb-6 relative">
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full"></div>
              <img 
                src="https://i.top4top.io/p_3759frad11.png" 
                alt="Fintech Logo" 
                className="w-24 h-24 object-contain drop-shadow-2xl relative z-10 animate-[bounce_3s_infinite]"
              />
            </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-wide">
            منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">فينتك</span>
          </h1>
          <p className="text-gray-500 dark:text-[#64748b] text-lg font-medium">مرحباً بك في منصة التعلم الذكي لطلاب كلية التجارة.</p>
        </div>

        <div className="bg-white/80 dark:bg-[#131b2f]/80 backdrop-blur-xl border border-gray-200 dark:border-[#1e293b] shadow-2xl rounded-[2rem] p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2 tracking-wide">تسجيل الدخول</h2>
            <p className="text-gray-500 dark:text-[#94a3b8] text-center text-sm font-medium">استخدم حساب جوجل الخاص بك للدخول</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-gray-50 hover:bg-gray-100 dark:bg-white text-gray-900 font-bold py-3.5 px-6 rounded-xl border border-gray-200 dark:border-transparent transition-all shadow-md dark:shadow-none dark:hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                <span>تسجيل الدخول باستخدام جوجل</span>
              </>
            )}
          </button>
          
          {error && <p className="text-red-400 text-sm text-center mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
};

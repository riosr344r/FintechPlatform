
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
      <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4 font-sans" dir="rtl">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <div className="bg-primary-500/20 p-4 rounded-full inline-block mb-4">
              <IconBook className="w-12 h-12 text-primary-400" />
            </div>
            <h2 className="text-3xl font-bold text-white">استكمال البيانات</h2>
            <p className="text-gray-400 mt-2">أدخل اسمك باللغة العربية واختر الفرقة الدراسية</p>
          </div>

          <div className="bg-gray-800 border border-gray-700 shadow-2xl rounded-2xl p-8">
            <form onSubmit={handleSubmitDetails} className="space-y-6">
              <div>
                <label className="block text-right text-gray-300 mb-2">الاسم باللغة العربية</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                  placeholder="مثال: أحمد محمد"
                />
              </div>
              <div>
                <label className="block text-right text-gray-300 mb-2">الفرقة الدراسية</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAcademicYear('third')}
                    className={`py-3 px-4 rounded-lg border transition-all ${academicYear === 'third' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                  >
                    الفرقة الثالثة
                  </button>
                  <button
                    type="button"
                    onClick={() => setAcademicYear('fourth')}
                    className={`py-3 px-4 rounded-lg border transition-all ${academicYear === 'fourth' ? 'bg-primary-600 border-primary-500 text-white' : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                  >
                    الفرقة الرابعة
                  </button>
                </div>
              </div>
              
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-500 transition-all"
              >
                تسجيل الدخول إلى المنصة
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center items-center p-4 font-sans" dir="rtl">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="bg-primary-500/20 p-4 rounded-full inline-block mb-4">
            <IconBook className="w-12 h-12 text-primary-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            منصة <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-indigo-400">التجارة</span>
          </h1>
          <p className="text-gray-400 text-lg">مرحباً بك في منصة التعلم الذكي لطلاب كلية التجارة.</p>
        </div>

        <div className="bg-gray-800 border border-gray-700 shadow-2xl shadow-primary-500/10 rounded-2xl p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white text-center mb-2">تسجيل الدخول</h2>
            <p className="text-gray-400 text-center text-sm">استخدم حساب جوجل الخاص بك للدخول</p>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
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

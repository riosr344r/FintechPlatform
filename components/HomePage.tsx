import React, { useState, useEffect } from 'react';
import { ICON_MAP } from '../constants';
import { IconBook } from './icons';
import { Sparkles, ArrowLeft, Lightbulb } from 'lucide-react';
import type { Course } from '../types';

const TIPS = [
    'متعتمدش على ليلة الامتحان… ذاكر أول بأول عشان متتخضش.',
    'افهم قبل ما تحفظ، خصوصًا في مواد زي المحاسبة والاقتصاد.',
    'حاول تحضر المحاضرات حتى لو مملة، بتفرق جامد وقت المراجعة.',
    'اعمل شلة مذاكرة، بس تكون ناس جد مش هزار بس.',
    'متستسهلش المواد النظري… دي بتلم درجات حلوة.',
    'اسأل الدكاترة والمعيدين لو مش فاهم، متكسفش.',
    'اتعلم Excel كويس، هيفرق معاك جدًا في الشغل بعدين.',
    'خد كورسات جنب الكلية (محاسبة / تسويق / HR) عشان تزود فرصك.',
    'نظم وقتك بين المذاكرة والخروج عشان متزهقش.',
    'متقارنش نفسك بحد، كل واحد ليه طريقه وسرعته.',
    'حل امتحانات السنين اللي فاتت، دي كنز بجد.',
    'خلي عندك هدف من بدري (هتتخصص إيه؟ محاسبة ولا إدارة ولا غيره).',
    'اشتغل تدريب حتى لو ببلاش في الأول عشان تاخد خبرة.',
    'خليك متابع أخبار الاقتصاد والبزنس، هتفرق معاك في الفهم.',
    'متفقدش الحماس حتى لو وقعت في مادة… عادي تقوم تاني وتكمل 💪'
];

interface HomePageProps {
    onSelectCourse: (id: string) => void;
    userName?: string;
    courses: Course[];
}

export const HomePage: React.FC<HomePageProps> = ({ 
    onSelectCourse, 
    userName, 
    courses
}) => {
  const [tipOfTheDay, setTipOfTheDay] = useState('');

  useEffect(() => {
    // استخدم تاريخ اليوم لتحديد نصيحة يومية ثابتة
    const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
    const index = dayOfYear % TIPS.length;
    setTipOfTheDay(TIPS[index]);
  }, []);

  const greetingTime = new Date().getHours() < 12 ? 'صباح الخير' : 'مساء الخير';

  return (
    <div className="p-4 md:p-8 h-full bg-transparent transition-colors duration-500 overflow-y-auto relative w-full">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-primary-500/10 to-transparent pointer-events-none -z-10 blur-3xl"></div>
      
      {/* Welcome Banner */}
      <div className="max-w-6xl mx-auto mb-10 mt-4">
        <div className="bg-white dark:bg-[#131b2f] rounded-[2rem] p-8 md:p-10 shadow-xl shadow-gray-200/50 dark:shadow-black/50 border border-gray-100 dark:border-[#1e293b] relative overflow-hidden group">
            {/* Soft decorative blur inside banner */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-500/30 transition-colors duration-700"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-colors duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold mb-6 shadow-sm border border-primary-100 dark:border-[#1e293b]">
                        <Sparkles size={14} className="animate-pulse" />
                        <span>{greetingTime} يا بشمحاسب!</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight tracking-tight">
                        أهلاً، <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400">{userName || 'طالبنا المميز'}</span>
                    </h1>
                    <p className="text-gray-500 dark:text-[#94a3b8] text-lg font-medium max-w-xl leading-relaxed">
                        استعد لاستكمال رحلتك التعليمية.. اختر المادة وابدأ المذاكرة فوراً مع المساعد الذكي.
                    </p>

                    {/* Tip of the Day */}
                    <div className="mt-8 inline-flex items-center gap-3 text-sm font-medium bg-gray-50 dark:bg-[#0b1021] py-3.5 px-5 rounded-2xl border border-gray-100 dark:border-[#1e293b] shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                            <Lightbulb size={20} className="animate-pulse" />
                            <strong className="whitespace-nowrap">نصيحة اليوم:</strong>
                        </div>
                        <div className="w-px h-5 bg-gray-200 dark:bg-[#1e293b] mx-1"></div>
                        <span className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {tipOfTheDay}
                        </span>
                    </div>
                </div>
                
                {/* 3D-like Graphic / Illustration Placeholder */}
                <div className="hidden md:flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-[#0b1021] dark:to-[#131b2f] rounded-full w-48 h-48 border-4 border-white dark:border-[#1e293b] shadow-2xl shadow-primary-500/20 relative">
                   <div className="text-7xl animate-bounce" style={{ animationDuration: '3s' }}>🎓</div>
                   <div className="absolute -bottom-2 px-4 py-1 bg-white dark:bg-[#1e293b] shadow-md rounded-full text-xs font-bold text-gray-900 dark:text-white border border-gray-100 dark:border-[#2d3748]">جاهز للتفوق؟</div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
            {/* Courses Grid */}
            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <div className="p-2.5 bg-white dark:bg-[#131b2f] shadow-sm border border-gray-100 dark:border-[#1e293b] rounded-xl flex items-center justify-center">
                            <IconBook className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        <span>موادك الدراسية</span>
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => {
                        return (
                        <div
                            key={course.id}
                            onClick={() => onSelectCourse(course.id)}
                            className="bg-white dark:bg-[#131b2f] rounded-[1.5rem] p-6 cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1.5 border border-gray-200 dark:border-[#1e293b] group overflow-hidden relative flex flex-col h-full"
                        >
                            {/* Glow effect matching theme */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/5 pointer-events-none"></div>
                            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${course.color} opacity-[0.05] group-hover:opacity-[0.15] rounded-full blur-2xl transition-opacity duration-500`}></div>

                            <div className="relative z-10 flex items-start justify-between mb-5">
                                <div className="relative z-20">
                                    {/* Ambient Pulsing Glow behind the icon box */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${course.color} blur-xl opacity-40 group-hover:opacity-100 rounded-full transition-opacity duration-500 animate-pulse`}></div>
                                    
                                    {/* Icon Container with Hover Pop */}
                                    <div className={`relative p-3 bg-gradient-to-br ${course.color} rounded-2xl border border-white/20 shadow-lg shadow-gray-200 dark:shadow-none transform group-hover:scale-[1.15] group-hover:-rotate-6 transition-all duration-500 w-16 h-16 flex items-center justify-center overflow-hidden`}>
                                        
                                        {/* Shine Sweep Effect on Hover */}
                                        <div className="absolute inset-0 -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-[1500ms] ease-in-out bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-[-25deg] z-10 w-[150%]"></div>
                                        
                                        {/* Strong 3D Emoji */}
                                        <div className="relative text-4xl drop-shadow-[0_8px_16px_rgba(0,0,0,0.5)] transform group-hover:-translate-y-1 transition-transform duration-500 z-0">
                                            {course.emojiIcon || '📚'}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 dark:bg-[#0b1021] text-gray-400 group-hover:bg-primary-50 dark:group-hover:bg-[#1a233a] group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors border border-gray-100 dark:border-[#1e293b]">
                                    <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform" />
                                </div>
                            </div>
                            
                            <div className="relative z-10 flex-1 mt-2">
                                <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-1 tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                    {course.titleAr}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-[#64748b] font-semibold uppercase tracking-wider mb-4 opacity-80">{course.title}</p>
                            </div>
                        </div>
                        )
                    })}
                </div>
            </div>
      </div>
    </div>
  );
};


import React from 'react';
import { COURSES } from '../constants';
import { IconBook } from './icons';

interface HomePageProps {
    onSelectCourse: (id: string) => void;
    userName?: string;
}

export const HomePage: React.FC<HomePageProps> = ({ 
    onSelectCourse, 
    userName, 
}) => {
  return (
    <div className="p-4 md:p-8 h-full bg-gray-50 dark:bg-gray-900 transition-colors duration-300 overflow-y-auto">
      
      {/* Welcome Banner */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-3xl p-8 md:p-12 shadow-2xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full transform translate-x-1/3 -translate-y-1/2 blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-900 opacity-20 rounded-full transform -translate-x-1/3 translate-y-1/3 blur-2xl group-hover:scale-110 transition-transform duration-700"></div>
            <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight leading-tight">
                    مرحباً بك مجدداً، {userName || 'يا بطل'}! 👋
                </h1>
                <p className="text-primary-100 text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                    جاهز تكمل رحلتك التعليمية النهاردة؟ تصفح موادك وابدأ المذاكرة مع مساعدك الذكي "بكار".
                </p>
            </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
            {/* Courses Grid */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <div className="p-2.5 bg-primary-100 dark:bg-primary-900/50 rounded-xl">
                        <IconBook className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <span>موادك الدراسية</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COURSES.map(course => {
                        const CourseIcon = course.icon;
                        return (
                        <div
                            key={course.id}
                            onClick={() => onSelectCourse(course.id)}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-primary-500/30 group relative overflow-hidden"
                        >
                            {/* Background decoration */}
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${course.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-bl-[100px] -mr-6 -mt-6 transition-all duration-500`}></div>

                            <div className="relative z-10 flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4 w-full">
                                    <div className={`p-3.5 bg-gradient-to-br ${course.color} rounded-xl shadow-md shadow-primary-500/20 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                                        <CourseIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                                            {course.titleAr}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{course.title}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <p className="relative z-10 text-sm text-gray-600 dark:text-gray-300 mb-6 line-clamp-2 leading-relaxed h-10 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                                {course.description}
                            </p>
                            
                            {/* Footer with arrow button (Progress removed as requested) */}
                            <div className="relative z-10 mt-auto flex items-center justify-end">
                                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-gray-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-[-4px] shadow-sm">
                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                     </svg>
                                </div>
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

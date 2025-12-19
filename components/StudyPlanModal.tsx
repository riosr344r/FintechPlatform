
import React, { useState } from 'react';
import type { Course, StudyTask } from '../types';
import { generateStudyPlan } from '../services/geminiService';
import { IconClose, IconLoader, IconClipboardList } from './icons';

interface StudyPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  courses: Course[];
  onPlanGenerated: (tasks: StudyTask[]) => void;
}

export const StudyPlanModal: React.FC<StudyPlanModalProps> = ({ 
  isOpen, 
  onClose, 
  courses,
  onPlanGenerated
}) => {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const toggleCourse = (id: string) => {
    setSelectedCourseIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (selectedCourseIds.length === 0) return;
    setIsLoading(true);
    try {
        const selectedCourseNames = courses
            .filter(c => selectedCourseIds.includes(c.id))
            .map(c => c.titleAr);
        
        const tasks = await generateStudyPlan(selectedCourseNames);
        onPlanGenerated(tasks);
        onClose();
    } catch (error) {
        console.error("Failed to generate plan:", error);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-2xl w-full max-w-lg relative p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white">
          <IconClose className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-6">
            <div className="mx-auto w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                <IconClipboardList className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">إنشاء خطة دراسية ذكية</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">اختر المواد التي تريد التركيز عليها، وسيقوم المساعد الذكي بإنشاء جدول منظم لك.</p>
        </div>

        <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {courses.map(course => (
                <div 
                    key={course.id}
                    onClick={() => toggleCourse(course.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                        selectedCourseIds.includes(course.id)
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-500'
                        : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                    <span className="font-medium text-gray-900 dark:text-white">{course.titleAr}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedCourseIds.includes(course.id) ? 'border-primary-500 bg-primary-500' : 'border-gray-400'
                    }`}>
                        {selectedCourseIds.includes(course.id) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                </div>
            ))}
        </div>

        <button
            onClick={handleGenerate}
            disabled={isLoading || selectedCourseIds.length === 0}
            className="w-full bg-primary-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-500 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
            {isLoading ? (
                <>
                    <IconLoader className="w-5 h-5" />
                    <span>جاري التخطيط...</span>
                </>
            ) : (
                'إنشاء الخطة'
            )}
        </button>
      </div>
    </div>
  );
};
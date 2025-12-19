
import React, { useState, useCallback } from 'react';
import { analyzeImage } from '../services/geminiService';
import { IconLoader } from './icons';

export const ImageAnalyzer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64((reader.result as string).split(',')[1]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = useCallback(async () => {
        if (!imageBase64 || !prompt) {
            setError('لو سمحت ارفع صورة واكتب طلبك.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult('');

        try {
            const analysis = await analyzeImage(imageBase64, imageFile?.type || 'image/jpeg', prompt);
            setResult(analysis);
        } catch (e) {
            console.error(e);
            setError('فشل تحليل الصورة. حاول مرة أخرى.');
        } finally {
            setIsLoading(false);
        }
    }, [imageBase64, prompt, imageFile]);

    return (
        <div className="max-w-4xl mx-auto p-4 bg-gray-800 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">تحليل الصور</h2>
            <p className="text-gray-400 mb-6">ارفع صورة واسأل سؤال عنها. مثلاً، ارفع صورة رسم بياني واطلب ملخص له.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Input Column */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-1">رفع صورة</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imageFile ? (
                                    <img src={URL.createObjectURL(imageFile)} alt="Preview" className="mx-auto h-24 w-auto" />
                                ) : (
                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                                <div className="flex text-sm text-gray-400 justify-center">
                                    <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-700 rounded-md font-medium text-primary-400 hover:text-primary-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-primary-500 px-2">
                                        <span>{imageFile ? "تغيير الملف" : "ارفع ملف"}</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                                    </label>
                                    <p className="ps-1">{imageFile ? imageFile.name : 'أو اسحبه هنا'}</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">اكتب طلبك</label>
                        <textarea
                            id="prompt"
                            rows={3}
                            className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-white p-2"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="مثال: لخص محتوى هذه الميزانية العمومية"
                        />
                    </div>
                    <button
                        onClick={handleAnalyze}
                        disabled={isLoading || !imageBase64 || !prompt}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isLoading ? <IconLoader className="w-5 h-5" /> : 'تحليل الصورة'}
                    </button>
                </div>

                {/* Output Column */}
                <div className="bg-gray-900/50 rounded-lg p-4">
                     <h3 className="text-lg font-semibold text-white mb-2">نتيجة التحليل</h3>
                     {error && <p className="text-sm text-red-400">{error}</p>}
                     <div className="prose prose-sm prose-invert text-gray-300 max-w-none h-64 overflow-y-auto" style={{ whiteSpace: 'pre-wrap' }}>
                        {result || "نتيجة التحليل هتظهر هنا..."}
                     </div>
                </div>
            </div>
        </div>
    );
};
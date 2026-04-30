import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob } from '../utils/audioUtils';
import { IconMicrophone, IconStop, IconLoader } from './icons';

export const AudioTranscriber: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcription, setTranscription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

    const startRecording = async () => {
        if (isRecording) return;
        
        setTranscription('');
        setError(null);
        setIsLoading(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                },
                callbacks: {
                    onopen: () => {
                        console.log('Transcription session opened.');
                        setIsLoading(false);
                        setIsRecording(true);
                    },
                    onmessage: (message: LiveServerMessage) => {
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            setTranscription(prev => prev + text);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Transcription error:', e);
                        setError('حصل خطأ أثناء تحويل الصوت.');
                        stopRecording();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Transcription session closed.');
                    }
                }
            });

            // FIX: Cast window to any to support webkitAudioContext for older browsers.
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = audioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromiseRef.current?.then((session) => {
                    session.sendRealtimeInput({ audio: pcmBlob });
                });
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(audioContextRef.current.destination);

        } catch (err) {
            console.error('Failed to start recording:', err);
            setError('مشكلة في الوصول للمايكروفون. اتأكد من السماحيات.');
            setIsLoading(false);
        }
    };
    
    const stopRecording = useCallback(async () => {
        if (!isRecording && !isLoading) return;

        setIsRecording(false);
        setIsLoading(false);
        
        scriptProcessorRef.current?.disconnect();
        try {
            if (audioContextRef.current?.state !== 'closed') {
                audioContextRef.current?.close();
            }
        } catch (e) { console.warn(e); }

        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
    }, [isRecording, isLoading]);

    return (
        <div className="max-w-2xl mx-auto p-4 bg-gray-800 rounded-xl">
            <h2 className="text-2xl font-bold text-white mb-4">تحويل الصوت إلى نص</h2>
            <p className="text-gray-400 mb-6">دوس على زر المايكروفون واتكلم. التطبيق هيكتب كل اللي بتقوله بشكل فوري.</p>
            
            <div className="flex justify-center mb-6">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`flex items-center justify-center w-24 h-24 rounded-full text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
                        ${isRecording ? 'bg-red-600 hover:bg-red-700 animate-pulse' : 'bg-primary-600 hover:bg-primary-700'}
                        ${isLoading ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? <IconLoader className="h-10 w-10" /> : (isRecording ? <IconStop className="h-10 w-10" /> : <IconMicrophone className="h-10 w-10" />) }
                </button>
            </div>
            
            <div className="bg-gray-900/50 rounded-lg p-4 min-h-[150px]">
                <h3 className="text-lg font-semibold text-white mb-2">النص المكتوب</h3>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <p className="text-gray-300 whitespace-pre-wrap">{transcription || 'النص هيظهر هنا...'}</p>
            </div>
        </div>
    );
};
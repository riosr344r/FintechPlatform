
import React, { useState, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';
import { IconMicrophone, IconStop, IconLoader, IconUser, IconSparkles } from './icons';

interface Transcript {
    id: number;
    speaker: 'user' | 'model';
    text: string;
}

interface LiveConversationProps {
    userName: string;
    courseName: string;
    knowledgeBase?: string;
}

type VoiceGender = 'male' | 'female';

export const LiveConversation: React.FC<LiveConversationProps> = ({ userName, courseName, knowledgeBase }) => {
    const [isLive, setIsLive] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcripts, setTranscripts] = useState<Transcript[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<VoiceGender>('male');

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);
    
    let currentInputTranscription = '';
    let currentOutputTranscription = '';

    const startConversation = async () => {
        if (isLive) return;
        
        setTranscripts([]);
        setError(null);
        setIsLoading(true);

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // FIX: Cast window to any to support webkitAudioContext for older browsers.
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            nextStartTimeRef.current = 0;

            // Voice Configuration
            // Puck: Male
            // Kore: Female
            const voiceName = selectedVoice === 'male' ? 'Puck' : 'Kore';
            const assistantName = selectedVoice === 'male' ? 'بكار' : 'سارة';
            
            // Addressing logic: Bakkar talks to males, Sara talks to females (based on user request)
            const addressInstruction = selectedVoice === 'male' 
                ? "Address the user in the masculine form (صيغة المذكر)." 
                : "Address the user in the feminine form (صيغة المؤنث) ONLY. Use feminine verbs and adjectives (e.g، عاملة إيه، فاهمة، جاهزة).";

            const initialGreeting = selectedVoice === 'male'
                ? `"ازيك يا ${userName}، أقدر أساعدك إزاي في مادة ${courseName}؟"`
                : `"ازيك يا ${userName}، عاملة إيه؟ أقدر أساعدك إزاي في مادة ${courseName}؟"`;

            let knowledgeInstruction = "";
            if (knowledgeBase) {
                knowledgeInstruction = `
                USE THE FOLLOWING KNOWLEDGE BASE AS YOUR PRIMARY SOURCE OF TRUTH for answering questions. 
                Knowledge Base:
                ${knowledgeBase}
                `;
            }

            const systemInstruction = `
            You are a smart, friendly, and helpful AI tutor named ${assistantName}.
            IMPORTANT: Speak ONLY in the Common Egyptian Colloquial Dialect (Ammiya Masri). 
            Do NOT use Standard Arabic (Fusha) at all. Be natural, like a native Egyptian friend.
            The user's name is "${userName}".
            The current subject we are discussing is "${courseName}".
            ${addressInstruction}
            ${knowledgeInstruction}

            DEVELOPER INFO: The developer of this platform is "Lido" (المطور ليدو). If anyone asks who developed, created, or built the platform, or who is the developer, always say that the developer is Lido (المطور ليدو).
            
            When the conversation starts, your VERY FIRST sentence MUST be exactly:
            ${initialGreeting}
            
            Keep your responses concise, engaging, and relevant to the subject.
            IMPORTANT: Do not use asterisks (*) or markdown formatting in your response.
            `;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: voiceName } }
                    },
                    systemInstruction: systemInstruction,
                },
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        setIsLoading(false);
                        setIsLive(true);
                        
                        // Send a silent text trigger to force the model to speak the greeting defined in system instruction
                        sessionPromiseRef.current?.then(session => {
                            session.sendRealtimeInput({
                                content: [{ role: 'user', parts: [{ text: "Hello, start the conversation now." }] }]
                            });
                        });
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        // Handle audio output
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const audioCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtx.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioCtx, 24000, 1);
                            const source = audioCtx.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(audioCtx.destination);
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                        }

                        // Handle transcriptions
                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription += message.serverContent.outputTranscription.text;
                        }
                        if (message.serverContent?.turnComplete) {
                            const userInput = currentInputTranscription.trim();
                            const modelOutput = currentOutputTranscription.trim();
                            
                            setTranscripts(prev => {
                                let newTranscripts = [...prev];
                                if (userInput) newTranscripts.push({ id: Date.now(), speaker: 'user', text: userInput });
                                if (modelOutput) newTranscripts.push({ id: Date.now() + 1, speaker: 'model', text: modelOutput.replace(/\*/g, '') });
                                return newTranscripts;
                            });
                            
                            currentInputTranscription = '';
                            currentOutputTranscription = '';
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live error:', e);
                        setError('حصل خطأ أثناء المحادثة.');
                        stopConversation();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Live session closed.');
                    }
                }
            });

            // FIX: Cast window to any to support webkitAudioContext for older browsers.
            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            const source = inputAudioContextRef.current.createMediaStreamSource(stream);
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
            
            scriptProcessorRef.current.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromiseRef.current?.then((session) => {
                    session.sendRealtimeInput({ media: pcmBlob });
                });
            };
            
            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);

        } catch (err) {
            console.error('Failed to start conversation:', err);
            setError('مشكلة في الوصول للمايكروفون. اتأكد من السماحيات.');
            setIsLoading(false);
        }
    };
    
    const stopConversation = useCallback(async () => {
        if (!isLive && !isLoading) return;

        setIsLive(false);
        setIsLoading(false);
        
        scriptProcessorRef.current?.disconnect();
        try {
            if (inputAudioContextRef.current?.state !== 'closed') {
                inputAudioContextRef.current?.close();
            }
        } catch (e) { console.warn(e); }
        try {
            if (outputAudioContextRef.current?.state !== 'closed') {
                outputAudioContextRef.current?.close();
            }
        } catch (e) { console.warn(e); }

        sessionPromiseRef.current?.then(session => session.close());
        sessionPromiseRef.current = null;
    }, [isLive, isLoading]);

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">محادثة صوتية حية</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">ابدأ محادثة صوتية فورية باللهجة المصرية. اختار الصوت المناسب ليك.</p>
            
            <div className="flex flex-col items-center gap-6 mb-6">
                 {/* Voice Selection */}
                 <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-lg inline-flex">
                    <button
                        onClick={() => setSelectedVoice('male')}
                        disabled={isLive || isLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            selectedVoice === 'male' 
                            ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-white shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                        } disabled:opacity-50`}
                    >
                        صوت ولد (بكار)
                    </button>
                    <button
                        onClick={() => setSelectedVoice('female')}
                        disabled={isLive || isLoading}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            selectedVoice === 'female' 
                            ? 'bg-white dark:bg-gray-600 text-pink-600 dark:text-pink-300 shadow-sm' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
                        } disabled:opacity-50`}
                    >
                        صوت بنت (سارة)
                    </button>
                 </div>

                 <button
                    onClick={isLive ? stopConversation : startConversation}
                    disabled={isLoading}
                    className={`flex items-center justify-center w-24 h-24 rounded-full text-white transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800
                        ${isLive ? 'bg-red-600 hover:bg-red-700 animate-pulse shadow-red-500/50' : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/50 shadow-lg'}
                        ${isLoading ? 'bg-gray-500 cursor-not-allowed' : ''}`}
                >
                    {isLoading ? <IconLoader className="h-10 w-10" /> : (isLive ? <IconStop className="h-10 w-10" /> : <IconMicrophone className="h-10 w-10" />) }
                </button>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 min-h-[250px] max-h-[400px] overflow-y-auto border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">نص المحادثة</h3>
                    <span className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded">
                        {selectedVoice === 'male' ? 'لهجة مصرية (بكار)' : 'لهجة مصرية (سارة)'}
                    </span>
                </div>
                
                {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
                
                <div className="space-y-4">
                    {transcripts.length === 0 && !isLive && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <p>اضغط على المايك عشان تبدأ الكلام مع المساعد الذكي</p>
                        </div>
                    )}
                    {transcripts.map(t => (
                        <div key={t.id} className={`flex items-start gap-3 ${t.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {t.speaker === 'model' && (
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center overflow-hidden bg-gray-100 border border-gray-200`}>
                                     <img 
                                        src={selectedVoice === 'male' ? "https://avatar.iran.liara.run/public/boy?username=Bakkar" : "https://avatar.iran.liara.run/public/girl?username=Sara"} 
                                        alt={selectedVoice === 'male' ? "Bakkar" : "Sara"}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                                t.speaker === 'user' 
                                ? 'bg-primary-600 text-white rounded-tr-none' 
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-gray-600 rounded-tl-none'
                            }`}>
                                {t.text}
                            </div>
                             {t.speaker === 'user' && <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center"><IconUser className="h-5 w-5 text-gray-700 dark:text-white" /></div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

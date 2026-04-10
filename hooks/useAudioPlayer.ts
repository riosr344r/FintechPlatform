
import { useState, useCallback, useRef, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

// Custom hook to manage audio playback with a queue for streaming support
export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    
    // Queue for audio chunks
    const queueRef = useRef<AudioBuffer[]>([]);
    const isProcessingRef = useRef(false);
    const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

    // Initialize AudioContext only once
    useEffect(() => {
        if (!audioContextRef.current) {
            try {
                // FIX: Cast window to any to support webkitAudioContext for older browsers.
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                audioContextRef.current = new AudioContext({ sampleRate: 24000 });
            } catch (e) {
                console.error("AudioContext is not supported.", e);
                setError("Your browser does not support audio playback.");
            }
        }
        return () => {
           try {
               if (audioContextRef.current?.state !== 'closed') {
                   audioContextRef.current?.close();
               }
           } catch (e) { console.warn(e); }
        }
    }, []);

    const processQueue = useCallback(async () => {
        if (isProcessingRef.current || queueRef.current.length === 0 || !audioContextRef.current) {
            if (queueRef.current.length === 0) {
                setIsPlaying(false);
            }
            return;
        }

        isProcessingRef.current = true;
        setIsPlaying(true);
        const audioBuffer = queueRef.current.shift();

        if (audioBuffer) {
            try {
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                currentSourceRef.current = source;

                source.onended = () => {
                    isProcessingRef.current = false;
                    processQueue();
                };

                source.start();
            } catch (e) {
                console.error("Error playing buffer from queue:", e);
                isProcessingRef.current = false;
                processQueue();
            }
        } else {
             isProcessingRef.current = false;
        }
    }, []);

    const addToQueue = useCallback(async (base64Audio: string) => {
        if (!audioContextRef.current) return;
        
        try {
            const audioBytes = decode(base64Audio);
            // Decode asynchronously
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            queueRef.current.push(audioBuffer);
            processQueue();
        } catch (e) {
            console.error("Failed to decode audio chunk:", e);
        }
    }, [processQueue]);

    const playAudio = useCallback(async (base64Audio: string) => {
        // Clear queue for immediate single playback
        stopAudio();
        addToQueue(base64Audio);
    }, [addToQueue]);

    const stopAudio = useCallback(() => {
        if (currentSourceRef.current) {
            try {
                currentSourceRef.current.stop();
            } catch(e) {}
        }
        queueRef.current = [];
        isProcessingRef.current = false;
        setIsPlaying(false);
    }, []);

    return { playAudio, addToQueue, stopAudio, isPlaying, error };
};

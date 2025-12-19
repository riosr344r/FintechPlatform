import { useState, useEffect, useCallback } from 'react';
import type { Source, ChatMessage } from '../types';
import { generateGroundedResponse } from '../services/geminiService';

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};

export const useNotebook = (courseId: string) => {
    const getInitialState = <T,>(key: string, defaultValue: T): T => {
        try {
            const item = window.localStorage.getItem(`notebook_${courseId}_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(error);
            return defaultValue;
        }
    };

    const [sources, setSources] = useState<Source[]>(() => getInitialState('sources', []));
    const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialState('messages', []));
    const [notes, setNotes] = useState<string>(() => getInitialState('notes', ''));
    const [isLoading, setIsLoading] = useState(false);

    const debouncedNotes = useDebounce(notes, 500);

    useEffect(() => {
        try {
            localStorage.setItem(`notebook_${courseId}_sources`, JSON.stringify(sources));
        } catch (error) {
            console.error("Failed to save sources to localStorage", error);
        }
    }, [sources, courseId]);

    useEffect(() => {
        try {
            localStorage.setItem(`notebook_${courseId}_messages`, JSON.stringify(messages));
        } catch (error) {
            console.error("Failed to save messages to localStorage", error);
        }
    }, [messages, courseId]);

    useEffect(() => {
        try {
            localStorage.setItem(`notebook_${courseId}_notes`, JSON.stringify(debouncedNotes));
        } catch (error) {
            console.error("Failed to save notes to localStorage", error);
        }
    }, [debouncedNotes, courseId]);
    
    const addSource = (source: Omit<Source, 'id'>) => {
        const newSource: Source = { ...source, id: Date.now().toString() };
        setSources(prev => [...prev, newSource]);
    };

    const removeSource = (sourceId: string) => {
        setSources(prev => prev.filter(s => s.id !== sourceId));
    };

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;
        
        const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const responseText = await generateGroundedResponse(text, sources);
            
            // Basic citation parsing
            const citationRegex = /\[المصدر: (.*?)\]/g;
            const citations = [];
            let match;
            while ((match = citationRegex.exec(responseText)) !== null) {
                const sourceTitle = match[1];
                const foundSource = sources.find(s => s.title === sourceTitle);
                if (foundSource) {
                    citations.push({ title: foundSource.title, content: foundSource.content });
                }
            }

            const modelMessage: ChatMessage = { 
                id: (Date.now() + 1).toString(), 
                role: 'model', 
                text: responseText,
                citations,
            };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error in grounded response:", error);
            const errorMessage: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: 'عفواً، حدث خطأ أثناء معالجة طلبك.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, sources]);

    const updateNotes = (newNotes: string) => {
        setNotes(newNotes);
    };

    return {
        sources,
        messages,
        notes,
        isLoading,
        addSource,
        removeSource,
        sendMessage,
        updateNotes,
    };
};

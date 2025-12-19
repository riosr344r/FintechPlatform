import { GoogleGenAI, GenerateContentResponse, Modality, Type, Content } from '@google/genai';
import type { ChatMessage, Source, StudyTask } from '../types';

if (!process.env.API_KEY) {
    // In a real app, you'd want to handle this more gracefully.
    // For this environment, we assume the key is set.
    console.warn("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export type ChatMode = 'standard' | 'fast' | 'thinking';
export type Verbosity = 'concise' | 'balanced' | 'detailed';

function getModelForMode(mode: ChatMode): string {
    switch (mode) {
        case 'fast':
            return 'gemini-2.5-flash-lite';
        case 'thinking':
            return 'gemini-2.5-pro';
        case 'standard':
        default:
            return 'gemini-2.5-flash';
    }
}

export async function generateChatResponse(
    prompt: string,
    history: ChatMessage[],
    systemInstruction: string,
    mode: ChatMode,
    verbosity: Verbosity = 'balanced'
): Promise<string> {
    const modelName = getModelForMode(mode);

    // Convert history to Gemini's format
    const contents: Content[] = history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    // Add the new user prompt
    contents.push({ role: 'user', parts: [{ text: prompt }] });
    
    let verbosityPrompt = "";
    if (verbosity === 'concise') {
        verbosityPrompt = "Keep the answer concise, short, and to the point. Avoid unnecessary elaboration.";
    } else if (verbosity === 'detailed') {
        verbosityPrompt = "Provide a detailed and comprehensive answer. Explain concepts thoroughly and provide examples where possible.";
    } else {
        verbosityPrompt = "Provide a balanced answer, not too short and not too long. Cover key points clearly.";
    }

    const fullSystemInstruction = `${systemInstruction}\n\nResponse Style Instruction: ${verbosityPrompt}`;

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: contents,
        config: {
            systemInstruction: fullSystemInstruction,
            ...(mode === 'thinking' && { thinkingConfig: { thinkingBudget: 32768 } })
        }
    });

    return response.text || '';
}

export async function generateGroundedResponse(prompt: string, sources: Source[]): Promise<string> {
    const model = 'gemini-2.5-pro'; // Use a powerful model for better reasoning
    
    const sourceContent = sources.map((source, index) => 
        `[المصدر ${index + 1}: ${source.title}]\n---\n${source.content}\n---\n`
    ).join('\n');

    const systemInstruction = `أنت مساعد بحث ذكي. يجب أن تستند إجاباتك بشكل صارم وحصري على المصادر المقدمة. عند الإجابة، يجب عليك الاستشهاد بالمصادر التي استخدمتها. استخدم التنسيق التالي للاستشهاد: [المصدر: عنوان المصدر]. لا تضف أي معلومات غير موجودة في المصادر. إذا كان السؤال لا يمكن الإجابة عليه من المصادر، فقل "لا يمكنني الإجابة على هذا السؤال بناءً على المصادر المتاحة."`;

    const fullPrompt = `${sourceContent}\n\nسؤال المستخدم: ${prompt}`;

    const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
        config: {
            systemInstruction,
        },
    });

    return response.text || '';
}


export async function analyzeImage(
    base64Image: string,
    mimeType: string,
    prompt: string
): Promise<string> {
    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: base64Image,
        },
    };
    const textPart = { text: prompt };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text || '';
}

export async function generateSpeech(text: string): Promise<string> {
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `قل هذا بشكل طبيعي وواضح: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error("No audio content received from API.");
    }

    return base64Audio;
}

// Generate an Audio Overview (Deep Dive Podcast) with Streaming
// Returns an async generator yielding audio chunks as base64 strings
export async function* generatePodcastStream(sources: Source[]): AsyncGenerator<string, void, unknown> {
    // 1. Prepare Prompt
    const sourceContent = sources.map((source, index) => 
        `[Document ${index + 1}: ${source.title}]\n${source.content}`
    ).join('\n\n');

    const scriptPrompt = `
    Based on the following documents, create a lively, engaging podcast script between two hosts, Ahmed and Sara. 
    They should discuss the key insights, find interesting connections, and explain complex topics simply. 
    The conversation should be in Arabic (Egyptian dialect preferred for a natural feel) but keep it professional yet accessible.
    
    Format the output EXACTLY like this:
    Ahmed: [text]
    Sara: [text]
    Ahmed: [text]
    ...

    Documents:
    ${sourceContent}
    `;

    // 2. Stream the script generation using flash-lite for speed
    const stream = await ai.models.generateContentStream({
        model: 'gemini-2.5-flash-lite',
        contents: scriptPrompt,
    });

    let buffer = '';
    const FLUSH_THRESHOLD = 500; // characters

    for await (const chunk of stream) {
        const text = chunk.text || '';
        buffer += text;

        // Check if we have enough text and a natural break (newline) to send to TTS
        if (buffer.length > FLUSH_THRESHOLD && buffer.includes('\n')) {
            const lastNewlineIndex = buffer.lastIndexOf('\n');
            const toSynthesize = buffer.substring(0, lastNewlineIndex);
            buffer = buffer.substring(lastNewlineIndex + 1);

            if (toSynthesize.trim()) {
                const audioChunk = await synthesizeScriptChunk(toSynthesize);
                if (audioChunk) yield audioChunk;
            }
        }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
         const audioChunk = await synthesizeScriptChunk(buffer);
         if (audioChunk) yield audioChunk;
    }
}

// Helper to synthesize a chunk of the script
async function synthesizeScriptChunk(scriptChunk: string): Promise<string | null> {
    try {
        const audioResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: scriptChunk }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    multiSpeakerVoiceConfig: {
                        speakerVoiceConfigs: [
                            {
                                speaker: 'Ahmed',
                                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } // Male voice
                            },
                            {
                                speaker: 'Sara',
                                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } // Female voice
                            }
                        ]
                    }
                }
            }
        });
        return audioResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (e) {
        console.error("Error synthesizing chunk:", e);
        return null;
    }
}

export async function generateStudyPlan(courseNames: string[]): Promise<StudyTask[]> {
    const prompt = `
    Create a realistic 3-day study plan for a student studying the following courses: ${courseNames.join(', ')}.
    Include 3-5 tasks per day mixed between the courses.
    
    Return the response as a JSON object containing an array of tasks.
    Each task should have:
    - title: Brief description of the study task (in Arabic)
    - courseName: Name of the course
    - type: 'study', 'assignment', or 'review'
    - priority: 'high', 'medium', or 'low'
    - offsetHours: Number of hours from now until this task is due (e.g., 2, 24, 48)

    Ensure the tasks are practical and tailored to commerce students.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tasks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                courseName: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['study', 'assignment', 'review'] },
                                priority: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
                                offsetHours: { type: Type.NUMBER }
                            }
                        }
                    }
                }
            }
        }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Failed to generate study plan");

    const data = JSON.parse(jsonText);
    const tasks = data.tasks || [];

    // Map to StudyTask format with actual timestamps
    return tasks.map((task: any, index: number) => ({
        id: `task-${Date.now()}-${index}`,
        title: task.title,
        courseId: 'generated', // Placeholder
        courseName: task.courseName,
        dueDate: Date.now() + (task.offsetHours * 3600000),
        type: task.type,
        priority: task.priority,
        completed: false
    }));
}
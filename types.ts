
import React from 'react';

export type Theme = 'light' | 'dark';
export type FontSize = 'small' | 'medium' | 'large';
export type AccentColor = 'indigo' | 'blue' | 'purple' | 'emerald' | 'rose' | 'amber';
export type BotPersonality = 'bakkar' | 'hania';

export interface Course {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  systemPrompt: string;
  resources: Resource[];
  color: string; // e.g., 'from-indigo-500 to-purple-600'
  icon: React.FC<{ className?: string }>;
  iconName?: string; // String reference for the icon
  emojiIcon?: string; // 3D emoji icon
  progress?: number; // 0-100 Mock progress for dashboard
  knowledgeBase?: string; // Context/Source material for the AI
  academicYear: 'third' | 'fourth';
}

export interface Resource {
  id: string;
  type: 'pdf' | 'link' | 'video';
  title: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  citations?: { title: string; content: string }[];
}

export interface User {
  id: string;
  name: string;
  picture: string;
  academicYear?: 'third' | 'fourth';
}

export interface Source {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'pdf' | 'link';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  timestamp: number;
  read: boolean;
}

export interface StudyTask {
    id: string;
    title: string;
    courseId: string;
    courseName: string; // Helper for display
    dueDate: number; // Timestamp
    type: 'study' | 'assignment' | 'review';
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
}

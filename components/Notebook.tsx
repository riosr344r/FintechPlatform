
import React from 'react';
import { SourcePanel } from './notebook/SourcePanel';
import { ChatPanel } from './notebook/ChatPanel';
import { NotepadPanel } from './notebook/NotepadPanel';
import { useNotebook } from '../hooks/useNotebook';

interface NotebookProps {
  courseId: string;
  userName: string;
}

export const Notebook: React.FC<NotebookProps> = ({ courseId, userName }) => {
  const {
    sources,
    messages,
    notes,
    isLoading,
    addSource,
    removeSource,
    sendMessage,
    updateNotes,
  } = useNotebook(courseId);

  return (
    <div className="flex flex-col md:flex-row h-full w-full gap-4">
      {/* Right Panel: Sources */}
      <div className="w-full md:w-1/4 h-1/3 md:h-full flex flex-col order-1 md:order-3">
        <SourcePanel sources={sources} onAddSource={addSource} onRemoveSource={removeSource} />
      </div>
      
      {/* Center Panel: Chat */}
      <div className="w-full md:w-1/2 h-full flex flex-col order-2 md:order-2">
        <ChatPanel 
          messages={messages} 
          onSendMessage={sendMessage} 
          isLoading={isLoading} 
          sources={sources}
          userName={userName}
        />
      </div>

      {/* Left Panel: Notepad */}
      <div className="w-full md:w-1/4 h-1/3 md:h-full flex flex-col order-3 md:order-1">
        <NotepadPanel notes={notes} onNotesChange={updateNotes} />
      </div>
    </div>
  );
};
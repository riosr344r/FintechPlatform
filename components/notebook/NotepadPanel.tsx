
import React from 'react';

interface NotepadPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export const NotepadPanel: React.FC<NotepadPanelProps> = ({ notes, onNotesChange }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-bold text-white">دفتر الملاحظات</h2>
      </div>
      <div className="flex-grow p-2">
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="اكتب ملاحظاتك وأفكارك هنا..."
          className="w-full h-full bg-gray-800 text-gray-200 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
    </div>
  );
};
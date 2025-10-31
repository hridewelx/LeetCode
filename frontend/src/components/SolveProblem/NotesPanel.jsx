import { useState, useEffect } from "react";

const NotesPanel = ({ problemId, onClose }) => {
  const [notes, setNotes] = useState("");

  // Load notes from localStorage when component mounts
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes_${problemId}`) || "";
    setNotes(savedNotes);
  }, [problemId]);

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes_${problemId}`, newNotes);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Notes Header with Close Button */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700/50 bg-slate-800/50">
        <h3 className="text-lg font-semibold text-white">Problem Notes</h3>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-700 rounded-lg transition-colors duration-200 text-slate-400 hover:text-white"
          title="Close Notes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Notes Content */}
      <div className="flex-1 p-4">
        <div className="bg-slate-800/50 rounded-lg border border-slate-700 h-full">
          <textarea
            placeholder="Write your notes here...&#10;&#10;• Problem insights&#10;• Solution approaches&#10;• Edge cases to consider&#10;• Time/space complexity analysis&#10;• Related problems"
            value={notes}
            onChange={handleNotesChange}
            className="w-full h-full bg-transparent border-none text-slate-300 resize-none focus:outline-none p-4 text-md leading-relaxed"
            style={{ minHeight: "300px" }}
          />
        </div>
      </div>

      {/* Notes Footer */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/50">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Notes are automatically saved</span>
          <span>{notes.length} characters</span>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
import { useState, useEffect } from "react";

const DeleteQuestionModal = ({ isOpen, onClose, onConfirm, questionTitle, isDeleting }) => {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const [isMatching, setIsMatching] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
      setError("");
      setIsMatching(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (inputValue && questionTitle) {
      const matches = inputValue.trim() === questionTitle.trim();
      setIsMatching(matches);
      if (inputValue.trim() && !matches) {
        setError("Question title doesn't match");
      } else {
        setError("");
      }
    } else {
      setIsMatching(false);
      setError("");
    }
  }, [inputValue, questionTitle]);

  const handleConfirm = () => {
    if (!inputValue.trim()) {
      setError("Please enter the question title");
      return;
    }
    
    if (inputValue.trim() !== questionTitle.trim()) {
      setError("Question title doesn't match");
      return;
    }

    onConfirm();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && isMatching && !isDeleting) {
      handleConfirm();
    }
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={!isDeleting ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-red-500/20 max-w-2xl w-full overflow-hidden animate-scaleIn">
        {/* Danger Stripe */}
        <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-orange-500" />
        
        {/* Close Button */}
        {!isDeleting && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <div className="p-8">
          {/* Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
              <div className="relative w-20 h-20 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-2xl flex items-center justify-center border-2 border-red-500/30">
                <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Delete Question Permanently?
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed">
              This action <span className="text-red-400 font-semibold">cannot be undone</span>. 
              This will permanently delete the question and all associated data.
            </p>
          </div>

          {/* Question Title Display */}
          <div className="mb-6 p-4 bg-slate-700/30 border border-slate-600 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-slate-400 text-sm font-medium mb-1">Question to be deleted:</p>
                <p className="text-white font-semibold text-lg break-words">{questionTitle}</p>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="mb-6">
            <label className="block text-slate-300 font-semibold mb-3">
              To confirm deletion, type the question title exactly as shown above:
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type question title here..."
                disabled={isDeleting}
                className={`w-full px-4 py-3.5 bg-slate-700/50 border-2 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all duration-200 ${
                  error 
                    ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/20" 
                    : isMatching
                    ? "border-green-500/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/20"
                    : "border-slate-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
                } ${isDeleting ? "opacity-50 cursor-not-allowed" : ""}`}
                autoFocus
              />
              
              {/* Validation Icons */}
              {inputValue && !isDeleting && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  {isMatching ? (
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-sm font-medium">Match!</span>
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
              )}
            </div>
            
            {/* Error Message */}
            {error && (
              <div className="mt-2 flex items-center gap-2 text-red-400 text-sm animate-shake">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            {/* Helper Text */}
            {!error && !isMatching && inputValue && (
              <p className="mt-2 text-slate-400 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Title must match exactly (case-sensitive)
              </p>
            )}
          </div>

          {/* Warning Message */}
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="text-red-300 text-sm">
                <p className="font-semibold mb-1">Warning: This will delete:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>The question and its description</li>
                  <li>All test cases (visible and hidden)</li>
                  <li>Boilerplate code for all languages</li>
                  <li>All user submissions for this question</li>
                  <li>Video editorials and notes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`flex-1 px-6 py-3.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-semibold transition-all duration-200 border border-slate-600 ${
                isDeleting ? "opacity-50 cursor-not-allowed" : "hover:border-slate-500"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isMatching || isDeleting}
              className={`flex-1 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                isMatching && !isDeleting
                  ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50"
                  : "bg-slate-700/50 text-slate-500 cursor-not-allowed border border-slate-600"
              }`}
            >
              {isDeleting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Deleting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Permanently
                </>
              )}
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          {!isDeleting && (
            <div className="mt-6 pt-6 border-t border-slate-700/50 flex items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs font-mono">Enter</kbd>
                <span>Confirm</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-slate-700/50 border border-slate-600 rounded text-xs font-mono">Esc</kbd>
                <span>Cancel</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default DeleteQuestionModal;

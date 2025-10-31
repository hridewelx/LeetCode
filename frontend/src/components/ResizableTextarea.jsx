const ResizableTextarea = ({ register, name, rows = 15, placeholder, className = "", ...props }) => {
  const handleMouseDown = (e) => {
    e.preventDefault();
    const textarea = e.target.previousElementSibling;
    const startY = e.clientY;
    const startHeight = parseInt(getComputedStyle(textarea).height);
    
    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      textarea.style.height = `${startHeight + deltaY}px`;
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div className="group relative">
      <textarea
        {...register(name)}
        rows={rows}
        className={`hide-resize-handle w-full px-3 py-2 bg-slate-600/50 border border-slate-500 rounded text-white font-mono text-sm ${className}`}
        placeholder={placeholder}
        {...props}
      />
      {/* Custom resize handle */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-6 cursor-ns-resize opacity-0 group-hover:opacity-100  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-opacity duration-200"
        onMouseDown={handleMouseDown}
      >
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-400 rounded-full"></div>
      </div>
    </div>
  );
};

export default ResizableTextarea;
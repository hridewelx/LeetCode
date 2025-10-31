const ResizableSplit = ({ 
  children, 
  direction = "horizontal", 
  onMouseDown,
  isDragging 
}) => {
  const className = direction === "horizontal" 
    ? "w-1 bg-slate-700/50 hover:bg-yellow-500 cursor-col-resize flex items-center justify-center transition-colors duration-150 flex-shrink-0"
    : "h-1 bg-slate-700/50 hover:bg-yellow-500 cursor-row-resize flex items-center justify-center transition-colors duration-150 flex-shrink-0";

  return (
    <div
      className={className}
      onMouseDown={onMouseDown}
    >
      <div className={direction === "horizontal" ? "w-1 h-full" : "h-1 w-full"}></div>
    </div>
  );
};

export default ResizableSplit;
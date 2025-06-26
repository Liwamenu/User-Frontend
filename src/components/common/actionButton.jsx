const ActionButton = ({ className, element, element2, onClick }) => {
  return (
    <button
      className={`w-full flex items-center gap-2 py-2 pl-6 text-left border-b border-solid border-[--border-1] cursor-pointer hover:bg-[--light-3] transition-colors ${className}`}
      onClick={onClick}
    >
      {element} {element2}
    </button>
  );
};

export default ActionButton;

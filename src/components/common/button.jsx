function Button({ text, icon, onClick, className, disabled, type }) {
  return (
    <button
      className={`flex items-center py-2.5 whitespace-nowrap text-[--primary-2] px-3 rounded-md text-sm border-2 border-solid border-[--primary-2] disabled:cursor-not-allowed ${className}`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {text} {icon}
    </button>
  );
}

export default Button;

const CustomTextarea = ({
  icon,
  onClick,
  label,
  type,
  placeholder,
  value,
  onChange,
  onKeyDown,
  required,
  className,
  className2,
  className3,
  autoComplete = "new-password",
}) => {
  return (
    <div className={`flex flex-col w-full relative ${className2}`}>
      <label className="text-xs font-[600] tracking-wide text-[--gr-1] max-md:max-w-full text-left">
        {label}
      </label>
      <textarea
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        className={`px-4 pt-2 h-20 text-base font-[300] rounded-md sm:rounded-md border border-solid border-[--border-1] text-[--gr-1] max-md:pr-5 w-full autofill:shadow-[--white-1] bg-[--white-1] autofill:outline-none ${className}`}
      />
      <div
        className={`absolute right-4 top-1/2 text-2xl cursor-pointer text-[--gr-1] ${className3}`}
        onClick={onClick}
      >
        {icon}
      </div>
    </div>
  );
};

export default CustomTextarea;

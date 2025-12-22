const CustomToggle = ({
  id,
  label,
  checked,
  onChange,
  className1,
  className,
  className2,
  disabled,
  swap,
}) => {
  return (
    <label
      className={`inline-flex items-center w-full justify-between ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${className1}`}
    >
      {!swap && <span className={`${className2}`}>{label}</span>}
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only peer"
      />
      <div
        className={`relative w-[48px] h-[22px] bg-[--gr-1] rounded-full peer-checked:after:translate-x-[65%] rtl:peer-checked:after:-translate-x-full peer-checked:after:border-[--white-1] after:content-[''] after:absolute after:top-[1px] after:start-[.5px] after:bg-[--white-1] after:border-[--gr-1] after:border after:rounded-full after:h-5 after:w-7 transition-colors after:transition-transform duration-500 after:duration-500 ease-in-out after:ease-in-out peer-checked:bg-[--primary-1] ${className}`}
      ></div>

      {swap && <span className={`${className2}`}>{label}</span>}
    </label>
  );
};

export default CustomToggle;

import CheckI from "../../assets/icon/check";

const CustomRadiobox = ({
  id,
  label,
  checked,
  onClick,
  className,
  className2,
  size = 6,
  name,
}) => {
  return (
    <div className={`max-w-max flex items-center cursor-pointer ${className}`}>
      <input
        id={id}
        type="radio"
        checked={checked}
        onClick={onClick}
        className="hidden"
        name={name}
      />
      <span
        className={`flex justify-center items-center bg-[--white-1] border-[3px] border-[--border-1] rounded-full relative size-${size} ${
          checked ? "border-[--primary-2]" : "border-[--gr-1]"
        }`}
      >
        <div
          className={`size-3 rounded-full ${
            checked ? "bg-[--primary-2]" : "bg-[--white-2]"
          }`}
        ></div>
      </span>
      {label && (
        <label
          htmlFor={id}
          className={`ml-2 text-[--gr-1] ${className2}`}
          dangerouslySetInnerHTML={{ __html: label }}
        ></label>
      )}
    </div>
  );
};

export default CustomRadiobox;

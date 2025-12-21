import CheckI from "../../assets/icon/check";

const CustomCheckbox = ({
  id,
  label,
  checked,
  onChange,
  className,
  className2,
  size = "6",
  Icon = <CheckI className="h-4 text-[--white-1]" strokeWidth="4" />,
}) => {
  return (
    <label
      className={`max-w-max flex items-center cursor-pointer ${className}`}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hidden"
      />
      <span
        className={`flex justify-center items-center border-2 border-[--border-1] rounded-md relative size-${size} ${
          checked ? "bg-[--primary-2] border-[--primary-2]" : "bg-[--white-1]"
        }`}
      >
        {checked && Icon}
      </span>
      {label && (
        <span
          className={`ml-2 font-normal ${className2}`}
          // dangerouslySetInnerHTML={{ __html: label }}
        >
          {label}
        </span>
      )}
    </label>
  );
};

export default CustomCheckbox;

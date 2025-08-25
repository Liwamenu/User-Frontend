import { useState } from "react";
import EyeI from "../../assets/icon/eye";
import EyeInv from "../../assets/icon/eyeInv";
import { maxInput } from "../../utils/utils";

const CustomInput = ({
  icon,
  iconClick,
  letIcon,
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
  className4,
  maxLength,
  minLength,
  autoComplete = "new-password",
  disabled,
  onClick,
  readOnly,
  onFocus,
  onBlur,
  inputRef,
  className5,
  pattern,
  name,
}) => {
  const eyeIconVis = <EyeI className="w-5" strokeWidth={2} />;
  const eyeIconInv = <EyeInv className="w-5" strokeWidth={2} />;

  const [eyeIcon, setEyeIcon] = useState(eyeIconInv);
  const [inputType, setInputType] = useState("password");

  const eyeIconClick = (e) => {
    e.preventDefault();
    if (inputType === "password") {
      setInputType("text");
      setEyeIcon(eyeIconVis);
    } else {
      setInputType("password");
      setEyeIcon(eyeIconInv);
    }
  };

  return (
    <div className={`flex flex-col mt-3 sm:mt-6 w-full relative ${className2}`}>
      <label
        className={`text-xs font-semibold tracking-wide text-[--gr-1] max-md:max-w-full text-left ${className5}`}
      >
        {label}
      </label>
      <input
        ref={inputRef}
        label={label}
        type={letIcon ? inputType : type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(maxInput(e))}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        maxLength={maxLength}
        minLength={minLength}
        disabled={disabled}
        onClick={onClick}
        readOnly={readOnly}
        onFocus={onFocus}
        onBlur={onBlur}
        pattern={pattern}
        name={name}
        className={`px-4 py-2.5 mt-1 sm:mt-2.5 font-[300] rounded-md border border-solid border-[--border-1] text-[--black-2] max-md:pr-5 w-full autofill:bg-inherit autofill:outline-none outline-none ${className}`}
      />
      {letIcon && !icon && (
        <div
          className={`absolute right-4 top-1/2 text-2xl cursor-pointer text-[--gr-1] ${className3}`}
          onClick={eyeIconClick}
        >
          {eyeIcon}
        </div>
      )}
      {icon && !letIcon && (
        <div className="absolute top-0 right-2 h-full pb-2 flex items-end">
          <div className={`cursor-pointer ${className4}`} onClick={iconClick}>
            {icon}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomInput;

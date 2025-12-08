// import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = ({
  label,
  placeholder,
  value,
  onChange,
  required,
  className,
  className2,
  autoComplete = "new-password",
  className5,
  disabled,
}) => {
  // const [phone, setPhone] = useState(value);

  const handleChange = (value) => {
    if (!value.startsWith("90")) {
      if (value.startsWith("9")) {
        value = "90" + value.slice(1);
      } else if (value.startsWith("0")) {
        value = "9" + value.slice(1);
      } else {
        value = "90" + value;
      }
    }

    // setPhone(value);
    onChange(value);
  };

  // useEffect(() => {
  //   handleChange(value);
  // }, [value]);

  return (
    <div className={`flex flex-col w-full relative ${className2}`}>
      <style>{`
        .hide-flag .flag-dropdown,
        .hide-flag .selected-flag {
          display: none;
        }

        .hide-flag .form-control {
          padding-left: 0;
        }
      `}</style>
      <label
        className={`text-xs font-[600] tracking-wide text-[--gr-1] max-md:max-w-full text-left ${className5}`}
      >
        {label}
      </label>
      <PhoneInput
        country={"tr"}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        containerClass="hide-flag"
        maxlength={14}
        minLength={14}
        disabled={disabled}
        inputProps={{
          required: required,
          pattern: "\\+90\\s[0-9]{3}\\s[0-9]{3}\\s[0-9]{2}\\s[0-9]{2}",
          autoComplete: autoComplete,
          className: `px-4 py-2.5 text-base font-[300] rounded-md border border-solid border-[--border-1] text-[--black-2] max-md:pr-5 w-full autofill:shadow-white autofill:outline-none ${className}`,
        }}
      />
    </div>
  );
};

export default CustomPhoneInput;

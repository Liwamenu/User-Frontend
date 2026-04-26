import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const AuthPhoneField = ({
  id,
  label,
  rightLabel,
  value,
  onChange,
  required,
  country = "tr",
  placeholder,
  autoComplete = "tel",
  disabled,
}) => (
  <div className="w-full auth-phone-field">
    {(label || rightLabel) && (
      <div className="flex items-center justify-between mb-1.5">
        {label ? (
          <label
            htmlFor={id}
            className="block text-xs font-semibold text-[--black-1]"
          >
            {label}
          </label>
        ) : (
          <span />
        )}
        {rightLabel}
      </div>
    )}
    <PhoneInput
      country={country}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      inputProps={{
        id,
        name: id,
        required,
        autoComplete,
      }}
    />
  </div>
);

export default AuthPhoneField;

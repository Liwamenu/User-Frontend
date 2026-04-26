import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const AuthField = ({
  id,
  label,
  rightLabel,
  icon: Icon,
  type = "text",
  value,
  onChange,
  required,
  placeholder,
  autoComplete,
  password,
  minLength,
  maxLength,
  name,
  inputMode,
  pattern,
  onBlur,
}) => {
  const [show, setShow] = useState(false);
  const inputType = password ? (show ? "text" : "password") : type;

  return (
    <div className="w-full">
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
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[--gr-1] pointer-events-none" />
        )}
        <input
          id={id}
          name={name || id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          maxLength={maxLength}
          inputMode={inputMode}
          pattern={pattern}
          className={`w-full h-12 ${Icon ? "pl-10" : "pl-4"} ${
            password ? "pr-11" : "pr-4"
          } rounded-xl border border-[--border-1] bg-[--white-1] text-[--black-1] placeholder:text-[--gr-1] outline-none transition focus:border-[--primary-1] focus:ring-4 focus:ring-indigo-100`}
        />
        {password && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-2 top-1/2 -translate-y-1/2 grid place-items-center size-8 rounded-md text-[--gr-1] hover:text-[--black-1] hover:bg-[--white-2] transition"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthField;

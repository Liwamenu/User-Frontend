import React, { useState, useRef, useEffect } from "react";

const VerificationInputs = ({
  numInputs,
  onChange,
  labelClass,
  label,
  required,
  disabled,
}) => {
  const [inputValues, setInputValues] = useState(Array(numInputs).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) return;

    const newInputValues = [...inputValues];

    if (value.length > 1) {
      let chars = value.split("");
      chars.forEach((char, i) => {
        if (index + i < numInputs) {
          newInputValues[index + i] = char;
        }
      });

      setInputValues(newInputValues);

      const nextIndex = index + chars.length;
      if (nextIndex < numInputs) {
        inputRefs.current[nextIndex].focus();
      } else {
        inputRefs.current[numInputs - 1].focus();
      }
    } else {
      newInputValues[index] = value;
      setInputValues(newInputValues);

      if (value !== "" && index < numInputs - 1) {
        inputRefs.current[index + 1].focus();
      }
    }

    onChange(newInputValues.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newInputValues = [...inputValues];

      if (inputValues[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
        newInputValues[index - 1] = "";
        setInputValues(newInputValues);
      } else {
        newInputValues[index] = "";
        setInputValues(newInputValues);
      }

      onChange(newInputValues.join(""));
    }
  };

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  return (
    <div className="w-max">
      <label
        className={`text-xs font-semibold tracking-wide text-[--white-1] block pb-2 ${labelClass}`}
      >
        {label}
      </label>
      <div
        className={`flex gap-2.5 w-max ${disabled && "pointer-events-none"}`}
      >
        {inputValues.map((value, index) => (
          <input
            key={index}
            type="text"
            value={value}
            required={required}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            ref={(el) => (inputRefs.current[index] = el)}
            maxLength={1}
            style={{
              width: "50px",
              height: "50px",
              fontSize: "20px",
              textAlign: "center",
              borderRadius: "5px",
              border: "1px solid var(--gr-3)",
              background:
                value || index === 0 ? "var(--white-1)" : "transparent",
              color: "var(--black-1)",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default VerificationInputs;

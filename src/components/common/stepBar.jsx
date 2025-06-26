import React from "react";

function StepBar({ step, steps, className }) {
  const stepsArray = Array.from({ length: steps }, (_, index) => index + 1);
  const colors = {
    main: ["--primary-1"],
    text: ["--white-1"],
    border: ["--primary-1"],
  };

  return (
    <div className={`w-full flex items-center py-5 ${className}`}>
      {stepsArray.map((num, index) => (
        <React.Fragment key={index}>
          <div
            className={`w-full max-w-10 h-10 p-1 border border-solid border-[${colors.border[0]}] rounded-full relative overflow-hidden`}
          >
            <div
              className={`w-full h-full flex justify-center items-center rounded-full text-[${colors.text[0]}] relative z-20 bg-[${colors.main[0]}]`}
            >
              {num}
            </div>
            <div
              className={`absolute left-0 top-0 w-full h-full bg-[${colors.main[0]}] transition-all ease-in`}
              style={{
                transform: step >= num ? "translateX(0)" : "translateX(-100%)",
                transitionDelay: step >= num ? "200ms" : "0ms",
              }}
            ></div>
          </div>
          <div
            key={num}
            className={`w-full h-2 relative overflow-hidden border-y border-solid border-[${
              colors.border[0]
            }] ${num === steps && "hidden"}`}
          >
            <div
              className={`absolute w-full h-full bg-[${colors.main[0]}] transition-all duration-200 ease-in`}
              style={{
                transform:
                  step >= num + 1 ? "translateX(0)" : "translateX(-100%)",
                transitionDelay: step >= num + 1 ? "0ms" : "200ms",
              }}
            ></div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default StepBar;

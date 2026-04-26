const StepFrame = ({ step, component }) => {
  // Render all steps but only show the active one — content flows naturally,
  // so the page grows with content instead of scrolling inside a fixed box.
  return component.map((c, i) => (
    <div
      key={i}
      className={`transition-opacity duration-300 ${
        step === i + 1 ? "block opacity-100" : "hidden opacity-0"
      }`}
    >
      {c}
    </div>
  ));
};

export default StepFrame;

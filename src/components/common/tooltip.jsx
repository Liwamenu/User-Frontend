function ToolTip({ className, color = "--light-4" }) {
  return (
    <div
      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8  ${className}`}
      style={{
        borderTop: `8px solid var(${color})`,
      }}
    ></div>
  );
}

export default ToolTip;

const CustomPing = ({ bgColor1, bgColor2, width, height }) => {
  return (
    <span className={`relative flex h-2 w-2`} style={{ width, height }}>
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
        style={{ backgroundColor: bgColor1 }}
      ></span>
      <span
        className="relative inline-flex rounded-full h-2 w-2 bg-red-500"
        style={{ width, height, backgroundColor: bgColor2 }}
      ></span>
    </span>
  );
};

export default CustomPing;

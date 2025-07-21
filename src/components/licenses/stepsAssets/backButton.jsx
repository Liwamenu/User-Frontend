import { ArrowIL } from "../../../assets/icon";

const BackButton = ({
  type = "button",
  text,
  letIcon,
  disabled,
  className,
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center h-max py-2.5 whitespace-nowrap px-3 rounded-md text-sm border-[1.5px] disabled:cursor-not-allowed justify-center w-24 text-white bg-[--primary-1] border-[--primary-1] group border-none ${className}`}
    >
      {letIcon && (
        <div
          className={`-translate-x-1 transition-transform duration-200 ease-in-out group-hover:-translate-x-2`}
        >
          <ArrowIL className="size-[16px]" />
        </div>
      )}
      {text}
    </button>
  );
};

export default BackButton;

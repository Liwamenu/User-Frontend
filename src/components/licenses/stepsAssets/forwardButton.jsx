import { ArrowIR } from "../../../assets/icon";

const ForwardButton = ({
  type = "button",
  disabled,
  text,
  letIcon,
  className,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`flex items-center h-max py-2.5 whitespace-nowrap px-3 rounded-md text-sm border-[1.5px] disabled:cursor-not-allowed justify-center w-24 text-white bg-[--primary-1] border-[--primary-1] group border-none ${className}`}
    >
      {text}
      {letIcon && (
        <div className="translate-x-1 transition-transform duration-200 ease-in-out group-hover:translate-x-2">
          <ArrowIR className="size-[16px]" />
        </div>
      )}
    </button>
  );
};

export default ForwardButton;

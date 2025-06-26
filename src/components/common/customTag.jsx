import CloseI from "../../assets/icon/close";

const CustomTag = ({ onClick, data }) => {
  return (
    <div
      key={data.id}
      className="w-44 flex items-center justify-between py-2 px-3 border border-solid border-[--border-1] rounded-md text-xs text-[--gr-1] whitespace-nowrap"
    >
      <p>
        {data.label.slice(0, 16)}
        {data.label.length > 16 && "..."}
      </p>
      <span
        className="p-1 bg-[--light-1] rounded-full cursor-pointer hover:bg-[--light-4]"
        onClick={onClick}
      >
        <CloseI className="size-[1rem]" />
      </span>
    </div>
  );
};

export default CustomTag;

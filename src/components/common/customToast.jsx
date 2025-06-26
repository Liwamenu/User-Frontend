import toast from "react-hot-toast";
import { CloseI, InfoI } from "../../assets/icon";

export default function CustomToast({ color, message, t }) {
  const classNames =
    color === "red"
      ? {
          elmnt1: "border-[--red-1]",
          elmnt2: "bg-[--status-red] text-[--red-1]",
        }
      : color === "green"
      ? {
          elmnt1: "border-[--green-1]",
          elmnt2: "bg-[--status-green] text-[--green-1]",
        }
      : {
          elmnt1: "border-[--brown-1]",
          elmnt2: "bg-[--status-red] text-[--red-1]",
        };

  return (
    <div
      className={`transition-all max-w-md w-full bg-[--white-1] shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 border overflow-clip ${
        classNames.elmnt1
      } ${t.visible ? "opacity-100 scale-1" : "opacity-0 scale-0"}`}
    >
      <div
        className={`flex justify-center items-center px-2.5 mr-2 ${classNames.elmnt2}`}
      >
        <InfoI />
      </div>
      <div className="flex-1 w-0 py-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5"></div>
          <div className="flex-1">
            <p
              className="text-sm font-medium text-[--black-2]"
              dangerouslySetInnerHTML={{ __html: message.title }}
            >
              {/* {message.title} */}
            </p>
            <p
              className="mt-1 text-sm text-[--gr-1]"
              dangerouslySetInnerHTML={{ __html: message.content }}
            >
              {/* {message.content} */}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-[--gr-3]">
        <button
          onClick={() => toast.dismiss(t?.id)}
          className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-[--red-1] hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <CloseI />
        </button>
      </div>
    </div>
  );
}

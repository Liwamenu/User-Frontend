import { CancelI } from "../../../../assets/icon";

const CancelButton = ({ closeForm }) => {
  return (
    <div className="absolute top-4 right-3 z-[50]">
      <div
        className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
        onClick={closeForm}
      >
        <CancelI />
      </div>
    </div>
  );
};

export default CancelButton;

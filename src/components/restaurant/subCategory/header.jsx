import AddSubCategory from "./addSubCategory";
import { usePopup } from "../../../context/PopupContext";

const SubCategoriesHeader = ({ categoryId, onSuccess }) => {
  const { setPopupContent } = usePopup();

  const handleAddSubCategory = () => {
    setPopupContent(
      <AddSubCategory categoryId={categoryId} onSuccess={onSuccess} />
    );
  };

  return (
    <div className="py-4 flex items-center justify-between w-full">
      <div>
        <h2 className="text-lg font-semibold text-[--black-1]">
          Alt Kategoriler
        </h2>
        <p className="text-xs text-[--gr-1] mt-1">
          Alt kategorileri yönetin ve düzenleyin
        </p>
      </div>
      <button
        onClick={handleAddSubCategory}
        className="px-4 py-2 text-sm font-medium text-white bg-[--primary-1] rounded-lg shadow-md hover:bg-[--primary-2] transition-all flex items-center gap-2"
      >
        <i className="fa-solid fa-plus"></i> Yeni Alt Kategori
      </button>
    </div>
  );
};

export default SubCategoriesHeader;

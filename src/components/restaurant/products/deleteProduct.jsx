import { DeleteI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";

const DeleteProduct = ({ product }) => {
  const { setSecondPopupContent } = usePopup();

  function onConfirm() {
    console.log(product.id, "is to be deleted");
  }

  return (
    <main className="flex justify-center">
      <div className="bg-[--white-2] text-[--black-2] rounded-[32px] p-8 md:p-10 w-full max-w-[440px] flex flex-col items-center text-center shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        {/* Icon Circle */}
        <div className="size-16 bg-[--status-red] rounded-full flex items-center justify-center mb-6">
          <DeleteI className="size-[1.8rem] text-[--red-1]" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 tracking-tight">Silme İşlemi</h2>

        {/* Description */}
        <p className="text-[--gr-1] text-base mb-10 leading-relaxed px-2 font-medium">
          <span className="font-bold text-[--red-1]">{product.name}</span>{" "}
          öğesini silmek üzeresiniz. Bu işlem geri alınamaz.
        </p>

        {/* Buttons */}
        <div className="flex gap-4 w-full text-sm">
          <button
            onClick={() => setSecondPopupContent(false)}
            className="flex-1 py-2 px-6 border border-[--border-1] rounded-xl text-[--gr-1] font-semibold hover:bg-[--gr-3] transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-6 bg-[--red-1] text-white rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Sil
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeleteProduct;

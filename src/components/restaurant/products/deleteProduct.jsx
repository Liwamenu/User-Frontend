import { useEffect } from "react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

//COMP
import { DeleteI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";

//REDUX
import {
  deleteProduct,
  resetDeleteProduct,
} from "../../../redux/products/deleteProductSlice";

const DeleteProduct = ({ product, onSuccess }) => {
  const dispatch = useDispatch();
  const { setSecondPopupContent } = usePopup();

  const { success, error, loading } = useSelector((s) => s.products.delete);
  const { t } = useTranslation();

  // Clear any leftover success/error from a previous delete so this modal
  // doesn't auto-confirm just by mounting.
  useEffect(() => {
    dispatch(resetDeleteProduct());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onConfirm() {
    dispatch(deleteProduct(product.id));
  }

  useEffect(() => {
    if (success) {
      toast.success(t("deleteProduct.success"));
      setSecondPopupContent(null);
      onSuccess && onSuccess(product.id);
      // Reset the slice so the next open of any delete modal starts clean.
      dispatch(resetDeleteProduct());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  // Surface backend failures (e.g. FK constraint, network error). Without this
  // the modal would silently sit open and the user would think nothing happened.
  useEffect(() => {
    if (error) {
      const msg =
        error?.message_TR ||
        error?.message ||
        t("deleteProduct.error", "Ürün silinemedi. Lütfen tekrar deneyin.");
      toast.error(msg, { id: "deleteProductError" });
      dispatch(resetDeleteProduct());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  return (
    <main className="flex justify-center">
      <div className="bg-[--white-2] text-[--black-2] rounded-[32px] p-8 md:p-10 w-full max-w-[440px] flex flex-col items-center text-center shadow-2xl animate-[fadeIn_0.2s_ease-out]">
        {/* Icon Circle */}
        <div className="size-16 bg-[--status-red] rounded-full flex items-center justify-center mb-6">
          <DeleteI className="size-[1.8rem] text-[--red-1]" strokeWidth={1.8} />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3 tracking-tight">
          {t("deleteProduct.title")}
        </h2>

        {/* Description */}
        <p className="text-[--gr-1] text-base mb-10 leading-relaxed px-2 font-medium">
          <span className="font-bold text-[--red-1]">{product.name}</span>{" "}
          {t("deleteProduct.description")}
        </p>

        {/* Buttons */}
        <div className="flex gap-4 w-full text-sm">
          <button
            onClick={() => setSecondPopupContent(false)}
            disabled={loading}
            className="flex-1 py-2 px-6 border border-[--border-1] rounded-xl text-[--gr-1] font-semibold hover:bg-[--gr-3] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("deleteProduct.cancel")}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-6 bg-[--red-1] text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-70 disabled:cursor-wait"
          >
            {loading ? "..." : t("deleteProduct.delete")}
          </button>
        </div>
      </div>
    </main>
  );
};

export default DeleteProduct;

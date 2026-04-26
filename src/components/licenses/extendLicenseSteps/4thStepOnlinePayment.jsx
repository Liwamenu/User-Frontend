//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";

//REDUX
import { resetExtendByOnlinePay } from "../../../redux/licenses/extendLicense/extendByOnlinePaySlice";

const FourthStepOnlinePayment = ({ setStep, setPaymentStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const currentPath = location.pathname;

  const [htmlResponse, setHtmlResponse] = useState(null);
  const { data } = useSelector((state) => state.licenses.extendByPay);

  useEffect(() => {
    if (data) {
      setHtmlResponse(data);
      dispatch(resetExtendByOnlinePay());
    }

    const handleMessage = (event) => {
      if (event.data.status === "success") {
        setStep(5);
        setPaymentStatus("success");
        toast.success("Ödeme başarılı 😃", { id: "payment_success" });
      } else if (event.data.status === "failed") {
        setStep(5);
        setPaymentStatus("failure");
        toast.error("Ödeme başarısız 😞", { id: "payment_failed" });
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [data, dispatch]);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 sm:px-5 pt-4 pb-3 border-b border-[--border-1]">
        <div className="grid place-items-center size-10 shrink-0 rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20">
          <ShieldCheck className="size-5" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-[--black-1] leading-tight">
            {t("payment.secure_3d_title")}
          </h2>
          <p className="mt-0.5 text-xs text-[--gr-1] leading-snug">
            {t("payment.secure_3d_subtitle")}
          </p>
        </div>
      </div>

      {/* Iframe area */}
      <div className="relative bg-[--white-2]/40 min-h-[28rem]">
        {htmlResponse ? (
          <iframe
            title="3D Secure Frame"
            width="100%"
            height="500"
            srcDoc={htmlResponse}
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
            className="bg-[--white-1] block"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div className="flex flex-col items-center gap-3 text-[--gr-1]">
              <Loader2 className="size-8 animate-spin text-[--primary-1]" />
              <p className="text-xs">{t("payment.loading_3d")}</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[--border-1] bg-[--white-2]/40 px-4 sm:px-5 py-3 flex items-center justify-end">
        <button
          type="button"
          onClick={() => navigate(currentPath.replace("/extend-license", ""))}
          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-rose-200 bg-[--white-1] text-rose-600 text-sm font-medium hover:bg-rose-50 transition"
        >
          <ArrowLeft className="size-4" />
          {t("payment.cancel_payment")}
        </button>
      </div>
    </div>
  );
};

export default FourthStepOnlinePayment;

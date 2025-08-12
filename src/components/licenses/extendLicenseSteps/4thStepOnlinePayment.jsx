//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//COMP
import BackButton from "../stepsAssets/backButton";

//REDUX
import { resetExtendByOnlinePay } from "../../../redux/licenses/extendLicense/extendByOnlinePaySlice";

const FourthStepOnlinePayment = ({ setStep, setPaymentStatus }) => {
  const navigate = useNavigate();
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
      // Verify the origin here if necessary
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
    <>
      <div className="w-full h-full bg-[--white-1] flex flex-col justify-center items-center relative">
        {htmlResponse && (
          <iframe
            title="3D Secure Frame"
            width="100%"
            height="100%"
            srcDoc={htmlResponse}
            sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
          />
        )}
      </div>
      {/* BTNS */}
      <div className="flex gap-3 absolute -bottom-20 -right-0 h-12">
        <BackButton
          text="İptal"
          letIcon={true}
          onClick={() => navigate(currentPath.replace("/extend-license", ""))}
        />
      </div>
    </>
  );
};

export default FourthStepOnlinePayment;

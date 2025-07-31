//MODULES
import { useLocation } from "react-router-dom";

//COMP
import FourthStepBankPayment from "./4thStepBankPayment";
import OnlinePayment from "../paymentTypes/onlinePayment";
import WithOutPayment from "../paymentTypes/withOutPayment";

const FourthStep = ({
  step,
  setStep,
  userData,
  userInvData,
  paymentMethod,
  setPaymentStatus,
}) => {
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const actionType = pathArray[pathArray.length - 1];

  const paymentId = paymentMethod.selectedOption.id;
  const value = paymentMethod.selectedOption.value;

  return (
    step === 4 && (
      <div className="h-full overflow-y-auto">
        {value === "bankPayment" ? (
          <FourthStepBankPayment
            step={step}
            setStep={setStep}
            paymentId={paymentId}
          />
        ) : value === "onlinePayment" ? (
          <OnlinePayment
            step={step}
            setStep={setStep}
            userData={userData}
            paymentId={paymentId}
            actionType={actionType}
            userInvData={userInvData}
            setPaymentStatus={setPaymentStatus}
          />
        ) : (
          <WithOutPayment
            step={step}
            user={userData}
            setStep={setStep}
            actionType={actionType}
            setPaymentStatus={setPaymentStatus}
          />
        )}
      </div>
    )
  );
};

export default FourthStep;

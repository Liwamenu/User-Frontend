//MODULES
import { useLocation } from "react-router-dom";

//COMP
import OnlinePayment from "../paymentTypes/onlinePayment";
import FourthStepBankPayment from "./4thStepBankPayment";

const FourthStep = ({
  step,
  setStep,
  userData,
  userInvData,
  paymentMethod,
  setPaymentStatus,
}) => {
  const value = paymentMethod.selectedOption.value;
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const actionType = pathArray[pathArray.length - 1];
  return (
    step === 4 && (
      <div className="h-full overflow-y-auto">
        {value === "bankPayment" ? (
          <FourthStepBankPayment step={step} setStep={setStep} />
        ) : (
          value === "onlinePayment" && (
            <OnlinePayment
              step={step}
              setStep={setStep}
              userData={userData}
              actionType={actionType}
              userInvData={userInvData}
              setPaymentStatus={setPaymentStatus}
            />
          )
        )}
      </div>
    )
  );
};

export default FourthStep;

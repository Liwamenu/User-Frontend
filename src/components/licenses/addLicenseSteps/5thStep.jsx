//MODULES
import { useLocation } from "react-router-dom";

//COMP
import BankPayment from "../paymentTypes/bankPayment";
import FifthStepOnlinePayment from "./5thStepOnlinePayment";

const FifthStep = ({
  step,
  user,
  setStep,
  paymentMethod,
  setPaymentStatus,
}) => {
  const value = paymentMethod.selectedOption.value;
  return (
    step === 5 && (
      <div className="h-full overflow-y-auto">
        {value === "onlinePayment" ? (
          <FifthStepOnlinePayment
            setStep={setStep}
            setPaymentStatus={setPaymentStatus}
          />
        ) : (
          value === "bankPayment" && (
            <BankPayment
              user={user}
              step={step}
              setStep={setStep}
              setPaymentStatus={setPaymentStatus}
            />
          )
        )}
      </div>
    )
  );
};

export default FifthStep;

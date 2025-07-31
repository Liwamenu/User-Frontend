//MODULES

//COMP
import BankPayment from "../paymentTypes/bankPayment";
import FifthStepOnlinePayment from "./5thStepOnlinePayment";

const FifthStep = ({
  user,
  step,
  setStep,
  userInvData,
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
              userInvData={userInvData}
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

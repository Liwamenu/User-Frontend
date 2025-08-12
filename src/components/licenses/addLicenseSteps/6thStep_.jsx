//MODULES

//COMP
import SixthStepOnlinePayment from "./6thStepOnlinePayment";

const SixthStep = ({ step, setStep, paymentMethod, paymentStatus }) => {
  const value = paymentMethod.selectedOption.value;
  return (
    step === 6 && (
      <div className="h-full overflow-y-auto">
        {value === "onlinePayment" ? (
          <SixthStepOnlinePayment step={step} paymentStatus={paymentStatus} />
        ) : (
          value === "bankPayment" && null
        )}
      </div>
    )
  );
};

export default SixthStep;

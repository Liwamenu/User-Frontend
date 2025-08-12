//MODULES

//COMP
import FifthStepOnlinePayment from "./5thStepOnlinePayment";

const FifthStep = ({ step, paymentMethod, paymentStatus }) => {
  const value = paymentMethod.selectedOption.value;
  return (
    step === 5 && (
      <div className="h-full">
        <div className="flex flex-col w-full items-center h-full overflow-y-auto">
          {value === "onlinePayment" ? (
            <FifthStepOnlinePayment step={step} paymentStatus={paymentStatus} />
          ) : (
            value === "bankPayment" && null
          )}
        </div>
      </div>
    )
  );
};

export default FifthStep;

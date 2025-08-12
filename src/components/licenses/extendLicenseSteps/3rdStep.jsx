//MODULES
import { useLocation } from "react-router-dom";

//COMP
import ThirdStepBankPayment from "./3thStepBankPayment";
import OnlinePayment from "../paymentTypes/onlinePayment";

const ThirdStep = ({ step, setStep, userData, userInvData, paymentMethod }) => {
  const location = useLocation();
  const pathArray = location.pathname.split("/");
  const actionType = pathArray[pathArray.length - 1];

  const value = paymentMethod.selectedOption.value;
  return (
    step === 3 && (
      <div className="h-full">
        <div className="flex flex-col w-full items-center h-full overflow-y-auto">
          {value === "onlinePayment" ? (
            <OnlinePayment
              step={step}
              setStep={setStep}
              userData={userData}
              actionType={actionType}
              userInvData={userInvData}
            />
          ) : (
            value === "bankPayment" && (
              <ThirdStepBankPayment step={step} setStep={setStep} />
            )
          )}
        </div>
      </div>
    )
  );
};

export default ThirdStep;

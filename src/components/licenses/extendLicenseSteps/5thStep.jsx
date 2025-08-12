//MODULES
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//COMP
import SuccessPage from "../stepsAssets/successPage";
import FailurePage from "../stepsAssets/failurePage";

const FifthStep = ({ step, paymentStatus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const pathArray = location.pathname.split("/");
  const actionType = pathArray[pathArray.length - 1];

  useEffect(() => {
    let goToLicenses;

    if (step === 5) {
      goToLicenses = setTimeout(
        () => navigate(currentPath?.replace(`/${actionType}`, "")),
        7000
      );
    }

    return () => {
      if (goToLicenses) {
        clearTimeout(goToLicenses);
      }
    };
  }, [step]);

  return (
    step === 5 &&
    (paymentStatus === "success" ? (
      <SuccessPage
        step={step}
        currentPath={currentPath}
        actionType={actionType}
      />
    ) : (
      <FailurePage currentPath={currentPath} actionType={actionType} />
    ))
  );
};

export default FifthStep;

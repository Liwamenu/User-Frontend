// MODULES
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//COMP
import StepBar from "../../common/stepBar";
import StepFrame from "../../common/stepFrame";
import PaymentTypes from "../../../enums/paymentTypes";
import DoubleArrowRI from "../../../assets/icon/doubleArrowR";

//STEPS
import FirstStep from "../addLicenseSteps/1stStep";
import SecondStep from "../addLicenseSteps/2ndStep";
import ThirdStep from "../addLicenseSteps/3rdStep";
import FourthStep from "../addLicenseSteps/4thStep";
import FifthStep from "../addLicenseSteps/5thStep";
import SixthStep from "../addLicenseSteps/6thStep";

//REDUX
import { clearCart } from "../../../redux/cart/cartSlice";

const AddLicensePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, restaurant, licenses } = location.state || {};
  const currentPath = location.pathname;
  const pathArray = currentPath.split("/");
  const actionType = pathArray[pathArray.length - 1];

  const initialPackage = {
    value: null,
    label: "Lisans Paketi Seç",
    id: null,
    time: null,
  };

  const cartItems = useSelector((state) => state.cart.items);

  const [step, setStep] = useState(1);
  const [steps, setSteps] = useState(6);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [userInvData, setUserInvData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [restaurantData, setRestaurantData] = useState({
    label: "Restoran Seç",
  });
  const [licensePackageData, setLicensePackageData] = useState(initialPackage);

  const [paymentMethod, setPaymentMethod] = useState({
    selectedOption: PaymentTypes[0],
    options: PaymentTypes,
  });

  const selectedMethod = paymentMethod.selectedOption.value || "";

  useEffect(() => {
    return () => {
      if (cartItems) {
        dispatch(clearCart());
        setLicensePackageData(initialPackage);
      }
    };
  }, []);

  return (
    <section className="lg:ml-[280px] pt-28 px-[4%] pb-4 grid grid-cols-1 section_row">
      {/* TITLE */}
      <div className="w-max flex gap-1 text-[--gr-1] pt-4 text-sm font-[300] cursor-pointer">
        <div
          className="flex items-center gap-1"
          onClick={() =>
            navigate(currentPath.replace("/add-license", ""), {
              replace: true,
            })
          }
        >
          {currentPath.includes("users") &&
            (user ? (
              <>
                {user.fullName} <DoubleArrowRI />
              </>
            ) : (
              <>
                Kullanıcılar <DoubleArrowRI />
              </>
            ))}
          {currentPath.includes("restaurants") &&
            (restaurant ? (
              <>
                {restaurant.name} <DoubleArrowRI />
              </>
            ) : (
              <>
                Restoranlar <DoubleArrowRI />
              </>
            ))}
          Lisanslar
          <DoubleArrowRI />
          Lisans Ekle
        </div>
      </div>

      <div className="flex flex-col items-center w-full text-base">
        <div className="flex flex-col items-center w-full pt-4 pb-4 text-[--black-2] relative ">
          <StepBar step={step} steps={steps} className="max-w-2xl" />

          <div className="w-full self-center overflow-x-clip">
            <div
              className={`w-full h-[32rem] border-0 border-dashed border-[--light-3] rounded-sm relative ${
                selectedMethod === "onlinePayment" && step === 2 && "h-[31rem]"
              }`}
            >
              <div className="w-full h-full">
                <StepFrame
                  step={step}
                  steps={steps}
                  percent={100}
                  measure="%"
                  component={[
                    <FirstStep
                      key={0}
                      paramsUser={user}
                      restaurantData={restaurantData}
                      setRestaurantData={setRestaurantData}
                      licensePackageData={licensePackageData}
                      setLicensePackageData={setLicensePackageData}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      setStep={setStep}
                      actionType={actionType}
                      restaurant={restaurant}
                      licenses={licenses}
                    />,
                    <SecondStep
                      key={1}
                      step={step}
                      setStep={setStep}
                      setSteps={setSteps}
                      paymentMethod={paymentMethod}
                      setPaymentMethod={setPaymentMethod}
                      restaurantData={restaurantData}
                    />,
                    <ThirdStep
                      key={2}
                      step={step}
                      setStep={setStep}
                      userInvData={userInvData}
                      setUserInvData={setUserInvData}
                      selectedUserData={selectedUserData}
                      setSelectedUserData={setSelectedUserData}
                    />,
                    <FourthStep
                      key={3}
                      step={step}
                      steps={steps}
                      setStep={setStep}
                      userInvData={userInvData}
                      userData={selectedUserData}
                      paymentMethod={paymentMethod}
                      setPaymentStatus={setPaymentStatus}
                    />,
                    <FifthStep
                      key={4}
                      step={step}
                      setStep={setStep}
                      user={selectedUserData}
                      userInvData={userInvData}
                      paymentMethod={paymentMethod}
                      setPaymentStatus={setPaymentStatus}
                    />,
                    <SixthStep
                      key={4}
                      step={step}
                      paymentMethod={paymentMethod}
                      paymentStatus={paymentStatus}
                    />,
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AddLicensePage;

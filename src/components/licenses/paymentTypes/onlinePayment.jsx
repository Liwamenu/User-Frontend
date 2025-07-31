//MODULES
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMP
import PaymentCard from "../../payment/card/card";
import BackButton from "../stepsAssets/backButton";
import PayTRForm from "../../payment/form/PayTRForm";
// import { getPriceWithKDV } from "../../../utils/utils";
import { usePopup } from "../../../context/PopupContext";
import ForwardButton from "../stepsAssets/forwardButton";
import { PaymentLoader } from "../stepsAssets/paymentLoader";
import PaymentCardForm from "../../payment/form/PaymentCardForm";

// REDUX
import {
  addByOnlinePay,
  resetAddByOnlinePay,
} from "../../../redux/licenses/addLicense/addByOnlinePaySlice";
import {
  extendByOnlinePay,
  resetExtendByOnlinePay,
} from "../../../redux/licenses/extendLicense/extendByOnlinePaySlice";

const OnlinePayment = ({
  step,
  setStep,
  userData,
  actionType,
  userInvData,
  setPaymentStatus,
}) => {
  const toastId = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const { setPopupContent } = usePopup();
  const { currentLicense } = location?.state || {};
  const isPageExtend = actionType === "extend-license";

  const {
    error: addError,
    loading: addLoading,
    success: addSuccess,
  } = useSelector((state) => state.licenses.addByPay);

  const {
    error: extendError,
    loading: extendLoading,
    success: extendSuccess,
  } = useSelector((state) => state.licenses.extendByPay);

  const { loading: updateInvLoading } = useSelector(
    (state) => state.users.updateInvoice
  );

  const { loading: addInvLoading } = useSelector(
    (state) => state.users.addInvoice
  );

  const cartItems = useSelector((state) => state.cart.items);

  const [flip, setFlip] = useState(false);
  const [cardData, setCardData] = useState({
    userName: "", // "PAYTR TEST",
    cardNumber: "", // "4355 0843 5508 4358",
    month: "", // "12",
    year: "", // "24",
    cvv: "", // "000",
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (addLoading || extendLoading) return;

    const { userName, cardNumber, month, year, cvv } = cardData;
    const { email, fullName, phoneNumber, id } = userData;
    const address = `${userInvData.city}/${userInvData.district}/${userInvData.neighbourhood}`;

    const paymentAmount = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price),
      // acc + parseFloat(getPriceWithKDV(item.price, item.kdvData)),
      0
    );

    const addLicenseBasket = cartItems.reduce((result, item) => {
      const existingRestaurant = result.find(
        (restaurant) => restaurant.restaurantId === item.restaurantId
      );

      if (existingRestaurant) {
        existingRestaurant.licensePackageIds.push(item.id);
      } else {
        result.push({
          restaurantId: item.restaurantId,
          licensePackageIds: [item.id],
        });
      }

      return result;
    }, []);

    const { licensePackageId, restaurantId } = cartItems[0];
    const extendLicenseBasket = {
      licensePackageId,
      restaurantId,
      licenseId: currentLicense?.id,
    };

    const data = {
      userId: id,
      userName: fullName,
      userEmail: email,
      userPhoneNumber: phoneNumber,
      userAddress: address,
      ccOwner: userName,
      cardNumber: cardNumber.replace(/\D/g, ""),
      expiryMonth: month,
      expiryYear: year,
      cvv,
      userBasket: isPageExtend
        ? JSON.stringify(extendLicenseBasket)
        : JSON.stringify(addLicenseBasket),
      paymentType: "card",
      paymentAmount,
    };

    if (isPageExtend) {
      dispatch(extendByOnlinePay(data));
    } else {
      dispatch(addByOnlinePay(data));
    }
    //NOTE: the step changer function based on the response is in the "addLicensePage".
  }

  // ADD TOAST
  useEffect(() => {
    if (addLoading) {
      toastId.current = toast.loading("Loading...");
    }
    if (addSuccess) {
      setStep(5);
      toast.remove(toastId.current);
      return;
    }
    if (addError) {
      setStep(6);
      setPaymentStatus("failure");
      toast.remove(toastId.current);
      dispatch(resetAddByOnlinePay());
    }
  }, [addLoading, addSuccess, addError, dispatch]);

  // EXTEND TOAST
  useEffect(() => {
    if (extendLoading) {
      toastId.current = toast.loading("Loading...");
    }
    if (extendSuccess) {
      setStep(4);
      toast.remove(toastId.current);
      return;
    }
    if (extendError) {
      setStep(5);
      setPaymentStatus("failure");
      toast.remove(toastId.current);
      dispatch(resetExtendByOnlinePay());
    }
  }, [extendLoading, extendSuccess, extendError, dispatch]);

  //LOADING ANIMATION
  useEffect(() => {
    if (addLoading || extendLoading) {
      setPopupContent(<PaymentLoader />);
    } else setPopupContent(null);
  }, [addLoading, extendLoading]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="full flex justify-center">
        <div className="w-[325px] flex flex-col">
          <PaymentCard flip={flip} cardData={cardData} />

          <PaymentCardForm
            setFlip={setFlip}
            cardData={cardData}
            setCardData={setCardData}
          />
        </div>
      </div>
      {/* BTNS */}
      <div className="flex gap-3 absolute -bottom-16 -right-0 h-12">
        <BackButton
          text="Geri"
          letIcon={true}
          onClick={() => setStep(step - 1)}
          disabled={
            addLoading || extendLoading || updateInvLoading || addInvLoading
          }
        />
        <ForwardButton
          text="Devam"
          letIcon={true}
          type="submit"
          disabled={
            addLoading || extendLoading || updateInvLoading || addInvLoading
          }
        />
      </div>

      <PayTRForm cardData={cardData} />
    </form>
  );
};

export default OnlinePayment;

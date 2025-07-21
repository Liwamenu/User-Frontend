import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";

import {
  formatToPrice,
  getPriceWithKDV,
  groupedLicensePackages,
} from "../../../utils/utils";

//COMP
import BackButton from "../stepsAssets/backButton";
import ForwardButton from "../stepsAssets/forwardButton";
import { usePopup } from "../../../context/PopupContext";
import { PaymentLoader } from "../stepsAssets/paymentLoader";

//ASSETS
import GoFody from "../../../assets/img/packages/GoFody.png";
import Siparisim from "../../../assets/img/packages/Siparisim.png";
import Getiryemek from "../../../assets/img/packages/Getiryemek.png";
import MigrosYemek from "../../../assets/img/packages/MigrosYemek.png";
import Yemeksepeti from "../../../assets/img/packages/Yemeksepeti.png";
import TrendyolYemek from "../../../assets/img/packages/TrendyolYemek.png";
import Autoronics from "../../../assets/img/packages/Autoronics.png";
import Vigo from "../../../assets/img/packages/Vigo.png";
import PaketNet from "../../../assets/img/packages/PaketNet.png";

//REDUX
import {
  addByBankPay,
  resetAddByBankPay,
} from "../../../redux/licenses/addLicense/addByBankPaySlice";
import {
  extendByBankPay,
  resetExtendByBankPay,
} from "../../../redux/licenses/extendLicense/extendByBankPaySlice";

const imageSRCs = [
  { src: Getiryemek, name: "Getiryemek" },
  { src: MigrosYemek, name: "MigrosYemek" },
  { src: TrendyolYemek, name: "TrendyolYemek" },
  { src: Yemeksepeti, name: "Yemeksepeti" },
  { src: GoFody, name: "GoFody" },
  { src: Siparisim, name: "Siparisim" },
  { src: Autoronics, name: "Autoronics" },
  { src: Vigo, name: "Vigo" },
  { src: PaketNet, name: "PaketNet" },
];

const WithOutPayment = ({
  user,
  step,
  setStep,
  setPaymentStatus,
  actionType,
}) => {
  const toastId = useRef();
  const dispatch = useDispatch();
  const location = useLocation();
  const { setPopupContent } = usePopup();
  const { currentLicense } = location?.state || {};

  const isPageExtend = actionType === "extend-license";
  const cartItems = useSelector((state) => state.cart.items);
  const {
    error: addError,
    loading: addLoading,
    success: addSuccess,
  } = useSelector((state) => state.licenses.addByBank);

  const {
    error: extendError,
    loading: extendLoading,
    success: extendSuccess,
  } = useSelector((state) => state.licenses.extendByBank);

  const [licensePackagesData, setLicensePackagesData] = useState();

  function getTotalPrice() {
    const result = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price),
      0
    );
    const kdv = cartItems.reduce(
      (acc, item) =>
        acc + (parseFloat(item.price) / 100) * item.kdvData.kdvPercentage,
      0
    );
    const useKDV = cartItems[0]?.kdvData.useKDV;
    const kdvTotal = formatToPrice(kdv);
    const total = formatToPrice(result);
    const totalWithKdv = formatToPrice(result + kdv);
    return { total, kdvTotal, useKDV, totalWithKdv };
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (addLoading || extendLoading) return;

    const paymentAmount = cartItems.reduce(
      (acc, item) =>
        acc + parseFloat(getPriceWithKDV(item.price, item.kdvData)),
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

    // Create a FormData object
    const formData = new FormData();
    formData.append("UserId", user.id);
    formData.append("UserName", user.fullName);
    formData.append("UserEmail", user.email);
    formData.append("UserPhoneNumber", user.phoneNumber);
    formData.append("UserAddress", ``);
    formData.append(
      "UserBasket",
      isPageExtend
        ? JSON.stringify(extendLicenseBasket)
        : JSON.stringify(addLicenseBasket)
    );
    formData.append("PaymentType", "Free");
    formData.append("PaymentAmount", paymentAmount.toString());

    if (isPageExtend) {
      dispatch(extendByBankPay(formData));
    } else {
      dispatch(addByBankPay(formData));
    }
  }

  useEffect(() => {
    if (cartItems) {
      setLicensePackagesData(groupedLicensePackages(cartItems));
    }
  }, [cartItems]);

  // ADD SUCCESS
  useEffect(() => {
    if (addLoading) {
      toastId.current = toast.loading("Loading...");
    }
    if (addSuccess) {
      setStep(6);
      toast.remove(toastId.current);
      setPaymentStatus("success");
      dispatch(resetAddByBankPay());
    }
    if (addError) {
      setStep(6);
      toast.remove(toastId.current);
      setPaymentStatus("failure");
      dispatch(resetAddByBankPay());
    }
  }, [addLoading, addSuccess, addError]);

  // EXTEND SUCCESS
  useEffect(() => {
    if (extendLoading) {
      toastId.current = toast.loading("Loading...");
    }
    if (extendSuccess) {
      setStep(5);
      toast.remove(toastId.current);
      setPaymentStatus("success");
      dispatch(resetExtendByBankPay());
    }
    if (extendError) {
      setStep(5);
      toast.remove(toastId.current);
      setPaymentStatus("failure");
      dispatch(resetExtendByBankPay());
    }
  }, [extendLoading, extendSuccess, extendError, dispatch]);

  //LOADING ANIMATION
  useEffect(() => {
    if (addLoading || extendLoading) {
      setPopupContent(<PaymentLoader type={1} />);
    } else setPopupContent(null);
  }, [addLoading, extendLoading]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <p className="text-[--red-1] border-b border-[--red-1]">
          Aşağıdaki lisanslar ücretsiz olarak{" "}
          {isPageExtend ? "uzatılacaktır" : "eklenecektir"}.
        </p>
      </div>
      <main className="w-max mt-16 flex flex-col gap-1">
        {licensePackagesData &&
          licensePackagesData.map((licensePkg, i) => (
            <div
              key={i}
              className="flex items-center gap-8 even:bg-[--white-1] odd:bg-[--table-odd] relative"
            >
              <img
                src={imageSRCs[licensePkg[0].licenseTypeId]?.src}
                alt="Pazaryeri"
                className="w-36 h-full rounded-sm"
              />
              {i === 0 && (
                <p className="absolute -top-8 left-0 right-0 w-36">Pazaryeri</p>
              )}
              <div className="flex gap-4 py-1">
                {licensePkg.map((pkg) => {
                  const isSelected = true;
                  return (
                    <React.Fragment key={pkg.restaurantId}>
                      <div className="flex flex-col items-center text-center text-[12px] leading-snug relative">
                        {i === 0 && (
                          <p className="absolute -top-8 left-0 right-0">
                            Restoran Adı
                          </p>
                        )}
                        <p className="text-[8px] whitespace-nowrap">
                          {pkg.restaurantName}
                        </p>
                        <div
                          className={`py-1 px-6 rounded w-28 ${
                            isSelected
                              ? "bg-[--primary-1] text-white"
                              : "bg-[--light-3]"
                          }`}
                        >
                          <p className="whitespace-nowrap">{pkg.time} Yıllık</p>
                          <p
                            className={`text-sm whitespace-nowrap ${
                              isSelected ? "text-white" : "text-[--gr-1]"
                            }`}
                          >
                            {pkg.price} ₺
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-8 py-1">
                        <div className="text-center flex flex-col justify-center px-3 relative">
                          {i === 0 && pkg.kdvData.useKDV && (
                            <p className="absolute -top-8 left-0 right-0">
                              KDV%{pkg.kdvPercentage}
                            </p>
                          )}
                          {pkg.kdvData.useKDV && (
                            <p className="font-normal w-24">
                              {(pkg.price / 100) * pkg.kdvPercentage} ₺
                            </p>
                          )}
                        </div>
                        <div className="text-center flex flex-col justify-center px-3 relative">
                          {i === 0 && (
                            <p className="absolute -top-8 left-0 right-0">
                              Toplam
                            </p>
                          )}
                          <p className="font-normal">
                            {formatToPrice(
                              getPriceWithKDV(pkg.price, pkg.kdvData).replace(
                                ".00",
                                ""
                              )
                            )}{" "}
                            ₺
                          </p>
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        <div className="flex justify-between px-2">
          <p>Toplam</p>{" "}
          <p>
            {getTotalPrice().useKDV
              ? getTotalPrice().totalWithKdv
              : getTotalPrice().total}{" "}
            ₺
          </p>
        </div>
      </main>

      {/* BTNS */}
      <div className="flex gap-3 absolute -bottom-16 -right-0">
        <BackButton
          text="Geri"
          letIcon={true}
          onClick={() => setStep(step - 2)}
          disabled={addLoading || extendLoading}
        />
        <ForwardButton
          text={isPageExtend ? "Uzat" : "Ekle"}
          letIcon={true}
          type="submit"
          disabled={addLoading || extendLoading}
        />
      </div>
    </form>
  );
};

export default WithOutPayment;

//MODULES
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

//COMP
import BackButton from "../stepsAssets/backButton";
import ForwardButton from "../stepsAssets/forwardButton";
import {
  formatToPrice,
  // getPriceWithKDV,
  groupedLicensePackages,
} from "../../../utils/utils";

const SecondStep = ({ step, setStep, paymentMethod, setPaymentMethod }) => {
  const cartItems = useSelector((state) => state.cart.items);
  const [licensePackagesData, setLicensePackagesData] = useState();

  function getTotalPrice() {
    const result = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price),
      0
    );

    const total = formatToPrice(result);
    return total;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const paymentId = paymentMethod.selectedOption.id;

    if (paymentId == 2) {
      setStep(4);
      return;
    }
    setStep(3);
  }

  useEffect(() => {
    if (cartItems) {
      setLicensePackagesData(groupedLicensePackages(cartItems));
    }
  }, [cartItems]);

  return (
    step === 2 && (
      <form
        onSubmit={handleSubmit}
        className="min-h-full flex flex-col justify-between overflow-y-autoo"
      >
        <div className="w-full min-h-max px-4">
          <div className="w-full flex justify-center pt-2">
            <div>
              <p className="text-center py-2">Ödeme Yontemı Seç</p>
              <div className="flex gap-2">
                {paymentMethod.options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => {
                      setPaymentMethod((prev) => {
                        return {
                          ...prev,
                          selectedOption: option,
                        };
                      });
                    }}
                    className={`py-2.5 px-2  text-white text-sm rounded-md ${
                      option.value === paymentMethod.selectedOption.value
                        ? "bg-[--green-1]"
                        : "bg-[--status-primary-1]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <main className="w-max mt-16 flex flex-col gap-1">
            {licensePackagesData &&
              licensePackagesData.map((licensePkg, i) => (
                <div
                  key={i}
                  className="flex items-center gap-8 even:bg-[--white-1] odd:bg-[--table-odd] relative"
                >
                  <div className="flex gap-4 pt-1">
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
                              <p className="whitespace-nowrap">
                                {pkg.time} Yıllık
                              </p>
                              <p
                                className={`text-sm whitespace-nowrap ${
                                  isSelected ? "text-white" : "text-[--gr-1]"
                                }`}
                              >
                                {pkg.price} ₺
                              </p>
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                  </div>
                </div>
              ))}
          </main>
        </div>

        {/* BTNS */}
        <div
          className={`w-full flex justify-end gap-4 ${
            cartItems.length > 5 && "py-6"
          }`}
        >
          <div className="w-max flex gap-3 self-en">
            <BackButton
              text="Geri"
              letIcon={true}
              onClick={() => setStep(1)}
              // disabled={loading}
            />
            <ForwardButton
              text="Devam"
              letIcon={true}
              type="submit"
              // disabled={loading}
            />
          </div>
        </div>
      </form>
    )
  );
};

export default SecondStep;

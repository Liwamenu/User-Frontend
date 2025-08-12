//MODULES
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";

//COMP
import BackButton from "../stepsAssets/backButton";
import ForwardButton from "../stepsAssets/forwardButton";

//FUNC
import { formatToPrice, groupedLicensePackages } from "../../../utils/utils";

const SecondStep = ({
  step,
  setStep,
  setSteps,
  paymentMethod,
  setPaymentMethod,
}) => {
  const cartItems = useSelector((state) => state.cart.items);
  const [licensePackagesData, setLicensePackagesData] = useState();

  function handleSubmit(e) {
    e.preventDefault();
    setStep(3 + 1);
  }

  useEffect(() => {
    if (cartItems) {
      setLicensePackagesData(groupedLicensePackages(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    if (paymentMethod.selectedOption.id === 0 && step == 2) {
      setSteps(6);
    }
  }, [step]);

  return (
    step === 2 && (
      <form
        onSubmit={handleSubmit}
        className="min-h-full flex flex-col justify-between overflow-y-autoo"
      >
        <div className="w-full px-4 min-h-max">
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
                      option.id == 0 ? setSteps(6) : setSteps(6);
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
                  <div className="flex gap-4 py-1">
                    {licensePkg.map((pkg) => {
                      const isSelected = true;

                      return (
                        <React.Fragment key={pkg.restaurantId}>
                          <div className="flex flex-col items-center text-center text-white text-[12px] leading-snug relative">
                            {i === 0 && (
                              <p className="absolute -top-6 left-0 right-0 text-sm">
                                Restoran Adı
                              </p>
                            )}
                            <p className="text-[8px] whitespace-nowrap">
                              {pkg.restaurantName}
                            </p>
                            <div
                              className={`py-1 px-6 rounded w-28 ${
                                isSelected
                                  ? "bg-[--primary-1]"
                                  : "bg-[--light-3]"
                              }`}
                            >
                              <p className="whitespace-nowrap">
                                {pkg.time} Yıllık
                              </p>
                              <p className={`text-sm whitespace-nowrap`}>
                                {pkg.price} ₺
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-8 py-1">
                            <div className="text-center flex flex-col justify-center px-3 relative">
                              {i === 0 && (
                                <p className="absolute -top-8 left-0 right-0">
                                  Toplam
                                </p>
                              )}
                              <p className="font-normal">
                                {formatToPrice(
                                  String(pkg.price.toFixed(2))
                                    .replace(".", "d")
                                    .replace(",", ".")
                                    .replace("d", ",")
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

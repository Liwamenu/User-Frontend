import { useState } from "react";
import CustomInput from "../common/customInput";
import CustomToggle from "../common/customToggle";
import CustomSelect from "../common/customSelector";
import LanguagesEnums from "../../enums/languagesEnums";

const RestaurantSettings = ({ data }) => {
  const [restaurantData, setRestaurantData] = useState({ ...data });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted settings:", restaurantData);
    // dispatch update action here
  }

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col">
        <h1 className="self-center text-2xl font-bold">Ayarlar</h1>

        <form onSubmit={handleSubmit} className="px-4 sm:px-14 mt-6 space-y-5">
          <div className="max-w-md">
            <CustomInput
              type="number"
              label="Minimum Mesafe (KM)"
              placeholder="Minimum mesafe giriniz"
              className="py-[.4rem] rounded-sm"
              value={restaurantData?.minDistance ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    minDistance: e,
                  };
                })
              }
            />
          </div>

          <div className="max-w-md">
            <CustomInput
              type="text"
              label={
                <p>
                  {" "}
                  <a
                    href="https://analytics.google.com/analytics/web"
                    target="_blank"
                    className="text-[--link-1]"
                  >
                    Google Analytics
                  </a>{" "}
                  websitesinden ulaşabilirsiniz.{" "}
                </p>
              }
              className="py-[.4rem] rounded-sm"
              placeholder="Google Analytics Measurement-ID'nizi yazınız"
              value={restaurantData?.googleAnalytics ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    googleAnalytics: e,
                  };
                })
              }
            />
          </div>

          <div className="max-w-md">
            <CustomSelect
              type="text"
              label="Varsayılan Dil"
              placeholder="Örn: tr, en"
              style={{ borderRadius: ".125rem", padding: "0.1rem 0px" }}
              className="py-[.4rem] rounded-sm"
              value={
                LanguagesEnums.find(
                  (L) => L.value == (restaurantData?.defaultLang ?? null)
                ) || { label: "Dil Seç" }
              }
              options={LanguagesEnums}
              onChange={(selectedOption) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    defaultLang: selectedOption.value,
                  };
                })
              }
            />
          </div>

          <div className="max-w-md">
            <CustomInput
              type="text"
              label="Slogan 1"
              placeholder="Slogan 1 giriniz"
              className="py-[.4rem] rounded-sm"
              value={restaurantData?.slogan1 ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    slogan1: e,
                  };
                })
              }
            />
          </div>

          <div className="max-w-md">
            <CustomInput
              type="text"
              label="Slogan 2"
              placeholder="Slogan 1 giriniz"
              className="py-[.4rem] rounded-sm"
              value={restaurantData?.slogan2 ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    slogan2: e,
                  };
                })
              }
            />
          </div>

          <div className="flex justify-between items-center max-w-md">
            <label className="font-medium">Masada Sipariş</label>
            <CustomToggle
              checked={restaurantData?.inPersonOrder}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    inPersonOrder: !restaurantData.inPersonOrder,
                  };
                })
              }
            />
          </div>

          <div className="flex justify-between items-center max-w-md">
            <label className="font-medium">Online Sipariş</label>
            <CustomToggle
              checked={restaurantData?.onlineOrder}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    onlineOrder: !restaurantData.onlineOrder,
                  };
                })
              }
            />
          </div>

          {/* Hide */}
          <div className="flex justify-between items-center max-w-md">
            <label className="font-medium">Restoranı Gizle</label>
            <CustomToggle
              checked={restaurantData?.hide}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    hide: !restaurantData.hide,
                  };
                })
              }
            />
          </div>

          <div className="w-full flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-md bg-[--primary-1] text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSettings;

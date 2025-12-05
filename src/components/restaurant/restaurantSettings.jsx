//MODULES
import { useState } from "react";
import { useDispatch } from "react-redux";

//COMP
import CustomInput from "../common/customInput";
import CustomToggle from "../common/customToggle";
import CustomSelect from "../common/customSelector";
import LanguagesEnums from "../../enums/languagesEnums";
import { setRestaurantSettings } from "../../redux/restaurant/setRestaurantSettingsSlice";

const RestaurantSettings = ({ data }) => {
  const dispatch = useDispatch();
  const {
    id,
    tenant,
    maxDistanceKM,
    googleAnalytics,
    defaultLang,
    menuLang,
    onlineOrder,
    inPersonOrder,
    hide,
    slogan1,
    slogan2,
    online_order_discount_rate,
    table_order_discount_rate,
  } = data || {};
  const [restaurantData, setRestaurantData] = useState({
    restaurantId: id,
    tenant,
    maxDistanceKM,
    googleAnalytics,
    defaultLang,
    menuLang,
    onlineOrder,
    inPersonOrder,
    hide,
    slogan1,
    slogan2,
    online_order_discount_rate,
    table_order_discount_rate,
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Submitted settings:", restaurantData);

    dispatch(setRestaurantSettings(restaurantData));
  }

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14 ">
        <h1 className="text-2xl font-bold">
          Ayarlar
          <span className="text-[--primary-1]"> {restaurantData?.name} </span>
          Restoranı
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-2 max-lg:grid-cols-1 gap-x-4 gap-y-1"
        >
          {/* TENANT */}
          <div className="mt-3 sm:mt-4">
            <label className="text-xs font-semibold tracking-wide text-[--gr-1] max-md:max-w-full text-left">
              <span className="whitespace-nowrap">
                Tenant (Örn:{" "}
                <span className="text-[--primary-1]">restoran</span>
                .liwamenu.com)
              </span>
            </label>

            <div className="max-w-md flex items-end">
              <span className="bg-[--light-2] px-3 py-[7.5px] rounded-l-md">
                https://
              </span>
              <CustomInput
                type="text"
                placeholder="restoran"
                className="py-[.4rem] rounded-none mt-0 sm:mt-0"
                className2="mt-0 sm:mt-0"
                value={restaurantData?.tenant ?? ""}
                onChange={(e) =>
                  setRestaurantData((prev) => {
                    return {
                      ...prev,
                      tenant: e,
                    };
                  })
                }
              />
              <span className="bg-[--light-2] px-3 py-[7.5px] rounded-r-md">
                .liwamenu.com
              </span>
            </div>
          </div>

          {/* MAXIMUM DISTANCE */}
          <div className="max-w-md">
            <CustomInput
              type="number"
              label={
                <span>
                  Maksimum Mesafe (km){" "}
                  <span className="text-[--primary-1]">Paket servisi için</span>
                </span>
              }
              placeholder="Maksimum mesafe giriniz"
              className="py-[.4rem] mt-[0] sm:mt-[0]"
              value={restaurantData?.maxDistanceKM ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    maxDistanceKM: e,
                  };
                })
              }
            />
          </div>

          {/* GOOGLE ANALYTICS */}
          <div className="max-w-md">
            <CustomInput
              type="text"
              label={
                <span>
                  {" "}
                  <a
                    href="https://analytics.google.com/analytics/web"
                    target="_blank"
                    className="text-[--link-1]"
                  >
                    Google Analytics
                  </a>{" "}
                  websitesinden ulaşabilirsiniz.{" "}
                </span>
              }
              className="py-[.4rem] mt-[0] sm:mt-[0]"
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

          {/* DEFAULT LANGUAGE */}
          <div className="max-w-md">
            <CustomSelect
              type="text"
              label="Arayüz dil seçeneği"
              placeholder="Örn: tr, en"
              style={{ borderRadius: ".4rem", padding: "0.1rem 0px" }}
              className="py-[.4rem] mt-[0] sm:mt-[0]"
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

          {/* MENU LANGUAGE */}
          <div className="max-w-md">
            <CustomSelect
              type="text"
              label="Menu Dili Seçeneği"
              placeholder="Örn: tr, en"
              style={{ borderRadius: ".4rem", padding: "0.1rem 0px" }}
              className="py-[.4rem] mt-[0] sm:mt-[0]"
              value={
                LanguagesEnums.find(
                  (L) => L.value == (restaurantData?.menuLang ?? null)
                ) || { label: "Dil Seç" }
              }
              options={LanguagesEnums}
              onChange={(selectedOption) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    menuLang: selectedOption.value,
                  };
                })
              }
            />
          </div>

          {/* ONLINE ORDER */}
          <div className="flex justify-between items-center max-w-md mt-4">
            <label className="font-medium">Paket Sipariş</label>
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

          {/* SLOGAN 1 */}
          <div className="max-w-md">
            <CustomInput
              type="text"
              label="Slogan 1"
              placeholder="Slogan 1 giriniz"
              className="py-[.4rem]  mt-[0] sm:mt-[0]"
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

          {/* ONLINE ORDER DISCOUNT */}
          <div className="max-w-md flex items-end">
            <CustomInput
              type="number"
              label="Paket Sipariş İskonto"
              placeholder="Paket Sipariş İskonto giriniz"
              className="py-[.4rem] mt-[0] sm:mt-[0] rounded-r-none"
              value={restaurantData?.online_order_discount_rate ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    online_order_discount_rate: e,
                  };
                })
              }
            />
            <span className="bg-[--light-2] px-3 py-[7.5px] rounded-r-md">
              %
            </span>
          </div>

          {/* SLOGAN 2 */}
          <div className="max-w-md">
            <CustomInput
              label="Slogan 2"
              placeholder="Slogan 2 giriniz"
              className="py-[.4rem]  mt-[0] sm:mt-[0]"
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

          {/* IN PERSON ORDER */}
          <div className="flex justify-between items-center max-w-md mt-4">
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

          {/* HIDE RESTAURANT */}
          <div className="flex justify-between items-center max-w-md mt-4">
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

          {/* TABLE ORDER DISCOUNT */}
          <div className="max-w-md flex items-end">
            <CustomInput
              type="number"
              label="Masada Sipariş İskonto"
              placeholder="Masada Sipariş İskonto giriniz"
              className="py-[.4rem] mt-[0] sm:mt-[0] rounded-r-none"
              value={restaurantData?.table_order_discount_rate ?? ""}
              onChange={(e) =>
                setRestaurantData((prev) => {
                  return {
                    ...prev,
                    table_order_discount_rate: e,
                  };
                })
              }
            />
            <span className="bg-[--light-2] px-3 py-[7.5px] rounded-r-md">
              %
            </span>
          </div>

          <div></div>

          <div className="w-full flex justify-end pt-4 max-w-md">
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

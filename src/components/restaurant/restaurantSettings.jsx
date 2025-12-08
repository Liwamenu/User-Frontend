//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//COMP
import CustomInput from "../common/customInput";
import CustomToggle from "../common/customToggle";
import CustomSelect from "../common/customSelector";
import LanguagesEnums from "../../enums/languagesEnums";

//REDUX
import {
  setRestaurantSettings,
  resetSetRestaurantSettings,
} from "../../redux/restaurant/setRestaurantSettingsSlice";

const RestaurantSettings = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { success, error } = useSelector(
    (state) => state.restaurant.setRestaurantSettings
  );

  const [restaurantData, setRestaurantData] = useState(data);

  function handleSubmit(e) {
    e.preventDefault();

    const dataToSend = {
      restaurantId: restaurantData?.id,
      name: restaurantData?.name,
      tenant: restaurantData?.tenant,
      maxDistance: restaurantData?.maxDistance,
      googleAnalytics: restaurantData?.googleAnalytics,
      defaultLang: restaurantData?.defaultLang,
      menuLang: restaurantData?.menuLang,
      onlineOrder: restaurantData?.onlineOrder,
      inPersonOrder: restaurantData?.inPersonOrder,
      hide: restaurantData?.hide,
      slogan1: restaurantData?.slogan1,
      slogan2: restaurantData?.slogan2,
      onlineOrderDiscountRate: restaurantData?.onlineOrderDiscountRate,
      tableOrderDiscountRate: restaurantData?.tableOrderDiscountRate,
    };
    console.log("Submitted settings:", dataToSend);
    dispatch(setRestaurantSettings(dataToSend));
  }

  useEffect(() => {
    if (data && !restaurantData) setRestaurantData(data);
  }, [data, restaurantData]);

  // TOAST SUCCESS
  useEffect(() => {
    if (success) {
      toast.success(t("restaurantSettings.success"));
      dispatch(resetSetRestaurantSettings());
    }
    if (error) dispatch(resetSetRestaurantSettings());
  }, [success, error, dispatch]);

  return (
    <div className="w-full pb-8 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          {t("restaurantSettings.title", { name: restaurantData?.name })}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="w-full flex max-lg:flex-col gap-x-4 gap-y-3 mt-10">
            <div className="flex-1 flex flex-col gap-y-8">
              {/* TENANT */}
              <div className="max-w-md">
                <label className="text-xs font-semibold tracking-wide text-[--gr-1] max-md:max-w-full text-left">
                  {t("restaurantSettings.tenant")}{" "}
                  <span className="text-[--primary-1]">
                    {t("restaurantSettings.tenant_note")}
                  </span>
                </label>

                <div className="max-w-md flex items-end">
                  <span className="bg-[--gr-4] px-3 py-[7.5px] rounded-l-md">
                    https://
                  </span>
                  <CustomInput
                    type="text"
                    placeholder={t("restaurantSettings.tenant_placeholder")}
                    className="py-[.4rem] rounded-none"
                    value={restaurantData?.tenant ?? ""}
                    onChange={(e) =>
                      setRestaurantData((prev) => ({
                        ...prev,
                        tenant: e,
                      }))
                    }
                  />
                  <span className="bg-[--gr-4] px-3 py-[7.5px] rounded-r-md">
                    .liwamenu.com
                  </span>
                </div>
              </div>

              {/* GOOGLE ANALYTICS */}
              <div className="max-w-md">
                <CustomInput
                  type="text"
                  label={
                    <span>
                      <a
                        href="https://analytics.google.com/analytics/web"
                        target="_blank"
                        className="text-[--link-1]"
                      >
                        {t("restaurantSettings.google_analytics")}
                      </a>{" "}
                      websitesinden ulaşabilirsiniz.
                    </span>
                  }
                  className="py-[.4rem]"
                  placeholder={t(
                    "restaurantSettings.google_analytics_placeholder"
                  )}
                  value={restaurantData?.googleAnalytics ?? ""}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      googleAnalytics: e,
                    }))
                  }
                />
              </div>

              {/* MENU LANGUAGE */}
              <div className="max-w-md">
                <CustomSelect
                  type="text"
                  label={t("restaurantSettings.menu_language")}
                  placeholder={t(
                    "restaurantSettings.menu_language_placeholder"
                  )}
                  style={{ borderRadius: ".4rem", padding: "0rem 0px" }}
                  value={
                    LanguagesEnums.find(
                      (L) => L.value == (restaurantData?.menuLang ?? null)
                    ) || {
                      label: t("restaurantSettings.menu_language_placeholder"),
                    }
                  }
                  options={LanguagesEnums}
                  onChange={(selectedOption) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      menuLang: selectedOption.value,
                    }))
                  }
                />
              </div>

              {/* SLOGAN 1 */}
              <div className="max-w-md">
                <CustomInput
                  type="text"
                  label={t("restaurantSettings.slogan1")}
                  placeholder={t("restaurantSettings.slogan1_placeholder")}
                  className="py-[.4rem]"
                  value={restaurantData?.slogan1 ?? ""}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      slogan1: e,
                    }))
                  }
                />
              </div>

              {/* SLOGAN 2 */}
              <div className="max-w-md">
                <CustomInput
                  label={t("restaurantSettings.slogan2")}
                  placeholder={t("restaurantSettings.slogan2_placeholder")}
                  className="py-[.4rem]"
                  value={restaurantData?.slogan2 ?? ""}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      slogan2: e,
                    }))
                  }
                />
              </div>

              {/* HIDE RESTAURANT */}
              <div className="flex justify-between items-center max-w-md border border-[--border-1] rounded-md p-1.5 mt-3">
                <CustomToggle
                  label={t("restaurantSettings.hide_restaurant")}
                  className2="font-medium"
                  checked={restaurantData?.hide}
                  onChange={() =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      hide: !restaurantData.hide,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-y-8">
              {/* MAXIMUM DISTANCE */}
              <div>
                <span className="text-xs font-semibold tracking-wide text-[--gr-1] max-md:max-w-full text-left ">
                  {t("restaurantSettings.max_distance")}{" "}
                  <span className="text-[--primary-1]">
                    {t("restaurantSettings.max_distance_note")}
                  </span>
                </span>
                <div className="max-w-md">
                  <CustomInput
                    type="number"
                    placeholder={t(
                      "restaurantSettings.max_distance_placeholder"
                    )}
                    className="py-[.4rem]"
                    value={restaurantData?.maxDistance ?? ""}
                    onChange={(e) =>
                      setRestaurantData((prev) => ({
                        ...prev,
                        maxDistance: e,
                      }))
                    }
                  />
                </div>
              </div>

              {/* ONLINE ORDER */}
              <div className="flex justify-between items-center max-w-md border border-[--border-1] rounded-md p-1.5 mt-3">
                <CustomToggle
                  label={t("restaurantSettings.online_order")}
                  className2="font-medium"
                  checked={restaurantData?.onlineOrder}
                  onChange={() =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      onlineOrder: !restaurantData.onlineOrder,
                    }))
                  }
                />
              </div>

              {/* ONLINE ORDER DISCOUNT */}
              <div className="max-w-md flex items-end">
                <CustomInput
                  type="number"
                  label={t("restaurantSettings.online_order_discount")}
                  placeholder={t(
                    "restaurantSettings.online_order_discount_placeholder"
                  )}
                  className="py-[.4rem] rounded-r-none"
                  value={restaurantData?.onlineOrderDiscountRate ?? ""}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      onlineOrderDiscountRate: e,
                    }))
                  }
                />
                <span className="bg-[--gr-4] px-3 py-[7.5px] rounded-r-md">
                  %
                </span>
              </div>

              {/* IN PERSON ORDER */}
              <div className="flex justify-between items-center max-w-md border border-[--border-1] rounded-md p-1.5 mt-3">
                <CustomToggle
                  label={t("restaurantSettings.in_person_order")}
                  className2="font-medium"
                  checked={restaurantData?.inPersonOrder}
                  onChange={() =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      inPersonOrder: !restaurantData.inPersonOrder,
                    }))
                  }
                />
              </div>

              {/* TABLE ORDER DISCOUNT */}
              <div className="max-w-md flex items-end">
                <CustomInput
                  type="number"
                  label={t("restaurantSettings.table_order_discount")}
                  placeholder={t(
                    "restaurantSettings.table_order_discount_placeholder"
                  )}
                  className="py-[.4rem] rounded-r-none"
                  value={restaurantData?.tableOrderDiscountRate ?? ""}
                  onChange={(e) =>
                    setRestaurantData((prev) => ({
                      ...prev,
                      tableOrderDiscountRate: e,
                    }))
                  }
                />
                <span className="bg-[--gr-4] px-3 py-[7.5px] rounded-r-md">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* SUBMIT */}
          <div className="w-full flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-3 rounded-md bg-[--primary-1] text-white font-semibold"
            >
              {t("restaurantSettings.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSettings;

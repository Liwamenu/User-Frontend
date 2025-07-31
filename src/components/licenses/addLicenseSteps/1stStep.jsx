//MOD
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import CustomSelect from "../../common/customSelector";
import ForwardButton from "../stepsAssets/forwardButton";

//FUNC
import {
  formatToPrice,
  formatSelectorData,
  groupedLicensePackages,
} from "../../../utils/utils";

// REDUX
import {
  getLicensePackages,
  resetGetLicensePackages,
} from "../../../redux/licensePackages/getLicensePackagesSlice";
import { getRestaurants } from "../../../redux/restaurants/getRestaurantsSlice";
import {
  addItemToCart,
  removeItemFromCart,
} from "../../../redux/cart/cartSlice";
import { getUser, resetGetUser } from "../../../redux/users/getUserByIdSlice";
import { getUserRestaurants } from "../../../redux/restaurants/getUserRestaurantsSlice";
// import {
//   getKDVParameters,
//   resetGetKDVParameters,
// } from "../../../redux/generalVars/KDVParameters/getKDVParametersSlice";

const FirstStep = ({
  restaurantData,
  setRestaurantData,
  setStep,
  restaurant,
  paramsUser,
  licenses,
}) => {
  const dispatch = useDispatch();

  const { success, error, licensePackages } = useSelector(
    (state) => state.licensePackages.getLicensePackages
  );
  const { restaurants } = useSelector(
    (state) => state.restaurants.getRestaurants
  );

  const { restaurants: userRestaurants } = useSelector(
    (state) => state.restaurants.getUserRestaurants
  );

  // const { KDVParameters, error: kdvError } = useSelector(
  //   (state) => state.generalVars.getKDVParams
  // );

  const { user } = useSelector((state) => state.users.getUser);

  const cartItems = useSelector((state) => state.cart.items);

  const [kdvData, setKdvData] = useState(null);
  const [restaurantsData, setRestaurantsData] = useState(null);
  const [licensePackagesData, setLicensePackagesData] = useState(null);

  function getTotalPrice() {
    const result = cartItems.reduce(
      (acc, item) => acc + parseFloat(item.price),
      0
    );
    const kdv = cartItems.reduce(
      (acc, item) => acc + (parseFloat(item.price) / 100) * item.kdvPercentage,
      0
    );
    const kdvTotal = formatToPrice(kdv);
    const total = formatToPrice(result);
    return { total, kdvTotal };
  }

  // GET LICENSE PACKAGES
  useEffect(() => {
    if (!licensePackagesData) {
      dispatch(getLicensePackages());
    }
  }, [licensePackagesData]);

  // TOAST AND GET KDV PARAMS
  useEffect(() => {
    if (error) {
      dispatch(resetGetLicensePackages());
    }

    if (success) {
      setLicensePackagesData(groupedLicensePackages(licensePackages.data));
      dispatch(resetGetLicensePackages());
      // dispatch(getKDVParameters());
    }
  }, [success, error]);

  //TOAST AND SET VALUES
  // useEffect(() => {
  //   if (kdvError) {
  //     dispatch(resetGetKDVParameters());
  //   }

  //   if (KDVParameters && success) {
  //     setKdvData(KDVParameters);
  //     setLicensePackagesData(groupedLicensePackages(licensePackages.data));
  //     dispatch(resetGetLicensePackages());
  //     dispatch(resetGetKDVParameters());
  //   }
  // }, [kdvError, KDVParameters]);

  // GET RESTAURANTS
  useEffect(() => {
    if (!restaurant && !restaurantsData) {
      if (paramsUser) {
        dispatch(getUserRestaurants({ userId: paramsUser.id }));
      } else {
        dispatch(getRestaurants({}));
      }
    }
  }, [restaurant, restaurantsData, paramsUser]);

  //SET RESTAURANTS
  useEffect(() => {
    if (restaurants) {
      setRestaurantsData(formatSelectorData(restaurants.data, false, true));
    }
    if (userRestaurants) {
      console.log(userRestaurants);
      setRestaurantsData(formatSelectorData(userRestaurants.data, false, true));
    }
  }, [restaurants, userRestaurants]);

  //SET USER IN RESTAURANT DATA
  useEffect(() => {
    if (user && restaurantData.userId) {
      setRestaurantData({
        ...restaurantData,
        fullName: user.fullName,
        isDealer: user.isDealer,
        label:
          restaurantData.label.replace(user.fullName, "") + " " + user.fullName,
        name: restaurantData.label,
        user: user,
      });
      dispatch(resetGetUser());
    }
  }, [user, restaurantData]);

  //GET USER FOR READY SET RESTAURANT
  useEffect(() => {
    if (restaurant) {
      setRestaurantData({
        label: restaurant?.name,
        value: restaurant?.id,
        userId: restaurant?.userId,
        id: restaurant.id,
      });
      dispatch(getUser({ userId: restaurant.userId }));
    }
  }, [restaurant]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!cartItems?.length) {
      toast.error("Lütfen en az bir tane lisans paketi seçin", {
        id: "first_step",
      });
      return;
    }
    setStep(2);
  }

  const handleAddToCart = (pkg) => {
    if (!pkg.restaurantId) {
      toast.error("Lütfen restoran seçın 😊", { id: "first_step" });
      return;
    }
    if (!licenses) return;
    const existingLicenses = licenses.filter(
      (license) => license.restaurantId === pkg.restaurantId
    );
    const marketPlaceExistes = existingLicenses.some(
      (license) => license.licenseTypeId === pkg.licenseTypeId
    );
    if (marketPlaceExistes) {
      toast(
        `${pkg.restaurantName} restoranına ${pkg.name} lisansı var. Uzatmak isterseniz uzatma sayfasından uzatabılırsınız.`,
        { id: "first_step" }
      );
      return;
    }
    const existingPackage = cartItems.find(
      (item) =>
        item.licenseTypeId === pkg.licenseTypeId &&
        item.restaurantId === pkg.restaurantId
    );

    if (existingPackage) {
      dispatch(
        removeItemFromCart({
          id: existingPackage.id,
          restaurantId: pkg.restaurantId,
        })
      );
      if (
        existingPackage.id === pkg.id &&
        existingPackage.restaurantId == pkg.restaurantId
      )
        return;
    }

    const data = kdvData ? kdvData : {};
    dispatch(addItemToCart({ ...pkg, ...data }));
    const toastComp = (
      <div>
        {pkg.time} Yıllık{" "}
        <span className="text-[--primary-1]">{pkg.marketPlaceName}</span> lisans
        sepete eklendi
      </div>
    );
    toast.success(toastComp, { id: "first_step" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-full flex flex-col justify-between mb-7"
    >
      <div className="w-full h-full sm:px-4">
        <div className="w-full flex justify-center pt-2">
          <CustomSelect
            required={true}
            className="text-sm mt-[0] sm:mt-[0]"
            className2="mt-[0] sm:mt-[0] max-w-2xl"
            value={restaurantData}
            disabled={restaurant}
            options={restaurantsData}
            onChange={(selectedOption) => {
              setRestaurantData(selectedOption);
              dispatch(getUser({ userId: selectedOption.userId }));
            }}
          />
          <div className="flex px-6 gap-4">
            <div className="flex flex-col">
              <p className="text-sm">Toplam</p>
              <p>{getTotalPrice().total}</p>
            </div>
          </div>
        </div>

        <div className="h-[85%] flex flex-col gap-1 mt-5 overflow-y-visible">
          {licensePackagesData &&
            licensePackagesData.map((licensePkg, i) => (
              <div
                key={i}
                className="flex max-sm:flex-col sm:items-center gap-2 sm:gap-8 max-sm:mb-6 even:bg-[--white-1] odd:bg-[--table-odd]"
              >
                <div className="max-sm:w-full flex gap-4 py-1 overflow-x-auto">
                  {licensePkg.map((pkg) => {
                    const isSelected = cartItems.some(
                      (item) =>
                        item.id === pkg.id &&
                        item.restaurantId === restaurantData?.id
                    );

                    return (
                      <div
                        key={pkg.id}
                        className="flex items-center text-[12px] leading-snug"
                      >
                        <div
                          className={`flex flex-col justify-center py-1.5 px-6 rounded cursor-pointer ${
                            isSelected
                              ? "bg-[--primary-1] text-white"
                              : "bg-[--light-3]"
                          }`}
                          onClick={() =>
                            handleAddToCart({
                              ...pkg,
                              kdvData: kdvData,
                              price:
                                restaurantData.isDealer === true
                                  ? pkg.dealerPrice
                                  : restaurantData.isDealer === false &&
                                    pkg.userPrice,
                              restaurantId: restaurantData.id,
                              restaurantName: restaurantData.name,
                              userId: restaurantData?.userId,
                              user: restaurantData.user,
                            })
                          }
                        >
                          <div>
                            <span className="whitespace-nowrap">
                              {pkg.time} Yıllık{" "}
                            </span>
                            <span
                              className={`whitespace-nowrap ${
                                isSelected && "text-white"
                              }`}
                            >
                              {restaurantData.isDealer === true
                                ? pkg.dealerPrice
                                : restaurantData.isDealer === false &&
                                  pkg.userPrice}{" "}
                              tl
                            </span>
                          </div>
                          <div>
                            <span className="font-normal whitespace-nowrap">
                              {pkg.description}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="flex justify-end items-end h-full">
        <ForwardButton text="Devam" letIcon={true} type="submit" />
      </div>
    </form>
  );
};

export default FirstStep;

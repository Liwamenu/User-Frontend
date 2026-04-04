//MOD
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//COMP
import CustomSelect from "../../common/customSelector";
import ForwardButton from "../stepsAssets/forwardButton";

//FUNC
import {
  // getPriceWithKDV,
  formatSelectorData,
  // formatLisansPackages,
} from "../../../utils/utils";

// REDUX
import {
  getLicensePackages,
  resetGetLicensePackages,
} from "../../../redux/licensePackages/getLicensePackagesSlice";
import { getRestaurants } from "../../../redux/restaurants/getRestaurantsSlice";
import { addItemToCart, clearCart } from "../../../redux/cart/cartSlice";

const FirstStep = ({
  setStep,
  paymentMethod,
  restaurantData,
  setPaymentMethod,
  setRestaurantData,
  licensePackageData,
  setLicensePackageData,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentLicense, restaurant } = location?.state || {};
  const { restaurantName, restaurantId, userId } = currentLicense || {};

  const { success, error, licensePackages } = useSelector(
    (state) => state.licensePackages.getLicensePackages,
  );
  const { restaurants } = useSelector(
    (state) => state.restaurants.getRestaurants,
  );

  const [kdvData, setKdvData] = useState(null);
  const [restaurantsData, setRestaurantsData] = useState(null);
  const [licensePackagesData, setLicensePackagesData] = useState(null);

  // GET LICENSE PACKAGES
  useEffect(() => {
    if (!licensePackagesData) {
      dispatch(getLicensePackages());
    }
  }, [licensePackagesData]);

  // GET RESTAURANTS
  useEffect(() => {
    if (!currentLicense && !restaurantsData) {
      dispatch(getRestaurants({}));
    }
  }, [currentLicense, restaurantsData]);

  //SET RESTAURANTS
  useEffect(() => {
    if (restaurants) {
      setRestaurantsData(formatSelectorData(restaurants.data, false));
    }
  }, [restaurants]);

  //SET RESTAURANT DATA
  useEffect(() => {
    if ((restaurantId || restaurant) && !restaurantData?.value) {
      if (restaurant) {
        setRestaurantData({
          label: restaurant.name,
          value: restaurant.id,
          userId: restaurant.userId,
        });
      } else {
        setRestaurantData({
          label: restaurantName,
          value: restaurantId,
          userId,
        });
      }
    }
  }, [restaurantId, restaurant, restaurantData]);

  function handleSubmit(e) {
    e.preventDefault();
    setStep(2);
  }

  const handleAddToCart = (pkg) => {
    if (!pkg.restaurantId) {
      toast.error("Lütfen restoran seçın 😊", { id: "choose_restaurant" });
      return;
    }
    dispatch(clearCart());
    dispatch(addItemToCart(pkg));
  };

  return (
    <form className="size-full flex flex-col" onSubmit={handleSubmit}>
      <div className="px-4 flex justify-between items-center p-2 w-full text-sm bg-[--light-1] border-b border-solid border-[--border-1]">
        <div className="h-full text-center flex flex-col justify-between pb-3">
          <p>Toplam</p>
          <p className="">{licensePackageData.price} ₺</p>
        </div>
      </div>

      <div className="flex flex-col pt-2 gap-4 md:px-4">
        <CustomSelect
          required={true}
          className="text-sm max-w-[28rem]"
          className2="mt-[0] sm:mt-[0]"
          value={restaurantData}
          disabled={restaurantId}
          options={restaurantsData}
          onChange={(selectedOption) => {
            setRestaurantData(selectedOption);
          }}
        />
        <CustomSelect
          required={true}
          isSearchable={false}
          className="text-sm max-w-[28rem]"
          className2="mt-[0] sm:mt-[0]"
          value={licensePackageData}
          options={licensePackagesData}
          onChange={(selectedOption) => {
            setLicensePackageData(selectedOption);
            if (
              selectedOption?.licensePackageId !==
              licensePackageData?.licensePackageId
            ) {
              handleAddToCart({
                ...selectedOption,
                restaurantId: restaurantData.value,
                restaurantName: restaurantData.label,
              });
            }
          }}
        />

        <CustomSelect
          required={true}
          className="text-sm max-w-[28rem]"
          className2="mt-[0] sm:mt-[0]"
          value={paymentMethod.selectedOption}
          options={paymentMethod.options}
          onChange={(selectedOption) => {
            setPaymentMethod((prev) => {
              return {
                ...prev,
                selectedOption,
              };
            });
          }}
        />
      </div>

      <div className="h-full flex justify-end items-end relative">
        <ForwardButton
          text="Devam"
          letIcon={true}
          type="submit"
          className="absolute -bottom-16 -right-1"
        />
      </div>
    </form>
  );
};

export default FirstStep;

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
// import {
//   getKDVParameters,
//   resetGetKDVParameters,
// } from "../../../redux/generalVars/KDVParameters/getKDVParametersSlice";

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
    (state) => state.licensePackages.getLicensePackages
  );
  const { restaurants } = useSelector(
    (state) => state.restaurants.getRestaurants
  );

  const { KDVParameters, error: kdvError } = useSelector(
    (state) => state.generalVars.getKDVParams
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

  // // TOAST AND SET PACKAGES
  // useEffect(() => {
  //   if (error) {
  //     dispatch(resetGetLicensePackages());
  //   }

  //   if (success) {
  //     dispatch(getKDVParameters());
  //   }
  // }, [success, error]);

  // //GET KDV VALUE
  // useEffect(() => {
  //   if (kdvError) {
  //     dispatch(resetGetKDVParameters());
  //   }

  //   if (KDVParameters && success) {
  //     setKdvData(KDVParameters);
  //     const updatedData = licensePackages.data
  //       .filter((P) => P.isActive)
  //       .map((pkg) => {
  //         return {
  //           ...pkg,
  //           price: getPriceWithKDV(pkg.userPrice, KDVParameters),
  //         };
  //       });

  //     const sameMarketplacePKGS = updatedData.filter(
  //       (pack) => pack?.licenseTypeId === currentLicense?.licenseTypeId
  //     );

  //     if (sameMarketplacePKGS.length) {
  //       const formattedPkgs = formatLisansPackages(sameMarketplacePKGS);
  //       setLicensePackagesData(formattedPkgs);
  //       const defaultPkg = formattedPkgs.find((pkg) => pkg.time === 1);
  //       setLicensePackageData(defaultPkg);
  //       handleAddToCart({
  //         ...defaultPkg,
  //         restaurantId: restaurantData.value,
  //         restaurantName: restaurantData.label,
  //       });
  //     } else setLicensePackagesData(sameMarketplacePKGS);

  //     dispatch(resetGetKDVParameters());
  //     dispatch(resetGetLicensePackages());
  //   }
  // }, [kdvError, KDVParameters]);

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

  // useEffect(() => {
  //   const bgColors = [
  //     "bg-[#4682B4] border-[#4682B4]",
  //     "bg-[--link-1] border-[--link-1]",
  //     "bg-[--primary-1] border-[--primary-1]",
  //     "bg-[--primary-2] border-[--primary-2]",
  //   ];
  //   setTestData([
  //     {
  //       value: "Trendyol Yemek",
  //       label: `
  //         <div class="flex justify-between">
  //           <p class="w-36">Trendyol Yemek</p>
  //           <p class="w-20 text-[--link-1] text-center"> 1 Yıllık </p>
  //           <p class="text-xs text-[--white-1] border rounded-md px-0.5 mx-0.5 py-1 whitespace-nowrap ${bgColors[2]}"> 20% Standart Yıllık </p>
  //           <p class="w-12">2800</p>
  //         </div>
  //       `,
  //       id: "94eed0fb-11dc-4d92-84e3-b269fc6ab107",
  //       time: 1,
  //       price: "3350.00",
  //       licensePackageId: "94eed0fb-11dc-4d92-84e3-b269fc6ab107",
  //       entityGuid: "748f9e84-8e17-431b-b0ba-d02b6686d817",
  //       licenseTypeId: 2,
  //       userPrice: 200,
  //       dealerPrice: 2000,
  //       description: "Standart",
  //       isActive: true,
  //       createdDateTime: "2024-12-29T15:49:41.8054539",
  //       lastUpdateDateTime: "2025-01-26T03:34:38.7710466",
  //     },
  //   ]);
  // }, []);
  // const [testData, setTestData] = useState([]);

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

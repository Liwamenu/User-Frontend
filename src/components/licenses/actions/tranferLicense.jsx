import { usePopup } from "../../../context/PopupContext";
import { CancelI, TransferI } from "../../../assets/icon";
import ActionButton from "../../common/actionButton";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurants,
  resetGetRestaurants,
} from "../../../redux/restaurants/getRestaurantsSlice";
import {
  licenseTransfer,
  resetLicenseTransfer,
} from "../../../redux/licenses/licenseTransferSlice";
import toast from "react-hot-toast";
import CustomCheckbox from "../../common/customCheckbox";
import CustomSelector from "../../common/customSelector";
import { isEqual } from "lodash";

const TransferLicense = ({ licenseData, onSuccess }) => {
  const { setPopupContent } = usePopup();

  const handlePopup = (event) => {
    event.stopPropagation();
    setPopupContent(
      <TransferLicensePopup data={licenseData} onSuccess={onSuccess} />
    );
  };

  return (
    <ActionButton
      element={<TransferI className="w-[1.1rem]" />}
      element2="Transfer"
      onClick={handlePopup}
    />
  );
};

export default TransferLicense;

const TransferLicensePopup = ({ data, onSuccess }) => {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const {
    restaurants,
    success: rstSuccess,
    loading: rstLoading,
  } = useSelector((state) => state.restaurants.getRestaurants);
  const { loading, success, error } = useSelector(
    (state) => state.licenses.licenseTransfer
  );

  const [checked, setChecked] = useState(false);
  const [restaurantsData, setRestaurantsData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [currentRestaurant, setCurrentRestaurant] = useState(
    fillCurrentRestaurant()
  );

  //FORMAT AND GET CURRENT USER
  function fillCurrentRestaurant(restaurants) {
    const rst = restaurants?.data.find((U) => U.id == data.restaurantId);
    const { id, name, phoneNumber } = rst ?? {};
    const uData = {
      userId: id,
      fullName: name,
      value: id,
      label: `${name},  ${phoneNumber}`,
    };
    return uData || null;
  }

  //FORMAT USERS FOR SELECTOR
  function formatUserSelector(restaurants) {
    const out = restaurants.data.map((U) => {
      const { id, name, phoneNumber } = U ?? {};
      return {
        restaurantId: id,
        name,
        value: id,
        label: `${name},  ${phoneNumber}`,
      };
    });
    setRestaurantsData(out);
  }

  //SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    if (isEqual(selectedData, currentRestaurant)) {
      toast.error("Herhangi bir değişiklik yapmadınız.", { id: "NO_CHANGE" });
    } else {
      console.log(selectedData);
      dispatch(
        licenseTransfer({
          licenseId: data.id,
          restaurantId: selectedData.id,
        })
      );
    }
  }

  //get users if no
  useEffect(() => {
    if (!restaurantsData) {
      dispatch(getRestaurants({}));
    }
  }, [restaurantsData, dispatch]);

  //set users
  useEffect(() => {
    if (rstSuccess && restaurants) {
      formatUserSelector(restaurants);
      setCurrentRestaurant(fillCurrentRestaurant(restaurants));
      setSelectedData(fillCurrentRestaurant(restaurants));
      dispatch(resetGetRestaurants());
    }
  }, [rstSuccess, restaurants, dispatch]);

  //TRANSFER TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    } else if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetLicenseTransfer());
    } else if (success) {
      setPopupContent(null);
      onSuccess();
      toast.dismiss(toastId.current);
      toast.success("İşlem Başarılı");
      dispatch(resetLicenseTransfer());
    }
  }, [loading, success, error]);

  return (
    <div className=" w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base max-h-[90dvh]">
      <div className="flex flex-col bg-[--white-1] relative">
        <div className="absolute -top-6 right-3 z-[50]">
          <div
            className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
            onClick={() => setPopupContent(null)}
          >
            <CancelI />
          </div>
        </div>

        <h1 className="self-center text-2xl font-bold">Lisans Transfer</h1>
        <form
          className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Kullanıcı:</p>
            <p className="text-[--primary-1]">{data?.userName}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Lisans Durumu:</p>
            <p>● {data?.isActive ? "Aktif" : "Pasif"}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Restoran Adı:</p>
            <p>● {data?.restaurantName}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">İşlem:</p>
            <CustomSelector
              required
              value={
                selectedData || currentRestaurant || { label: "Restoran Seç" }
              }
              options={restaurantsData || []}
              onChange={(e) => setSelectedData(e)}
            />
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <CustomCheckbox
              checked={checked}
              onChange={() => setChecked(!checked)}
              label="Transfer Yap"
            />
          </div>

          <div className="w-full flex justify-end mt-6">
            <button
              disabled={loading || rstLoading || !checked}
              className="py-2 px-3 bg-[--primary-1] text-white rounded-lg disabled:cursor-not-allowed"
              type="submit"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

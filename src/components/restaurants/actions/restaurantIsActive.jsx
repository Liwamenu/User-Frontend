import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";
import { usePopup } from "../../../context/PopupContext";
import CustomCheckbox from "../../common/customCheckbox";
import {
  resetUpdateRestaurant,
  updateRestaurant,
} from "../../../redux/restaurants/updateRestaurantSlice";
import { CancelI } from "../../../assets/icon";

const ChangeRestaurantStatus = ({ restaurant, onSuccess }) => {
  const { setShowPopup, setPopupContent } = usePopup();

  const handleEditRestaurantStatus = () => {
    setPopupContent(
      <ChangeRestaurantStatusPopup
        restaurant={restaurant}
        onSuccess={onSuccess}
      />
    );
    setShowPopup(true);
  };

  return (
    <>
      <span
        className={`text-xs font-normal cursor-pointer ${
          restaurant.isActive
            ? "text-[--green-1] bg-[--status-green] border-[--green-1]"
            : "text-[--red-1] bg-[--status-red] border-[--red-1]"
        } px-3 py-1 border border-solid rounded-full`}
        onClick={handleEditRestaurantStatus}
      >
        ● {restaurant.isActive ? "Aktif" : "Pasif"}
      </span>
    </>
  );
};

export default ChangeRestaurantStatus;

function ChangeRestaurantStatusPopup({ restaurant, onSuccess }) {
  const dispatch = useDispatch();
  const toastId = useRef();
  const restaurantStatusRef = useRef();
  const { setShowPopup, setPopupContent, contentRef, setContentRef } =
    usePopup();

  const { loading, success, error } = useSelector(
    (state) => state.restaurants.updateRestaurant
  );

  const {
    id: restaurantId,
    dealerId,
    userId,
    name,
    phoneNumber,
    latitude,
    longitude,
    city,
    district,
    neighbourhood,
    address,
    isActive,
  } = restaurant;

  const [restaurantData, setRestaurantData] = useState({
    restaurantId,
    dealerId,
    userId,
    name,
    phoneNumber: "90" + phoneNumber,
    latitude,
    longitude,
    city: { label: city, value: city, id: null },
    district: { label: district, value: district, id: null },
    neighbourhood: { label: neighbourhood, value: neighbourhood, id: null },
    address,
    isActive,
    checked: false,
  });

  const closeThePopup = () => {
    setPopupContent(null);
    setShowPopup(false);
  };

  function editRestaurantStatus() {
    dispatch(updateRestaurant({ ...restaurantData }));
    // console.log(restaurantData);
  }

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor 🤩...");
    }
    if (error) {
      toastId.current && toast.dismiss(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR + "🙁");
      } else {
        toast.error("Something went wrong");
      }
      dispatch(resetUpdateRestaurant());
    } else if (success) {
      toastId.current && toast.dismiss(toastId.current);
      onSuccess();
      setShowPopup(false);
      setPopupContent(null);
      toast.success(
        `Restoran başarıyla ${
          restaurant.isActive ? "Pasifleştirildi" : "Aktifleştirildi"
        } 🥳🥳`
      );
      dispatch(resetUpdateRestaurant());
    }
  }, [loading, success, error]);

  useEffect(() => {
    if (restaurantStatusRef) {
      const refs = contentRef.filter(
        (ref) => ref.id !== "restaurantStatusPopup"
      );
      setContentRef([
        ...refs,
        {
          id: "restaurantStatusPopup",
          outRef: null,
          ref: restaurantStatusRef,
          callback: () => closeThePopup(),
        },
      ]);
    }
  }, [restaurantStatusRef]);

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] max-w-2xl"
        ref={restaurantStatusRef}
      >
        <div className="flex flex-col bg-[--white-1] relative">
          <div className="absolute -top-6 right-3">
            <div
              className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
              onClick={closeThePopup}
            >
              <CancelI />
            </div>
          </div>
          <h1 className="self-center text-2xl font-bold">Restoran Durumu</h1>
          <div className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left gap-8">
            <div className="w-full flex gap-12 items-center">
              <p className="min-w-28">Durum:</p>
              <p
                className={`py-3 border border-dashed w-24 text-center rounded-md ${
                  restaurant.isActive
                    ? "text-[--green-1] border-[--green-1]"
                    : "text-[--red-1] border-[--red-1]"
                }`}
              >
                ● {restaurant.isActive ? "Aktif" : "Pasif"}
              </p>
            </div>

            <div className="w-full flex gap-12 items-center">
              <p className="min-w-28">İşlem:</p>
              <CustomCheckbox
                className2={`${
                  restaurant.isActive ? "text-[--red-1]" : "text-[--green-1]"
                }`}
                label={restaurant.isActive ? "Pasifleştir" : "Aktifleştir"}
                checked={restaurantData.checked}
                onChange={() =>
                  setRestaurantData((prev) => {
                    return {
                      ...prev,
                      checked: !restaurantData.checked,
                      isActive: !restaurantData.isActive,
                    };
                  })
                }
              />
            </div>

            {restaurant?.note && (
              <div className="w-full flex gap-12 items-center">
                <p className="min-w-28">Note:</p>
                <p className="text-sm font-normal">{restaurant.note}</p>
              </div>
            )}

            {restaurant?.passiveNote && (
              <div className="w-full flex gap-12 items-center">
                <p className="min-w-28">Pasif Note:</p>
                <CustomInput
                  placeholder="Note"
                  value={restaurantData.passiveNote}
                  onChange={(e) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        passiveNote: e,
                      };
                    });
                  }}
                  disabled={!restaurantData.checked}
                  className="mt-[0] sm:mt-[0] text-sm"
                  className2="mt-[0] sm:mt-[0]"
                />
              </div>
            )}

            <div className="w-full flex gap-12 items-center justify-end">
              <button
                disabled={!restaurantData.checked}
                onClick={editRestaurantStatus}
                className={`py-3 w-24 text-center rounded-md border border-solid transition-colors disabled:cursor-not-allowed ${
                  restaurant.isActive
                    ? "bg-[--status-red] text-[--red-1] border-[--red-1] hover:bg-[--red-1] hover:text-[--white-1] disabled:hover:bg-[--status-red] disabled:hover:text-[--red-1]"
                    : "bg-[--status-green] text-[--green-1] hover:bg-[--green-1] hover:text-[--white-1] border-[--green-1] disabled:hover:bg-[--status-green] disabled:hover:text-[--green-1]"
                }`}
              >
                {restaurant.isActive ? "Pasifleştir" : "Aktifleştir"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

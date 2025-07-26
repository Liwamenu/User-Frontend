import { useEffect, useRef, useState } from "react";
import LoadingI from "../../../assets/anim/loading";
import { DeleteI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";
import CustomCheckbox from "../../common/customCheckbox";
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurantLicenses,
  resetGetRestaurantLicenses,
} from "../../../redux/licenses/getRestaurantLicensesSlice";
import {
  deleteRestaurant,
  resetDeleteRestaurant,
} from "../../../redux/restaurants/deleteRestaurantSlice";
import toast from "react-hot-toast";
import ActionButton from "../../common/actionButton";

const DeleteRetaurant = ({ restaurant, onSuccess }) => {
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();
  const handleClick = () => {
    setPopupContent(
      <DeleteRetaurantPopup restaurant={restaurant} onSuccess={onSuccess} />
    );
    dispatch(getRestaurantLicenses({ restaurantId: restaurant.id }));
  };

  return (
    <ActionButton
      className="text-[--red-1]"
      element={<DeleteI className="w-[1.1rem]" />}
      element2="Sil"
      onClick={handleClick}
    />
  );
};

export default DeleteRetaurant;

function DeleteRetaurantPopup({ restaurant, onSuccess }) {
  const dispatch = useDispatch();
  const toastId = useRef();
  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector(
    (state) => state.restaurants.deleteRestaurant
  );

  const { success: restaurantLicensesSuccess, restaurantLicenses } =
    useSelector((state) => state.licenses.getRestaurantLicenses);

  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [licenseNumber, setLicenseNumber] = useState(null);

  const handleDelete = () => {
    dispatch(deleteRestaurant({ restaurantId: restaurant.id }));
  };

  const closeForm = () => {
    setChecked(false);
    setPopupContent(null);
  };

  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("Logging in..");
    }
    if (error) {
      toast.dismiss(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR);
      } else {
        toast.error("Something went wrong");
      }
      dispatch(resetDeleteRestaurant());
    }
    if (success) {
      onSuccess();
      setChecked(false);
      setPopupContent(false);
      toast.dismiss(toastId.current);
      toast.success("Successfuly Deleted");
      dispatch(resetDeleteRestaurant());
    }
  }, [loading, success, error, dispatch]);

  useEffect(() => {
    if (restaurantLicensesSuccess) {
      if (restaurantLicenses) {
        setLicenseNumber(restaurantLicenses.data?.length);
        console.log(restaurantLicenses);
      }
      dispatch(resetGetRestaurantLicenses());
    } else {
      // dispatch(resetGetRestaurantLicenses());
    }
  }, [restaurantLicensesSuccess, restaurantLicenses, dispatch]);

  return (
    <>
      <div className="flex flex-col w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base">
        <h1 className="self-center text-2xl font-bold">Silinecek</h1>
        <div className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left">
          <p className="">
            Restoran{" "}
            <span className="font-bold text-[--primary-2]">
              {restaurant.name}
            </span>{" "}
            ve bağlı olan
          </p>

          <div className="flex  items-center gap-2 mt-6">
            {licenseNumber || licenseNumber === 0 ? (
              licenseNumber
            ) : (
              <span className="text-[--green-1]">
                <LoadingI className="fill-[--red-1] text-[--light-4]" />
              </span>
            )}{" "}
            <p className=" text-[--red-1]">Lisans</p>
          </div>
          <p className="mt-7">
            Silinecektir.
            <span className="text-[--primary-1]">
              {" "}
              Bu işlem geri alınamaz!{" "}
            </span>
            Emin misiniz?
          </p>
          {/* <p className="mt-5">
            💡(Silmeden önce bağlı lisansları başka bir restorana transfer
            edebilirsiniz)
          </p> */}
          <div className="mt-10 flex flex-col gap-4">
            <CustomCheckbox
              checked={checked}
              onChange={() => setChecked(!checked)}
              label="Eminim sil"
            />
            <CustomCheckbox
              checked={checked2}
              onChange={() => setChecked2(!checked2)}
              label="Restoran Silme Bilgilendirmesi gönder"
            />
          </div>
          <div className="flex gap-3 self-end max-sm:mt-4 mt-2 text-[--white-1]">
            <button
              className="px-10 py-2 text-base bg-[--red-1] rounded-lg disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!checked}
              onClick={handleDelete}
            >
              Sil
            </button>
            <button
              className="px-6 py-2 text-base bg-[--primary-1] rounded-lg"
              onClick={closeForm}
            >
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

//MODULES
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import { DeleteI } from "../../../assets/icon";
import LoadingI from "../../../assets/anim/loading";
import ActionButton from "../../common/actionButton";
import { usePopup } from "../../../context/PopupContext";
import CustomCheckbox from "../../common/customCheckbox";

//REDUX
import {
  deleteUser,
  resetDeleteUser,
} from "../../../redux/users/deleteUserSlice";
import {
  getUserLicenses,
  resetGetUserLicenses,
} from "../../../redux/licenses/getUserLicensesSlice";
import {
  getUserRestaurants,
  resetGetUserRestaurants,
} from "../../../redux/restaurants/getUserRestaurantsSlice";

const DeleteUser = ({ user, onSuccess }) => {
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const handlePopup = (e) => {
    e.stopPropagation();
    setPopupContent(<DeletePopup data={user} onSuccess={onSuccess} />);

    dispatch(getUserRestaurants({ userId: user.id })).then(() => {
      dispatch(getUserLicenses({ userId: user.id }));
    });
  };

  return (
    <ActionButton
      className="text-[--red-1]"
      element={<DeleteI className="w-[1.1rem]" />}
      element2="Sil"
      onClick={handlePopup}
    />
  );
};

export default DeleteUser;

const DeletePopup = ({ data, onSuccess }) => {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector(
    (state) => state.users.delete
  );

  const { success: userRestaurantsSuccess, restaurants } = useSelector(
    (state) => state.restaurants.getUserRestaurants
  );
  const { success: userLicensesSuccess, userLicenses } = useSelector(
    (state) => state.licenses.getUserLicenses
  );

  const [checked, setChecked] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState(null);
  const [restorantNumber, setRestorantNumber] = useState(null);

  const handleDelete = () => {
    dispatch(deleteUser({ userId: data.id }));
  };

  //TOAST DELETE
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("Deleting..");
    }
    if (error) {
      dispatch(resetDeleteUser());
    }
    if (success) {
      onSuccess();
      toast.dismiss(toastId.current);
      setChecked(false);
      setPopupContent(false);
      dispatch(resetDeleteUser());
      toast.success("Successfuly Deleted");
    }
  }, [loading, success, error, dispatch]);

  //SET RESTAURANT LENGTH
  useEffect(() => {
    if (userRestaurantsSuccess) {
      if (restaurants) {
        setRestorantNumber(restaurants?.data?.length);
      }
      dispatch(resetGetUserRestaurants());
    }
  }, [userRestaurantsSuccess, restaurants, dispatch]);

  //SET LICENSE LENGTH
  useEffect(() => {
    if (userLicensesSuccess) {
      if (userLicenses?.data) {
        setLicenseNumber(userLicenses?.data.length);
      }
      dispatch(resetGetUserLicenses());
    }
  }, [userLicensesSuccess, userLicenses, dispatch]);

  return (
    <>
      <div className="flex flex-col w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base">
        <h1 className="self-center text-2xl font-bold">Silinecek</h1>
        <div className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left">
          <p className="">
            Kullanıcı{" "}
            <span className="font-bold text-[--primary-2]">
              {data.fullName}
            </span>{" "}
            ve bağlı olan
          </p>
          <div className="flex  items-center gap-2 mt-6">
            {restorantNumber || restorantNumber === 0 ? (
              restorantNumber
            ) : (
              <span className="text-[--green-1]">
                <LoadingI className="fill-[--red-1] text-[--light-4]" />
              </span>
            )}{" "}
            <p className=" text-[--red-1]">Tane Restoran</p>
          </div>

          <div className="flex  items-center gap-2 mt-6">
            {licenseNumber || licenseNumber === 0 ? (
              licenseNumber
            ) : (
              <span className="text-[--green-1]">
                <LoadingI className="fill-[--red-1] text-[--light-4]" />
              </span>
            )}{" "}
            <p className=" text-[--red-1]">Tane Lisans</p>
          </div>
          <p className="mt-7">
            Silinecektir.
            <span className="text-[--primary-1]">
              {" "}
              Bu işlem geri alınamaz!{" "}
            </span>
            Emin misiniz?
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <CustomCheckbox
              checked={checked}
              onChange={() => setChecked(!checked)}
              label="Eminim sil"
            />
            {/* <CustomCheckbox
              checked={checked2}
              onChange={() => setChecked2(!checked2)}
              label="Kullanıcı Silme Bilgilendirmesi gönder"
            /> */}
          </div>
          <div className="flex gap-3 self-end max-sm:mt-4 mt-2 text-[--white-1]">
            <button
              className="px-10 py-2 text-base bg-[--red-1] rounded-lg disabled:cursor-not-allowed disabled:opacity-70"
              disabled={
                !checked ||
                (!restorantNumber && restorantNumber !== 0) ||
                (!licenseNumber && licenseNumber !== 0)
              }
              onClick={handleDelete}
            >
              Sil
            </button>
            <button
              className="px-6 py-2 text-base bg-[--primary-1] rounded-lg"
              onClick={() => {
                setPopupContent(false);
                setChecked(false);
              }}
            >
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

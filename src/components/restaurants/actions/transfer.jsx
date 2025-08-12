//MODULES
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import ActionButton from "../../common/actionButton";
import CustomSelector from "../../common/customSelector";
import { usePopup } from "../../../context/PopupContext";
import CustomCheckbox from "../../common/customCheckbox";
import { CancelI, TransferI } from "../../../assets/icon";

//REDUX
import {
  getUsers,
  resetGetUsersState,
} from "../../../redux/users/getUsersSlice";
import {
  restaurantTransfer,
  resetRestaurantTransfer,
} from "../../../redux/restaurants/restaurantTransferSlice";

const TransferRestaurant = ({ restaurant, onSuccess }) => {
  const { setPopupContent } = usePopup();
  const handleClick = () => {
    setPopupContent(
      <TransferRestaurantPopup restaurant={restaurant} onSuccess={onSuccess} />
    );
  };

  return (
    <ActionButton
      element={<TransferI className="w-4" strokeWidth="2" />}
      element2="Restoran Transfer"
      onClick={handleClick}
    />
  );
};

export default TransferRestaurant;

function TransferRestaurantPopup({ restaurant, onSuccess }) {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const {
    users,
    success: usrSuccess,
    loading: usrLoading,
  } = useSelector((state) => state.users.getUsers);
  const { loading, success, error } = useSelector(
    (state) => state.restaurants.restaurantTransfer
  );

  const [checked, setChecked] = useState(false);
  const [usersData, setUsersData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [currentUser, setCurrentUser] = useState(fillCurrentUser());

  //FORMAT AND GET CURRENT USER
  function fillCurrentUser() {
    const user = users?.data.find((U) => U.id == restaurant.userId);
    const { id, fullName, phoneNumber } = user ?? {};
    const uData = {
      userId: id,
      fullName: fullName,
      value: id,
      label: `${fullName},  ${phoneNumber}`,
    };
    return uData || null;
  }

  //FORMAT USERS FOR SELECTOR
  function formatUserSelector() {
    const out = users.data.map((U) => {
      const { id, fullName, phoneNumber } = U ?? {};
      return {
        userId: id,
        fullName,
        value: id,
        label: `${fullName},  ${phoneNumber}`,
      };
    });
    setUsersData(out);
  }

  const closeForm = () => {
    setPopupContent(null);
  };

  //SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    if (isEqual(selectedData, currentUser)) {
      toast.error("Herhangi bir değişiklik yapmadınız.", { id: "NO_CHANGE" });
    } else {
      console.log(selectedData);
      dispatch(
        restaurantTransfer({
          userId: selectedData.userId,
          restaurantId: restaurant.id,
        })
      );
    }
  }

  //get users if no
  useEffect(() => {
    if (!usersData) {
      dispatch(getUsers({}));
    }
  }, [users, dispatch]);

  //set users
  useEffect(() => {
    if (usrSuccess && users) {
      formatUserSelector();
      setCurrentUser(fillCurrentUser());
      setSelectedData(fillCurrentUser());
      dispatch(resetGetUsersState());
    }
  }, [usrSuccess, users, dispatch]);

  //TRANSFER TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    } else if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetRestaurantTransfer());
    } else if (success) {
      setPopupContent(null);
      onSuccess();
      toast.dismiss(toastId.current);
      toast.success("İşlem Başarılı");
      dispatch(resetRestaurantTransfer());
    }
  }, [loading, success, error]);

  return (
    <div className=" w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base max-h-[90dvh]">
      <div className="flex flex-col bg-[--white-1] relative">
        <div className="absolute -top-6 right-3 z-[50]">
          <div
            className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
            onClick={closeForm}
          >
            <CancelI />
          </div>
        </div>

        <h1 className="self-center text-2xl font-bold">Restoran Transfer</h1>
        <form
          className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Kullanıcı:</p>
            <p className="text-[--primary-1]">{restaurant.userName}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Durum:</p>
            <p>● {restaurant.isActive ? "Aktif" : "Pasif"}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Restoran Adı:</p>
            <p>● {restaurant.name}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">İşlem:</p>
            <CustomSelector
              required
              value={selectedData || currentUser || { label: "Kullanıcı Seç" }}
              options={usersData || []}
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
              disabled={loading || usrLoading || !checked}
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
}

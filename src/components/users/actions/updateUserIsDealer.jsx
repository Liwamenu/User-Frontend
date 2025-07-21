//MODULES
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import ActionButton from "../../common/actionButton";
import CustomCheckbox from "../../common/customCheckbox";
import { usePopup } from "../../../context/PopupContext";
import { CancelI, UserPlusI } from "../../../assets/icon";

//REDUX
import {
  resetUpdateUserIsDealer,
  updateUserIsDealer,
} from "../../../redux/users/updateUserIsDealerSlice";

const UpdateUserIsDealer = ({ onSuccess, user }) => {
  const { setPopupContent } = usePopup();

  const handleClick = () => {
    setPopupContent(
      <UpdateUserIsDealerPopup onSuccess={onSuccess} user={user} />
    );
  };
  return (
    <ActionButton
      element={<UserPlusI className="w-5" />}
      element2={user.isDealer ? "Müşteri Yap" : "Bayi Yap"}
      onClick={handleClick}
    />
  );
};

export default UpdateUserIsDealer;

function UpdateUserIsDealerPopup({ onSuccess, user }) {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setShowPopup, setPopupContent } = usePopup();
  const { loading, success, error } = useSelector(
    (state) => state.users.updateIsDealer
  );

  const [userData, setUserData] = useState({
    userId: user.id,
    isDealer: user.isDealer,
    sendSMSNotify: false,
    sendEmailNotify: false,
    checked: false,
  });

  const clearForm = () => {
    setPopupContent(null);
    setShowPopup(false);
  };

  function handleAddTemplate(e) {
    e.preventDefault();
    // console.log(userData);
    dispatch(updateUserIsDealer(userData));
  }

  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    } else if (error) {
      toastId.current && toast.remove(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR);
      } else {
        toast.error("Something went wrong");
      }
      dispatch(resetUpdateUserIsDealer());
    } else if (success) {
      clearForm();
      onSuccess();
      toastId.current && toast.remove(toastId.current);
      toast.success("Başarılı");
      dispatch(resetUpdateUserIsDealer());
    }
  }, [loading, success, error]);

  return (
    <div className="w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base max-h-[95dvh] overflow-y-auto">
      <div className="flex flex-col bg-[--white-1] relative">
        <div className="absolute -top-6 right-3">
          <div
            className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
            onClick={clearForm}
          >
            <CancelI />
          </div>
        </div>
        <h1 className="self-center text-2xl font-bold">
          {user.isDealer ? "Müşteri Yap" : "Bayi Yap"}
        </h1>
        <div className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left gap-4">
          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Kullanıcı:</p>
            <p className="text-[--primary-1]">{user.fullName}</p>
          </div>
          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Durum:</p>
            <p>● {user.isDealer ? "Bayi" : "Müşteri"}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">İşlem:</p>
            <CustomCheckbox
              label={user.isDealer ? "Müşteri Yap" : "Bayi Yap"}
              checked={userData.checked}
              onChange={() =>
                setUserData((prev) => {
                  return {
                    ...prev,
                    checked: !userData.checked,
                    isDealer: !userData.isDealer,
                  };
                })
              }
            />
          </div>

          {!user.isDealer && (
            <div className="w-full flex flex-col mt-6 text-sm gap-4">
              <CustomCheckbox
                label="E-Posta bayilik bilgilendirme gönder"
                checked={userData.sendEmailNotify}
                onChange={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      sendEmailNotify: !userData.sendEmailNotify,
                    };
                  })
                }
              />
              <CustomCheckbox
                label="SMS bayilik bilgilendirme gönder"
                checked={userData.sendSMSNotify}
                onChange={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      sendSMSNotify: !userData.sendSMSNotify,
                    };
                  })
                }
              />
            </div>
          )}

          <div className="w-full flex justify-end mt-6">
            <button
              onClick={handleAddTemplate}
              disabled={loading || !userData.checked}
              className="py-2 px-3 bg-[--primary-1] text-white rounded-lg disabled:cursor-not-allowed"
              type="submit"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

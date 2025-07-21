import { useEffect, useRef, useState } from "react";
import { usePopup } from "../../context/PopupContext";
import { CancelI } from "../../assets/icon";
import CustomInput from "../common/customInput";
import CustomCheckbox from "../common/customCheckbox";
import { useDispatch, useSelector } from "react-redux";
import {
  resetUpdateUserIsActive,
  updateUserIsActive,
} from "../../redux/users/updateUserIsActiveSlice";
import toast from "react-hot-toast";

const ChangeUsersStatus = ({ user, onSuccess }) => {
  const usersStatusRef = useRef();

  const { setShowPopup, setPopupContent } = usePopup();

  const handleEditUserStatus = () => {
    setPopupContent(<EditUserStatusPopup user={user} onSuccess={onSuccess} />);
    setShowPopup(true);
  };

  return (
    <>
      <span
        className={`text-xs font-normal px-3 py-1 border border-solid rounded-full cursor-pointer ${
          user.isActive
            ? "text-[--green-1] bg-[--status-green] border-[--green-1]"
            : "text-[--red-1] bg-[--status-red] border-[--red-1]"
        } `}
        onClick={handleEditUserStatus}
        ref={usersStatusRef}
      >
        ● {user.isActive ? "Aktif" : "Pasif"}
      </span>
    </>
  );
};

export default ChangeUsersStatus;

function EditUserStatusPopup({ user, onSuccess }) {
  const dispatch = useDispatch();
  const toastId = useRef();
  const userStatusRef = useRef();

  const { loading, success, error } = useSelector(
    (state) => state.users.updateIsActive
  );

  const { setShowPopup, setPopupContent, contentRef, setContentRef } =
    usePopup();

  const [userData, setUserData] = useState({
    userId: user.id,
    isActive: user.isActive,
    note: user.note ? user.note : "",
    passiveNote: user.passiveNote ? user.passiveNote : "",
    checked: false,
  });

  const closeThePopup = () => {
    setPopupContent(null);
    setShowPopup(false);
  };

  function editUserStatus() {
    dispatch(updateUserIsActive({ ...userData }));
    console.log(userData);
  }

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...🤩");
    }
    if (error) {
      toastId.current && toast.dismiss(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR);
      } else {
        toast.error("Bir şeyler ters gitti 😟");
      }
      dispatch(resetUpdateUserIsActive());
    } else if (success) {
      toastId.current && toast.dismiss(toastId.current);
      onSuccess();
      closeThePopup();
      toast.success("Kullanıcı durumu güncelendi🥳");
      dispatch(resetUpdateUserIsActive());
    }
  }, [loading, success, error]);

  useEffect(() => {
    if (userStatusRef) {
      const refs = contentRef.filter((ref) => ref.id !== "userStatusPopup");
      setContentRef([
        ...refs,
        {
          id: "userStatusPopup",
          outRef: null,
          ref: userStatusRef,
          callback: () => closeThePopup(),
        },
      ]);
    }
  }, [userStatusRef]);

  return (
    <div className="w-full flex justify-center">
      <div
        className="w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] max-w-2xl"
        ref={userStatusRef}
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
          <h1 className="self-center text-2xl font-bold">Kullanıcı Durumu</h1>
          <div className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left gap-8">
            <div className="w-full flex gap-12 items-center">
              <p className="min-w-28">Durum:</p>
              <p
                className={`py-3 border border-dashed w-24 text-center rounded-md ${
                  user.isActive
                    ? "text-[--green-1] border-[--green-1]"
                    : "text-[--red-1] border-[--red-1]"
                }`}
              >
                ● {user.isActive ? "Aktif" : "Pasif"}
              </p>
            </div>

            <div className="w-full flex gap-12 items-center">
              <p className="min-w-28">İşlem:</p>
              <CustomCheckbox
                className2={`${
                  user.isActive ? "text-[--red-1]" : "text-[--green-1]"
                }`}
                label={user.isActive ? "Pasifleştir" : "Aktifleştir"}
                checked={userData.checked}
                onChange={() =>
                  setUserData((prev) => {
                    return {
                      ...prev,
                      checked: !userData.checked,
                      isActive: !userData.isActive,
                    };
                  })
                }
              />
            </div>

            {user.note && (
              <div className="w-full flex gap-12 items-center">
                <p className="min-w-28">Note:</p>
                <p className="text-sm font-normal">{user.note}</p>
              </div>
            )}

            <div className="w-full flex gap-12 items-center">
              <p className="min-w-28">Pasif Note:</p>
              <CustomInput
                placeholder="Note"
                value={userData.passiveNote}
                onChange={(e) => {
                  setUserData((prev) => {
                    return {
                      ...prev,
                      passiveNote: e,
                    };
                  });
                }}
                disabled={!userData.checked}
                className="mt-[0] sm:mt-[0] text-sm"
                className2="mt-[0] sm:mt-[0]"
              />
            </div>

            <div className="w-full flex gap-12 items-center justify-end">
              <button
                disabled={!userData.checked}
                onClick={editUserStatus}
                className={`py-3 w-24 text-center rounded-md border border-solid transition-colors disabled:cursor-not-allowed ${
                  user.isActive
                    ? "bg-[--status-red] text-[--red-1] border-[--red-1] hover:bg-[--red-1] hover:text-[--white-1] disabled:hover:bg-[--status-red] disabled:hover:text-[--red-1]"
                    : "bg-[--status-green] text-[--green-1] hover:bg-[--green-1] hover:text-[--white-1] border-[--green-1] disabled:hover:bg-[--status-green] disabled:hover:text-[--green-1]"
                }`}
              >
                {user.isActive ? "Pasifleştir" : "Aktifleştir"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

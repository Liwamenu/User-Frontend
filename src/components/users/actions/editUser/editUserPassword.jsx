import { useEffect, useRef, useState } from "react";
import CustomInput from "../../../common/customInput";
import toast from "react-hot-toast";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  resetUpdateUserPassword,
  updateUserPasswordById,
} from "../../../../redux/users/updateUserPasswordByIdSlice";
import { ArrowID, ArrowIU } from "../../../../assets/icon";

const EditUserPassword = ({
  targetUserId,
  submitPass,
  setSubmitPass,
  submit,
  setSubmit,
  setNoChange,
}) => {
  const dispatch = useDispatch();
  const toastId = useRef();

  const { loading, success, error } = useSelector(
    (state) => state.users.updatePassword
  );

  const [openPassword, setOpenPassword] = useState(false);
  const [userPassword, setUserPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleStatus = () => {
    if (userPassword.confirmPassword || userPassword.password) {
      if (userPassword.confirmPassword !== userPassword.password) {
        toast.error("Şifreler eşit değil");
        setSubmitPass({ status: false, submit: false });
        return;
      }
    }
    setSubmitPass({ status: true, submit: false });
  };

  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("Updating user password...");
    } else if (error) {
      toastId.current && toast.remove(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR);
      } else {
        toast.error("Something went wrong");
      }
      setSubmit(false);
      dispatch(resetUpdateUserPassword());
    } else if (success) {
      toastId.current && toast.remove(toastId.current);
      toast.success("User password updated");
      dispatch(resetUpdateUserPassword());
    }
  }, [loading, success, error, dispatch]);

  useEffect(() => {
    if (submit) {
      if (openPassword) {
        dispatch(
          updateUserPasswordById({
            targetUserId,
            newPassword: userPassword.password,
            newPasswordConfirm: userPassword.confirmPassword,
          })
        );
      }
    }
    if (openPassword) {
      setNoChange((prev) => {
        return {
          ...prev,
          userPass: false,
        };
      });
    } else {
      setNoChange((prev) => {
        return {
          ...prev,
          userPass: true,
        };
      });
    }
  }, [submit, openPassword]);

  useEffect(() => {
    if (submitPass.submit) {
      handleStatus();
    }
  }, [submitPass.submit]);

  return (
    <>
      <div
        className="w-full flex border-b border-solid border-[--border-1] cursor-pointer mt-14"
        onClick={() => setOpenPassword(!openPassword)}
      >
        <h1 className="w-full text-center text-lg font-normal text-[--black-3] ">
          Şifre Değiştir
        </h1>
        <span>
          {openPassword ? (
            <ArrowIU className="size-5" />
          ) : (
            <ArrowID className="size-5" />
          )}
        </span>
      </div>
      {openPassword && (
        <div className="flex gap-4 mt-4 max-sm:flex-col">
          <CustomInput
            required={openPassword}
            label="Şifre"
            placeholder="Şifre"
            className="py-[.45rem] text-sm"
            letIcon={true}
            value={userPassword.password}
            onChange={(e) => {
              setUserPassword((prev) => {
                return {
                  ...prev,
                  password: e,
                };
              });
            }}
          />
          <CustomInput
            required={openPassword}
            label="Şifreyi onayla"
            placeholder="Şifre"
            className="py-[.45rem] text-sm"
            letIcon={true}
            value={userPassword.confirmPassword}
            onChange={(e) => {
              setUserPassword((prev) => {
                return {
                  ...prev,
                  confirmPassword: e,
                };
              });
            }}
          />
        </div>
      )}
    </>
  );
};

export default EditUserPassword;

//MOD
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import CustomInput from "../../common/customInput";

// REDUX
import {
  resetUpdateUserPassword,
  updateUserPassword,
} from "../../../redux/user/updateUserPasswordSlice";

const EditUserPassword = ({ user }) => {
  const toastId = useRef();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.user.updatePassword
  );

  const [userPassword, setUserPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    } else if (error) {
      dispatch(resetUpdateUserPassword());
    } else if (success) {
      toast.dismiss(toastId.current);
      toast.success("Şifrenız başarıyla güncelendi");
      setUserPassword({
        password: "",
        confirmPassword: "",
      });
      dispatch(resetUpdateUserPassword());
    }
  }, [loading, success, error, dispatch]);

  function handleSubmit(e) {
    e.preventDefault();

    if (userPassword.confirmPassword !== userPassword.password) {
      toast.error("Şifreler aynı değil");
      return;
    }

    dispatch(
      updateUserPassword({
        newPassword: userPassword.password,
        newPasswordConfirm: userPassword.confirmPassword,
      })
    );
  }

  return (
    <section className="flex flex-col items-start pt-3.5 pr-20 pl-6 mt-10 w-full bg-[--white-1] min-h-0 max-md:px-5">
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="flex gap-4 mt-4 max-sm:flex-col">
          <CustomInput
            required
            label="Şifre"
            placeholder="Şifre"
            className="py-3.5 text-sm"
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
            minLength={4}
            maxLength={20}
          />
          <CustomInput
            required
            label="Şifreyi onayla"
            placeholder="Şifre"
            className="py-3.5 text-sm"
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
            minLength={4}
            maxLength={20}
          />
        </div>

        <div className="flex justify-end mt-16">
          <button
            type="submit"
            disabled={loading}
            className="text-[--white-1] bg-[--primary-1] rounded-md px-5 py-2.5"
          >
            Kaydet
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditUserPassword;

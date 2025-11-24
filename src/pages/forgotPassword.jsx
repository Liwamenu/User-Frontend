//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//REDUX
import {
  forgotPassword,
  resetForgotPassword,
} from "../redux/auth/forgotPasswordSlice";

//COMP
import LoadingI from "../assets/anim/loading";
import VerifyCode from "../components/common/verifyCode";
import GlassFrame from "../components/common/glassFrame";
import CustomInput from "../components/common/customInput";
import CustomCheckbox from "../components/common/customCheckbox";
import CustomPhoneInput from "../components/common/customPhoneInput";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { success, loading, error } = useSelector(
    (state) => state.auth.forgotPassword
  );

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [checked, setChecked] = useState(false); //it was true before
  const [checked2, setChecked2] = useState(false);
  const [toVerify, setToVerify] = useState(false);

  const sendCode = (e) => {
    e?.preventDefault();
    // if (checked && phoneNumber) {
    //   dispatch(
    //     forgotPassword({ toAddress: phoneNumber.slice(1), isEmail: false })
    //   );
    // } else if (email) {
    // }
    dispatch(forgotPassword({ toAddress: email, isEmail: true }));
  };

  useEffect(() => {
    if (success) {
      setToVerify(true);
      dispatch(resetForgotPassword());
      toast.success("Onay kodu gönderildi");
    }
    if (error) {
      toast.error(error.message);
      dispatch(resetForgotPassword());
    }
  }, [success, error]);

  return (
    <GlassFrame
      className="pt-[4rem]"
      component={
        !toVerify ? (
          /* Send code via Email or PhoneNumber */
          <form className="flex flex-col w-full light" onSubmit={sendCode}>
            <div className="flex justify-center relative">
              <div className="w-max">
                <h2 className="text-[2.3rem] font-bold text-[--white-1] tracking-tighter">
                  Şifre Hatırlatma
                </h2>
              </div>
            </div>
            {/* <div className="w-full flex justify-center gap-4 mt-16">
              <CustomCheckbox
                checked={checked}
                onChange={() => {
                  setChecked(!checked);
                  setChecked2(checked);
                }}
                label="SMS ile gönder"
                className2="whitespace-nowrap"
              />
              <CustomCheckbox
                checked={checked2}
                onChange={() => {
                  setChecked2(!checked2);
                  setChecked(checked2);
                }}
                label="E-Posta ile gönder"
                className2="whitespace-nowrap"
              />
            </div> */}
            <div className="flex flex-col max-w-full customInput">
              {checked ? (
                <CustomPhoneInput
                  label="Telefon"
                  placeholder="Telefon"
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  className="py-2 bg-transparent text-[var(--white-1)]"
                  className5="text-[var(--white-1)]"
                />
              ) : (
                <CustomInput
                  label="E-Posta"
                  type="email"
                  name="email"
                  placeholder="E-Posta"
                  value={email}
                  onChange={(e) => setEmail(e)}
                  required={true}
                  className="py-2 bg-transparent text-[var(--white-1)]"
                  className5="text-[var(--white-1)]"
                />
              )}
              <div className="flex flex-col w-full">
                <div className="font-[300] text-[--link-1] mt-5 text-sm">
                  <p>
                    Onay kodu göndermek için sistemde kayıtlı olan telefon
                    numaranızı veya mail adresinizi giriniz.
                  </p>
                </div>
                <button
                  disabled={loading}
                  type="submit"
                  className="flex justify-center px-7 py-2 mt-5 text-lg rounded-md bg-[--primary-1] text-white hover:opacity-90 disabled:opacity-90 disabled:cursor-not-allowed"
                >
                  {loading ? <LoadingI className="h-7" /> : "Gönder"}
                </button>
                {/* <div className="shrink-0 mt-5 h-px bg-slate-200 w-full" /> */}
              </div>
            </div>
            <div className="flex flex-col mt-10 w-full">
              <div className="text-sm leading-5 text-[--link-1] w-full text-center">
                {/* <p>Zaten Hesabınız var mı ?</p> */}
              </div>
              <button
                type="button"
                onClick={() => (window.location.href = "/login")}
                className="px-7 py-2 text-xl rounded-md border border-solid border-[--gr-1] mt-5 text-center text-white"
              >
                Giriş yap
              </button>
            </div>
          </form>
        ) : (
          /* Verify the code */
          <VerifyCode
            setToConfirm={setToVerify}
            phoneNumber={checked ? phoneNumber : email}
            onSuccess={() => navigate("/setNewPassword")}
            reSend={() => sendCode()}
          />
        )
      }
    />
  );
};

export default ForgotPassword;

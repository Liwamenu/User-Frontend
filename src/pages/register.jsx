// MODULES
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../context/PopupContext";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import PrivacyPolicy from "./privacyPolicy";
import LoadingI from "../assets/anim/loading";
import CustomInput from "../components/common/customInput";
import CustomSelect from "../components/common/customSelector";
import CustomCheckbox from "../components/common/customCheckbox";
import CustomPhoneInput from "../components/common/customPhoneInput";

//FUNC
import { formatEmail, spacePhoneNumber } from "../utils/utils";

// REDUX
import { getCities } from "../redux/data/getCitiesSlice";
import { getDistricts } from "../redux/data/getDistrictsSlice";
import { registerUser, resetRgisterState } from "../redux/auth/registerSlice";

// ASSETS
import { CancelI } from "../assets/icon";
import VerifyCode from "../components/common/verifyCode";
import GlassFrame from "../components/common/glassFrame";

const Register = () => {
  const toastId = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { popupContent, setPopupContent } = usePopup();

  const { cities, success: citiesSuccess } = useSelector(
    (state) => state.data.getCities
  );

  const { districts: districtsData, success: districtsSuccess } = useSelector(
    (state) => state.data.getDistricts
  );

  const { loading, success, error } = useSelector(
    (state) => state.auth.register
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(null);
  const [district, setDistrict] = useState(null);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [checked, setChecked] = useState(false);
  const [toConfirm, setToConfirm] = useState(false);

  const [citiesData, setCitiesData] = useState(null);
  const [districts, setDistricts] = useState([]);

  const confirmRegister = (e) => {
    e.preventDefault();

    if (password !== password2) {
      toast.error("Şifreler aynı değil");
      return;
    }
    if (phoneNumber.length < 12) {
      toast("Lütfen telefon numaranızı tamamlayın");
      return;
    }

    if (!checked) {
      toast.error("Lütfen kullanım şartılarını kabul edin");
      return;
    }
    setPopupContent(
      <Confirm
        email={email}
        popupContent={popupContent}
        setPopupContent={setPopupContent}
        onClick={register}
      />
    );
  };

  const register = () => {
    setPopupContent(null);
    if (
      firstName &&
      lastName &&
      phoneNumber &&
      city?.value &&
      district?.value &&
      password
    ) {
      dispatch(
        registerUser({
          email,
          tel: phoneNumber.slice(1),
          password,
          firstName,
          lastName,
          city: city.value,
          district: district.value,
          neighbourhood: "string",
        })
      );
    } else {
      toast("Tüm alanları doldurunuz");
    }
  };

  // USE EFFECTS
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    } else if (success) {
      setToConfirm(true);
      toast.dismiss(toastId.current);
      toast.success("Doğrulama Kodu Gönderildi");
      dispatch(resetRgisterState());
    } else if (error) {
      toast.dismiss();
      toast.error(error.message);
      dispatch(resetRgisterState());
    }
  }, [loading, success, error]);

  useEffect(() => {
    if (!cities) {
      dispatch(getCities());
    }
    if (citiesSuccess) {
      setCitiesData(cities);
    }
  }, [citiesSuccess, cities]);

  useEffect(() => {
    if (city?.id) {
      dispatch(getDistricts({ cityId: city.id }));
      setDistrict(null);
    }
  }, [city]);

  useEffect(() => {
    if (districtsSuccess) {
      setDistricts(districtsData);
    }
  }, [districtsSuccess]);

  return (
    <GlassFrame
      className="pt-[3.5rem] sm:pt-[4.5rem] pb-16 overflow-y-auto"
      className2="pt-[0rem] pb-[1rem] sm:max-w-[34rem]"
      component={
        !toConfirm ? (
          /* Register Page */
          <form onSubmit={confirmRegister} className="light">
            <div className="flex justify-center">
              <h2 className="text-[2.7rem] font-bold text-[--white-1] tracking-tighter">
                Kayıt ol
              </h2>
            </div>
            <div className="flex flex-col max-w-full">
              <div className="flex max-sm:flex-col w-full sm:gap-2 customInput">
                <CustomInput
                  // label="Ad"
                  type="text"
                  placeholder="Ad"
                  value={firstName}
                  onChange={(e) => setFirstName(e)}
                  required={true}
                  className="mt-[0px] sm:mt-[0px] py-[.5rem] bg-transparent"
                  className2="mt-[5px] sm:mt-[5px]"
                />
                <CustomInput
                  // label="Soyad"
                  type="text"
                  placeholder="Soyad"
                  value={lastName}
                  onChange={(e) => setLastName(e)}
                  required={true}
                  className="mt-[0px] sm:mt-[0px] py-[.5rem] bg-transparent"
                  className2="mt-[5px] sm:mt-[5px]"
                />
              </div>

              <div className="flex w-full sm:gap-2 max-sm:flex-col customInput">
                <CustomPhoneInput
                  // label="Cep Telefonu"
                  type="tel"
                  placeholder="+90"
                  value={phoneNumber}
                  onChange={(phone) => setPhoneNumber(phone)}
                  required={true}
                  className="mt-[0px] sm:mt-[0px] py-[.5rem] bg-transparent"
                  className2="mt-[5px] sm:mt-[5px]"
                  maxLength={14}
                />
                <CustomInput
                  // label="E-Posta"
                  type="email"
                  placeholder="E-Posta"
                  value={email}
                  onChange={(e) => setEmail(formatEmail(e))}
                  required={true}
                  className="mt-[0px] sm:mt-[0px] py-[.5rem] bg-transparent"
                  className2="mt-[5px] sm:mt-[5px]"
                />
              </div>

              <div className="flex w-full sm:gap-2 max-sm:flex-col">
                <CustomSelect
                  // label="Şehir"
                  options={citiesData || []}
                  value={city ? city : { value: null, label: "Şehir" }}
                  onChange={setCity}
                  style={{
                    padding: "1px 0px",
                    fontSize: ".8rem",
                    backgroundColor: "transparent",
                  }}
                  inputStyle={{ color: "var(--white-1)" }}
                  singleValueStyle={{ color: "white" }}
                  className="text-sm mt-[5px] sm:mt-[5px]"
                  className2="container-class mt-[0px] sm:mt-[0px]"
                />
                <CustomSelect
                  required={true}
                  // label="İlçe"
                  value={
                    district ? district : { value: null, label: "İlçe seç" }
                  }
                  options={
                    districts
                      ? [{ value: null, label: "İlçe seç" }, ...districts]
                      : [{ value: null, label: "İlçe seç" }]
                  }
                  onChange={setDistrict}
                  style={{
                    padding: "1px 0px",
                    fontSize: ".8rem",
                    backgroundColor: "transparent",
                  }}
                  inputStyle={{ color: "var(--white-1)" }}
                  singleValueStyle={{ color: "white" }}
                  className="text-sm mt-[5px] sm:mt-[5px]"
                  className2="container-class mt-[0px] sm:mt-[0px]"
                />
              </div>

              <div className="customInput">
                <CustomInput
                  // label="Şifre"
                  placeholder="Şifre"
                  value={password}
                  onChange={(e) => setPassword(e)}
                  required={true}
                  className="mt-[0px] sm:mt-[0px] py-[.5rem] bg-transparent text-[var(--white-1)]"
                  className2="mt-[5px] sm:mt-[5px]"
                  className3="top-[25%]"
                  className5="text-[var(--white-1)]"
                  letIcon={true}
                  minLength={4}
                  maxLength={20}
                />
                <CustomInput
                  // label="Şifreyi onayla"
                  placeholder="Şifre Tekrar"
                  value={password2}
                  onChange={(e) => setPassword2(e)}
                  required={true}
                  className="mt-[0px] sm:mt-[0px] py-[.5rem] bg-[transparent !important] text-[var(--white-1)]"
                  className2="mt-[5px] sm:mt-[5px]"
                  className3="top-[25%]"
                  className5="text-[var(--white-1)]"
                  letIcon={true}
                  minLength={4}
                  maxLength={20}
                />
              </div>

              <div className="flex w-full mt-4">
                {/* /privacyPolicy target='_blank' rel='noopener noreferrer */}
                <CustomCheckbox
                  label={<PrivacyBtn />}
                  className="text-sm"
                  checked={checked}
                  onChange={() => setChecked(!checked)}
                />
              </div>

              <div className="flex flex-col mt-4 sm:mt-10 w-full">
                <button
                  type="submit"
                  className={`flex justify-center px-7 py-2 text-xl rounded-md bg-[--primary-1] text-white hover:opacity-90 `}
                  disabled={loading}
                >
                  {loading ? <LoadingI className="h-7" /> : "Devam"}
                </button>
              </div>
            </div>

            <div className="flex flex-col mt-4 sm:mt-6 w-full">
              <div className="flex justify-center gap-2 text-white">
                <p>Hesabınız var mı ?</p>
                <a href="/login" className="text-[--link-1]">
                  Giriş Yapın
                </a>
              </div>
            </div>
          </form>
        ) : (
          /* Verify Page*/
          <VerifyCode
            email={email}
            setToConfirm={setToConfirm}
            onSuccess={() => navigate("/login")}
          />
        )
      }
    />
  );
};

export default Register;

const Confirm = ({ email, setPopupContent, onClick }) => {
  return (
    <div className="w-full flex justify-center light">
      <div className="w-full max-w-[35rem] bg-[--white-1] shadow-lg py-10 px-5 rounded-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-10 border border-[--gr-1] text-[--white-1]">
        <div className="text-center">
          <div className="w-full flex justify-center mb-8">
            <p className="text-[--primary-2] text-4xl">{email}</p>
          </div>
          <p className="font-[350]">
            E-Posta Adresinize onay kodu gönderilecektir.
            <br />
            E-Posta Adresiniz doğru olduğundan emin misiniz ?
          </p>
        </div>
        <div className="mt-10 w-full flex gap-4 justify-center">
          <button
            className="py-2 px-5 rounded-lg bg-[--light-3] text-[--black-1] hover:opacity-90"
            onClick={() => setPopupContent(null)}
          >
            Düzelt
          </button>
          <button
            className="py-2 px-6 rounded-lg bg-[--primary-1] text-white hover:opacity-90"
            onClick={onClick}
          >
            Evet
          </button>
        </div>
      </div>
    </div>
  );
};

function PrivacyBtn() {
  const { setPopupContent } = usePopup();

  const closeForm = () => {
    setPopupContent(null);
  };

  const PrivacyPopup = () => {
    return (
      <div className="pt-8 bg-[--white-1] rounded-lg overflow-clip">
        <div className="overflow-y-auto h-[95dvh]">
          <div className="absolute top-2 right-3 z-[50]">
            <div
              className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-white transition-colors"
              onClick={closeForm}
            >
              <CancelI />
            </div>
          </div>
          <PrivacyPolicy />
        </div>
      </div>
    );
  };

  return (
    <div>
      <button
        className="text-[--link-1]"
        type="button"
        onClick={() => {
          setPopupContent(<PrivacyPopup />);
        }}
      >
        Kullanım Şartları
      </button>
      nı okudum ve onaylıyorum.
    </div>
  );
}

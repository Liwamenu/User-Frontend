//MODELS
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// ICONS
import LoadingI from "../assets/anim/loading";
import TurnstileWidget from "../components/turnstileWidget";

//REDUX
import { getAuth } from "../redux/api";
import { login, resetLoginState } from "../redux/auth/loginSlice";

// CONTEXT
import { useFirebase } from "../context/firebase";

// COMP
import GlassFrame from "../components/common/glassFrame";
import CustomInput from "../components/common/customInput";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { pushToken, notificationPermission, requestNotificationAccess } =
    useFirebase();

  const token = getAuth()?.token;
  const { success, loading, error } = useSelector((state) => state.auth.login);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleEnableNotifications = async () => {
    const { permission, token } = await requestNotificationAccess();

    if (permission === "granted" && token) {
      toast.success(t("auth.notification_granted"));
      return;
    }

    if (permission === "denied") {
      window.alert(t("auth.notification_blocked"));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!emailOrPhone || !password || loading) return;

    console.log("[Login] Sending login with push token");
    dispatch(login({ emailOrPhone, password, pushToken: pushToken || null }));
  };

  useEffect(() => {
    if (loading) {
      toast.loading(t("auth.login_loading"));
    } else if (error) {
      toast.dismiss();
      if (error?.statusCode == 422) navigate("/verify");
      if (error.statusCode == 403) {
        toast.error(t("auth.login_inactive"));
      } else {
        toast.error(error.message);
      }
      dispatch(resetLoginState());
    } else if (success) {
      navigate("/restaurants");
      toast.dismiss();
      toast.success(t("auth.login_success"));
      dispatch(resetLoginState());
    }
  }, [loading, success, error, dispatch, navigate, t]);

  useEffect(() => {
    if (token) {
      navigate("/restaurants");
    }
  }, [token]);

  return (
    <GlassFrame
      className="pt-[4rem]"
      component={
        <form onSubmit={handleLogin} className="text-white light">
          <h1 className="text-4xl font-bold text-center mb-8">
            {t("auth.login_title")}
          </h1>

          {notificationPermission !== "granted" && (
            <div className="mb-4 text-xs rounded-md border border-dashed border-[--primary-1] p-3">
              <p className="mb-2">{t("auth.enable_notifications_text")}</p>
              <button
                type="button"
                onClick={handleEnableNotifications}
                className="px-3 py-1 rounded bg-[--primary-1] text-white"
              >
                {t("auth.enable_notifications_button")}
              </button>
            </div>
          )}

          <CustomInput
            label={t("auth.email_or_phone_label")}
            type="text"
            placeholder={t("auth.email_or_phone_placeholder")}
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e)}
            required={true}
            className="py-2 bg-transparent text-white"
            autoComplete="on"
          />
          <CustomInput
            label={t("auth.password_label")}
            placeholder={t("auth.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e)}
            letIcon={true}
            className="py-2 bg-transparent text-white"
            autoComplete="on"
            minLength={4}
            maxLength={20}
          />
          <div className="text-right text-[--link-1] mt-4">
            <a href="/forgotPassword">{t("auth.forgot_password")}</a>
          </div>

          <TurnstileWidget setToken={setTurnstileToken} pageName={"login"} />

          <button
            disabled={loading}
            type="submit"
            className="w-full flex justify-center px-7 py-2 text-xl rounded-md bg-[--primary-1] text-white mt-10 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingI className="h-7 text-white" />
            ) : (
              t("auth.login_button")
            )}
          </button>

          <div className="flex mt-4 justify-center gap-2">
            <p>{t("auth.no_account")}</p>
            <a href="/register" className="text-[--link-1]">
              {t("auth.register_link")}
            </a>
          </div>
        </form>
      }
    />
  );
}

export default Login;

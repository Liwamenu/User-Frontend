//MOD
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Save, Loader2, IdCard, MapPin } from "lucide-react";

//COMP
import CustomInput from "../../common/customInput";
import { formatEmail } from "../../../utils/utils";
import CustomPhoneInput from "../../common/customPhoneInput";

// REDUX
import {
  updateUserData,
  resetUpdateUserData,
} from "../../../redux/user/updateUserDataSlice";
import { getUser } from "../../../redux/user/getUserSlice";

const PRIMARY_GRADIENT =
  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)";

const baselineFromUser = (user) => ({
  firstName: user?.firstName ?? "",
  lastName: user?.lastName ?? "",
  // Backend already stores the phone in the format CustomPhoneInput expects
  // (e.g. "905380828959" — country code + number, no plus). Use as-is.
  phoneNumber: user?.phoneNumber ?? "",
  email: user?.email ?? "",
  city: user?.city ?? "",
  district: user?.district ?? "",
  dealerId: user?.dealerId ?? null,
});

const EditUserProfile = ({ user }) => {
  const { t } = useTranslation();
  const toastId = useRef();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.user.updateUserData,
  );

  const [userDataBefore, setUserDataBefore] = useState(baselineFromUser(null));
  const [userData, setUserData] = useState(baselineFromUser(null));

  function handleSubmit(e) {
    e.preventDefault();
    if (isEqual(userDataBefore, userData)) {
      toast.error(t("editUserProfile.no_changes"));
      return;
    }
    dispatch(updateUserData(userData));
  }

  // Toast lifecycle for the update request.
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading(t("editUserProfile.processing"));
    }
    if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetUpdateUserData());
    }
    if (success) {
      // Refresh user from server (slice now persists to localStorage too).
      dispatch(getUser());
      dispatch(resetUpdateUserData());
      toast.dismiss(toastId.current);
      toast.success(t("editUserProfile.success"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, success, error]);

  // Sync state whenever the parent passes a fresh user object (e.g. after
  // getUser resolves). Without this the form would keep showing the old
  // values that came in via the initial localStorage hydration.
  useEffect(() => {
    if (!user) return;
    const baseline = baselineFromUser(user);
    setUserDataBefore(baseline);
    setUserData(baseline);
  }, [user]);

  const dirty = !isEqual(userDataBefore, userData);

  const setField = (key) => (val) =>
    setUserData((prev) => ({ ...prev, [key]: val }));

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Personal info */}
      <Section icon={IdCard} title={t("editUserProfile.section_personal")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <CustomInput
            label={t("editUserProfile.first_name")}
            required
            className="py-2.5 bg-[--white-1]"
            value={userData.firstName}
            onChange={setField("firstName")}
          />
          <CustomInput
            label={t("editUserProfile.last_name")}
            required
            className="py-2.5 bg-[--white-1]"
            value={userData.lastName}
            onChange={setField("lastName")}
          />
          <CustomPhoneInput
            label={t("editUserProfile.phone")}
            required
            disabled
            className="py-2.5"
            value={userData.phoneNumber}
            onChange={setField("phoneNumber")}
          />
          <CustomInput
            label={t("editUserProfile.email")}
            required
            disabled
            className="py-2.5"
            value={userData.email}
            onChange={(v) => setField("email")(formatEmail(v))}
          />
        </div>
      </Section>

      {/* Address */}
      <Section icon={MapPin} title={t("editUserProfile.section_location")}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <CustomInput
            label={t("editUserProfile.city")}
            className="py-2.5 bg-[--white-1]"
            value={userData.city}
            onChange={setField("city")}
          />
          <CustomInput
            label={t("editUserProfile.district")}
            className="py-2.5 bg-[--white-1]"
            value={userData.district}
            onChange={setField("district")}
          />
        </div>
      </Section>

      {/* Submit */}
      <div className="flex justify-end pt-2 border-t border-[--border-1]">
        <button
          type="submit"
          disabled={loading || !dirty}
          className={`inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-lg text-sm font-semibold transition shrink-0 ${
            dirty && !loading
              ? "text-white shadow-md shadow-indigo-500/25 hover:brightness-110 active:brightness-95"
              : "text-[--gr-1] bg-[--white-2] border border-[--border-1] cursor-not-allowed"
          }`}
          style={
            dirty && !loading ? { background: PRIMARY_GRADIENT } : undefined
          }
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {loading
            ? t("editUserProfile.processing")
            : t("editUserProfile.save")}
        </button>
      </div>
    </form>
  );
};

const Section = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-[--border-1] bg-[--white-1] overflow-hidden">
    <div className="flex items-center gap-2 px-3 py-2 bg-[--white-2]/60 border-b border-[--border-1]">
      <span className="grid place-items-center size-7 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300 shrink-0">
        <Icon className="size-3.5" />
      </span>
      <h3 className="text-[10px] font-bold uppercase tracking-wider text-[--gr-1]">
        {title}
      </h3>
    </div>
    <div className="p-3 sm:p-4">{children}</div>
  </div>
);

export default EditUserProfile;

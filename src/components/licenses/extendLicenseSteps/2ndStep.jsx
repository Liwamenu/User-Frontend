//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Mail,
  MapPin,
  Phone,
  Receipt,
  User,
  UserCircle,
} from "lucide-react";

//REDUX
import { getUser, resetGetUserState } from "../../../redux/user/getUserSlice";

const PRIMARY_GRADIENT =
  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)";

const initialForm = {
  title: "",
  identityType: "tax", // 'tax' (10 digits) | 'tc' (11 digits)
  identityNumber: "",
  taxOffice: "",
  address: "",
  city: "",
  district: "",
};

const SecondStep = ({
  step,
  setStep,
  userData,
  setUserData,
  userInvData,
  setUserInvData,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { success: getUserSucc, user } = useSelector(
    (state) => state.user.getUser,
  );

  const [form, setForm] = useState(initialForm);

  // GET USER on mount
  useEffect(() => {
    if (!userData) {
      dispatch(getUser());
    }
  }, [userData]);

  // Set user from redux
  useEffect(() => {
    if (getUserSucc && user) {
      setUserData(user);
      setUserInvData(user.userInvoiceAddressDTO);
      dispatch(resetGetUserState());
    }
  }, [user, getUserSucc]);

  // Pre-fill form from existing userInvData
  useEffect(() => {
    if (userInvData) {
      const num = userInvData.taxNumber || userInvData.identityNumber || "";
      setForm({
        title: userInvData.title || "",
        identityType:
          userInvData.identityType ||
          (num.length === 11 ? "tc" : "tax"),
        identityNumber: num,
        taxOffice: userInvData.taxOffice || "",
        address: userInvData.address || "",
        city: userInvData.city || "",
        district: userInvData.district || "",
      });
    }
  }, [userInvData]);

  const setField = (k) => (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, [k]: value }));
  };

  const setIdentityNumber = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setForm((p) => ({ ...p, identityNumber: onlyDigits }));
  };

  const setIdentityType = (type) => {
    setForm((p) => ({ ...p, identityType: type, identityNumber: "" }));
  };

  function handleSubmit(e) {
    e.preventDefault();

    // Light validation only when user has actually entered an identity number
    if (form.identityNumber) {
      if (form.identityType === "tc" && form.identityNumber.length !== 11) {
        toast.error(t("extendLicense.identity_invalid_tc"));
        return;
      }
      if (form.identityType === "tax" && form.identityNumber.length !== 10) {
        toast.error(t("extendLicense.identity_invalid_tax"));
        return;
      }
    }

    // Persist what's filled — empty fields stay empty
    setUserInvData({
      ...form,
      taxNumber: form.identityNumber,
    });
    setStep(step + 1);
  }

  const isTC = form.identityType === "tc";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div className="px-4 sm:px-5 pt-4 pb-3 space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="grid place-items-center size-10 shrink-0 rounded-xl text-white shadow-md shadow-indigo-500/20"
            style={{ background: PRIMARY_GRADIENT }}
          >
            <Receipt className="size-5" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[--black-1] leading-tight">
              {t("extendLicense.invoice_title")}
            </h2>
            <p className="mt-0.5 text-xs text-[--gr-1] leading-snug">
              {t("extendLicense.invoice_subtitle")}
            </p>
          </div>
        </div>

        {/* Account info (read-only) */}
        <div className="rounded-xl border border-[--border-1] overflow-hidden">
          <div className="px-3.5 py-2 bg-[--white-2] border-b border-[--border-1] flex items-center gap-2">
            <UserCircle className="size-3.5 text-[--primary-1]" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[--black-1]">
              {t("extendLicense.account_info")}
            </h3>
          </div>
          <div className="divide-y divide-[--border-1]">
            <ReadRow icon={User} value={userData?.fullName} />
            <ReadRow icon={Mail} value={userData?.email} />
            <ReadRow icon={Phone} value={userData?.phoneNumber} />
          </div>
        </div>

        {/* Editable invoice form */}
        <div className="rounded-xl border border-[--border-1] overflow-hidden">
          <div className="px-3.5 py-2 bg-[--white-2] border-b border-[--border-1] flex items-center gap-2">
            <Building2 className="size-3.5 text-[--primary-1]" />
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[--black-1]">
              {t("extendLicense.invoice_address")}
            </h3>
          </div>
          <div className="p-3.5 space-y-3">
            {/* Trade title / Full name */}
            <Field
              id="inv-title"
              label={t("extendLicense.form_company_title")}
            >
              <input
                id="inv-title"
                type="text"
                maxLength={120}
                value={form.title}
                onChange={setField("title")}
                placeholder={t("extendLicense.form_company_placeholder")}
                className={inputClass}
              />
            </Field>

            {/* Identity type tabs */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[--gr-1] mb-1.5">
                {t("extendLicense.identity_type_label")}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIdentityType("tax")}
                  className={`h-10 px-3 rounded-lg border-2 text-xs font-semibold transition ${
                    !isTC
                      ? "border-[--primary-1] bg-[--primary-1]/5 text-[--primary-1]"
                      : "border-[--border-1] bg-[--white-1] text-[--black-1] hover:border-[--primary-1]/40"
                  }`}
                >
                  {t("extendLicense.identity_type_tax")}
                </button>
                <button
                  type="button"
                  onClick={() => setIdentityType("tc")}
                  className={`h-10 px-3 rounded-lg border-2 text-xs font-semibold transition ${
                    isTC
                      ? "border-[--primary-1] bg-[--primary-1]/5 text-[--primary-1]"
                      : "border-[--border-1] bg-[--white-1] text-[--black-1] hover:border-[--primary-1]/40"
                  }`}
                >
                  {t("extendLicense.identity_type_tc")}
                </button>
              </div>
            </div>

            {/* Identity number + tax office */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field
                id="inv-id"
                label={
                  isTC
                    ? t("extendLicense.identity_type_tc")
                    : t("extendLicense.identity_type_tax")
                }
              >
                <input
                  id="inv-id"
                  type="text"
                  inputMode="numeric"
                  maxLength={isTC ? 11 : 10}
                  value={form.identityNumber}
                  onChange={setIdentityNumber}
                  placeholder={
                    isTC
                      ? t("extendLicense.identity_placeholder_tc")
                      : t("extendLicense.identity_placeholder_tax")
                  }
                  className={`${inputClass} tabular-nums tracking-wide`}
                />
              </Field>

              {!isTC && (
                <Field
                  id="inv-taxoffice"
                  label={t("extendLicense.tax_office_placeholder")}
                >
                  <input
                    id="inv-taxoffice"
                    type="text"
                    maxLength={60}
                    value={form.taxOffice}
                    onChange={setField("taxOffice")}
                    placeholder={t("extendLicense.tax_office_placeholder")}
                    className={inputClass}
                  />
                </Field>
              )}
            </div>

            {/* Address */}
            <Field
              id="inv-address"
              label={t("restaurants.address")}
            >
              <textarea
                id="inv-address"
                rows={2}
                maxLength={250}
                value={form.address}
                onChange={setField("address")}
                placeholder={t("extendLicense.address_placeholder")}
                className={`${inputClass} !h-auto py-2.5 resize-none`}
              />
            </Field>

            {/* City / District */}
            <div className="grid grid-cols-2 gap-3">
              <Field
                id="inv-city"
                label={t("restaurants.city")}
              >
                <input
                  id="inv-city"
                  type="text"
                  maxLength={40}
                  value={form.city}
                  onChange={setField("city")}
                  placeholder={t("extendLicense.city_placeholder")}
                  className={inputClass}
                />
              </Field>
              <Field
                id="inv-district"
                label={t("restaurants.district")}
              >
                <input
                  id="inv-district"
                  type="text"
                  maxLength={40}
                  value={form.district}
                  onChange={setField("district")}
                  placeholder={t("extendLicense.district_placeholder")}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[--border-1] bg-[--white-2]/40 px-4 sm:px-5 py-3 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl border border-[--border-1] bg-[--white-1] text-[--black-1] text-sm font-medium hover:bg-[--white-2] transition"
        >
          <ArrowLeft className="size-4" />
          {t("addLicense.back")}
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/30 hover:brightness-110 active:brightness-95"
          style={{ background: PRIMARY_GRADIENT }}
        >
          {t("addLicense.continue")}
          <ArrowRight className="size-4" />
        </button>
      </div>
    </form>
  );
};

export default SecondStep;

// ====== Helpers ======

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-[--border-1] bg-[--white-1] text-[--black-1] placeholder:text-[--gr-1] outline-none transition focus:border-[--primary-1] focus:ring-2 focus:ring-indigo-100 text-sm";

const Field = ({ id, label, required, children }) => (
  <div>
    <label
      htmlFor={id}
      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[--gr-1] mb-1"
    >
      {label}
      {required && <span className="text-rose-500">*</span>}
    </label>
    {children}
  </div>
);

const ReadRow = ({ icon: Icon, value }) => (
  <div className="flex items-center gap-3 px-3.5 py-2.5">
    <span className="grid place-items-center size-7 shrink-0 rounded-lg bg-[--primary-1]/10 text-[--primary-1]">
      <Icon className="size-3.5" strokeWidth={2} />
    </span>
    <p className="text-sm font-semibold text-[--black-1] truncate">
      {value || "—"}
    </p>
  </div>
);

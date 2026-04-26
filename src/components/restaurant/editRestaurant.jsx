//MODULES
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Building2,
  Phone,
  MapPin,
  Map,
  Image as ImageIcon,
  Save,
  X,
  Check,
  Compass,
} from "lucide-react";

//COMP
import { googleMap, toNameCase } from "../../utils/utils";
import CustomFileInput from "../common/customFileInput";
import CustomPhoneInput from "../common/customPhoneInput";

//REDUX
import {
  updateRestaurant,
  resetUpdateRestaurant,
} from "../../redux/restaurants/updateRestaurantSlice";

function formatCoordinate(value) {
  if (value === null || value === undefined || value === "") {
    return value;
  }

  const stringValue = String(value);
  if (stringValue.includes(".")) {
    return stringValue;
  }

  const cleanedValue = stringValue.replace(/\D/g, "");
  if (cleanedValue.length <= 2) {
    return stringValue;
  }

  return `${cleanedValue.slice(0, 2)}.${cleanedValue.slice(2)}`;
}

const EditRestaurant = ({ data: restaurant }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toastId = useRef();

  // Derive formatted restaurant object
  const formatRestaurant = (restaurant) => {
    if (!restaurant) return null;

    const {
      id: restaurantId,
      dealerId,
      userId,
      name,
      phoneNumber,
      latitude,
      longitude,
      city,
      district,
      neighbourhood,
      address,
      isActive,
      imageAbsoluteUrl,
      logoImageUrl,
    } = restaurant;

    return {
      restaurantId,
      dealerId,
      userId,
      name,
      phoneNumber,
      latitude: formatCoordinate(latitude),
      longitude: formatCoordinate(longitude),
      city,
      district,
      neighbourhood,
      address,
      isActive,
      imageAbsoluteUrl,
      logoImageUrl,
    };
  };

  const { loading, success, error } = useSelector(
    (state) => state.restaurants.updateRestaurant,
  );

  const { success: locationSuccess, location } = useSelector(
    (state) => state.data.getLocation,
  );

  const [lat, setLat] = useState(formatCoordinate(restaurant?.latitude));
  const [lng, setLng] = useState(formatCoordinate(restaurant?.longitude));
  const [document, setDocument] = useState("");
  const [document2, setDocument2] = useState("");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [restaurantDataBefore, setRestaurantDataBefore] = useState(
    formatRestaurant(restaurant),
  );
  const [restaurantData, setRestaurantData] = useState(
    formatRestaurant(restaurant),
  );
  const [preview, setPreview] = useState();
  const [preview2, setPreview2] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const equalData = isEqual(restaurantDataBefore, restaurantData);
    if (equalData && !document && !document2) {
      toast("Hiç bir değişiklik yapmadınız.");
      return;
    }

    const formData = new FormData();

    formData.append("RestaurantId", restaurantData.restaurantId);
    formData.append("DealerId", restaurantData.dealerId);
    formData.append("UserId", restaurantData.userId);
    formData.append("Name", restaurantData.name);
    formData.append("PhoneNumber", restaurantData.phoneNumber);
    formData.append("Latitude", restaurantData.latitude);
    formData.append("Longitude", restaurantData.longitude);
    formData.append("City", restaurantData.city);
    formData.append("District", restaurantData.district);
    formData.append("Neighbourhood", restaurantData.neighbourhood);
    formData.append("Address", restaurantData.address);
    formData.append("IsActive", restaurantData.isActive);
    document && formData.append("Image", document);
    document2 && formData.append("LogoImage", document2);

    dispatch(updateRestaurant(formData));
  };

  function handleOpenMap() {
    setIsMapOpen(true);
  }

  // Initialize Google Map AFTER the modal is rendered & visible — otherwise the
  // map container has 0 dimensions and tiles never load.
  useEffect(() => {
    if (!isMapOpen) return;
    const id = requestAnimationFrame(() => {
      const latNum = parseFloat(formatCoordinate(lat));
      const lngNum = parseFloat(formatCoordinate(lng));
      const validLat = Number.isFinite(latNum) ? latNum : 39.0;
      const validLng = Number.isFinite(lngNum) ? lngNum : 35.0;
      googleMap(validLat, validLng, setLat, setLng, null, 15, false);
    });
    return () => cancelAnimationFrame(id);
  }, [isMapOpen]);

  function handleSetMap() {
    setRestaurantData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    // console.log(lat, lng);
    setIsMapOpen(false);
  }

  // REFRESH WHEN RESTAURANT CHANGES
  useEffect(() => {
    if (restaurant) {
      const formatted = formatRestaurant(restaurant);
      setRestaurantData(formatted);
      setRestaurantDataBefore(formatted);
      setPreview(formatted?.imageAbsoluteUrl);
      setPreview2(formatted?.logoImageUrl);
      // Sync map coords so the map opens at the saved location.
      if (formatted?.latitude) setLat(formatted.latitude);
      if (formatted?.longitude) setLng(formatted.longitude);
    }
  }, [restaurant]);

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor 🤩...");
    }
    if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetUpdateRestaurant());
    } else if (success) {
      toast.dismiss(toastId.current);
      toast.success("Restoran başarıyla güncelendi 🥳🥳");
      dispatch(resetUpdateRestaurant());
    }
  }, [loading, success, error]);

  //PREVIEW
  useEffect(() => {
    let objectUrl;
    let objectUrl2;
    if (document) {
      // Create a preview URL
      objectUrl = URL.createObjectURL(document);
      setPreview(objectUrl);
    }
    if (document2) {
      // Create a preview URL
      objectUrl2 = URL.createObjectURL(document2);
      setPreview2(objectUrl2);
    }

    // Free memory when the component unmounts or doc changes
    return () => {
      if (document) {
        URL.revokeObjectURL(objectUrl);
      }
      if (document2) {
        URL.revokeObjectURL(objectUrl2);
      }
    };
  }, [document, document2]);

  const inputCls =
    "w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100";
  const labelCls =
    "block text-[11px] font-semibold text-slate-600 mb-1 tracking-wide";

  const SectionHeader = ({ icon: Icon, label }) => (
    <header className="flex items-center gap-1.5 mb-2.5">
      <Icon className="size-3.5 text-indigo-600" />
      <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.12em]">
        {label}
      </h2>
    </header>
  );

  return (
    <div className="w-full pb-8 mt-1 text-slate-900">
      {/* MAP MODAL */}
      <div
        className={`fixed bg-white border border-slate-200 w-[calc(100%-2rem)] top-0 bottom-0 right-0 left-0 max-w-2xl max-h-[80dvh] m-auto z-[999] rounded-2xl flex flex-col justify-start items-center shadow-2xl overflow-hidden ${
          !isMapOpen && "hidden"
        }`}
      >
        <div id="map" className="size-full"></div>

        <div className="w-full px-3 py-2.5 flex items-center gap-3 border-t border-slate-200 bg-white">
          <div className="flex flex-1 gap-3 min-w-0">
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                {t("restaurants.latitude")}
              </span>
              <p className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-900 font-medium truncate">
                {lat}
              </p>
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                {t("restaurants.longitude")}
              </span>
              <p className="rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-900 font-medium truncate">
                {lng}
              </p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 transition"
              onClick={() => setIsMapOpen(false)}
            >
              <X className="size-4" />
              <span className="hidden sm:inline">
                {t("restaurants.map_close")}
              </span>
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-lg text-white shadow-md shadow-indigo-500/25 transition hover:brightness-110"
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)",
              }}
              onClick={handleSetMap}
            >
              <Check className="size-4" strokeWidth={3} />
              {t("restaurants.map_save")}
            </button>
          </div>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Slim gradient accent strip */}
        <div
          className="h-0.5"
          style={{
            background:
              "linear-gradient(90deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)",
          }}
        />
        {/* HERO HEADER — slim & elegant */}
        <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center gap-3">
          <span
            className="grid place-items-center size-9 rounded-xl text-white shadow-md shadow-indigo-500/25 shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)",
            }}
          >
            <Building2 className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-semibold text-slate-900 truncate tracking-tight">
                {restaurantData?.name || t("restaurants.name")}
              </h1>
              {restaurantData?.isActive && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 shrink-0">
                  AKTİF
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {[restaurantData?.city, restaurantData?.district]
                .filter(Boolean)
                .join(" / ") || "—"}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {restaurantData && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* RESTORAN BİLGİLERİ */}
              <div>
                <SectionHeader
                  icon={Building2}
                  label={t("restaurants.name")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>
                      {t("restaurants.name")}
                      <span className="text-rose-500 ml-0.5">*</span>
                    </label>
                    <input
                      required
                      type="text"
                      className={inputCls}
                      placeholder={t("restaurants.name")}
                      value={restaurantData.name || ""}
                      onChange={(e) =>
                        setRestaurantData((prev) => ({
                          ...prev,
                          name: toNameCase(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {t("restaurants.phone")}
                      <span className="text-rose-500 ml-0.5">*</span>
                    </label>
                    <CustomPhoneInput
                      required
                      placeholder={t("restaurants.phone")}
                      className="!h-10 !rounded-lg !border-slate-200 !text-sm !bg-white"
                      value={restaurantData.phoneNumber}
                      onChange={(phone) =>
                        setRestaurantData((prev) => ({
                          ...prev,
                          phoneNumber: phone,
                        }))
                      }
                      maxLength={14}
                    />
                  </div>
                </div>
              </div>

              {/* ADRES */}
              <div>
                <SectionHeader
                  icon={MapPin}
                  label={t("restaurants.address")}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className={labelCls}>{t("restaurants.city")}</label>
                    <input
                      required
                      type="text"
                      className={inputCls}
                      placeholder={t("restaurants.city")}
                      value={restaurantData.city || ""}
                      onChange={(e) =>
                        setRestaurantData((prev) => ({
                          ...prev,
                          city: toNameCase(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {t("restaurants.district")}
                    </label>
                    <input
                      required
                      type="text"
                      className={inputCls}
                      placeholder={t("restaurants.district")}
                      value={restaurantData.district || ""}
                      onChange={(e) =>
                        setRestaurantData((prev) => ({
                          ...prev,
                          district: toNameCase(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>
                      {t("restaurants.neighbourhood")}
                    </label>
                    <input
                      required
                      type="text"
                      className={inputCls}
                      placeholder={t("restaurants.neighbourhood")}
                      value={restaurantData.neighbourhood || ""}
                      onChange={(e) =>
                        setRestaurantData((prev) => ({
                          ...prev,
                          neighbourhood: toNameCase(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className={labelCls}>
                    {t("restaurants.address")}
                    <span className="text-rose-500 ml-0.5">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    className={`${inputCls} h-auto py-2 resize-none`}
                    placeholder={t("restaurants.address")}
                    value={restaurantData.address || ""}
                    onChange={(e) =>
                      setRestaurantData((prev) => ({
                        ...prev,
                        address: toNameCase(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              {/* KONUM — tek satır button */}
              <div>
                <SectionHeader
                  icon={Compass}
                  label={`${t("restaurants.latitude")} / ${t(
                    "restaurants.longitude",
                  )}`}
                />
                <button
                  type="button"
                  onClick={handleOpenMap}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-indigo-300 hover:shadow-sm transition text-left group"
                >
                  <div className="grid place-items-center size-9 rounded-lg bg-white border border-slate-200 shrink-0 group-hover:border-indigo-200 group-hover:bg-indigo-50 transition">
                    <Map className="size-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      {t("restaurants.latitude")} ·{" "}
                      {t("restaurants.longitude")}
                    </div>
                    <div className="text-sm font-medium text-slate-900 truncate font-mono">
                      {restaurantData.latitude || "—"},{" "}
                      {restaurantData.longitude || "—"}
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-indigo-600 hidden sm:inline shrink-0 mr-1">
                    {t("restaurants.map_save")} →
                  </span>
                </button>
              </div>

              {/* GÖRSELLER — kompakt yan yana */}
              <div>
                <SectionHeader
                  icon={ImageIcon}
                  label={t("restaurants.logo_msg")}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <ImageField
                    label={t("restaurants.logo_msg")}
                    preview={preview2}
                    document={document2}
                    onChange={setDocument2}
                    contain
                  />
                  <ImageField
                    label={t("restaurants.file-info")}
                    preview={preview}
                    document={document}
                    onChange={setDocument}
                  />
                </div>
              </div>

              {/* SUBMIT */}
              <div className="flex justify-end pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className={`group inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:brightness-95 disabled:opacity-70 disabled:cursor-not-allowed ${
                    isMapOpen && "invisible"
                  }`}
                  style={{
                    background:
                      "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)",
                  }}
                >
                  <Save className="size-4" />
                  {t("restaurants.save")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const ImageField = ({ label, preview, document: doc, onChange, contain }) => (
  <div>
    <span className="block text-[11px] font-semibold text-slate-600 mb-1 tracking-wide">
      {label}
    </span>
    <div className="flex gap-3 items-stretch">
      <div className="w-20 sm:w-24 aspect-square rounded-lg bg-slate-50 ring-1 ring-slate-200 grid place-items-center overflow-hidden shrink-0">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className={`size-full ${contain ? "object-contain" : "object-cover"}`}
          />
        ) : (
          <ImageIcon className="size-7 text-slate-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <CustomFileInput
          msg={label}
          value={doc}
          onChange={onChange}
          accept={"image/png, image/jpeg, image/gif, image/webp"}
        />
      </div>
    </div>
  </div>
);

export default EditRestaurant;

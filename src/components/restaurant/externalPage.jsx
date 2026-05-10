// External Page settings — owners configure an extra page that the
// customer-facing theme renders behind a button. The theme can only show
// ONE of the two modes (HTML or image), so the editor enforces that:
//   - "HTML" mode  → rich HTML content (with live preview)
//   - "Image" mode → single full-bleed image (typically a long menu graphic)
// Saving sends the active mode's field and clears the other (empty string)
// so the backend never has stale data from the unused mode.
//
// All three fields ride along with Restaurants/UpdateRestaurant (multipart)
// because there's no dedicated endpoint. To stay safe with that catch-all
// "send everything or risk a null-out" endpoint, we re-send the basic
// restaurant fields from `data`, mirroring editRestaurant.jsx's payload.

import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  AlertTriangle,
  Code2,
  Eye,
  Expand,
  Image as ImageIcon,
  Layout,
  Monitor,
  MousePointerClick,
  Save,
  Smartphone,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import CustomTextarea from "../common/customTextarea";
import SettingsTabs from "./settingsTabs";
import EditImageFile from "../common/editImageFile";
import { usePopup } from "../../context/PopupContext";
import {
  updateRestaurant,
  resetUpdateRestaurant,
} from "../../redux/restaurants/updateRestaurantSlice";
// Shared with announcementSettings.jsx — same authoring surface, same
// iframe contract, so any drift would re-create the "preview works in
// one editor, breaks in another" class of bugs.
import {
  buildPreviewSrcDoc,
  detectDangerousContent,
  PREVIEW_ALLOW,
  PREVIEW_SANDBOX,
} from "../../utils/htmlSafety";

const PRIMARY_GRADIENT =
  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)";

// The backend stores externalPageImage as a bare filename
// (e.g. "abc-123.png") instead of pre-resolving it to a full URL like it
// does for imageAbsoluteUrl. Build the prefix from the API origin so this
// works in dev / staging / prod without a hardcode. Convention: image
// files live at <origin>/images/restaurants/.
const IMAGES_BASE = (() => {
  try {
    const apiOrigin = new URL(import.meta.env.VITE_BASE_URL).origin;
    return `${apiOrigin}/images/restaurants/`;
  } catch {
    return "/images/restaurants/";
  }
})();

const resolveImageUrl = (raw) => {
  if (!raw || typeof raw !== "string") return "";
  // Already an absolute URL or root-relative path — leave as-is.
  if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("/")) return raw;
  return `${IMAGES_BASE}${raw}`;
};

// Backend may serialize the saved external-page image under any of these
// keys depending on which serializer/DTO it picked. Try them in order,
// then resolve through the prefix helper so a bare filename becomes a
// usable URL.
const readSavedImageUrl = (data) =>
  resolveImageUrl(
    data?.externalPageImageUrl ??
      data?.externalPageImageAbsoluteUrl ??
      data?.externalPageImage ??
      "",
  );

const ExternalPage = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setCropImgPopup, setPopupContent } = usePopup();

  const { success, error } = useSelector(
    (s) => s.restaurants.updateRestaurant,
  );

  const savedImageUrl = readSavedImageUrl(data);
  const savedHtml = data?.externalPageHTML ?? "";

  // Default to whichever mode currently has saved content. If both are
  // present (unlikely after a save through this UI, but possible if seeded
  // elsewhere), prefer image — it's the more visually impactful one.
  const initialMode = savedImageUrl ? "image" : "html";

  const [mode, setMode] = useState(initialMode);
  const [htmlContent, setHtmlContent] = useState(savedHtml);
  const [buttonName, setButtonName] = useState(
    data?.externalPageButtonName ?? "",
  );
  const [imageFile, setImageFile] = useState(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [imagePreview, setImagePreview] = useState(savedImageUrl);
  // Device-frame width for the live preview. Mirrors AnnouncementSettings
  // so authors can confirm their content holds up on a phone before
  // publishing. Defaults to mobile because most customers visit via QR
  // code on a phone.
  const [previewMode, setPreviewMode] = useState("mobile");

  // Self-contained HTML document for the preview iframe (full doc passed
  // through verbatim, snippets wrapped with Tailwind CDN + sane reset).
  // Logic shared with the announcement editor and the customer-side
  // modal — see utils/htmlSafety.js.
  const previewSrcDoc = useMemo(
    () => buildPreviewSrcDoc(htmlContent),
    [htmlContent],
  );

  // Re-seed when the restaurant data prop changes (e.g. parent re-derived
  // from the slice cache after a list refetch).
  useEffect(() => {
    const url = readSavedImageUrl(data);
    setHtmlContent(data?.externalPageHTML ?? "");
    setButtonName(data?.externalPageButtonName ?? "");
    if (!imageFile) setImagePreview(url);
    // Don't clobber the user's mid-edit mode choice on every prop tick —
    // only re-pick mode when there's no draft work in progress.
    if (!imageFile && !imageRemoved && htmlContent === savedHtml) {
      setMode(url ? "image" : "html");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Manage ObjectURL lifecycle for the new-file preview.
  useEffect(() => {
    if (!imageFile) return;
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  // Toast on save success/failure.
  useEffect(() => {
    if (success) {
      toast.success(t("externalPage.success"));
      dispatch(resetUpdateRestaurant());
      setImageFile(null);
      setImageRemoved(false);
    }
    if (error) {
      dispatch(resetUpdateRestaurant());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  const handlePickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error(t("externalPage.invalid_image"));
      return;
    }
    const maxMb = import.meta.env.VITE_MAX_FILE_SIZE_MB || 5;
    if (file.size > maxMb * 1024 * 1024) {
      toast.error(t("externalPage.image_too_large", { mb: maxMb }));
      return;
    }
    setCropImgPopup(
      <EditImageFile
        file={file}
        onSave={(cropped) => {
          setImageFile(cropped);
          setImageRemoved(false);
        }}
      />,
    );
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageRemoved(true);
    setImagePreview("");
  };

  const openFullPreview = () => {
    if (!imagePreview) return;
    setPopupContent(<ImageFullPreview src={imagePreview} t={t} />);
  };

  const handleSubmit = () => {
    if (!data?.id) {
      toast.error(t("externalPage.missing_restaurant"));
      return;
    }

    // Button name is the trigger label customers see in the menu — saving
    // a blank name would render an unlabelled button, so require it any
    // time *some* external content is being published. Both modes share
    // this requirement.
    const hasHtml =
      typeof htmlContent === "string" && htmlContent.trim().length > 0;
    const hasImage = !!imagePreview && !imageRemoved;
    const willPublish =
      (mode === "html" && hasHtml) || (mode === "image" && hasImage);
    if (willPublish && !buttonName.trim()) {
      toast.error(t("externalPage.button_name_required"));
      return;
    }

    if (mode === "html") {
      // Empty HTML in HTML mode would publish a button that opens a blank
      // page. Block instead of silently saving the no-op state.
      if (!hasHtml) {
        toast.error(t("externalPage.html_required"));
        return;
      }
      // Reject the same XSS- / SQL-injection-shaped patterns the
      // announcement editor blocks. The customer-side renderer is a
      // separate codebase; defending at the editor stops bad content
      // from being persisted in the first place.
      const dangerous = detectDangerousContent(htmlContent);
      if (dangerous.length > 0) {
        toast.error(
          t("externalPage.dangerous_content_blocked", {
            items: dangerous.join(", "),
          }),
        );
        return;
      }
    }

    const formData = new FormData();
    // Re-send the basic restaurant fields the way editRestaurant.jsx does
    // — UpdateRestaurant is the catch-all endpoint and missing fields
    // historically risk being nulled out.
    formData.append("RestaurantId", data.id);
    formData.append("DealerId", data.dealerId ?? "");
    formData.append("UserId", data.userId ?? "");
    formData.append("Name", data.name ?? "");
    formData.append("PhoneNumber", data.phoneNumber ?? "");
    formData.append("Latitude", data.latitude ?? "");
    formData.append("Longitude", data.longitude ?? "");
    formData.append("City", data.city ?? "");
    formData.append("District", data.district ?? "");
    formData.append("Neighbourhood", data.neighbourhood ?? "");
    formData.append("Address", data.address ?? "");
    formData.append("IsActive", data.isActive ?? true);

    // Always send the button name.
    formData.append("ExternalPageButtonName", buttonName ?? "");

    // Mutual exclusivity: only the active mode's field carries a value;
    // the other goes empty so the backend treats it as null/cleared.
    if (mode === "html") {
      formData.append("ExternalPageHTML", htmlContent ?? "");
      formData.append("ExternalPageImage", "");
    } else {
      formData.append("ExternalPageHTML", "");
      if (imageFile) {
        formData.append("ExternalPageImage", imageFile);
      } else if (imageRemoved || !imagePreview) {
        formData.append("ExternalPageImage", "");
      }
      // If imagePreview is the existing saved URL and no new file picked,
      // we deliberately omit the field so the backend keeps the existing
      // image binary instead of trying to interpret a URL string as a file.
    }

    dispatch(updateRestaurant(formData));
  };

  const labelCls =
    "block text-[11px] font-semibold text-[--gr-1] mb-1 tracking-wide uppercase";

  return (
    <div className="w-full pb-8 mt-1 text-[--black-1]">
      <SettingsTabs />
      <div className="bg-[--white-1] rounded-2xl border border-[--border-1] shadow-sm overflow-hidden">
        <div className="h-0.5" style={{ background: PRIMARY_GRADIENT }} />

        {/* HERO HEADER */}
        <div className="px-4 sm:px-5 py-3 border-b border-[--border-1] flex items-center gap-3">
          <span
            className="grid place-items-center size-9 rounded-xl text-white shadow-md shadow-indigo-500/25 shrink-0"
            style={{ background: PRIMARY_GRADIENT }}
          >
            <Layout className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-base font-semibold text-[--black-1] truncate tracking-tight">
              {t("externalPage.title", { name: data?.name || "" })}
            </h1>
            <p className="text-[11px] text-[--gr-1] truncate mt-0.5">
              {t("externalPage.subtitle")}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-5">
          {/* MODE PICKER */}
          <div>
            <label className={labelCls}>{t("externalPage.mode_label")}</label>
            <div className="inline-flex items-center p-1 rounded-xl border border-[--border-1] bg-[--white-2]/40 gap-1">
              <ModeButton
                active={mode === "html"}
                onClick={() => setMode("html")}
                icon={Code2}
                label={t("externalPage.mode_html")}
              />
              <ModeButton
                active={mode === "image"}
                onClick={() => setMode("image")}
                icon={ImageIcon}
                label={t("externalPage.mode_image")}
              />
            </div>
            <p className="mt-1 text-[11px] text-[--gr-1]">
              {t("externalPage.mode_hint")}
            </p>
          </div>

          {/* BUTTON NAME (always visible) */}
          <div>
            <label className={labelCls}>
              <span className="inline-flex items-center gap-1.5">
                <MousePointerClick className="size-3.5 text-indigo-600" />
                {t("externalPage.button_name_label")}
              </span>
            </label>
            <input
              type="text"
              value={buttonName}
              onChange={(e) => setButtonName(e.target.value)}
              placeholder={t("externalPage.button_name_placeholder")}
              maxLength={40}
              className="w-full h-10 px-3 rounded-lg border border-[--border-1] bg-[--white-1] text-sm text-[--black-1] placeholder:text-[--gr-2] outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
            <p className="mt-1 text-[11px] text-[--gr-1]">
              {t("externalPage.button_name_hint")}
            </p>
          </div>

          {/* MODE-SPECIFIC EDITOR */}
          {mode === "html" ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr,1fr] gap-3">
              {/* HTML EDITOR */}
              <div className="rounded-xl border border-[--border-1] overflow-hidden bg-slate-900 flex flex-col min-h-[28rem] shadow-sm">
                <div className="flex items-center justify-between gap-3 px-3 py-2 border-b border-slate-700/60 bg-slate-800/60">
                  <div className="flex items-center gap-2 text-slate-200 text-[11px] font-bold uppercase tracking-[0.12em]">
                    <Code2 className="size-3.5 text-cyan-400" />
                    {t("externalPage.html_label")}
                  </div>
                </div>
                <CustomTextarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  rows={20}
                  className2="!flex-1 !min-h-0"
                  className="!w-full !flex-1 !p-4 !font-mono !text-xs !bg-slate-900 !text-slate-200 !border-0 !rounded-none focus:!ring-0 !outline-none !resize-none !shadow-none !min-h-[24rem]"
                  placeholder={t("externalPage.html_placeholder")}
                />
              </div>

              {/* HTML LIVE PREVIEW — sandboxed iframe centered inside a
                  fixed-width device frame so authors can confirm their
                  HTML is responsive at both phone and desktop widths.
                  See utils/htmlSafety.js for the sandbox rationale. */}
              <div className="rounded-xl border border-dashed border-[--border-1] bg-[--white-2]/60 flex flex-col min-h-[28rem] shadow-sm overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-[--border-1] bg-[--white-1]/70">
                  <div className="flex items-center gap-2 text-[--gr-1] text-[11px] font-bold uppercase tracking-[0.12em] min-w-0">
                    <Eye className="size-3.5 text-indigo-600 shrink-0" />
                    <span className="truncate">
                      {t("externalPage.live_preview")}
                    </span>
                  </div>
                  {/* Device-width toggle — most external pages are opened
                      on a phone after scanning the QR code, but desktop
                      visits also need to look right. */}
                  <div className="inline-flex items-center rounded-md border border-[--border-1] bg-[--white-1] p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      title={t("externalPage.preview_mobile")}
                      aria-pressed={previewMode === "mobile"}
                      className={`inline-flex items-center gap-1 px-2 h-6 rounded text-[10px] font-semibold uppercase tracking-wider transition ${
                        previewMode === "mobile"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-[--gr-1] hover:bg-[--white-2]"
                      }`}
                    >
                      <Smartphone className="size-3" />
                      <span className="hidden sm:inline">
                        {t("externalPage.preview_mobile")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      title={t("externalPage.preview_desktop")}
                      aria-pressed={previewMode === "desktop"}
                      className={`inline-flex items-center gap-1 px-2 h-6 rounded text-[10px] font-semibold uppercase tracking-wider transition ${
                        previewMode === "desktop"
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "text-[--gr-1] hover:bg-[--white-2]"
                      }`}
                    >
                      <Monitor className="size-3" />
                      <span className="hidden sm:inline">
                        {t("externalPage.preview_desktop")}
                      </span>
                    </button>
                  </div>
                </div>
                <div className="flex-1 relative overflow-auto p-3 grid place-items-start justify-items-center">
                  {htmlContent ? (
                    <div
                      className={`bg-white rounded-2xl shadow-lg border border-[--border-1] overflow-hidden transition-all duration-300 mx-auto w-full ${
                        previewMode === "mobile"
                          ? "max-w-[360px]"
                          : "max-w-[768px]"
                      }`}
                      style={{ height: "min(28rem, 70vh)" }}
                    >
                      <iframe
                        title={t("externalPage.live_preview")}
                        srcDoc={previewSrcDoc}
                        sandbox={PREVIEW_SANDBOX}
                        allow={PREVIEW_ALLOW}
                        className="w-full h-full border-0 bg-white block"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-[--gr-1] italic text-center mt-10 px-4">
                      {t("externalPage.preview_empty")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[--border-1] bg-[--white-2]/40 p-4 flex flex-col sm:flex-row items-start gap-4">
              <div className="size-32 shrink-0 rounded-lg overflow-hidden bg-[--white-1] border border-[--border-1] grid place-items-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="size-8 text-[--gr-2]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[--gr-1] mb-2">
                  {t("externalPage.image_hint")}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[--border-1] bg-[--white-1] text-xs font-semibold text-[--black-2] hover:border-indigo-300 hover:text-indigo-700 cursor-pointer transition">
                    <Upload className="size-3.5" />
                    {imagePreview
                      ? t("externalPage.change_image")
                      : t("externalPage.pick_image")}
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/gif, image/webp"
                      onChange={handlePickImage}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <>
                      <button
                        type="button"
                        onClick={openFullPreview}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[--border-1] bg-[--white-1] text-xs font-semibold text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition"
                      >
                        <Expand className="size-3.5" />
                        {t("externalPage.full_preview")}
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[--border-1] bg-[--white-1] text-xs font-semibold text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="size-3.5" />
                        {t("externalPage.remove_image")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMER-SIDE COMPATIBILITY WARNING — only relevant when the
              author is publishing HTML, since the image mode is just a
              static <img> the customer theme drops in. Mirrors the
              identical banner in announcementSettings.jsx so authors get
              a consistent reminder that fancy markup (full HTML docs,
              <script>, embedded YouTube) requires the customer-side
              renderer to use the same iframe sandbox approach. */}
          {mode === "html" && (
            <div className="rounded-xl bg-amber-50/70 border border-amber-200 p-3 flex items-start gap-3 dark:bg-amber-500/10 dark:border-amber-400/30">
              <span className="grid place-items-center size-8 rounded-lg bg-[--white-1] text-amber-600 ring-1 ring-amber-200 shrink-0 dark:bg-amber-500/15 dark:ring-amber-400/40">
                <AlertTriangle className="size-4" />
              </span>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {t("externalPage.customer_compat_title")}
                </h4>
                <p className="text-[11px] text-amber-800/90 leading-relaxed mt-0.5 dark:text-amber-100/85">
                  {t("externalPage.customer_compat_text")}
                </p>
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <div className="flex justify-end pt-3 border-t border-[--border-1]">
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 active:brightness-95"
              style={{ background: PRIMARY_GRADIENT }}
            >
              <Save className="size-4" />
              {t("externalPage.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModeButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition ${
      active
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
        : "text-[--gr-1] hover:text-[--black-1] hover:bg-[--white-1]"
    }`}
  >
    <Icon className="size-3.5" />
    {label}
  </button>
);

// Full-page image preview popup. Image is meant to be a long menu graphic,
// so we let it scroll inside a near-full-viewport container at natural width.
const ImageFullPreview = ({ src, t }) => {
  const { setPopupContent } = usePopup();
  return (
    <div className="bg-[--white-1] text-[--black-1] rounded-2xl w-full max-w-5xl mx-auto shadow-2xl ring-1 ring-[--border-1] overflow-hidden flex flex-col max-h-[92dvh]">
      <div className="h-0.5 shrink-0" style={{ background: PRIMARY_GRADIENT }} />
      <header className="px-4 sm:px-5 py-3 border-b border-[--border-1] flex items-center gap-3 shrink-0">
        <span
          className="grid place-items-center size-9 rounded-xl text-white shadow-md shadow-indigo-500/25 shrink-0"
          style={{ background: PRIMARY_GRADIENT }}
        >
          <ImageIcon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm sm:text-base font-bold tracking-tight truncate">
            {t("externalPage.full_preview_title")}
          </h2>
          <p className="text-[11px] text-[--gr-1] truncate mt-0.5">
            {t("externalPage.full_preview_subtitle")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPopupContent(null)}
          aria-label={t("externalPage.close")}
          className="grid place-items-center size-8 rounded-md text-[--gr-1] hover:text-[--black-1] hover:bg-[--white-2] transition shrink-0"
        >
          <X className="size-4" />
        </button>
      </header>
      <div className="flex-1 min-h-0 overflow-auto bg-[--white-2]/40 grid place-items-start justify-items-center p-4">
        <img
          src={src}
          alt=""
          className="max-w-full h-auto rounded-lg shadow-md ring-1 ring-[--border-1]"
        />
      </div>
    </div>
  );
};

export default ExternalPage;

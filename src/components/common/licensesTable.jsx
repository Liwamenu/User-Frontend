import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Sparkles,
  Store,
  User,
} from "lucide-react";
import { formatDateString, getRemainingDays } from "../../utils/utils";
import { getLicenseTypeLabel } from "../../enums/licenseTypeEnums";
import EditLicenseIsActive from "../licenses/actions/updateLicenseIsActive";

const PRIMARY_GRADIENT =
  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)";

const LicensesTable = ({ inData, onSuccess }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
      {inData.map((data) => (
        <LicenseCard key={data.id} data={data} onSuccess={onSuccess} />
      ))}
    </div>
  );
};

export default LicensesTable;

const LicenseCard = ({ data, onSuccess }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const daysLeft = getRemainingDays(data.endDateTime);
  const expired = daysLeft <= 0;
  const totalDays = 365;
  const progressPercent = expired
    ? 100
    : Math.min(100, Math.max(0, ((totalDays - daysLeft) / totalDays) * 100));

  // Color tone based on remaining time
  const tone = expired
    ? {
        bar: "from-rose-500 to-red-600",
        hero: "text-rose-600",
        glow: "shadow-rose-500/10 group-hover:shadow-rose-500/20",
      }
    : daysLeft <= 7
      ? {
          bar: "from-amber-500 to-rose-500",
          hero: "text-amber-600",
          glow: "shadow-amber-500/10 group-hover:shadow-amber-500/20",
        }
      : daysLeft <= 30
        ? {
            bar: "from-yellow-400 to-amber-500",
            hero: "text-amber-600",
            glow: "shadow-yellow-500/10 group-hover:shadow-yellow-500/20",
          }
        : {
            bar: "from-indigo-500 via-violet-500 to-cyan-500",
            hero: "text-[--black-1]",
            glow: "shadow-indigo-500/5 group-hover:shadow-indigo-500/15",
          };

  const handleExtend = (e) => {
    e.stopPropagation();
    const { user, restaurant } = location.state || {};
    navigate(`${location.pathname}/extend-license`, {
      state: { user, restaurant, currentLicense: data },
    });
  };

  return (
    <article
      className={`group relative flex flex-col bg-[--white-1] border border-[--border-1] rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:border-[--primary-1]/30 ${tone.glow}`}
    >
      {/* Top gradient accent bar */}
      <div
        className={`h-1 shrink-0 bg-gradient-to-r ${tone.bar}`}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-4 pt-4 pb-3">
        <div className="flex-1 min-w-0">
          <h3 className="flex items-start gap-1.5 text-base font-bold text-[--black-1] leading-tight">
            <Store className="size-4 mt-0.5 text-[--gr-1] shrink-0" />
            <span className="truncate">{data.restaurantName || "—"}</span>
          </h3>
          <span className="mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 bg-[--primary-1]/10 text-[--primary-1] ring-[--primary-1]/20">
            <Sparkles className="size-2.5" strokeWidth={3} />
            {getLicenseTypeLabel(data.licensePackageType) || "—"}
          </span>
          {data.userName && (
            <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[--gr-1]">
              <User className="size-3 shrink-0" />
              <span className="truncate">{data.userName}</span>
            </p>
          )}
        </div>

        <div className="shrink-0">
          <EditLicenseIsActive licenseData={data} onSuccess={onSuccess} />
        </div>
      </div>

      {/* Hero stat */}
      <div className="px-4 pb-3">
        <div className="rounded-xl bg-[--white-2] border border-[--border-1] py-3 px-3 text-center">
          {expired ? (
            <>
              <div className="flex items-center justify-center gap-1.5">
                <AlertTriangle
                  className={`size-6 ${tone.hero}`}
                  strokeWidth={2.5}
                />
                <span
                  className={`text-2xl font-black ${tone.hero} leading-none tabular-nums`}
                >
                  !
                </span>
              </div>
              <p
                className={`mt-2 text-[11px] font-bold uppercase tracking-wider ${tone.hero}`}
              >
                {t("licenses.expired_label")}
              </p>
            </>
          ) : (
            <>
              <p
                className={`text-3xl font-black leading-none tabular-nums ${tone.hero}`}
              >
                {daysLeft}
              </p>
              <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[--gr-1]">
                {t("licenses.days_left_label")}
              </p>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full bg-[--white-2] overflow-hidden ring-1 ring-[--border-1]">
          <div
            className={`h-full bg-gradient-to-r ${tone.bar} rounded-full transition-all`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* End date */}
      <div className="px-4 py-3 border-t border-[--border-1] flex items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-1.5 text-[--gr-1]">
          <CalendarDays className="size-3.5" />
          {t("licenses.col_end_date")}
        </span>
        <span
          className={`font-semibold tabular-nums ${
            expired ? "text-rose-600" : "text-[--black-1]"
          }`}
        >
          {formatDateString({ dateString: data.endDateTime })}
        </span>
      </div>

      {/* Extend CTA */}
      <div className="mt-auto px-4 pb-4">
        <button
          type="button"
          onClick={handleExtend}
          className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-xl text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/30 hover:brightness-110 active:brightness-95"
          style={{ background: PRIMARY_GRADIENT }}
        >
          <Sparkles className="size-3.5" />
          {t("licenses.extend")}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </article>
  );
};

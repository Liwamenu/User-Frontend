//MODULES
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";

//FUNC
import { getAuth } from "../../redux/api";

function UserProfile({ setOpenSidebar }) {
  const { t } = useTranslation();
  const location = useLocation();
  const isActive = location.pathname.startsWith("/profile");

  const user = getAuth()?.user;
  const isAdmin = user?.role == 0;

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      to="/profile"
      onClick={() => setOpenSidebar(false)}
      className={`flex items-center gap-3 px-4 py-3 border-t border-[--border-1] transition group ${
        isActive
          ? "bg-[--primary-1]/10"
          : "hover:bg-[--white-2]"
      }`}
    >
      <span
        className="grid place-items-center size-10 rounded-full bg-[--primary-1]/10 text-[--primary-1] font-semibold text-sm shrink-0 ring-1 ring-[--primary-1]/20"
        aria-hidden="true"
      >
        {initials}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-[--black-1] truncate">
          {user?.fullName || t("userProfile.default_name")}
        </p>
        <p className="text-[11px] text-[--gr-1]">
          {isAdmin ? t("userProfile.admin") : t("userProfile.user")}
        </p>
      </div>
      <ChevronRight
        className={`size-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
          isActive ? "text-[--primary-1]" : "text-[--gr-1]"
        }`}
      />
    </Link>
  );
}

export default UserProfile;

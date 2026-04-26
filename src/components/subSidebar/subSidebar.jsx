//MODULES
import toast from "react-hot-toast";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Lock,
  ArrowLeft,
  PenLine,
  Settings,
  CalendarClock,
  Megaphone,
  ClipboardList,
  Clock,
  Share2,
  CreditCard,
  LayoutGrid,
  LayoutList,
  BookOpen,
  Tag,
  Package,
  Palette,
  Tv,
  QrCode,
} from "lucide-react";

//COMP
import UserProfile from "./userProfile";
import { usePopup } from "../../context/PopupContext";

const ALWAYS_ALLOWED_PATHS = new Set(["restaurants", "edit", "settings"]);

function Sidebar({ openSidebar, setOpenSidebar }) {
  const { t } = useTranslation();
  const param = useParams();
  const sidebarRef = useRef();
  const id = param["*"].split("/")[1];
  const { popupContent, contentRef, setContentRef } = usePopup();

  // Onboarding guard: if tenant isn't saved yet, lock advanced navigation.
  const restaurantsList = useSelector(
    (s) => s.restaurants.getRestaurants?.restaurants?.data,
  );
  const fetchedRestaurant = useSelector(
    (s) => s.restaurants.getRestaurant?.restaurant,
  );
  const currentRestaurant =
    fetchedRestaurant?.id === id
      ? fetchedRestaurant
      : restaurantsList?.find?.((r) => r.id === id);
  const isTenantLocked = !currentRestaurant?.tenant;
  const ICON_CLS = "size-[18px]";
  const ICON_STROKE = 2;
  const sidebarItems = [
    {
      icon: <ArrowLeft className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.back"),
      to: "/restaurants",
      path: "restaurants",
    },
    {
      icon: <PenLine className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.edit_restaurant"),
      to: `/restaurant/edit/${id}`,
      path: "edit",
    },
    {
      icon: <Settings className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.settings"),
      to: `/restaurant/settings/${id}`,
      path: "settings",
    },
    {
      icon: <CalendarClock className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.reservation_settings"),
      to: `/restaurant/reservationSettings/${id}`,
      path: "reservationSettings",
    },
    {
      icon: <Megaphone className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.announcement_settings"),
      to: `/restaurant/announcementSettings/${id}`,
      path: "announcementSettings",
    },
    {
      icon: <ClipboardList className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.survey_settings"),
      to: `/restaurant/surveySettings/${id}`,
      path: "surveySettings",
    },
    {
      icon: <Clock className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.working_hours"),
      to: `/restaurant/hours/${id}`,
      path: "hours",
    },
    {
      icon: <Share2 className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.social_media"),
      to: `/restaurant/social/${id}`,
      path: "social",
    },
    {
      icon: <CreditCard className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.payment_methods"),
      to: `/restaurant/payments/${id}`,
      path: "payments",
    },
    {
      icon: <LayoutGrid className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.categories"),
      to: `/restaurant/categories/${id}/list`,
      path: "categories",
    },
    {
      icon: <LayoutList className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.sub_categories"),
      to: `/restaurant/sub_categories/${id}/list`,
      path: "sub_categories",
    },
    {
      icon: <BookOpen className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.menus"),
      to: `/restaurant/menus/${id}/list`,
      path: "menus",
    },
    {
      icon: <Tag className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.tags"),
      to: `/restaurant/tags/${id}/`,
      path: "tags",
    },
    {
      icon: <Package className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.products"),
      to: `/restaurant/products/${id}`,
      path: "products",
    },
    {
      icon: <Palette className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.qrthemes"),
      to: `/restaurant/qrthemes/${id}`,
      path: "qrthemes",
    },
    {
      icon: <Tv className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.tvthemes"),
      to: `/restaurant/tvthemes/${id}`,
      path: "tvthemes",
    },
    {
      icon: <QrCode className={ICON_CLS} strokeWidth={ICON_STROKE} />,
      text: t("subSidebar.qr_code"),
      to: `/restaurant/qr/${id}`,
      path: "qr",
    },
  ];

  const route = Object.values(param)[0].split("/")[0];
  const path = route.length > 1 ? route : "edit";

  useEffect(() => {
    if (sidebarRef) {
      const refs = contentRef.filter((ref) => ref.id !== "sidebar");
      setContentRef([
        ...refs,
        {
          id: "sidebar",
          outRef: null,
          ref: sidebarRef,
          callback: () => setOpenSidebar(false),
        },
      ]);
    }
  }, [sidebarRef, openSidebar]);

  return (
    <nav
      className={`fixed -left-[280px] lg:left-0 top-0 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-2xl w-[280px] transition-all ${
        !popupContent && "z-[999]"
      } ${openSidebar && "left-[0]"}`}
      ref={sidebarRef}
    >
      <div className="flex flex-col w-full relative">
        <header className="flex items-center justify-center px-6 h-16 w-full">
          <Link
            to="/"
            className="font-[conthrax] text-2xl tracking-wide bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent hover:from-indigo-500 hover:to-cyan-400 transition-all"
            style={{ animation: "sidebar-logo-in 500ms ease-out both" }}
          >
            Liwamenu
          </Link>
        </header>

        <div className="flex flex-col justify-top w-full py-16 h-[100dvh] -mt-16">
          <div className="flex flex-col gap-0.5 px-3 pb-4 w-full overflow-y-auto">
            {sidebarItems.map((item, index) => {
              const active = path === item.path;
              const locked =
                isTenantLocked && !ALWAYS_ALLOWED_PATHS.has(item.path);
              return (
                <Link
                  to={locked ? "#" : item.to}
                  key={index}
                  onClick={(e) => {
                    if (locked) {
                      e.preventDefault();
                      toast.error(t("subSidebar.tenant_locked"), {
                        id: "tenant-locked",
                      });
                      return;
                    }
                    setOpenSidebar(!openSidebar);
                  }}
                  aria-disabled={locked}
                  style={{
                    animation: `sidebar-item-in 320ms ease-out ${index * 25}ms both`,
                  }}
                >
                  <div
                    className={`group relative flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 will-change-transform ${
                      locked
                        ? "cursor-not-allowed text-slate-300"
                        : active
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 hover:translate-x-0.5 cursor-pointer"
                    }`}
                  >
                    {active && !locked && (
                      <span
                        className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-full bg-gradient-to-b from-indigo-500 via-indigo-600 to-cyan-500 origin-center"
                        style={{
                          animation: "sidebar-accent-in 220ms ease-out both",
                        }}
                      />
                    )}
                    <span
                      className={`flex items-center justify-center shrink-0 transition-all duration-200 ${
                        locked
                          ? "text-slate-300"
                          : active
                            ? "text-indigo-600 scale-110"
                            : "text-slate-400 group-hover:text-indigo-600 group-hover:scale-110"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate flex-1 leading-none">
                      {item.text}
                    </span>
                    {locked && (
                      <Lock className="size-3 text-slate-300 shrink-0" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <UserProfile setOpenSidebar={setOpenSidebar} />
    </nav>
  );
}

export default Sidebar;

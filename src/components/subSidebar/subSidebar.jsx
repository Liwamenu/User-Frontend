//MODULES
import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

//ASSETS
import UserProfile from "./userProfile";
import logo from "../../assets/img/logo.png";

// ICONS
import {
  GobackI,
  EditI,
  TemplatesI,
  QRI,
  BellI,
  LicenseI,
  DebitI,
  WaitI,
  SettingsI,
  Bars4SubI,
  ListI,
} from "../../assets/icon/index";

//COMP
import { usePopup } from "../../context/PopupContext";
import Bars4I from "../../assets/icon/bars4";

function Sidebar({ openSidebar, setOpenSidebar }) {
  const param = useParams();
  const sidebarRef = useRef();
  const id = param["*"].split("/")[1];
  const { showPopup, contentRef, setContentRef } = usePopup();
  const sidebarItems = [
    {
      icon: <GobackI />,
      text: "Geri Dön",
      to: "/restaurants",
      path: "restaurants",
    },
    {
      icon: <EditI className="size-[1.3rem]" strokeWidth={2} />,
      text: "Restoranı Düzenle",
      to: `/restaurant/edit/${id}`,
      path: "edit",
    },
    {
      icon: <SettingsI className="size-[1.3rem]" strokeWidth={2} />,
      text: "Ayarlar",
      to: `/restaurant/settings/${id}`,
      path: "settings",
    },
    {
      icon: <WaitI />,
      text: "Çalışma Saatleri",
      to: `/restaurant/hours/${id}`,
      path: "hours",
    },
    {
      icon: <BellI />,
      text: "Sosyal Medya",
      to: `/restaurant/social/${id}`,
      path: "social",
    },
    {
      icon: <DebitI />,
      text: "Ödeme Yontemler",
      to: `/restaurant/payments/${id}`,
      path: "payments",
    },
    {
      icon: <Bars4I />,
      text: "Katagoriler",
      to: `/restaurant/categories/${id}/list`,
      path: "categories",
    },
    {
      icon: <Bars4SubI />,
      text: "Alt Katagoriler",
      to: `/restaurant/sub_categories/${id}/edit`,
      path: "sub_categories",
    },
    {
      icon: <LicenseI />,
      text: "Etiketler",
      to: `/restaurant/tags/${id}/edit`,
      path: "tags",
    },
    {
      icon: <ListI />,
      text: "Ürünler",
      to: `/restaurant/products/${id}`,
      path: "products",
    },
    {
      icon: <TemplatesI />,
      text: "Temalar",
      to: `/restaurant/themes/${id}`,
      path: "themes",
    },
    {
      icon: <QRI />,
      text: "QR Kod",
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
      className={`fixed -left-[280px] lg:left-0 top-0 flex flex-col justify-between bg-[--white-1] border-r shadow-2xl border-[--border-1] w-[280px] transition-all ${
        !showPopup && "z-[999]"
      } ${openSidebar && "left-[0]"}`}
      ref={sidebarRef}
    >
      <div className="flex flex-col w-full relative">
        <header className="flex items-center justify-center px-6 h-16 w-full text-xl font-[500] leading-7 text-[--black-2]">
          <Link to="/" className="flex gap-1 w-max mr-6">
            {/* <img
              loading="lazy"
              src={logo}
              alt=""
              className="shrink-0 w-7 aspect-square"
            /> */}
            <p className="whitespace-nowrap">Liwamenu</p>
          </Link>
        </header>

        <div className="flex flex-col justify-top w-full py-16 h-[100dvh] -mt-16">
          <div className="flex flex-col gap-1 px-6 pb-4 w-full overflow-y-auto">
            {sidebarItems.map((item, index) => (
              <Link to={item.to} key={index}>
                <div
                  onClick={() => {
                    setOpenSidebar(!openSidebar);
                  }}
                  className={`flex flex-col justify-center px-4 py-2 rounded-[99px] text-sm text-[--gr-1] cursor-pointer sidebar-item hover:bg-[--light-1] hover:text-[--primary-1] transition-colors ${
                    path === item.path && "bg-[--light-1] text-[--primary-1]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center p-1">
                      {item.icon}
                    </div>
                    <div>{item.text}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <UserProfile setOpenSidebar={setOpenSidebar} />
    </nav>
  );
}

export default Sidebar;

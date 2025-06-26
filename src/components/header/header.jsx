//MODULES
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import { usePopup } from "../../context/PopupContext";
import { getTheme, setTheme } from "../../utils/localStorage";
import { SettingsI, MenuI, SunI, MoonI } from "../../assets/icon";

//REDUX
import { getAuth, clearAuth } from "../../redux/api";
import { logout, resetLogoutState } from "../../redux/auth/logoutSlice";

function Header({ openSidebar, setOpenSidebar }) {
  const toastId = useRef();
  const param = useParams();
  const dispatch = useDispatch();
  const headerSettingsRef = useRef();

  const { loading, success, error } = useSelector((state) => state.auth.logout);

  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    const userSessionId = getAuth().sessionId;
    setOpen(!open);
    dispatch(logout({ userSessionId }));
  };

  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("Çıkış Yapılıyor...");
    }
    if (success) {
      clearAuth();
      window.location.href = "/login";
      dispatch({ type: "LOGOUT" });
      dispatch(resetLogoutState());
      toast.dismiss(toastId.current);
    }
    if (error) {
      clearAuth();
      window.location.href = "/login";
      dispatch(resetLogoutState());
    }
  }, [success, loading, error]);

  const { contentRef, setContentRef } = usePopup();

  useEffect(() => {
    if (headerSettingsRef) {
      const refs = contentRef.filter((ref) => ref.id !== "headerSettings");
      setContentRef([
        ...refs,
        {
          id: "headerSettings",
          outRef: null,
          ref: headerSettingsRef,
          callback: () => setOpen(false),
        },
      ]);
    }
  }, [headerSettingsRef, open]);

  return (
    <>
      <header className="fixed top-0 right-0 left-0 flex flex-col justify-center bg-[--white-1] z-[99]">
        <nav className="w-full h-16 flex justify-between items-center py-3.5 max-md:px-5 px-[4%] border-b border-[--border-1]">
          <div
            className="text-[--gr-1] cursor-pointer"
            onClick={() => setOpenSidebar(!openSidebar)}
          >
            <MenuI
              className={`${param["*"] === "orders" ? "" : "lg:hidden"}`}
            />
          </div>

          <p className="flex items-center text-3xl max-sm:text-xl text-[--primary-1] font-[conthrax]">
            Pentegrasyon
          </p>

          <div className="flex gap-4 max-sm:gap-2">
            <button
              onClick={() => setTheme(getTheme() == "light" ? "dark" : "light")}
              className="flex justify-center items-center w-10 h-10 bg-[--light-1] text-[--primary-1] rounded-3xl"
            >
              {getTheme() == "light" ? <SunI /> : <MoonI />}
            </button>

            <div
              className="flex justify-center items-center relative"
              ref={headerSettingsRef}
            >
              <div
                className="flex justify-center items-center p-[.5rem] w-10 h-10 bg-[--light-1] text-[--primary-1] rounded-3xl cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <SettingsI strokeWidth={1.5} className="size-7 text-[--gr-1]" />
              </div>

              <div
                className={`absolute top-[3rem] right-2 bg-[--white-1] text-[--gr-1] border border-solid border-[--border-1] font-sans rounded-md transition-colors ${
                  !open && "invisible"
                }`}
              >
                <ul>
                  <Link to="/profile">
                    <li
                      className="px-6 py-2 pr-16 text-sm hover:bg-[--light-3] border-b border-solid border-[--light-3] cursor-pointer"
                      onClick={() => setOpen(!open)}
                    >
                      Profile
                    </li>
                  </Link>
                  <li
                    className="px-6 py-2 pr-16 text-sm hover:bg-[--light-3] cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}

export default Header;

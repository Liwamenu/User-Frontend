//MODULES
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//COMP
import { UserI } from "../../assets/icon";
import ArrowIR from "../../assets/icon/arrowR";

//FUNC
import { getAuth } from "../../redux/api";

function UserProfile({ setOpenSidebar }) {
  const { t } = useTranslation();
  const param = useParams();

  const user = getAuth()?.user;
  const isAdmin = user?.role == 0;

  return (
    <main className="relative w-full">
      <Link to="/profile" className="absolute bottom-0 left-0 right-0">
        <div
          className={`flex items-center gap-3 px-6 py-3 font-normal whitespace-nowrap border-t text-[--gr-1] border-[--light-3] hover:bg-[--light-1] hover:text-[--primary-1] cursor-pointer group ${
            param["*"] === "profile" && "bg-[--light-1] text-[--primary-1]"
          }`}
          onClick={() => setOpenSidebar(false)}
        >
          <div className="flex flex-1 gap-3">
            <div className="flex justify-center items-center">
              <UserI className="size-9" />
            </div>
            <div className="flex flex-col flex-1">
              <div className="text-sm leading-5 text-[--black-2]">
                {user?.fullName || t("userProfile.default_name")}
              </div>
              <div className="text-xs leading-5">
                {isAdmin ? t("userProfile.admin") : t("userProfile.user")}
              </div>
            </div>
          </div>
          <div className="">
            <ArrowIR className="font-bold group-hover:translate-x-2 transition-transform duration-300 ease-in-out" />
          </div>
        </div>
      </Link>
    </main>
  );
}

export default UserProfile;

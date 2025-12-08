//MOD
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next"; // <-- Add this

//COMP
import EditUserProfile from "./pages/editUserProfile";
// import EditUserInvoice from "./pages/editUserInvoice";
import EditUserPassword from "./pages/editUserPassword";

//UTILS

//REDUX
import { getAuth } from "../../redux/api";
import { getCities } from "../../redux/data/getCitiesSlice";
// import { getUser, resetGetUserState } from "../../redux/user/getUserSlice";

const ProfilePage = () => {
  const { t } = useTranslation(); // <-- Add this
  const dispatch = useDispatch();

  const { cities } = useSelector((state) => state.data.getCities);
  // const { user, success } = useSelector((state) => state.user.getUser);
  // const { success: addSuccess } = useSelector((state) => state.user.addInvoice);
  // const { success: updateSuccess } = useSelector(
  //   (state) => state.user.updateInvoice
  // );

  const [selected, setSelected] = useState(0);
  const [userData, setUserData] = useState(/* user */ getAuth()?.user);

  //VAR
  const tabs = [
    t("profilePage.edit_profile"),
    t("profilePage.security"),
    /* t("profilePage.invoice_info") */
  ];

  // // GET THE USER
  // useEffect(() => {
  //   if (!userData) {
  //     dispatch(getUser());
  //   }
  // }, [userData]);

  // GET CITIES
  useEffect(() => {
    if (!cities) {
      dispatch(getCities());
    }
  }, [cities]);

  // //SET USER AND INVOICE
  // useEffect(() => {
  //   if (success) {
  //     setUserData(user);
  //     dispatch(resetGetUserState());
  //   }
  // }, [user, success]);

  // //RESET USER
  // useEffect(() => {
  //   if (addSuccess || updateSuccess) setUserData(null);
  // }, [addSuccess || updateSuccess]);

  return (
    <section className="lg:ml-[280px] pt-16 sm:pt-16 px-[4%] pb-4 grid grid-cols-1 section_row">
      <div className="w-full text-[--black-2] py-4 text-2xl font-bold">
        <h2>{t("profilePage.title")}</h2>
      </div>

      <nav className="flex flex-col items-start mt-5 w-full border-b border-[--border-1] max-w-[1050px]">
        <div className="flex flex-col w-max">
          <ul className="w-full flex gap-10 max-sm:gap-4 items-center px-4 text-base text-slate-500">
            {tabs.map((tab, index) => (
              <li
                key={index}
                className={`cursor-pointer w-32 ${
                  selected === index ? "text-[--primary-1]" : ""
                }`}
                onClick={() => setSelected(index)}
              >
                {tab}
              </li>
            ))}
          </ul>

          <div className="flex mt-2 w-full">
            <div
              className={`bg-[--primary-1] rounded-t-xl h-[3px] w-[8.6rem] transition-transform duration-500 ease-in-out ${
                selected === 1 && "translate-x-[8.5rem] sm:translate-x-[9.5rem]"
              } ${
                selected === 2 &&
                "translate-x-[17.7rem] sm:translate-x-[20.7rem] w-[7rem]"
              }`}
            />
          </div>
        </div>
      </nav>

      {
        selected === 0 ? (
          <EditUserProfile user={userData} cities={cities} />
        ) : selected === 1 ? (
          <EditUserPassword user={userData} cities={cities} />
        ) : null /* (selected === 2 && <EditUserInvoice user={userData} />) */
      }
    </section>
  );
};

export default ProfilePage;

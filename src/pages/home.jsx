//MODULES
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//COMP
import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";

//PAGES
import NotFound from "./404";
import TestPage from "./test";
import Profile from "./profile";
import Licenses from "./licenses";
import Restourants from "./restourants";
import RestaurantHome from "./restaurantHome";
// import DashboardPage from "./dashboard";
// import Messages from "./messages";
// import Templates from "./templates";
// import Accounts from "./accounts";
// import Payments from "./payments";
// import MailWaiters from "./mailWaiters";
// import Roles from "./roles";
// import Managers from "./managers";
// import TempUsers from "./tempUsers";

const Home = () => {
  const [showS1, setShowS1] = useState(true);
  const [openS1, setOpenS1] = useState(false);
  const [openS2, setOpenS2] = useState(false);
  return (
    <section className="bg-[--white-1]">
      <Header
        openSidebar={showS1 ? openS1 : openS2}
        setOpenSidebar={showS1 ? setOpenS1 : setOpenS2}
      />
      {showS1 && <Sidebar openSidebar={openS1} setOpenSidebar={setOpenS1} />}
      <Routes>
        <Route
          path="/restaurant/*"
          element={
            <RestaurantHome
              showS1={showS1}
              setShowS1={setShowS1}
              openSidebar={openS2}
              setOpenSidebar={setOpenS2}
            />
          }
        />
        <Route path="/restaurants/*" element={<Restourants />} />
        <Route path="/licenses/*" element={<Licenses />} />
        <Route path="/profile/*" element={<Profile />} />
        {/*
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/temp-users/*" element={<TempUsers />} />
        <Route path="/accounts/*" element={<Accounts />} />
        <Route path="/parameters/*" element={<Parameters />} />
        <Route path="/messages/*" element={<Messages />} />
        */}
        <Route path="/test" element={<TestPage />} />
        <Route path="/*" element={<Restourants />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </section>
  );
};

export default Home;

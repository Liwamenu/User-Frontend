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
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <section className="bg-[--white-1]">
      <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      <Routes>
        <Route path="/restaurants/*" element={<Restourants />} />
        <Route path="/licenses/*" element={<Licenses />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/*" element={<Restourants />} />
        {/*
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/temp-users/*" element={<TempUsers />} />
        <Route path="/accounts/*" element={<Accounts />} />
        <Route path="/parameters/*" element={<Parameters />} />
        <Route path="/messages/*" element={<Messages />} />
        */}
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </section>
  );
};

export default Home;

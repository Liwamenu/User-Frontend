//MODULES
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//COMP
import Header from "../components/header/header";
import Sidebar from "../components/sidebar/sidebar";

//PAGES
import NotFound from "./404";
import TestPage from "./test";
import Users from "./users";
// import DashboardPage from "./dashboard";
import Restourants from "./restourants";
import Licenses from "./licenses";
// import Parameters from "./parameters";
// import LicensePackages from "./licensePackages";
// import Profile from "./profile";
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
        <Route path="/users/*" element={<Users />} />
        <Route path="/restaurants/*" element={<Restourants />} />
        <Route path="/licenses/*" element={<Licenses />} />
        {/*
        <Route path="/*" element={<DashboardPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/temp-users/*" element={<TempUsers />} />
        <Route path="/accounts/*" element={<Accounts />} />
        <Route path="/license-packages/*" element={<LicensePackages />} />
        <Route path="/parameters/*" element={<Parameters />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/payments/*" element={<Payments />} />
        <Route path="/messages/*" element={<Messages />} />
        <Route path="/templates/*" element={<Templates />} />
        <Route path="/ys-mail-waiters" element={<MailWaiters />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/managers" element={<Managers />} />
        */}
        <Route path="/test" element={<TestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </section>
  );
};

export default Home;

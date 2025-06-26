//MODULES
import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

//COMP
import Header from "../components/header/header";
// import Sidebar from "../components/sidebar/sidebar";

//PAGES
// import Test from "./test";
import NotFound from "./404";
// import Orders from "./orders";
// import Profile from "./profile";
// import Messages from "./messages";
// import Payments from "./payments";
// import Couriers from "./couriers";
// import Licenses from "./licenses";
// import Dashboard from "./dashboard";
// import Restourants from "./restourants";
// import ProtectedPages from "./protectedPages";
// import CourierStatusChange from "../components/couriers/components/courierStatusChange";

const Home = () => {
  const [openSidebar, setOpenSidebar] = useState(false);
  return (
    <section className="bg-[--white-1]">
      <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      {/*<Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} /> */}
      {/* <Routes>
        <Route path="/*" element={<Navigate to="/orders" />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/restaurants/*" element={<Restourants />} />
        <Route path="/licenses/*" element={<Licenses />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/orders/*" element={<Orders />} />
        <Route path="/couriers/*" element={<Couriers />} />
        <Route path="/locked-pages/*" element={<ProtectedPages />} />
        <Route path="/payments/*" element={<Payments />} />
        <Route path="/messages/*" element={<Messages />} />
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes> */}
    </section>
  );
};

export default Home;

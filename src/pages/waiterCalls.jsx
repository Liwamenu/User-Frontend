import { Route, Routes } from "react-router-dom";

import NotFound from "./404";
import WaiterCallsPage from "../components/waiterCalls/pages/waiterCalls";

const WaiterCalls = () => {
  return (
    <Routes>
      <Route path="/" element={<WaiterCallsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default WaiterCalls;

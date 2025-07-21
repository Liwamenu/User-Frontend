import { Route, Routes } from "react-router-dom";
import NotFound from "./404";
import LicensesPage from "../components/licenses/pages/licensesPage";
import ExtendLicensePage from "../components/licenses/pages/extendLicensePage";
import AddLicensePage from "../components/licenses/pages/addLicensePage";

const Licenses = () => {
  return (
    <Routes>
      <Route path="/" element={<LicensesPage />} />
      <Route path="/extend-license" element={<ExtendLicensePage />} />
      <Route path="/add-license" element={<AddLicensePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Licenses;

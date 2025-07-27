import { Route, Routes } from "react-router-dom";
import NotFound from "./404";
import LicensePackagesPage from "../components/licensePackages/pages/licensePackagesPage";

const LicensePackages = () => {
  return (
    <Routes>
      <Route path="/" element={<LicensePackagesPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default LicensePackages;

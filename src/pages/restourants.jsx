//MODULES
import { Route, Routes } from "react-router-dom";

//COMP
import NotFound from "./404";
import AddLicensePage from "../components/licenses/pages/addLicensePage";
import RestaurantsPage from "../components/restaurants/pages/restaurantsPage";
import ExtendLicensePage from "../components/licenses/pages/extendLicensePage";

const Restaurants = () => {
  const addLicense = "licenses/:id/add-license";
  const licenseExtend = "licenses/:id/extend-license";

  return (
    <Routes>
      <Route path="/" element={<RestaurantsPage />} />
      <Route path={licenseExtend} element={<ExtendLicensePage />} />
      <Route path={addLicense} element={<AddLicensePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Restaurants;

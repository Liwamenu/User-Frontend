import { Route, Routes } from "react-router-dom";
import NotFound from "./404";
import RestaurantsPage from "../components/restaurants/pages/restaurantsPage";
import RestaurantLicensesPage from "../components/restaurants/pages/restaurantLicensesPage";
import ExtendLicensePage from "../components/licenses/pages/extendLicensePage";
import AddLicensePage from "../components/licenses/pages/addLicensePage";

const Restaurants = () => {
  const addLicense = "licenses/:id/add-license";
  const licenseExtend = "licenses/:id/extend-license";

  return (
    <Routes>
      <Route path="/" element={<RestaurantsPage />} />
      <Route path="/licenses/:id" element={<RestaurantLicensesPage />} />
      <Route path={licenseExtend} element={<ExtendLicensePage />} />
      <Route path={addLicense} element={<AddLicensePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Restaurants;

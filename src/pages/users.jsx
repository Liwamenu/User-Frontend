import { Route, Routes } from "react-router-dom";
import UsersPage from "../components/users/pages/usersPage";
import NotFound from "./404";
import UserRestaurants from "../components/restaurants/pages/userRestaurantsPage";
import UserLicensesPage from "../components/users/pages/userLicensesPage";
import RestaurantLicensesPage from "../components/restaurants/pages/restaurantLicensesPage";
import ExtendLicensePage from "../components/licenses/pages/extendLicensePage";
import AddLicensePage from "../components/licenses/pages/addLicensePage";

const Users = () => {
  const addLicense = "licenses/:id/add-license";
  const licenseExtend = "licenses/:id/extend-license";
  const restaurantLicense = "restaurants/licenses/:id";
  const restaurantAdd = "restaurants/licenses/:id/add-license";
  const restaurantExtend = "restaurants/licenses/:id/extend-license";
  return (
    <Routes>
      <Route path="/" element={<UsersPage />} />
      <Route path="restaurants/:id" element={<UserRestaurants />} />
      <Route path="licenses/:id" element={<UserLicensesPage />} />
      <Route path={licenseExtend} element={<ExtendLicensePage />} />
      <Route path={restaurantLicense} element={<RestaurantLicensesPage />} />
      <Route path={restaurantExtend} element={<ExtendLicensePage />} />
      <Route path={addLicense} element={<AddLicensePage />} />
      <Route path={restaurantAdd} element={<AddLicensePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Users;

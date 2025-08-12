//MODULES
import { useLocation, useNavigate } from "react-router-dom";

//COMP
import { LicenseI } from "../../../assets/icon";
import ActionButton from "../../common/actionButton";

const UserRestaurantLicenses = ({ restaurant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const handleClick = () => {
    const path = location.pathname.includes("users")
      ? "/users/restaurants/licenses/"
      : "/restaurants/licenses/";

    navigate(`${path}${restaurant.id}`, { state: { user, restaurant } });
  };

  return (
    <ActionButton
      element={<LicenseI className="w-4" strokeWidth="2" />}
      element2="Lisanslar"
      onClick={handleClick}
    />
  );
};

export default UserRestaurantLicenses;

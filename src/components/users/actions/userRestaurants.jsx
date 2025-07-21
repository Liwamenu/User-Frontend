import { useNavigate } from "react-router-dom";

//COMP
import { RestourantI } from "../../../assets/icon";
import ActionButton from "../../common/actionButton";

const UserRestaurants = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/users/restaurants/${user.id}`, { state: { user } });
  };
  return (
    <ActionButton
      element={<RestourantI className="w-5" />}
      element2="Restaurants"
      onClick={handleClick}
    />
  );
};

export default UserRestaurants;

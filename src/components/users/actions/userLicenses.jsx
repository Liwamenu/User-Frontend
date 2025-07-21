import { useNavigate } from "react-router-dom";

//COMP
import { LicenseI } from "../../../assets/icon";
import ActionButton from "../../common/actionButton";

const UserLicenses = ({ user }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/users/licenses/${user.id}`, { state: { user } });
  };
  return (
    <ActionButton
      element={<LicenseI className="w-5" />}
      element2="Lisanslar"
      onClick={handleClick}
    />
  );
};

export default UserLicenses;

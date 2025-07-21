// MODULES
import { useNavigate, useLocation } from "react-router-dom";

// COMPONENTS
import { ExtendI } from "../../../assets/icon";
import ActionButton from "../../common/actionButton";

const ExtendLicense = ({ licenseData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, restaurant } = location.state || {};

  const handleClick = (event) => {
    event.stopPropagation();
    const currentPath = location.pathname;
    navigate(`${currentPath}/extend-license`, {
      state: { user, restaurant, currentLicense: licenseData },
    });
  };

  return (
    <ActionButton
      element={<ExtendI className="w-[1.1rem]" />}
      element2="Lisans Uzat"
      onClick={handleClick}
    />
  );
};

export default ExtendLicense;

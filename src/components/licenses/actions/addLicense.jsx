import { useLocation, useNavigate } from "react-router-dom";

const AddLicense = ({ user, restaurant, licenses }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event) => {
    event.stopPropagation();
    const currentPath = location.pathname;
    navigate(`${currentPath}/add-license`, {
      state: { user, restaurant, licenses },
    });
  };

  return (
    <button
      className="h-11 whitespace-nowrap text-[--primary-2] px-3 rounded-md text-sm font-normal border-[1.5px] border-solid border-[--primary-2]"
      onClick={handleClick}
      disabled={!licenses}
    >
      Lisans Ekle
    </button>
  );
};

export default AddLicense;

import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const PRIMARY_GRADIENT =
  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)";

const AddLicense = ({ user, restaurant, licenses }) => {
  const { t } = useTranslation();
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
      type="button"
      onClick={handleClick}
      disabled={!licenses}
      className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition hover:shadow-indigo-500/30 hover:brightness-110 active:brightness-95 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ background: PRIMARY_GRADIENT }}
    >
      <Plus className="size-4" strokeWidth={2.5} />
      {t("licenses.add")}
    </button>
  );
};

export default AddLicense;

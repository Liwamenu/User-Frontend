import { usePopup } from "../../../context/PopupContext";
import { TransferI } from "../../../assets/icon";
import ActionButton from "../../common/actionButton";

const TransferLicense = ({ licensePackage, setOpenMenu, onSuccess }) => {
  const { setPopupContent } = usePopup();

  const handlePopup = (event) => {
    event.stopPropagation();
    setPopupContent(
      <TransferLicensePopup data={licensePackage} onSuccess={onSuccess} />
    );
  };

  return (
    <ActionButton
      element={<TransferI className="w-[1.1rem]" />}
      element2="Transfer"
      onClick={handlePopup}
    />
  );
};

export default TransferLicense;

const TransferLicensePopup = ({ data, onSuccess }) => {};

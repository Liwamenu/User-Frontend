// MODULES
import { useEffect, useRef, useState } from "react";

//COMP
import DeleteLicense from "./deleteLicense";
import ExtendLicense from "./extendLicense";
import TransferLicense from "./tranferLicense";
import EditLicenseDate from "./editLicenseDate";

// UTILS
import MenuI from "../../../assets/icon/menu";
import { usePopup } from "../../../context/PopupContext";

const LicensesActions = ({ index, licenseData, itemsPerPage, onSuccess }) => {
  const licenseDatasMenuRef = useRef();
  const { contentRef, setContentRef } = usePopup();
  const [openMenu, setOpenMenu] = useState(null);

  const handleClick = () => {
    setOpenMenu((prevIndex) => (prevIndex === index ? null : index));
  };

  useEffect(() => {
    if (licenseDatasMenuRef) {
      const refs = contentRef.filter((ref) => ref.id !== "licenseDatasMenuRef");
      setContentRef([
        ...refs,
        {
          id: "licenseDatasMenuRef",
          outRef: null,
          ref: licenseDatasMenuRef,
          callback: () => setOpenMenu(null),
        },
      ]);
    }
  }, [licenseDatasMenuRef, openMenu]);

  return (
    <>
      <div
        className="cursor-pointer"
        onClick={handleClick}
        ref={licenseDatasMenuRef}
      >
        <MenuI
          className={`w-full ${openMenu === index && "text-[--primary-2]"}`}
        />
      </div>
      <div
        className={`absolute right-10 border-2 border-solid border-[--light-3] rounded-sm z-10 shadow-lg overflow-hidden ${
          index >= itemsPerPage / 2 && itemsPerPage > 5 ? "bottom-5" : "top-5"
        } ${openMenu !== index && "invisible"}`}
      >
        <ul className="bg-[--white-1] text-[--gr-1] w-[18rem]">
          <ExtendLicense licenseData={licenseData} onSuccess={onSuccess} />
          <TransferLicense licenseData={licenseData} onSuccess={onSuccess} />
          <EditLicenseDate licenseData={licenseData} onSuccess={onSuccess} />

          <DeleteLicense licenseData={licenseData} onSuccess={onSuccess} />
        </ul>
      </div>
    </>
  );
};

export default LicensesActions;

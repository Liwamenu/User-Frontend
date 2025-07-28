//MODULES
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

//COMP
import Button from "../common/button";
import { CancelI } from "../../assets/icon";
import CustomInput from "../common/customInput";
import CustomSelect from "../common/customSelector";
import { usePopup } from "../../context/PopupContext";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  addLicensePackage,
  resetAddLicensePackage,
} from "../../redux/licensePackages/addLicensePackageSlice";

const AddLicensePackage = ({ onSuccess }) => {
  const params = useParams();
  const userId = params.id;
  const { setPopupContent } = usePopup();
  const handleClick = () => {
    setPopupContent(
      <AddLicensePackagePopup onSuccess={onSuccess} userId={userId} />
    );
  };

  return (
    <div className="max-sm:w-full w-max flex justify-end">
      <Button
        text="Lisans Paketi Ekle"
        className="border-[1px]"
        onClick={handleClick}
      />
    </div>
  );
};

export default AddLicensePackage;

//
///
//// *****AddLicensePackagePopup****** ////
function AddLicensePackagePopup({ onSuccess }) {
  const dispatch = useDispatch();
  const toastId = useRef();

  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector(
    (state) => state.licensePackages.addLicensePackage
  );

  const [licensePackagesData, setLicensePackagesData] = useState({
    time: "",
    userPrice: "",
    dealerPrice: "",
    description: "",
    name: "",
    timeId: "",
  });

  const closeForm = () => {
    setPopupContent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userValidPrice = parseFloat(
      licensePackagesData.userPrice.replace(/\./g, "").replace(",", ".")
    );
    const dealerValidPrice = parseFloat(
      licensePackagesData.dealerPrice.replace(/\./g, "").replace(",", ".")
    );
    console.log({
      ...licensePackagesData,
      userPrice: userValidPrice,
      dealerPrice: dealerValidPrice,
     
    });
    dispatch(
      addLicensePackage({
        ...licensePackagesData,
        userPrice: userValidPrice,
        dealerPrice: dealerValidPrice,
        
      })
    );
  };

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor 🤩...");
    }
    if (error) {
      toast.dismiss(toastId.current);

      dispatch(resetAddLicensePackage());
    } else if (success) {
      toast.dismiss(toastId.current);
      onSuccess();
      setPopupContent(null);
      toast.success("Lisans paketi başarıyla eklendi 🥳🥳");
      dispatch(resetAddLicensePackage());
    }
  }, [loading, success, error]);

  return (
    <div className=" w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base overflow-visible relative">
      <div className="flex flex-col bg-[--white-1] relative">
        <div className="absolute -top-6 right-3 z-[50]">
          <div
            className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
            onClick={closeForm}
          >
            <CancelI />
          </div>
        </div>

        <h1 className="self-center text-2xl font-bold">Lisans Paketi Ekle</h1>
        <div className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left">
          <form onSubmit={handleSubmit}>
            <div className="flex max-sm:flex-col sm:gap-4">
              <CustomInput
                label="Ad"
                placeholder="Ad"
                required={true}
                type="text"
                value={licensePackagesData.name}
                onChange={(e) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      name: e,
                    };
                  });
                }}
              />
              <CustomInput
                label="Zaman"
                placeholder="Zaman"
                required={true}
                type="number"
                value={licensePackagesData.time}
                onChange={(e) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      time: e,
                    };
                  });
                }}
              />
            </div>

            <div className="flex max-sm:flex-col sm:gap-4">
              <CustomInput
                label="Müşteri Fiyatı"
                placeholder="Müşteri Fiyatı"
                required={true}
                name="price"
                maxLength={11}
                value={licensePackagesData.userPrice}
                onChange={(e) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      userPrice: e,
                    };
                  });
                }}
              />
              <CustomInput
                label="Bayı Fiyatı"
                placeholder="Bayı Fiyatı"
                required={true}
                name="price"
                maxLength={11}
                value={licensePackagesData.dealerPrice}
                onChange={(e) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      dealerPrice: e,
                    };
                  });
                }}
              />
            </div>

            <div className="flex max-sm:flex-col sm:gap-4">
              <CustomInput
                type="text"
                maxLength={25}
                label="Açıklama"
                placeholder="Açıklama"
                value={licensePackagesData.description}
                onChange={(e) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      description: e,
                    };
                  });
                }}
              />
              <CustomSelect
                type="Zaman Tipi"
                label="Zaman Tipi"
                value={
                  licensePackagesData.selectedTimeId || {
                    value: 0,
                    label: "Yıl",
                  }
                }
                options={[
                  { value: 0, label: "Yıl" },
                  { value: 1, label: "Ay" },
                ]}
                onChange={(selectedOption) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      timeId: selectedOption.value,
                      selectedTimeId: selectedOption,
                    };
                  });
                }}
              />
            </div>

            <div className="w-full flex justify-end mt-10">
              <button
                disabled={false}
                className={`py-2 px-3 bg-[--primary-1] text-white rounded-lg`}
                type="submit"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

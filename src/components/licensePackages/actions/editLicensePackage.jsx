//MODULES
import toast from "react-hot-toast";
import isEqual from "lodash/isEqual";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import CustomInput from "../../common/customInput";
import ActionButton from "../../common/actionButton";
import { CancelI, EditI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";

//REDUX
import {
  updateLicensePackage,
  resetUpdateLicensePackage,
} from "../../../redux/licensePackages/updateLicensePackageSlice";

//UTILS
import { formatToPrice } from "../../../utils/utils";
import TimeIds from "../../../enums/licensePackagesTimeId";
import CustomSelect from "../../common/customSelector";

const EditLicensePackage = ({ licensePackage, onSuccess }) => {
  const { setPopupContent } = usePopup();

  const handlePopup = (e) => {
    e.stopPropagation();
    setPopupContent(
      <EditLicensePackagePopup data={licensePackage} onSuccess={onSuccess} />
    );
  };
  return (
    <ActionButton
      element={<EditI className="w-[1.1rem]" />}
      element2="Düzenle"
      onClick={handlePopup}
    />
  );
};

export default EditLicensePackage;

//
///
//// *****EditLicensePackagePopup****** ////
function EditLicensePackagePopup({ data, onSuccess }) {
  const dispatch = useDispatch();
  const toastId = useRef();
  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector(
    (state) => state.licensePackages.updateLicensePackage
  );

  const initialData = {
    id: data.id,
    time: data.time,
    licensePackageId: data.id,
    userPrice: formatToPrice(data.userPrice),
    dealerPrice: formatToPrice(data.dealerPrice),
    description: data.description,
    name: data.name,
    timeId: data.timeId,
    isActive: data.isActive,
  };

  const [licensePackagesData, setLicensePackagesData] = useState(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEqual(initialData, licensePackagesData)) {
      toast.error("Hiç bir değişiklik yapmadınız");
      return;
    }

    const userValidPrice = parseFloat(
      licensePackagesData.userPrice.replace(/\./g, "").replace(",", ".")
    );

    const dealerValidPrice = parseFloat(
      licensePackagesData.dealerPrice.replace(/\./g, "").replace(",", ".")
    );

    dispatch(
      updateLicensePackage({
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
      dispatch(resetUpdateLicensePackage());
    } else if (success) {
      toast.dismiss(toastId.current);
      onSuccess();
      setPopupContent(null);
      toast.success("Lisans paketi başarıyla düzenlendı 🥳🥳");
      dispatch(resetUpdateLicensePackage());
    }
  }, [loading, success, error]);

  return (
    <div className=" w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base overflow-visible relative">
      <div className="flex flex-col bg-[--white-1] relative">
        <div className="absolute -top-6 right-3 z-[50]">
          <div
            className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
            onClick={() => setPopupContent(null)}
          >
            <CancelI />
          </div>
        </div>

        <h1 className="self-center text-2xl font-bold">
          Lisans Paketi Düzenle
        </h1>
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
                placeholder="1,2,3..."
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
                required
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
                options={TimeIds}
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

            <div className="flex max-sm:flex-col sm:gap-4 sm:w-1/2">
              <CustomSelect
                type="Durum"
                label="Durum"
                value={
                  licensePackagesData.isActive
                    ? { value: true, label: "Aktif" }
                    : { value: false, label: "Pasif" }
                }
                options={[
                  { value: true, label: "Aktif" },
                  { value: false, label: "Pasif" },
                ]}
                onChange={(selectedOption) => {
                  setLicensePackagesData((prev) => {
                    return {
                      ...prev,
                      isActive: selectedOption.value,
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

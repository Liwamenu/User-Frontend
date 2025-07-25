// MODULES
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// COMPONENTS
import ActionButton from "../../common/actionButton";
import { CancelI, EditI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";
import CustomDatePicker from "../../common/customDatePicker";

//REDUX
import {
  updateLicenseDate,
  resetUpdateLicenseDateState,
} from "../../../redux/licenses/updateLicenseDateSlice";

const EditLicenseDate = ({ licenseData, onSuccess }) => {
  const { setPopupContent } = usePopup();

  const handleClick = () => {
    setPopupContent(
      <EditLicenseDatePopup onSuccess={onSuccess} license={licenseData} />
    );
  };

  return (
    <ActionButton
      element={<EditI className="w-[1.1rem]" />}
      element2="Lisans Tarihini Güncele"
      onClick={handleClick}
    />
  );
};

export default EditLicenseDate;

function EditLicenseDatePopup({ onSuccess, license }) {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector(
    (state) => state.licenses.updateLicenseDate
  );

  const [licenseData, setLicenseData] = useState({
    licenseId: license.id,
    start: new Date(license.startDateTime),
    end: new Date(license.endDateTime),
    startDateTime: license.startDateTime,
    endDateTime: license.endDateTime,
  });

  const closeForm = () => {
    setPopupContent(null);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (
      licenseData.start == new Date(license.startDateTime).toString() &&
      licenseData.end == new Date(license.endDateTime).toString()
    ) {
      console.log(licenseData.startDateTime);
      console.log(licenseData.start.toISOString());
      toast.error("Herhangi bir değişiklik yapmadınız.");
      return;
    }
    dispatch(updateLicenseDate(licenseData));
  };

  function adjustISOOffset(inDate) {
    if (!inDate) return;
    const isoWithLocalTime = new Date(
      inDate.getTime() - inDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -1); // Remove the 'Z' at the end
    return isoWithLocalTime;
  }

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor 🤩...");
    }
    if (error) {
      toastId.current && toast.dismiss(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR + "🙁");
      } else {
        toast.error("Something went wrong");
      }
      dispatch(resetUpdateLicenseDateState());
    } else if (success) {
      toastId.current && toast.dismiss(toastId.current);
      onSuccess();
      setPopupContent(null);
      toast.success("Lisans günü başarıyla güncellendi.");
      dispatch(resetUpdateLicenseDateState());
    }
  }, [loading, success, error]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] max-w-2xl">
        <div className="flex flex-col bg-[--white-1] relative">
          <div className="absolute -top-8 right-3">
            <div
              className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
              onClick={closeForm}
            >
              <CancelI />
            </div>
          </div>
          <h1 className="self-center text-2xl font-bold mt-4">
            Lisans Tarihini Güncele
          </h1>

          <form className="px-8" onSubmit={handleSubmit}>
            <div className="flex max-sm:flex-col gap-3 mt-7">
              <div>
                <p className="text-sm mb-3">Başlangıç Tarıhı</p>
                <CustomDatePicker
                  required
                  placeholder="Başlangıç Tarıhı"
                  value={licenseData.start}
                  onChange={(e) => {
                    setLicenseData((prev) => {
                      return {
                        ...prev,
                        start: e,
                        startDateTime: adjustISOOffset(e),
                      };
                    });
                  }}
                  className="mt-[0] sm:mt-[0] text-sm"
                  className2="mt-[0] sm:mt-[0]"
                />
              </div>
              <div>
                <p className="text-sm mb-3">Bıtış Tarıhı</p>
                <CustomDatePicker
                  required
                  placeholder="Bıtış Tarıhı"
                  value={licenseData.end}
                  onChange={(e) => {
                    setLicenseData((prev) => {
                      return {
                        ...prev,
                        end: e,
                        endDateTime: adjustISOOffset(e),
                      };
                    });
                  }}
                  className="mt-[0] sm:mt-[0] text-sm"
                  className2="mt-[0] sm:mt-[0]"
                />
              </div>
            </div>
            <div className="w-full flex gap-12 items-center justify-end mt-10">
              <button
                type="submit"
                className="text-sm w-20 py-2 px-3 bg-[--primary-1] text-white rounded-md"
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

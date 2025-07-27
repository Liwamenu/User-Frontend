//MODULES
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import Button from "../../common/button";
import CustomInput from "../../common/customInput";
import CustomToggle from "../../common/customToggle";

//REDUX
import {
  updateKDVParameters,
  resetUpdateKDVParameters,
} from "../../../redux/generalVars/KDVParameters/updateKDVParametersSlice";
import { getLicensePackages } from "../../../redux/licensePackages/getLicensePackagesSlice";
import { getKDVParameters } from "../../../redux/generalVars/KDVParameters/getKDVParametersSlice";

const UpdateLicenseKDV = ({ totalPrice, kdvData, setKdvData }) => {
  const toastId = useRef();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.generalVars.updateKDVParams
  );

  const {
    success: getKDVParamsSuccess,
    error: getKDVParamsError,
    KDVParameters,
  } = useSelector((state) => state.generalVars.getKDVParams);

  const [kdvDataBefore, setKdvDataBefore] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    if (isEqual(kdvData, kdvDataBefore)) {
      toast.error("Hiç bir deişiklik yapmadınız!");
      return;
    }
    dispatch(updateKDVParameters({ kdvData }));
  }

  function handleKDVSubmit(kdv) {
    const kdvData_ = { ...kdvData, useKDV: kdv };
    dispatch(updateKDVParameters({ kdvData: kdvData_ }));
  }

  useEffect(() => {
    if (!kdvData) {
      dispatch(getKDVParameters());
    }
  }, [kdvData]);

  // TOAST FOR GET
  useEffect(() => {
    if (getKDVParamsSuccess) {
      const { kdvPercentage, useKDV } = KDVParameters;

      setKdvDataBefore({
        kdvPercentage,
        useKDV,
      });
      setKdvData({
        kdvPercentage,
        useKDV,
      });
    }
    if (getKDVParamsError) {
      toast.error(
        getKDVParamsError.message_TR
          ? getKDVParamsError.message_TR
          : "KDV Parametreleri alınamadı"
      );
    }
  }, [getKDVParamsSuccess, getKDVParamsError]);

  // TOAST FOR UPDATING KDV
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    }
    if (error) {
      toast.dismiss(toastId.current);
      if (error?.message_TR) {
        toast.error(error.message_TR);
      } else {
        toast.error("Something went wrong");
      }
      dispatch(resetUpdateKDVParameters());
    }

    if (success) {
      toast.dismiss(toastId.current);
      toast.success("KDV Parametreleri başarıyla güncelendi.");
      dispatch(getLicensePackages());
      dispatch(resetUpdateKDVParameters());
    }
  }, [loading, success, error]);

  return (
    <div>
      <form className="flex items-center gap-2" onSubmit={handleSubmit}>
        <label className="whitespace-nowrap">KDV Oranı :</label>
        <CustomInput
          type="number"
          maxLength={3}
          value={kdvData ? kdvData.kdvPercentage : ""}
          onChange={(e) => {
            setKdvData((prev) => {
              return {
                ...prev,
                kdvPercentage: e,
              };
            });
          }}
          className="mt-[0] sm:mt-[0] py-[.5rem]"
          className2="mt-[0] sm:mt-[0] w-20"
        />
        <label className="whitespace-nowrap mr-4">%</label>
        <Button text="Kaydet" type="submit" className="border-[1px]" />
      </form>

      <div className="flex items-center mt-4 gap-16">
        <label
          htmlFor="CustomToggle"
          className="text-[--gr-1] cursor-pointer min-w-28"
        >
          KDV Güncele:{" "}
        </label>
        <CustomToggle
          id="CustomToggle"
          className="scale-75"
          disabled={loading}
          checked={kdvData ? kdvData.useKDV : false}
          onChange={(e) => {
            setKdvData((prev) => {
              return {
                ...prev,
                useKDV: !kdvData.useKDV,
              };
            });
            handleKDVSubmit(!kdvData.useKDV);
          }}
        />
      </div>
    </div>
  );
};

export default UpdateLicenseKDV;

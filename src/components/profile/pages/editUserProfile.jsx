//MOD
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import Button from "../../common/button";
import CustomInput from "../../common/customInput";
import { formatEmail } from "../../../utils/utils";
import CustomSelect from "../../common/customSelector";
import CustomPhoneInput from "../../common/customPhoneInput";

// REDUX
import { getUser } from "../../../redux/user/getUserSlice";
import {
  updateUserData,
  resetUpdateUserData,
} from "../../../redux/user/updateUserDataSlice";
import { getDistricts } from "../../../redux/data/getDistrictsSlice";

const EditUserProfile = ({ user, cities }) => {
  const toastId = useRef();
  const dispatch = useDispatch();

  const { loading, success, error } = useSelector(
    (state) => state.user.updateUserData
  );

  const { success: districtsSuccess, districts } = useSelector(
    (state) => state.data.getDistricts
  );

  const [citiesData, setCitiesData] = useState([]);
  const [districtsData, setDistrictsData] = useState([]);
  const [userDataBefore, setUserDataBefore] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: null,
    district: null,
  });
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    city: null,
    district: null,
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (isEqual(userDataBefore, userData)) {
      toast.error("Hiç bir geğişiklik yapmadınız");
    } else {
      dispatch(
        updateUserData({
          ...userData,
          phoneNumber: userData.phoneNumber.slice(1),
        })
      );
    }
  }

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    }
    if (error) {
      dispatch(resetUpdateUserData());
    }
    if (success) {
      dispatch(getUser());
      dispatch(resetUpdateUserData());
      toast.dismiss(toastId.current);
      toast.success("Profiliniz başarıyla güncelendi");
    }
  }, [loading, success, error]);

  // SET USER
  useEffect(() => {
    if (user) {
      setUserDataBefore((pre) => {
        return {
          ...pre,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: "9" + user.phoneNumber,
          email: user.email,
          city: { label: user.city, value: null, id: null },
          district: { label: user.district, value: null, id: null },
          dealerId: user.dealerId,
        };
      });
      setUserData((pre) => {
        return {
          ...pre,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: "9" + user.phoneNumber,
          email: user.email,
          city: { label: user.city, value: null, id: null },
          district: { label: user.district, value: null, id: null },
          dealerId: user.dealerId,
        };
      });
    }
  }, [user]);

  // GET AND SET CITIES IF THERE IS NOT
  useEffect(() => {
    if (cities) {
      setCitiesData(cities);
      if (!userData?.city?.id && userData?.city?.label) {
        const city = cities.filter(
          (city) => city.label === userData.city.label
        )[0];
        if (city) {
          setUserDataBefore((pre) => {
            return {
              ...pre,
              city,
            };
          });
          setUserData((pre) => {
            return {
              ...pre,
              city,
            };
          });
        }
      }
    }
  }, [cities, userData.city]);

  // GET DISTRICTS
  useEffect(() => {
    if (userData?.city?.id) {
      dispatch(getDistricts({ cityId: userData.city.id }));
    }
  }, [userData.city]);

  // SET DISTRICTS
  useEffect(() => {
    if (districtsSuccess) {
      setDistrictsData(districts);
      if (!userData?.district?.id && userData?.district?.label) {
        const district = districts.filter(
          (district) => district.label === userData.district.label
        )[0];
        if (district) {
          setUserDataBefore((pre) => {
            return {
              ...pre,
              district,
            };
          });
          setUserData((pre) => {
            return {
              ...pre,
              district,
            };
          });
        }
      }
    }
  }, [districtsSuccess, districts]);

  return (
    <section className="flex flex-col items-start pt-3.5 pr-20 pl-6 mt-10 w-full bg-[--white-1] min-h-0 max-md:px-5">
      <form className="w-full" onSubmit={handleSubmit}>
        <>
          <div className="w-full max-w-3xl flex max-sm:flex-col sm:gap-10 gap-2 max-sm:items-center">
            <CustomInput
              label="Ad"
              required
              className="py-3.5"
              value={userData.firstName}
              onChange={(e) => {
                setUserData((pre) => {
                  return {
                    ...pre,
                    firstName: e,
                  };
                });
              }}
            />
            <CustomInput
              label="Soyad"
              required
              className="rounded-2xl py-3.5"
              value={userData.lastName}
              onChange={(e) => {
                setUserData((pre) => {
                  return {
                    ...pre,
                    lastName: e,
                  };
                });
              }}
            />
          </div>
          <div className="w-full max-w-3xl flex max-sm:flex-col sm:gap-10 gap-2 max-sm:items-center">
            <CustomPhoneInput
              label="Telefon"
              required
              disabled
              className="py-3.5"
              value={userData.phoneNumber}
              onChange={(e) => {
                setUserData((pre) => {
                  return {
                    ...pre,
                    phoneNumber: e,
                  };
                });
              }}
            />

            <CustomInput
              label="E-Posta"
              required
              disabled
              className="py-3.5"
              value={userData.email}
              onChange={(e) => {
                setUserData((pre) => {
                  return {
                    ...pre,
                    email: formatEmail(e),
                  };
                });
              }}
            />
          </div>
          <div className="w-full max-w-3xl flex max-sm:flex-col sm:gap-10 gap-2 max-sm:items-center">
            <CustomSelect
              label="İl"
              required
              style={{
                padding: ".5rem 0",
              }}
              options={citiesData}
              value={userData?.city ? userData.city : { label: "Şehir seç" }}
              onChange={(selectedOption) => {
                setUserData((pre) => {
                  return {
                    ...pre,
                    city: selectedOption,
                  };
                });
              }}
            />
            <CustomSelect
              label="İlçe"
              required
              style={{
                padding: ".5rem 0",
              }}
              options={districtsData}
              value={
                userData?.district ? userData.district : { label: "İlçe seç" }
              }
              onChange={(selectedOption) => {
                setUserData((pre) => {
                  return {
                    ...pre,
                    district: selectedOption,
                  };
                });
              }}
            />
          </div>
        </>
        <div className="flex justify-end mt-16 sm:mt-52">
          <Button
            text="Kaydet"
            className="bg-[--primary-1] text-white text-lg rounded-xl py-[.8rem] sm:px-16 border-[0px]"
            type="submit"
            disabled={loading}
          />
        </div>
      </form>
    </section>
  );
};

export default EditUserProfile;

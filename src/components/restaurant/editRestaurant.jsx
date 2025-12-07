//MODULES
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import { googleMap } from "../../utils/utils";
import CustomInput from "../common/customInput";
import CustomSelect from "../common/customSelector";
import CustomTextarea from "../common/customTextarea";
import CustomFileInput from "../common/customFileInput";
import CustomPhoneInput from "../common/customPhoneInput";

//REDUX
import {
  getNeighs,
  resetGetNeighsState,
} from "../../redux/data/getNeighsSlice";
import {
  getLocation,
  resetGetLocationState,
} from "../../redux/data/getLocationSlice";
import {
  getDistricts,
  resetGetDistrictsState,
} from "../../redux/data/getDistrictsSlice";
import {
  resetUpdateRestaurant,
  updateRestaurant,
} from "../../redux/restaurants/updateRestaurantSlice";
import { getCities } from "../../redux/data/getCitiesSlice";

const EditRestaurant = ({ data: restaurant }) => {
  const dispatch = useDispatch();
  const toastId = useRef();

  // Derive formatted restaurant object
  const formatRestaurant = (restaurant) => {
    if (!restaurant) return null;

    const {
      id: restaurantId,
      dealerId,
      userId,
      name,
      phoneNumber,
      latitude,
      longitude,
      lat,
      lng,
      city,
      district,
      neighbourhood,
      address,
      isActive,
      imageAbsoluteUrl,
    } = restaurant;

    return {
      restaurantId,
      dealerId,
      userId,
      name,
      phoneNumber: phoneNumber?.startsWith("90")
        ? phoneNumber
        : "90" + phoneNumber,
      latitude: lat ? lat : latitude,
      longitude: lng ? lng : longitude,
      city: { label: city, value: city, id: null },
      district: { label: district, value: district, id: null },
      neighbourhood: { label: neighbourhood, value: neighbourhood, id: null },
      address,
      isActive,
      imageAbsoluteUrl,
    };
  };

  const { loading, success, error } = useSelector(
    (state) => state.restaurants.updateRestaurant
  );

  const { cities: citiesData } = useSelector((state) => state.data.getCities);

  const { districts: districtsData, success: districtsSuccess } = useSelector(
    (state) => state.data.getDistricts
  );

  const { neighs: neighsData, success: neighsSuccess } = useSelector(
    (state) => state.data.getNeighs
  );

  const { success: locationSuccess, location } = useSelector(
    (state) => state.data.getLocation
  );

  const [lat, setLat] = useState(restaurant?.latitude);
  const [lng, setLng] = useState(restaurant?.longitude);
  const [locationData, setLocationData] = useState({
    location: null,
    before: null,
  });
  const [cities, setCities] = useState([]);
  const [neighs, setNeighs] = useState([]);
  const [document, setDocument] = useState("");
  const [districts, setDistricts] = useState([]);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [restaurantDataBefore, setRestaurantDataBefore] = useState(
    formatRestaurant(restaurant)
  );
  const [restaurantData, setRestaurantData] = useState(
    formatRestaurant(restaurant)
  );
  const [preview, setPreview] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
    const equalData = isEqual(restaurantDataBefore, restaurantData);
    if (equalData && !document) {
      toast("Hiç bir değişiklik yapmadınız.");
      return;
    }

    const formData = new FormData();

    formData.append("RestaurantId", restaurantData.restaurantId);
    formData.append("DealerId", restaurantData.dealerId);
    formData.append("UserId", restaurantData.userId);
    formData.append("Name", restaurantData.name);
    formData.append("PhoneNumber", restaurantData.phoneNumber);
    formData.append("Latitude", restaurantData.latitude);
    formData.append("Longitude", restaurantData.longitude);
    formData.append("City", restaurantData.city.value);
    formData.append("District", restaurantData.district.value);
    formData.append("Neighbourhood", restaurantData.neighbourhood.value);
    formData.append("Address", restaurantData.address);
    formData.append("IsActive", restaurantData.isActive);
    document && formData.append("Image", document);

    dispatch(updateRestaurant(formData));
    // console.log(restaurantData);
  };

  async function handleOpenMap() {
    setIsMapOpen(true);
    googleMap(lat, lng, setLat, setLng, locationData.location);
  }

  function handleSetMap() {
    setRestaurantData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    // console.log(lat, lng);
    setIsMapOpen(false);
  }

  // REFRESH WHEN RESTAURANT CHANGES
  useEffect(() => {
    if (restaurant) {
      const formatted = formatRestaurant(restaurant);
      setRestaurantData(formatted);
      setRestaurantDataBefore(formatted);
      setPreview(formatted?.imageAbsoluteUrl);
    }
  }, [restaurant]);

  // TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor 🤩...");
    }
    if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetUpdateRestaurant());
    } else if (success) {
      toast.dismiss(toastId.current);
      toast.success("Restoran başarıyla güncelendi 🥳🥳");
      dispatch(resetUpdateRestaurant());
    }
  }, [loading, success, error]);

  // GET AND SET CITIES IF THERE IS NO CITIES
  useEffect(() => {
    if (!restaurantData) return;
    if (!citiesData) {
      dispatch(getCities());
    } else {
      setCities(citiesData);
      if (!restaurantData?.city?.id) {
        const city = citiesData.filter(
          (city) =>
            city?.label?.toLowerCase() ===
            restaurantData?.city?.label?.toLowerCase() //toLocaleLowerCase('tr-TR')
        )[0];

        if (city) {
          setRestaurantDataBefore((prev) => {
            return {
              ...prev,
              city,
            };
          });
          setRestaurantData((prev) => {
            return {
              ...prev,
              city,
            };
          });
        }
      }
    }
  }, [citiesData]);

  // GET DISTRICTS WHENEVER USER'S CITY CHANGES
  useEffect(() => {
    if (!restaurantData) return;
    if (restaurantData.city?.id) {
      dispatch(getDistricts({ cityId: restaurantData.city.id }));
      setRestaurantData((prev) => {
        return {
          ...prev,
          district: null,
        };
      });
    }
  }, [restaurantData?.city]);

  // SET DISTRICTS
  useEffect(() => {
    if (!restaurantData) return;
    if (districtsSuccess) {
      setDistricts(districtsData);

      if (!restaurantData.district || !restaurantData.district?.id) {
        const district = districtsData.filter(
          (dist) =>
            dist?.label.toLowerCase() ===
            restaurantDataBefore.district?.label.toLowerCase()
        )[0];
        if (district) {
          setRestaurantDataBefore((prev) => {
            return {
              ...prev,
              district,
            };
          });
          setRestaurantData((prev) => {
            return {
              ...prev,
              district,
            };
          });
        }
      }
      dispatch(resetGetDistrictsState());
    }
  }, [districtsSuccess]);

  // GET NEIGHBOURHOODS WHENEVER THE INVOICE DISTRICT CHANGES
  useEffect(() => {
    if (!restaurantData) return;
    if (restaurantData.district?.id && restaurantData.city?.id) {
      dispatch(
        getNeighs({
          cityId: restaurantData.city.id,
          districtId: restaurantData.district.id,
        })
      );
      setRestaurantData((prev) => {
        return {
          ...prev,
          neighbourhood: null,
        };
      });
    }
  }, [restaurantData?.district]);

  // SET NEIGHBOURHOODS
  useEffect(() => {
    if (!restaurantData) return;
    if (neighsSuccess) {
      setNeighs(neighsData);
      if (!restaurantData.neighbourhood) {
        const neigh = neighsData.filter(
          (neigh) =>
            neigh.label.toLowerCase() ===
            restaurantDataBefore.neighbourhood.label.toLowerCase()
        )[0];
        if (neigh) {
          setRestaurantDataBefore((prev) => {
            return {
              ...prev,
              neighbourhood: { ...neigh, id: null },
            };
          });
          setRestaurantData((prev) => {
            return {
              ...prev,
              neighbourhood: { ...neigh, id: null },
            };
          });
        }
      }
      dispatch(resetGetNeighsState());
    }
  }, [neighsSuccess]);

  // GET LOACTION IF THE NEIGH CHANGED
  useEffect(() => {
    if (!restaurantData) return;
    const city = restaurantData.city;
    const district = restaurantData.district;
    const neighbourhood = restaurantData.neighbourhood;

    if (city?.value && district?.value && neighbourhood?.value) {
      const address = `${city.value}, ${district.value}, ${neighbourhood.value}`;
      if (!isEqual(address, locationData.before)) {
        dispatch(getLocation(address));
        setLocationData((prev) => {
          return {
            ...prev,
            before: address,
          };
        });
      }
    }
  }, [restaurantData?.neighbourhood]);

  // SET LOCATION
  useEffect(() => {
    if (!restaurantData) return;
    if (locationSuccess) {
      const averageLat = (
        location.reduce((sum, loc) => sum + loc.lat, 0) / location.length
      ).toFixed(6);
      const averageLng = (
        location.reduce((sum, loc) => sum + loc.lng, 0) / location.length
      ).toFixed(6);

      const neighbourhood = restaurantData.neighbourhood;
      if (neighbourhood?.id) {
        //CHECK THE ORIGINAL VALUE
        setRestaurantData((prev) => {
          return {
            ...prev,
            latitude: averageLat,
            longitude: averageLng,
          };
        });
        setLat(averageLat);
        setLng(averageLng);
      } else {
        setLat(restaurantData.latitude);
        setLng(restaurantData.longitude);
      }
      setLocationData((prev) => {
        return {
          ...prev,
          location,
        };
      });
      dispatch(resetGetLocationState());
    }
  }, [locationSuccess]);

  //PREVIEW
  useEffect(() => {
    if (!document) return;

    // Create a preview URL
    const objectUrl = URL.createObjectURL(document);
    setPreview(objectUrl);

    // Free memory when the component unmounts or doc changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [document]);

  console.log(restaurantData);

  return (
    <div className=" w-full pb-8 mt-1 bg-[--white-1] rounded-lg text-[--black-2] text-base overflow-visible relative">
      <div className="flex flex-col bg-[--white-1] px-4 sm:px-14 relative">
        <div
          className={`absolute bg-black/15 w-full -top-12 -bottom-8 z-[999] rounded-lg flex flex-col justify-start items-center ${
            !isMapOpen && "hidden"
          }`}
        >
          <div id="map" className="size-full rounded-t-md"></div>

          <div className="w-full px-2 py-1 pt-2 flex rounded-b-md">
            <div className="w-full gap-2 flex">
              <div className="text-sm">
                <span className="text-xs text-[--gr-1]">latitude</span>
                <p className="border border-solid border-[--border-1]  px-2">
                  {lat}
                </p>
              </div>

              <div className="text-sm">
                <span className="text-xs text-[--gr-1]">longitude</span>
                <p className="border border-solid border-[--border-1]  px-2">
                  {lng}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                className="px-5 py-1 text-sm text-[--red-1] rounded-sm bg-[--status-red] border border-solid border-[--red-1]"
                onClick={() => setIsMapOpen(false)}
              >
                Kapat
              </button>
              <button
                className="px-5 py-1 text-sm text-[--green-1] rounded-sm bg-[--status-green] border border-solid border-[--green-1]"
                onClick={handleSetMap}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Restoranı Düzenle {restaurantData?.name} Restoranı
        </h1>

        <div className="flex flex-col mt-9 w-full text-left">
          {restaurantData && (
            <form onSubmit={handleSubmit}>
              <div className="flex max-sm:flex-col gap-4">
                <CustomInput
                  required={true}
                  label="Ad"
                  placeholder="Ad"
                  className="py-[.45rem] text-sm"
                  value={restaurantData.name}
                  onChange={(e) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        name: e,
                      };
                    });
                  }}
                />
                <CustomPhoneInput
                  required={true}
                  label="Telefone"
                  placeholder="Telefone"
                  className="py-[.45rem] text-sm"
                  value={restaurantData.phoneNumber}
                  onChange={(phone) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        phoneNumber: phone,
                      };
                    });
                  }}
                  maxLength={14}
                />
              </div>

              <div className="flex max-sm:flex-col gap-4">
                <CustomSelect
                  required={true}
                  label="Şehir"
                  placeholder="Ad"
                  style={{ padding: "1px 0px" }}
                  className="text-sm"
                  value={
                    restaurantData.city
                      ? restaurantData.city
                      : { value: null, label: "Şehir seç" }
                  }
                  options={[{ value: null, label: "Şehir seç" }, ...cities]}
                  onChange={(selectedOption) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        city: selectedOption,
                      };
                    });
                  }}
                />
                <CustomSelect
                  required={true}
                  label="İlçe"
                  placeholder="Ad"
                  style={{ padding: "1px 0px" }}
                  className="text-sm"
                  value={
                    restaurantData.district
                      ? restaurantData.district
                      : { value: null, label: "İlçe seç" }
                  }
                  options={[{ value: null, label: "İlçe seç" }, ...districts]}
                  onChange={(selectedOption) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        district: selectedOption,
                      };
                    });
                  }}
                />
              </div>

              <div className="flex max-sm:flex-col gap-4">
                <CustomSelect
                  required={true}
                  label="Mahalle"
                  placeholder="Ad"
                  style={{ padding: "1px 0px" }}
                  className="text-sm"
                  value={
                    restaurantData.neighbourhood
                      ? restaurantData.neighbourhood
                      : { value: null, label: "Mahalle Seç" }
                  }
                  options={[{ value: null, label: "Mahalle Seç" }, ...neighs]}
                  onChange={(selectedOption) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        neighbourhood: selectedOption,
                      };
                    });
                  }}
                />

                <CustomTextarea
                  required={true}
                  label="Adres"
                  placeholder="Adres"
                  className="text-sm h-14"
                  value={restaurantData.address}
                  onChange={(e) => {
                    setRestaurantData((prev) => {
                      return {
                        ...prev,
                        address: e.target.value,
                      };
                    });
                  }}
                />
              </div>

              <div onClick={handleOpenMap}>
                <div className="flex max-sm:flex-col gap-4 pointer-events-none">
                  <CustomInput
                    required={true}
                    label="Latitude"
                    placeholder="Latitude"
                    className="py-[.45rem] text-sm"
                    className2="mt-[.5rem] sm:mt-[.5rem]"
                    value={restaurantData.latitude}
                    onChange={() => {}}
                    onClick={() => {}}
                    readOnly={true}
                  />
                  <CustomInput
                    required={true}
                    label="Longitude"
                    placeholder="Longitude"
                    className="py-[.45rem] text-sm"
                    className2="mt-[.5rem] sm:mt-[.5rem]"
                    value={restaurantData.longitude}
                    onChange={() => {}}
                    onClick={() => {}}
                    readOnly={true}
                  />
                </div>
              </div>

              <div className="mt-4 flex max-sm:flex-col items-center">
                <div className="w-full max-w-40">
                  <img src={preview} alt="preview_liwamenu" />
                </div>
                <CustomFileInput
                  className="h-[8rem] p-4"
                  value={document}
                  onChange={setDocument}
                  accept={"image/png, image/jpeg"}
                />
              </div>

              <div className="w-full flex justify-end mt-10">
                <button
                  disabled={false}
                  className={`py-2 px-3 bg-[--primary-1] text-white rounded-lg ${
                    isMapOpen && "invisible"
                  }`}
                  type="submit"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;

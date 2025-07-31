//MODULES
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";

//COMPONENTS
import CloseI from "../../../assets/icon/close";
import CustomInput from "../../common/customInput";
import CustomSelect from "../../common/customSelector";
import TableSkeleton from "../../common/tableSkeleton";
import CustomPagination from "../../common/pagination";
import { usePopup } from "../../../context/PopupContext";
import AddLicense from "../../licenses/actions/addLicense";
import DoubleArrowRI from "../../../assets/icon/doubleArrowR";
import licenseFilterDates from "../../../enums/licenseFilterDates";
import LicensesTable from "../../../components/common/licensesTable";

// REDUX
import {
  getRestaurant,
  resetGetRestaurantState,
} from "../../../redux/restaurants/getRestaurantSlice";
import {
  getRestaurantLicenses,
  resetGetRestaurantLicenses,
} from "../../../redux/licenses/getRestaurantLicensesSlice";
import { getUser, resetGetUser } from "../../../redux/users/getUserByIdSlice";

const RestaurantLicensesPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const restaurantId = params.id;
  const isUserPath = location.pathname.includes("users");
  const isRestaurantPath = location.pathname.includes("restaurants");
  const { user: userInData, restaurant: restaurantInData } =
    location.state || {};

  const { loading, success, error, restaurantLicenses } = useSelector(
    (state) => state.licenses.getRestaurantLicenses
  );

  const {
    restaurant,
    error: restaurantError,
    success: restaurantSuccess,
    loading: restaurantLoading,
  } = useSelector((state) => state.restaurants.getRestaurant);

  const {
    user,
    error: userError,
    success: userSucc,
    loading: userLoading,
  } = useSelector((state) => state.users.getUser);

  const [searchVal, setSearchVal] = useState("");
  const [filter, setFilter] = useState({});

  const [restaurantData, setRestaurantData] = useState(restaurantInData);
  const [licensesData, setLicensesData] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

  const [userData, setUserData] = useState(userInData);

  const itemsPerPage = import.meta.env.VITE_ROWS_PER_PAGE;
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(null);

  //SEARCH
  function handleSearch(e) {
    e.preventDefault();
    if (!searchVal) return;
    dispatch(
      getRestaurantLicenses({
        restaurantId,
        pageNumber: 1,
        pageSize: itemsPerPage,
        searchKey: searchVal,
        isActive: filter?.status?.value,
        isSettingsAdded: filter?.isSettingsAdded?.value,
        licenseTypeId: filter?.licenseTypeId?.id,
        dateRange: filter?.dateRange?.value,
      })
    );
    setPageNumber(1);
  }

  //FILTER AND CLEAR FILTER
  function handleFilter(bool) {
    if (bool) {
      const filterData = {
        restaurantId,
        pageNumber: 1,
        searchKey: searchVal,
        pageSize: itemsPerPage,
        isActive: filter?.status?.value,
        isSettingsAdded: filter?.isSettingsAdded?.value,
        licenseTypeId: filter?.licenseTypeId?.id,
        dateRange: filter?.dateRange?.value,
      };
      dispatch(getRestaurantLicenses(filterData));
    } else {
      dispatch(
        getRestaurantLicenses({
          restaurantId,
          pageNumber,
          pageSize: itemsPerPage,
        })
      );
      setFilter({});
    }
    setPageNumber(1);
    setOpenFilter(false);
  }

  //CLEAR SEARCH
  function clearSearch() {
    setSearchVal("");
    dispatch(
      getRestaurantLicenses({
        restaurantId,
        pageNumber,
        pageSize: itemsPerPage,
        searchKey: null,
        isActive: filter?.status?.value,
        isSettingsAdded: filter?.isSettingsAdded?.value,
        licenseTypeId: filter?.licenseTypeId?.id,
        dateRange: filter?.dateRange?.value,
      })
    );
  }

  function handlePageChange(number) {
    dispatch(
      getRestaurantLicenses({
        restaurantId,
        pageNumber: number,
        pageSize: itemsPerPage,
        searchKey: searchVal,
        isActive: filter?.status?.value,
        isSettingsAdded: filter?.isSettingsAdded?.value,
        licenseTypeId: filter?.licenseTypeId?.id,
        dateRange: filter?.dateRange?.value,
      })
    );
  }

  function insertRestaurantsToLicenses(inRestaurant) {
    if (!restaurantLicenses) return;
    const updatedData = restaurantLicenses.data.map((license) => {
      return {
        ...license,
        restaurantId: inRestaurant?.id,
        restaurantName: inRestaurant?.name,
        userName: user ? user.fullName : userData?.fullName,
      };
    });
    setLicensesData(updatedData);
    setRestaurantData(inRestaurant);
    setTotalItems(restaurantLicenses.totalCount);
    dispatch(resetGetUser());
    dispatch(resetGetRestaurantState());
    dispatch(resetGetRestaurantLicenses());
  }

  // GET LICENSES WITH RESTAURANT
  useEffect(() => {
    if (!licensesData) {
      dispatch(
        getRestaurantLicenses({
          restaurantId,
          pageNumber,
          pageSize: itemsPerPage,
          searchKey: null,
          active: null,
          city: null,
          district: null,
          neighbourhood: null,
        })
      );
    }
  }, [licensesData]);

  //TOAST AND SET LICENSES OR GET RESTAURANT DATA
  useEffect(() => {
    if (success) {
      console.log(userInData);
      if (!restaurantInData) {
        dispatch(getRestaurant({ restaurantId }));
      } else if (!userInData && (isUserPath || isRestaurantPath)) {
        dispatch(getUser({ userId: restaurantInData.userId }));
      } else {
        insertRestaurantsToLicenses(restaurantInData);
      }
    }

    if (error) {
      dispatch(resetGetRestaurantLicenses());
    }
  }, [success, restaurantInData]);

  //TOAST AND SET RESTAURANT DATA OR GET USER DATA
  useEffect(() => {
    if (restaurantError) {
      dispatch(resetGetRestaurantState());
    }

    if (restaurantSuccess) {
      if (!userInData && isUserPath) {
        dispatch(getUser({ userId: restaurant.userId }));
      } else {
        insertRestaurantsToLicenses(restaurant);
      }
    }
  }, [restaurantError, restaurantSuccess, restaurant]);

  //CALL INSERT AND SET USER DATA
  useEffect(() => {
    if (userSucc) {
      setUserData(user);
      const rest = restaurantInData ? restaurantInData : restaurant;
      insertRestaurantsToLicenses(rest);
    }

    if (userError) {
      dispatch(resetGetUser());
    }
  }, [userSucc, userError, user]);

  //HIDE POPUP
  const { contentRef, setContentRef } = usePopup();
  const filterLicense = useRef();
  useEffect(() => {
    if (filterLicense) {
      const refs = contentRef.filter((ref) => ref.id !== "licensesFilter");
      setContentRef([
        ...refs,
        {
          id: "licensesFilter",
          outRef: null,
          ref: filterLicense,
          callback: () => setOpenFilter(false),
        },
      ]);
    }
  }, [filterLicense]);

  return (
    <section className="lg:ml-[280px] pt-28 px-[4%] pb-4 grid grid-cols-1 section_row">
      {/* TITLE */}
      <div className="w-max flex gap-1 text-[--gr-1] pt-4 text-sm font-[300] cursor-pointer max-sm:pb-8">
        <div
          className="flex items-center gap-1"
          onClick={() => window.history.back()}
        >
          {isUserPath &&
            (userData ? (
              <>
                {userData.fullName} <DoubleArrowRI className="size-3" />
              </>
            ) : (
              <>
                Kullanıcılar <DoubleArrowRI className="size-3" />
              </>
            ))}
          {restaurantData ? (
            <>
              {restaurantData.name} <DoubleArrowRI className="size-3" />
            </>
          ) : (
            <>
              Restoranlar <DoubleArrowRI className="size-3" />
            </>
          )}
          Lisanslar
        </div>
      </div>

      {/* ACTIONS/BUTTONS */}
      <div className="w-full flex justify-between items-end mb-6 flex-wrap gap-2">
        <div className="flex items-center w-full max-w-sm max-sm:order-2">
          <form className="w-full" onSubmit={handleSearch}>
            <CustomInput
              onChange={(e) => {
                setSearchVal(e);
                !e && clearSearch();
              }}
              value={searchVal}
              placeholder="Ara..."
              className2="mt-[0px] w-full"
              className="mt-[0px] py-[.7rem] w-[100%] focus:outline-none"
              icon={<CloseI className="w-4 text-[--red-1]" />}
              className4={`top-[20px] right-2 hover:bg-[--light-4] rounded-full px-2 py-1 ${
                searchVal ? "block" : "hidden"
              }`}
              iconClick={clearSearch}
            />
          </form>
        </div>

        <div className="max-sm:w-full flex justify-end">
          <div className="flex gap-2 max-sm:order-1 ">
            <div>
              <AddLicense
                restaurant={restaurantData}
                licenses={licensesData}
                onSuccess={() => setLicensesData(null)}
              />
            </div>

            <div className="w-full relative" ref={filterLicense}>
              <button
                className="w-full h-11 flex items-center justify-center text-[--primary-2] px-3 rounded-md text-sm font-normal border-[1.5px] border-solid border-[--primary-2]"
                onClick={() => setOpenFilter(!openFilter)}
              >
                Filtre
              </button>

              <div
                className={`absolute right-[-60px] sm:right-0 top-12 px-4 pb-3 flex flex-col bg-[--white-1] w-[22rem] border border-solid border-[--light-3] rounded-lg drop-shadow-md -drop-shadow-md ${
                  openFilter ? "visible" : "hidden"
                }`}
              >
                <div className="flex gap-6">
                  <CustomSelect
                    label="Durum"
                    className="text-sm sm:mt-1"
                    className2="sm:mt-3"
                    style={{ padding: "0 !important" }}
                    options={[
                      { value: null, label: "Hepsi" },
                      { value: true, label: "Aktif" },
                      { value: false, label: "Pasif" },
                    ]}
                    value={
                      filter?.status
                        ? filter.status
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          status: selectedOption,
                        };
                      });
                    }}
                  />

                  <CustomSelect
                    label="Ayarlar"
                    style={{ padding: "1px 0px" }}
                    className="text-sm"
                    options={[
                      { value: null, label: "Hepsi" },
                      { value: true, label: "Eklenmiş" },
                      { value: false, label: "Eklenmemiş" },
                    ]}
                    optionStyle={{ fontSize: ".8rem" }}
                    value={
                      filter?.isSettingsAdded
                        ? filter.isSettingsAdded
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          isSettingsAdded: selectedOption,
                        };
                      });
                    }}
                  />
                </div>

                <div className="flex gap-6">
                  <CustomSelect
                    label="Bitiş Zamanı"
                    className2="sm:mt-[.75rem] mt-1"
                    className="text-sm sm:mt-[.25rem]"
                    isSearchable={false}
                    style={{ padding: "0 !important" }}
                    optionStyle={{ fontSize: ".8rem" }}
                    options={[
                      { value: null, label: "Hepsi", id: null },
                      ...licenseFilterDates,
                    ]}
                    value={
                      filter?.dateRange
                        ? filter.dateRange
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          dateRange: selectedOption,
                        };
                      });
                    }}
                  />
                </div>

                <div className="w-full flex gap-2 justify-center pt-10">
                  <button
                    className="text-white bg-[--red-1] py-2 px-12 rounded-lg hover:opacity-90"
                    onClick={() => handleFilter(false)}
                  >
                    Temizle
                  </button>
                  <button
                    className="text-white bg-[--primary-1] py-2 px-12 rounded-lg hover:opacity-90"
                    onClick={() => handleFilter(true)}
                  >
                    Uygula
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {licensesData && !loading && !restaurantLoading && !userLoading ? (
        <LicensesTable
          inData={licensesData}
          onSuccess={() => setLicensesData(null)}
        />
      ) : loading || restaurantLoading || userLoading ? (
        <TableSkeleton />
      ) : null}

      {/* PAGINATION */}
      {licensesData && typeof totalItems === "number" && (
        <div className="w-full self-end flex justify-center pt-4 text-[--black-2]">
          <CustomPagination
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
    </section>
  );
};

export default RestaurantLicensesPage;

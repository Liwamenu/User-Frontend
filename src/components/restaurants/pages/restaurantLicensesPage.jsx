//MODULES
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

//COMPONENTS
import CloseI from "../../../assets/icon/close";
import CustomInput from "../../common/customInput";
import CustomSelect from "../../common/customSelector";
import TableSkeleton from "../../common/tableSkeleton";
import CustomPagination from "../../common/pagination";
import LicensesTable from "../../common/licensesTable";
import { usePopup } from "../../../context/PopupContext";
import AddLicense from "../../licenses/actions/addLicense";
import DoubleArrowRI from "../../../assets/icon/doubleArrowR";
import licenseFilterDates from "../../../enums/licenseFilterDates";

// REDUX
import { useDispatch, useSelector } from "react-redux";
import {
  getRestaurant,
  resetGetRestaurantState,
} from "../../../redux/restaurants/getRestaurantSlice";
import {
  getRestaurantLicenses,
  resetGetRestaurantLicenses,
} from "../../../redux/licenses/getRestaurantLicensesSlice";

const RestaurantLicensesPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const restaurantId = params.id;
  const { user: userInData, restaurant: restaurantInData } =
    location.state || {};

  const { loading, success, error, restaurantLicenses } = useSelector(
    (state) => state.licenses.getRestaurantLicenses
  );

  const {
    restaurant,
    error: restaurantError,
    loading: restaurantLoading,
    success: restaurantSuccess,
  } = useSelector((state) => state.restaurants.getRestaurant);

  const [filter, setFilter] = useState({});
  const [searchVal, setSearchVal] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [licensesData, setLicensesData] = useState(null);
  const [restaurantData, setRestaurantData] = useState(restaurantInData);

  const [userData, setuserData] = useState(userInData);

  const itemsPerPage = 8;
  const [pageNumber, setPageNumber] = useState(1);
  const [totalItems, setTotalItems] = useState(null);

  function handlePageChange(number) {
    dispatch(
      getRestaurantLicenses({
        restaurantId,
        pageNumber: number,
        pageSize: itemsPerPage,
        searchKey: searchVal,
        active: filter?.status?.value,
        city: filter?.city?.value,
        district: filter?.district?.value,
        neighbourhood: filter?.neighbourhood?.value,
      })
    );
  }

  //SEARCH
  function handleSearch(e) {
    e.preventDefault();
    if (!searchVal) return;
    dispatch(
      getRestaurantLicenses({
        restaurantId,
        pageNumber: 1,
        searchKey: searchVal,
        pageSize: itemsPerPage,
        isActive: filter?.status?.value,
        dateRange: filter?.dateRange?.value,
        licenseTypeId: filter?.licenseTypeId?.id,
        isSettingsAdded: filter?.isSettingsAdded?.value,
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
          pageNumber,
          restaurantId,
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
        pageNumber,
        searchKey: null,
        pageSize: itemsPerPage,
        restaurantId: restaurant.id,
        isActive: filter?.status?.value,
        dateRange: filter?.dateRange?.value,
        licenseTypeId: filter?.licenseTypeId?.id,
        isSettingsAdded: filter?.isSettingsAdded?.value,
      })
    );
  }

  function insertRestaurantToLicenses(restaurantName) {
    return restaurantLicenses.data.map((ent) => {
      return { ...ent, restaurantName };
    });
  }

  // GET LICENSES
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

  //TOAST AND SET LICENSES
  useEffect(() => {
    if (success) {
      if (!restaurantInData) {
        dispatch(getRestaurant({ restaurantId }));
      } else {
        const licensesWithRestaurantName = insertRestaurantToLicenses(
          restaurantData?.name
        );
        setLicensesData(licensesWithRestaurantName);
        setTotalItems(restaurantLicenses.totalCount);
        dispatch(resetGetRestaurantLicenses());
      }
    }

    if (error) {
      toast.error(error.message);
      dispatch(resetGetRestaurantLicenses());
    }
  }, [success, restaurantInData]);

  useEffect(() => {
    if (restaurantError) {
      toast.error(restaurantError.message);
      dispatch(resetGetRestaurantState());
    }

    if (restaurantSuccess) {
      setRestaurantData(restaurant);
      const licensesWithRestaurantName = insertRestaurantToLicenses(
        restaurant.name
      );
      setLicensesData(licensesWithRestaurantName);
      setTotalItems(restaurantLicenses.totalCount);
      dispatch(resetGetRestaurantState());
      dispatch(resetGetRestaurantLicenses());
    }
  }, [restaurantError, restaurantSuccess, restaurant]);

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
                onSuccess={() => setLicensesData(null)}
                user={userData}
                restaurant={restaurantData}
                licenses={licensesData}
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
                className={`absolute right-[-60px] sm:right-0 top-12 px-4 pb-3 flex flex-col bg-[--white-1] w-[22rem] border border-solid border-[--light-3] rounded-lg drop-shadow-md -drop-shadow-md z-50 ${
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
                    label="Bitiş Zamanı"
                    className="text-sm sm:mt-1"
                    className2="sm:mt-3"
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
                    className="text-[--white-1] bg-[--red-1] py-2 px-12 rounded-lg hover:opacity-90"
                    onClick={() => handleFilter(false)}
                  >
                    Temizle
                  </button>
                  <button
                    className="text-[--white-1] bg-[--primary-1] py-2 px-12 rounded-lg hover:opacity-90"
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
      {licensesData && !loading && !restaurantLoading ? (
        <LicensesTable
          inData={licensesData}
          onSuccess={() => setLicensesData(null)}
        />
      ) : loading || restaurantLoading ? (
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

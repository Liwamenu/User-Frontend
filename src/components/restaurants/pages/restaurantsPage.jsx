//MODULES
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import AddRestaurant from "../addRestaurant";
import CloseI from "../../../assets/icon/close";
import RestaurantsTable from "../restaurantsTable";
import CustomInput from "../../common/customInput";
import TableSkeleton from "../../common/tableSkeleton";
import CustomSelect from "../../common/customSelector";
import CustomPagination from "../../common/pagination";
import { usePopup } from "../../../context/PopupContext";
import RestaurantActions from "../actions/restaurantActions";

// REDUX
import {
  getRestaurants,
  resetGetRestaurantsState,
} from "../../../redux/restaurants/getRestaurantsSlice";
import { getCities } from "../../../redux/data/getCitiesSlice";
import { getNeighs } from "../../../redux/data/getNeighsSlice";
import { getDistricts } from "../../../redux/data/getDistrictsSlice";
import RestaurantsCard from "../restaurantsCard";

const RestaurantsPage = () => {
  const dispatch = useDispatch();

  const { loading, success, error, restaurants } = useSelector(
    (state) => state.restaurants.getRestaurants
  );

  const { cities: citiesData } = useSelector((state) => state.data.getCities);

  const { districts: districtsData, success: districtsSuccess } = useSelector(
    (state) => state.data.getDistricts
  );
  const { neighs: neighsData, success: neighsSuccess } = useSelector(
    (state) => state.data.getNeighs
  );

  const [searchVal, setSearchVal] = useState("");
  const [filter, setFilter] = useState({
    city: null,
    district: null,
    neighbourhood: null,
  });
  const [restaurantsData, setRestaurantsData] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [neighs, setNeighs] = useState([]);

  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = import.meta.env.VITE_ROWS_PER_PAGE;

  const [totalItems, setTotalItems] = useState(null);

  function clearSearch() {
    setSearchVal("");
    dispatch(
      getRestaurants({
        pageNumber,
        pageSize: itemsPerPage,
        searchKey: null,
        active: filter?.status?.value,
        city: filter?.city?.value,
        district: filter?.district?.value,
        neighbourhood: filter?.neighbourhood?.value,
      })
    );
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!searchVal) return;
    dispatch(
      getRestaurants({
        pageNumber: 1,
        pageSize: itemsPerPage,
        searchKey: searchVal,
        active: filter?.status?.value,
        city: filter?.city?.value,
        district: filter?.district?.value,
        neighbourhood: filter?.neighbourhood?.value,
      })
    );
    setPageNumber(1);
  }

  function handleFilter(bool) {
    if (bool) {
      setOpenFilter(false);
      setPageNumber(1);
      dispatch(
        getRestaurants({
          pageNumber,
          searchKey: searchVal,
          pageSize: itemsPerPage,
          active: filter?.status?.value,
          city: filter?.city?.value,
          district: filter?.district?.value,
          neighbourhood: filter?.neighbourhood?.value,
        })
      );
    } else {
      if (filter) {
        dispatch(
          getRestaurants({
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
      setFilter({
        city: null,
        district: null,
        neighbourhood: null,
      });
      setOpenFilter(false);
    }
  }

  function handlePageChange(number) {
    dispatch(
      getRestaurants({
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

  // GET RESTAURANTS
  useEffect(() => {
    if (!restaurantsData) {
      dispatch(
        getRestaurants({
          pageNumber,
          pageSize: itemsPerPage,
        })
      );
    }
  }, [restaurantsData]);

  // TOAST AND GET MERGED USERS
  useEffect(() => {
    if (error) {
      dispatch(resetGetRestaurantsState());
    }

    if (success && restaurants) {
      setTotalItems(restaurants.totalCount);
      setRestaurantsData(restaurants.data);
      dispatch(resetGetRestaurantsState());
    }
  }, [success, error, restaurants]);

  // GET AND SET CITIES
  useEffect(() => {
    if (!citiesData) {
      dispatch(getCities());
    } else {
      setCities(citiesData);
    }
  }, [citiesData]);

  // GET DISTRICTS
  useEffect(() => {
    if (filter.city?.id) {
      dispatch(getDistricts({ cityId: filter.city.id }));
      setFilter((prev) => {
        return {
          ...prev,
          district: null,
        };
      });
    }
  }, [filter.city]);

  // SET DISTRICTS
  useEffect(() => {
    if (districtsSuccess) {
      setDistricts(districtsData);
    }
  }, [districtsSuccess]);

  // GET NEIGHS
  useEffect(() => {
    if (filter.district?.id && filter.city?.id) {
      dispatch(
        getNeighs({
          cityId: filter.city.id,
          districtId: filter.district.id,
        })
      );
      setFilter((prev) => {
        return {
          ...prev,
          neighbourhood: null,
        };
      });
    }
  }, [filter.district]);

  // SET NEIGHS
  useEffect(() => {
    if (neighsSuccess) {
      setNeighs(neighsData);
    }
  }, [neighsSuccess]);

  //HIDE POPUP
  const { contentRef, setContentRef, setPopupContent } = usePopup();
  const filterRestaurant = useRef();
  useEffect(() => {
    if (filterRestaurant) {
      const refs = contentRef.filter(
        (ref) => ref.id !== "usersRestaurantFilter"
      );
      setContentRef([
        ...refs,
        {
          id: "usersRestaurantFilter",
          outRef: null,
          ref: filterRestaurant,
          callback: () => setOpenFilter(false),
        },
      ]);
    }
  }, [filterRestaurant]);

  return (
    <section className="lg:ml-[280px] pt-16 sm:pt-16 px-[4%] pb-4 grid grid-cols-1 section_row">
      {/* TITLE */}
      <div className="w-full text-[--black-2] pt-2 text-2xl font-semibold">
        <h2>Restoranlar</h2>
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
              className2="mt-[0px] w-full sm:mt-[0]"
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
            <div className="w-full relative" ref={filterRestaurant}>
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
                    label="Şehir"
                    style={{ padding: "1px 0px" }}
                    className="text-sm"
                    options={[{ value: null, label: "Hepsi" }, ...cities]}
                    optionStyle={{ fontSize: ".8rem" }}
                    value={
                      filter?.city
                        ? filter.city
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          city: selectedOption,
                        };
                      });
                    }}
                  />
                </div>

                <div className="flex gap-6">
                  <CustomSelect
                    label="District"
                    className2="sm:mt-[.75rem] mt-1"
                    className="text-sm sm:mt-[.25rem]"
                    isSearchable={false}
                    style={{ padding: "0 !important" }}
                    options={[{ value: null, label: "Hepsi" }, ...districts]}
                    optionStyle={{ fontSize: ".8rem" }}
                    value={
                      filter?.district
                        ? filter.district
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          district: selectedOption,
                        };
                      });
                    }}
                  />
                  <CustomSelect
                    label="neighbourhood"
                    className2="sm:mt-[.75rem] mt-1"
                    className="text-sm sm:mt-[.25rem]"
                    isSearchable={false}
                    style={{ padding: "0 !important" }}
                    options={[{ value: null, label: "Hepsi" }, ...neighs]}
                    optionStyle={{ fontSize: ".8rem" }}
                    value={
                      filter?.neighbourhood
                        ? filter.neighbourhood
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          neighbourhood: selectedOption,
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

            <div>
              <AddRestaurant onSuccess={() => handleFilter(true)} />
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {restaurantsData ? (
        <RestaurantsCard
          inData={restaurantsData}
          Actions={RestaurantActions}
          totalItems={restaurantsData.length}
          onSuccess={() => handleFilter(true)}
        />
      ) : loading ? (
        <TableSkeleton />
      ) : null}

      {/* PAGINATION */}
      {restaurantsData && typeof totalItems === "number" && (
        <div className="w-full self-end flex justify-center pt-2 text-[--black-2]">
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

export default RestaurantsPage;

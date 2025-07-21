//MODULES
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import UsersTable from "../userTable";
import AddUser from "../actions/addUser";
import CloseI from "../../../assets/icon/close";
import CustomInput from "../../common/customInput";
import CustomPagination from "../../common/pagination";
import TableSkeleton from "../../common/tableSkeleton";
import CustomSelect from "../../common/customSelector";
import { usePopup } from "../../../context/PopupContext";

//REDUX
import {
  getUsers,
  resetGetUsersState,
} from "../../../redux/users/getUsersSlice";
import { getCities } from "../../../redux/data/getCitiesSlice";

const UsersPage = () => {
  const dispatch = useDispatch();
  const { loading, success, error, users } = useSelector(
    (state) => state.users.getUsers
  );
  const { cities: citiesData } = useSelector((state) => state.data.getCities);

  const [searchVal, setSearchVal] = useState("");
  const [usersData, setUsersData] = useState(null);
  const [filter, setFilter] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

  const [pageNumber, setPageNumber] = useState(1);
  const itemsPerPage = import.meta.env.VITE_ROWS_PER_PAGE;

  const [cities, setCities] = useState([]);
  const [totalItems, setTotalItems] = useState(null);
  // const lastItemIndex = pageNumber * itemsPerPage;
  // const firstItemIndex = lastItemIndex - itemsPerPage;
  //const currentItems = usersData?.slice(firstItemIndex, lastItemIndex);

  function clearSearch() {
    setSearchVal("");
    dispatch(
      getUsers({
        pageNumber,
        pageSize: itemsPerPage,
        searchKey: null,
        active: filter?.active?.value,
        verify: filter?.verify?.value,
        dealer: filter?.dealer?.value,
        city: filter?.city?.value,
      })
    );
  }

  function handleSearch(e) {
    e.preventDefault();
    if (!searchVal) return;
    dispatch(
      getUsers({
        pageNumber: 1,
        searchKey: searchVal,
        pageSize: itemsPerPage,
        active: filter?.active?.value,
        verify: filter?.verify?.value,
        dealer: filter?.dealer?.value,
        city: filter?.city?.value,
      })
    );
    setPageNumber(1);
  }

  const handleFilter = (bool) => {
    if (bool) {
      setOpenFilter(false);
      setPageNumber(1);
      dispatch(
        getUsers({
          pageNumber: 1,
          searchKey: searchVal,
          pageSize: itemsPerPage,
          active: filter?.active?.value,
          verify: filter?.verify?.value,
          dealer: filter?.dealer?.value,
          city: filter?.city?.value,
        })
      );
    } else {
      if (filter) {
        dispatch(
          getUsers({
            pageNumber,
            pageSize: itemsPerPage,
            searchKey: searchVal,
            active: null,
            verify: null,
            dealer: null,
            city: null,
          })
        );
      }
      setFilter(null);
      setOpenFilter(false);
    }
  };

  const handlePageChange = (number) => {
    dispatch(
      getUsers({
        pageNumber: number,
        pageSize: itemsPerPage,
        searchKey: searchVal,
        active: filter?.active?.value,
        verify: filter?.verify?.value,
        dealer: filter?.dealer?.value,
        city: filter?.city?.value,
      })
    );
  };

  // GET USERS
  useEffect(() => {
    if (!usersData) {
      dispatch(
        getUsers({
          page: pageNumber,
          pageSize: itemsPerPage,
          searchKey: searchVal,
          active: null,
          verify: null,
          dealer: null,
          city: null,
        })
      );
    }
  }, [usersData]);

  // TOAST AND SET USERS
  useEffect(() => {
    if (error) {
      if (error?.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      dispatch(resetGetUsersState());
    }

    if (success) {
      setUsersData(users?.users);
      setTotalItems(users?.total);
      dispatch(resetGetUsersState());
    }
  }, [loading, success, error, users]);

  // GET CITIES
  useEffect(() => {
    if (!citiesData) {
      dispatch(getCities());
    } else {
      setCities(citiesData);
    }
  }, [citiesData]);

  //HIDE POPUP
  const { contentRef, setContentRef, setShowPopup, setPopupContent } =
    usePopup();
  const usersFilterRef = useRef();
  useEffect(() => {
    if (usersFilterRef) {
      const refs = contentRef.filter((ref) => ref.id !== "usersFilter");
      setContentRef([
        ...refs,
        {
          id: "usersFilter",
          outRef: null,
          ref: usersFilterRef,
          callback: () => setOpenFilter(false),
        },
      ]);
    }
  }, [usersFilterRef]);

  return (
    <section className="lg:ml-[280px] pt-16 px-[4%] pb-4 grid grid-cols-1 section_row">
      {/* TITLE */}
      <div className="w-full text-[--black-2] text-2xl font-semibold pt-2">
        <h2>Kullanıcılar</h2>
      </div>

      {/* ACTIONS/BUTTONS */}
      <div className="w-full flex justify-between items-end mb-6 flex-wrap gap-2">
        <div className="flex items-center w-full max-w-sm max-sm:order-2">
          <form className="w-full" onSubmit={(e) => handleSearch(e)}>
            <CustomInput
              onChange={(e) => {
                setSearchVal(e);
                !e && clearSearch();
              }}
              value={searchVal}
              placeholder="Ara..."
              className2="mt-[0px] w-full mt-[0] sm:mt-[0]"
              className="mt-[0px] py-[.7rem] w-[100%] focus:outline-none"
              icon={<CloseI className="w-4 text-[--red-1]" />}
              className4={`hover:bg-[--light-4] rounded-full px-2 py-1 ${
                searchVal ? "block" : "hidden"
              }`}
              iconClick={clearSearch}
            />
          </form>
        </div>

        <div className="max-sm:w-full flex justify-end">
          <div className="flex gap-2 max-sm:order-1 " ref={usersFilterRef}>
            <div className="w-full relative">
              <button
                className="w-full h-11 flex items-center justify-center text-[--primary-2] px-3 rounded-md text-sm font-normal border-[1.5px] border-solid border-[--primary-2]"
                onClick={() => setOpenFilter(!openFilter)}
              >
                Filtre
              </button>

              <div
                className={`absolute right-[-100px] sm:right-0 top-12 px-4 pb-3 flex flex-col bg-[--white-1] w-[22rem] border border-solid border-[--light-3] rounded-lg drop-shadow-md -drop-shadow-md z-50 ${
                  openFilter ? "visible" : "hidden"
                }`}
              >
                <div className="flex gap-6">
                  <CustomSelect
                    label="Rol"
                    className="text-sm sm:mt-1"
                    className2="sm:mt-3"
                    style={{ padding: "0 !important" }}
                    options={[
                      { value: null, label: "Hepsi" },
                      { value: true, label: "Bayi" },
                      { value: false, label: "Müşteri" },
                    ]}
                    value={
                      filter?.dealer
                        ? filter.dealer
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          dealer: selectedOption,
                        };
                      });
                    }}
                  />

                  <CustomSelect
                    label="Şehir"
                    className="text-sm sm:mt-1"
                    className2="sm:mt-3"
                    style={{ padding: "0 !important" }}
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
                    label="Durum"
                    className2="sm:mt-[.75rem] mt-1"
                    className="text-sm sm:mt-[.25rem]"
                    isSearchable={false}
                    style={{ padding: "0 !important" }}
                    options={[
                      { value: null, label: "Hepsi" },
                      { value: true, label: "Aktif" },
                      { value: false, label: "Pasif" },
                    ]}
                    value={
                      filter?.active
                        ? filter.active
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          active: selectedOption,
                        };
                      });
                    }}
                  />
                  <CustomSelect
                    label="Onay"
                    className2="sm:mt-[.75rem] mt-1"
                    className="text-sm sm:mt-[.25rem]"
                    isSearchable={false}
                    style={{ padding: "0 !important" }}
                    options={[
                      { value: null, label: "Hepsi" },
                      { value: true, label: "Onaylı" },
                      { value: false, label: "Onlaylanmadı" },
                    ]}
                    value={
                      filter?.verify
                        ? filter.verify
                        : { value: null, label: "Hepsi" }
                    }
                    onChange={(selectedOption) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          verify: selectedOption,
                        };
                      });
                    }}
                  />
                </div>

                {/* 
                <div className="flex gap-2">
                  <CustomDatePicker
                    label="Başlangıç"
                    className="sm:py-[.5rem] py-[.5rem] w-full"
                    className2="sm:mt-[.75rem]"
                    popperClassName="custom-popper-left"
                    dateFormat="dd.MM.yyyy"
                    value={filter?.startDateTime ? filter.startDateTime : null}
                    onChange={(date) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          startDateTime: date,
                        };
                      });
                    }}
                  />
                  <CustomDatePicker
                    label="Bitiş"
                    className="sm:py-[.5rem] py-[.5rem] w-full"
                    className2="sm:mt-[.75rem]"
                    popperClassName="custom-popper-right"
                    dateFormat="dd.MM.yyyy"
                    value={filter?.endDateTime ? filter.endDateTime : null}
                    onChange={(date) => {
                      setFilter((prev) => {
                        return {
                          ...prev,
                          endDateTime: date,
                        };
                      });
                    }}
                  />
                </div>
                */}

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
              <button
                className="h-11 whitespace-nowrap text-[--primary-2] px-3 rounded-md text-sm font-normal border-[1.5px] border-solid border-[--primary-2]"
                onClick={() => {
                  setShowPopup(true);
                  setPopupContent(
                    <AddUser onSuccess={() => handleFilter(true)} />
                  );
                }}
              >
                Kullanıcı Ekle
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {usersData ? (
        <UsersTable
          users={usersData}
          itemsPerPage={itemsPerPage}
          onSuccess={() => handleFilter(true)}
        />
      ) : loading ? (
        <TableSkeleton />
      ) : null}

      {/* PAGINATION */}
      {usersData && typeof totalItems === "number" && (
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

export default UsersPage;

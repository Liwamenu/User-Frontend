// MODULES
import { isEqual } from "lodash";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";

// UTILS
import { usePopup } from "../../../context/PopupContext";
import { formatDateString } from "../../../utils/utils";
import { useWaiterCalls } from "../../../context/waiterCallsContext";

// REDUX
import { getWaiterCalls } from "../../../redux/waiterCalls/getWaiterCallsSlice";
import CustomDatePicker from "../../common/customdatePicker";
import CustomSelect from "../../common/customSelector";

const PRIMARY_GRADIENT =
  "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #06b6d4 100%)";

const FilterWaiterCalls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const filterRef = useRef();
  const { contentRef, setContentRef } = usePopup();
  const { pageSize, setPageNumber, filterInitialState, filter, setFilter } =
    useWaiterCalls();

  const [openFilter, setOpenFilter] = useState(false);

  const formatDate = (date) => {
    const dateInFront = formatDateString(date, true, true, true);
    return dateInFront.split("-").reverse().join("-");
  };

  function handleFilter(apply) {
    if (apply) {
      const filterData = {
        page: 1,
        pageSize: pageSize.value,
        startDateTime: filter.endDateTime
          ? formatDate(filter.startDateTime)
          : null,
        endDateTime: filter.endDateTime ? formatDate(filter.endDateTime) : null,
        isResolved: filter.isResolved.value,
        tableNUmber: filter.tableNumber,
      };
      dispatch(getWaiterCalls(filterData));
    } else {
      if (!isEqual(filterInitialState, filter)) {
        setFilter(filterInitialState);
        dispatch(getWaiterCalls({ page: 1, pageSize: pageSize.value }));
      }
    }
    setPageNumber(1);
    setOpenFilter(false);
  }

  // Close popover on outside click via shared popup outside-click handler.
  useEffect(() => {
    if (filterRef) {
      const refs = contentRef.filter((ref) => ref.id !== "waiterCallsFilter");
      setContentRef([
        ...refs,
        {
          id: "waiterCallsFilter",
          outRef: null,
          ref: filterRef,
          callback: () => setOpenFilter(false),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRef]);

  const activeFilterCount = [
    filter.startDateTime,
    filter.endDateTime,
    filter.isResolved?.value !== null && filter.isResolved?.value !== undefined
      ? 1
      : null,
  ].filter(Boolean).length;

  return (
    <div className="relative" ref={filterRef}>
      <button
        type="button"
        onClick={() => setOpenFilter(!openFilter)}
        className={`relative inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold transition border ${
          openFilter || activeFilterCount > 0
            ? "border-indigo-300 bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-200 dark:border-indigo-400/30"
            : "border-[--border-1] bg-[--white-1] text-[--black-1] hover:border-indigo-300 hover:text-indigo-600"
        }`}
      >
        <SlidersHorizontal className="size-3.5" />
        {t("waiterCalls.filter_button")}
        {activeFilterCount > 0 && (
          <span
            className="grid place-items-center min-w-[18px] h-4 px-1 rounded-full text-white text-[10px] font-bold"
            style={{ background: PRIMARY_GRADIENT }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>

      {openFilter && (
        <div className="absolute right-0 top-11 z-[999] w-[min(92vw,22rem)] rounded-xl border border-[--border-1] bg-[--white-1] shadow-xl overflow-hidden">
          <div className="h-0.5" style={{ background: PRIMARY_GRADIENT }} />
          <div className="px-4 py-3 border-b border-[--border-1] flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[--gr-1]">
              {t("waiterCalls.filters_title")}
            </h3>
            <button
              type="button"
              onClick={() => setOpenFilter(false)}
              className="grid place-items-center size-7 rounded-md text-[--gr-1] hover:bg-[--white-2] hover:text-[--black-1] transition"
              aria-label={t("waiterCalls.clear")}
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <CustomDatePicker
                label={t("waiterCalls.start_date")}
                className="text-sm py-2"
                popperClassName="react-datepicker-popper-filter-order-1"
                value={filter.startDateTime}
                dateOnly
                onChange={(d) =>
                  setFilter((p) => ({ ...p, dateRange: 0, startDateTime: d }))
                }
              />
              <CustomDatePicker
                label={t("waiterCalls.end_date")}
                className="text-sm py-2"
                popperClassName="react-datepicker-popper-filter-order-2"
                value={filter.endDateTime}
                dateOnly
                onChange={(d) =>
                  setFilter((p) => ({ ...p, dateRange: 0, endDateTime: d }))
                }
              />
            </div>

            <CustomSelect
              label={t("waiterCalls.is_resolved")}
              className="text-sm"
              options={[
                { label: t("waiterCalls.status_all"), value: null },
                { label: t("waiterCalls.status_resolved"), value: true },
                { label: t("waiterCalls.status_pending"), value: false },
              ]}
              value={filter.isResolved}
              onChange={(opt) =>
                setFilter((p) => ({
                  ...p,
                  statusId: opt.value,
                  isResolved: opt,
                }))
              }
            />
          </div>

          <div className="px-4 py-3 border-t border-[--border-1] bg-[--white-2] flex justify-end gap-2">
            <button
              type="button"
              onClick={() => handleFilter(false)}
              className="h-9 px-3.5 rounded-lg text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition dark:bg-rose-500/15 dark:text-rose-200 dark:border-rose-400/30"
            >
              {t("waiterCalls.clear")}
            </button>
            <button
              type="button"
              onClick={() => handleFilter(true)}
              className="h-9 px-4 rounded-lg text-xs font-semibold text-white shadow-md shadow-indigo-500/25 hover:brightness-110 transition"
              style={{ background: PRIMARY_GRADIENT }}
            >
              {t("waiterCalls.apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterWaiterCalls;

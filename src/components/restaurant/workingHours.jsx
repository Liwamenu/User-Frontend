// MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

// COMP
import CustomToggle from "../common/customToggle";
import CustomDatePicker from "../common/customdatePicker";

// REDUX
import {
  setWorkingHours,
  resetSetWorkingHours,
} from "../../redux/restaurant/setWorkingHoursSlice";
import { getWorkingHours } from "../../redux/restaurant/getWorkingHoursSlice";

const WorkingHours = ({ data }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const id = useParams()["*"]?.split("/")[1];

  const { success, loading } = useSelector((s) => s.restaurant.setWorkingHours);
  const { data: workingHours } = useSelector(
    (s) => s.restaurant.getWorkingHours
  );

  const [workingHoursData, setWorkingHoursData] = useState([]);

  // Parse "HH:mm" string to Date object
  function parseTimeToDate(str) {
    if (!str) return null;
    const [h, m] = str.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  }

  // Format Date object to "HH:mm" string
  function formatTimeHHmm(d) {
    if (!d || isNaN(d.getTime())) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  //GET WORKING HOURS
  useEffect(() => {
    if (!workingHoursData?.length) {
      dispatch(getWorkingHours({ restaurantId: id }));
    }
  }, [workingHours, dispatch, id]);

  // Update working hours data when fetched from server
  useEffect(() => {
    if (workingHours) {
      const mapped = workingHours.days.map((item) => ({
        Day: item.day,
        IsClosed: item.isClosed,
        Open: parseTimeToDate(item.open),
        Close: parseTimeToDate(item.close),
      }));
      setWorkingHoursData(mapped);
      dispatch(resetSetWorkingHours());
    }
  }, [workingHours]);

  // Toast notifications
  useEffect(() => {
    if (loading)
      toast.loading(t("workingHours.processing"), { id: "workingHours" });
    if (success) {
      toast.success(t("workingHours.success"), {
        id: "workingHours",
      });
      dispatch(resetSetWorkingHours());
    }
  }, [loading, success, dispatch]);

  // Update a specific day's data
  const setDay = (day, patch) =>
    setWorkingHoursData((prev) =>
      prev.map((r) => (r.Day === day ? { ...r, ...patch } : r))
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate open days have both times set
    const invalid = workingHoursData.find(
      (r) => !r.IsClosed && (!r.Open || !r.Close)
    );
    if (invalid) {
      toast.error(t("workingHours.select_time"));
      return;
    }

    const payload = {
      restaurantId: id,
      days: workingHoursData.map((r) => ({
        day: r.Day,
        isClosed: r.IsClosed,
        open: r.IsClosed ? "00:00" : formatTimeHHmm(r.Open),
        close: r.IsClosed ? "23:59" : formatTimeHHmm(r.Close),
      })),
    };

    dispatch(setWorkingHours(payload));
  };

  const dayDefs = [
    { label: t("workingHours.monday"), day: 1 },
    { label: t("workingHours.tuesday"), day: 2 },
    { label: t("workingHours.wednesday"), day: 3 },
    { label: t("workingHours.thursday"), day: 4 },
    { label: t("workingHours.friday"), day: 5 },
    { label: t("workingHours.saturday"), day: 6 },
    { label: t("workingHours.sunday"), day: 7 },
  ];

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          {t("workingHours.title", { name: data?.name })}
        </h1>

        <form onSubmit={handleSubmit} className="mt-16 space-y-5">
          {workingHoursData.length > 0 &&
            dayDefs.map(({ label, day }) => {
              const row = workingHoursData.find((r) => r.Day === day) || {
                Day: day,
                IsClosed: true,
                Open: null,
                Close: null,
              };
              const disabled = row.IsClosed;

              return (
                <div
                  key={day}
                  className="w-full flex items-center max-md:flex-col max-md:items-start"
                >
                  <div className="w-28 font-semibold mb-2">{label}</div>

                  <div className="flex gap-3 items-center">
                    <div className="flex items-center">
                      <CustomToggle
                        label={
                          row.IsClosed ? (
                            <div className="w-14">
                              {t("workingHours.closed")}
                            </div>
                          ) : (
                            <div className="w-14">{t("workingHours.open")}</div>
                          )
                        }
                        checked={!row.IsClosed}
                        onChange={() =>
                          setDay(day, { IsClosed: !row.IsClosed })
                        }
                        className="max-sm:scale-[0.8]"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <CustomDatePicker
                        label=""
                        timeOnly={true}
                        value={row.Open}
                        calendarClassName
                        placeholder="--:--"
                        isDisabled={disabled}
                        className="mt-[0] sm:mt-[0] py-3"
                        className2="mt-[0] sm:mt-[0] w-auto"
                        onChange={(v) => setDay(day, { Open: v })}
                      />
                      <span className="text-gray-500">-</span>
                      <CustomDatePicker
                        label=""
                        timeOnly={true}
                        value={row.Close}
                        calendarClassName
                        placeholder="--:--"
                        isDisabled={disabled}
                        className="mt-[0] sm:mt-[0] py-3"
                        className2="mt-[0] sm:mt-[0] w-auto"
                        onChange={(v) => setDay(day, { Close: v })}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

          <div className="w-full flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[--primary-1] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("workingHours.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkingHours;

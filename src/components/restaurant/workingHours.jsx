// MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// COMP
import CustomToggle from "../common/customToggle";
import CustomDatePicker from "../common/customdatePicker";

// REDUX
import {
  setWorkingHours,
  resetSetWorkingHours,
} from "../../redux/restaurant/setWorkingHoursSlice";

const dayDefs = [
  { label: "Pazartesi", day: 1 },
  { label: "Salı", day: 2 },
  { label: "Çarşamba", day: 3 },
  { label: "Perşembe", day: 4 },
  { label: "Cuma", day: 5 },
  { label: "Cumartesi", day: 6 },
  { label: "Pazar", day: 7 },
];

const WorkingHours = ({ data }) => {
  const dispatch = useDispatch();
  const id = useParams()["*"]?.split("/")[1];

  const { success, loading } = useSelector((s) => s.restaurant.setWorkingHours);

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

  // Initialize working hours data from props
  useEffect(() => {
    if (data?.workingHours) {
      try {
        const parsed = JSON.parse(data.workingHours);
        const mapped = parsed.map((item) => ({
          Day: item.Day,
          IsClosed: item.IsClosed,
          Open: parseTimeToDate(item.Open),
          Close: parseTimeToDate(item.Close),
        }));
        setWorkingHoursData(mapped);
      } catch (error) {
        console.error("Error parsing working hours:", error);
        // Initialize with default closed days
        setWorkingHoursData(
          dayDefs.map((d) => ({
            Day: d.day,
            IsClosed: true,
            Open: parseTimeToDate("00:00"),
            Close: parseTimeToDate("23:59"),
          }))
        );
      }
    } else {
      // Initialize with default closed days if no data
      setWorkingHoursData(
        dayDefs.map((d) => ({
          Day: d.day,
          IsClosed: true,
          Open: parseTimeToDate("00:00"),
          Close: parseTimeToDate("23:59"),
        }))
      );
    }
  }, [data]);

  // Toast notifications
  useEffect(() => {
    if (loading) toast.loading("İşleniyor...", { id: "workingHours" });
    if (success) {
      toast.success("Çalışma saatleri başarıyla güncellendi.", {
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
      toast.error("Açık olan günlerde açılış ve kapanış saatlerini seçin.");
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

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Çalışma Saatleri {data?.name} Restoranı
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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
                <div key={day} className="w-full">
                  <div className="w-28 font-semibold mb-2">{label}</div>

                  <div className="flex gap-3 items-center">
                    <div className="flex items-center">
                      <CustomToggle
                        label={
                          row.IsClosed ? (
                            "Kapalı"
                          ) : (
                            <span className="pr-3">Açık</span>
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
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkingHours;

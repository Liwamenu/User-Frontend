// MODULES
import toast from "react-hot-toast";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// COMP
import CustomToggle from "../common/customToggle";
import CustomDatePicker from "../common/customdatePicker";

// REDUX
import {
  getWorkingHours,
  resetGetWorkingHours,
} from "../../redux/restaurant/getWorkingHoursSlice";
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

const WorkingHours = ({ data: restaurant }) => {
  const dispatch = useDispatch();
  const id = useParams()["*"].split("/")[1];

  const { data } = useSelector((s) => s.restaurant.getWorkingHours);
  const { success, loading } = useSelector((s) => s.restaurant.setWorkingHours);

  // editable week
  const emptyWeek = useMemo(
    () =>
      dayDefs.map((d) => ({
        day: d.day, // 1..7
        isClosed: true,
        open: null, // will store whatever DatePicker returns
        close: null,
      })),
    []
  );
  const [rows, setRows] = useState(emptyWeek);

  // "13:45" -> Date today 13:45
  function parseTimeToDate(str) {
    if (!str) return null;
    const [h, m] = str.split(":").map(Number);
    const d = new Date();
    d.setHours(h || 0, m || 0, 0, 0);
    return d;
  }

  // GET THE DATA
  useEffect(() => {
    dispatch(getWorkingHours({ restaurantId: id }));
  }, [dispatch, id]);

  // map API -> local state (no parsing; keep values as-is)
  useEffect(() => {
    if (!data) return;
    const byDay = new Map((data.days || []).map((d) => [d.day, d]));
    const merged = dayDefs.map((d) => {
      const src = byDay.get(d.day);
      return src
        ? {
            day: d.day,
            isClosed: !!src.isClosed,
            open: parseTimeToDate(src.open) ?? null,
            close: parseTimeToDate(src.close) ?? null,
          }
        : { day: d.day, isClosed: true, open: null, close: null };
    });
    setRows(merged);
    dispatch(resetGetWorkingHours());
  }, [data, dispatch]);

  // TOAST AND RESET
  useEffect(() => {
    if (loading) toast.loading("İşleniyor...");
    if (success) {
      toast.dismiss();
      toast.success("Çalışma saatleri başarıyla güncellendi.");
      dispatch(resetSetWorkingHours());
    }
  }, [loading, success, dispatch]);

  // helpers
  const setDay = (day, patch) =>
    setRows((prev) =>
      prev.map((r) => (r.day === day ? { ...r, ...patch } : r))
    );

  // Date -> "HH:mm"
  function formatTimeHHmm(d) {
    if (!d || Number.isNaN(d.getTime())) return "";
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    // If a day is open, ensure both values exist (but keep them *as-is*)
    const invalid = rows.find((r) => !r.isClosed && (!r.open || !r.close));
    if (invalid) {
      toast.error("Açık olan günlerde açılış ve kapanış saatlerini seçin.");
      return;
    }

    const payload = {
      restaurantId: id,
      days: rows.map((r) => ({
        day: r.day,
        isClosed: !!r.isClosed,
        open: r.isClosed ? "" : formatTimeHHmm(r.open),
        close: r.isClosed ? "" : formatTimeHHmm(r.close),
      })),
    };

    dispatch(setWorkingHours(payload));
  };

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14 ">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Çalışma Saatleri {restaurant?.name} Restoranı
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {dayDefs.map(({ label, day }) => {
            const row = rows.find((r) => r.day === day) || {};
            const disabled = row.isClosed;

            return (
              <div key={day} className="w-full">
                <div className="w-28 font-semibold">{label}</div>

                <div className="flex gap-3">
                  <div className="flex items-center">
                    <CustomToggle
                      label={
                        row.isClosed ? (
                          "Kapalı"
                        ) : (
                          <span className="pr-3 ">Açık</span>
                        )
                      }
                      checked={!row.isClosed}
                      onChange={() => setDay(day, { isClosed: !row.isClosed })}
                      className="max-sm:scale-[0.8]"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <CustomDatePicker
                      label=""
                      timeOnly={true}
                      value={row.open}
                      calendarClassName
                      placeholder="--:--"
                      isDisabled={disabled}
                      className="mt-[0] sm:mt-[0] py-3"
                      className2="mt-[0] sm:mt-[0] w-auto"
                      onChange={(v) => setDay(day, { open: v })} // keep as-is
                    />
                    <CustomDatePicker
                      label=""
                      timeOnly={true}
                      value={row.close}
                      calendarClassName
                      placeholder="--:--"
                      isDisabled={disabled}
                      className="mt-[0] sm:mt-[0] py-3"
                      className2="mt-[0] sm:mt-[0] w-auto"
                      onChange={(v) => setDay(day, { close: v })} // keep as-is
                    />
                  </div>
                </div>
              </div>
            );
          })}

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[--primary-1] text-white font-semibold"
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

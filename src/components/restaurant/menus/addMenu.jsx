//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import CustomInput from "../../common/customInput";
import { CancelI, WaitI } from "../../../assets/icon";

//REDUX
import { addMenu, resetaddMenu } from "../../../redux/menus/addMenuSlice";
import { useParams } from "react-router-dom";

const DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const AddMenu = ({ onClose, onSave }) => {
  const params = useParams();
  const restaurantId = params.id;
  const dispatch = useDispatch();

  const { success, error } = useSelector((s) => s.menus.add);

  const [menuName, setMenuName] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);

  const newMenu = {
    id: Date.now(),
    restaurantId,
    name: menuName,
    plans: schedules.map((sch) => ({
      id: sch.id,
      days: sch.days,
      startTime: sch.start,
      endTime: sch.end,
    })),
    categoryIds,
  };

  const addScheduleRow = (data = null) => {
    const newSchedule = {
      id: `sch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      days: data?.days || [],
      start: data?.startTime || "00:00",
      end: data?.endTime || "23:59",
    };
    setSchedules([...schedules, newSchedule]);
  };

  const removeScheduleRow = (rowId) => {
    setSchedules(schedules.filter((s) => s.id !== rowId));
  };

  const toggleScheduleDay = (rowId, dayIndex) => {
    setSchedules(
      schedules.map((sch) => {
        if (sch.id === rowId) {
          const days = sch.days.includes(dayIndex)
            ? sch.days.filter((d) => d !== dayIndex)
            : [...sch.days, dayIndex];
          return { ...sch, days };
        }
        return sch;
      })
    );
  };

  const updateScheduleTime = (rowId, field, value) => {
    setSchedules(
      schedules.map((sch) =>
        sch.id === rowId ? { ...sch, [field]: value } : sch
      )
    );
  };

  const handleSave = () => {
    if (!menuName.trim()) {
      toast.error("Menü adı gereklidir!");
      return;
    }

    if (schedules.length === 0) {
      toast.error("Zaman planı eklemelisiniz!");
      return;
    }

    const hasInvalidSchedules = schedules.some((sch) => sch.days.length === 0);
    if (hasInvalidSchedules) {
      toast.error("Her plan için gün seçilmelidir!");
      return;
    }

    console.log(newMenu);
    dispatch(addMenu(newMenu));
  };

  useEffect(() => {
    if (success) {
      toast.success("Menü başarıyla eklendi.");
      dispatch(resetaddMenu());
      onSave(newMenu);
      onClose();
    }
    if (error) dispatch(resetaddMenu());
  }, [success, error]);

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center transition-all duration-300">
      <div className="bg-[--white-1] rounded-2xl shadow-2xl w-full max-w-lg p-8 transform scale-95 transition-all duration-300 modal-content relative flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6 border-b border-[--border-1] pb-4">
          <h3 className="text-2xl font-bold text-[--black-1]">Yeni Menü</h3>
          <button
            onClick={onClose}
            className="text-[--gr-1] hover:text-[--black-2] transition-colors"
          >
            <CancelI className="size-[1.5rem]" />
          </button>
        </div>

        <div className="space-y-5 overflow-y-auto pr-2 custom-scrollbar flex-1">
          <div>
            <label className="block text-[--black-2] text-sm font-medium mb-2">
              Menü Adı <span className="text-[--red-1]">*</span>
            </label>
            <CustomInput
              required
              placeholder="Örn: Öğle Menüsü"
              className="w-full rounded-xl border-[--border-1] bg-[--light-1] focus:bg-[--white-1] p-3.5 text-[--black-1] border focus:border-[--primary-1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              value={menuName}
              onChange={(v) => setMenuName(v)}
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="block text-[--black-2] text-sm font-medium">
                Aktif Gün ve Saatler
              </label>
              <button
                type="button"
                onClick={() => addScheduleRow()}
                className="text-xs bg-[--status-primary-1] text-[--primary-1] px-3 py-1.5 rounded-lg hover:bg-[--status-primary-2] transition font-medium border border-[--border-1] flex gap-1 whitespace-nowrap"
              >
                <CancelI className="rotate-45 size-[1rem]" /> Yeni Plan Ekle
              </button>
            </div>

            <div className="space-y-3">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="bg-[--light-1] p-3 rounded-xl border border-[--border-1] relative group transition-all hover:border-[--primary-1]"
                >
                  {/* Days */}
                  <div className="flex flex-wrap gap-1.5 mb-3 justify-center sm:justify-start">
                    {DAYS.map((day, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleScheduleDay(sch.id, idx)}
                        className={`text-[10px] w-8 h-8 rounded-full border flex items-center justify-center transition-colors font-medium ${
                          sch.days.includes(idx)
                            ? "bg-[--primary-1] text-white border-[--primary-1]"
                            : "bg-[--white-1] text-[--gr-1] border-[--border-1]"
                        }`}
                      >
                        {day.substring(0, 2)}
                      </button>
                    ))}
                  </div>

                  {/* Times */}
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <WaitI className="size-[1rem] absolute left-2 top-1/2 -translate-y-1/2 text-[--gr-1] text-xs" />
                      <input
                        type="time"
                        className="w-full pl-7 pr-2 py-1.5 text-sm border border-[--border-1] rounded-lg outline-none focus:border-[--primary-1] bg-[--white-1] text-[--black-1]"
                        value={sch.start}
                        onChange={(e) =>
                          updateScheduleTime(sch.id, "start", e.target.value)
                        }
                      />
                    </div>
                    <span className="text-[--gr-1] text-sm">-</span>
                    <div className="relative flex-1">
                      <WaitI className="size-[1rem] absolute left-2 top-1/2 -translate-y-1/2 text-[--gr-1] text-xs" />
                      <input
                        type="time"
                        className="w-full pl-7 pr-2 py-1.5 text-sm border border-[--border-1] rounded-lg outline-none focus:border-[--primary-1] bg-[--white-1] text-[--black-1]"
                        value={sch.end}
                        onChange={(e) =>
                          updateScheduleTime(sch.id, "end", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeScheduleRow(sch.id)}
                    className="absolute -top-2 -right-2 bg-[--status-red] text-[--red-1] w-6 h-6 rounded-full flex items-center justify-center hover:bg-[--red-1] hover:text-white transition-colors shadow-sm"
                  >
                    <CancelI className="size-[1rem]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-[--border-1] mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-[--black-2] bg-[--white-1] border border-[--border-1] rounded-xl hover:bg-[--light-1] transition-all"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 text-sm font-medium text-white bg-[--primary-1] rounded-xl shadow-lg hover:bg-[--primary-2] transition-all"
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMenu;

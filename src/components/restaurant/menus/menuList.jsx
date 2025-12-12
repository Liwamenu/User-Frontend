import { useMemo } from "react";
import { EditI, DeleteI, WaitI } from "../../../assets/icon";
import menusJSON from "../../../assets/js/Menus.json";
import { usePopup } from "../../../context/PopupContext";
import AddMenu from "./addMenu";
import EditMenu from "./editMenu";
import DeleteMenu from "./deleteMenu";

const DAYS = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

const MenuList = ({}) => {
  const { setPopupContent } = usePopup();
  const menus = menusJSON.menus;
  const list = useMemo(() => menus || [], [menus]);

  const varColor = (key) => {
    const colors = ["var(--primary-1)", "var(--red-1)", "var(--green-1)"];

    // Always cycle through the array, even if key is huge
    const index = key % colors.length;
    return colors[index] || "var(--primary-1)";
  };

  function onAddMenu() {
    setPopupContent(<AddMenu onClose={() => setPopupContent(false)} />);
  }
  function onEditMenu(menu) {
    setPopupContent(
      <EditMenu menu={menu} onClose={() => setPopupContent(false)} />
    );
  }
  function onDeleteMenu(menu) {
    setPopupContent(
      <DeleteMenu menu={menu} onClose={() => setPopupContent(false)} />
    );
  }
  function onGoToCategories() {}

  return (
    <div className="space-y-6 mt-1">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-[--black-1]">Menü Listesi</h2>
        <button
          type="button"
          onClick={onAddMenu}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[--primary-1] rounded-xl shadow-lg hover:bg-[--primary-2] transition-all flex items-center"
        >
          <i className="fa-solid fa-plus mr-2" /> Yeni Menü Ekle
        </button>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        id="menu-list-container"
      >
        {list.map((menu, index) => {
          const headerBg = varColor(index);
          return (
            <div
              key={menu.id}
              className="bg-[--white-1] rounded-xl border border-[--border-1] shadow-sm hover:shadow-lg transition-all relative overflow-hidden flex flex-col h-full"
            >
              <div
                className="p-4 text-white flex justify-between items-start"
                style={{ backgroundColor: headerBg }}
              >
                <h3 className="text-lg font-bold drop-shadow-sm">
                  {menu.name}
                </h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEditMenu?.(menu)}
                    className="text-white/90 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <EditI className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMenu?.(menu)}
                    className="text-white/90 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <DeleteI className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 pt-4 space-y-3 flex-1 flex flex-col">
                <div className="space-y-2 border-t border-[--border-1] pt-2 flex-1">
                  {menu.plans && menu.plans.length > 0 ? (
                    menu.plans.map((plan, i) => {
                      const dayBadges =
                        plan.days?.length === 7
                          ? "Her Gün"
                          : (plan.days || [])
                              .map((d) => DAYS[d]?.substring(0, 3))
                              .join(", ");
                      return (
                        <div
                          key={i}
                          className="text-xs text-[--gr-1] flex items-start mb-1"
                        >
                          <WaitI className="size-[1rem] mr-1" />
                          <span className="flex-1">
                            <span className="font-medium text-[--black-2]">
                              {plan.startTime} - {plan.endTime}
                            </span>
                            <span className="block text-[--gr-1] text-[10px]">
                              {dayBadges}
                            </span>
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-[--gr-1] italic">
                      Zaman planı eklenmemiş.
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-2 flex justify-between items-center text-xs font-medium">
                  <span className="text-[--gr-2]">ID: {menu.id}</span>
                  <button
                    type="button"
                    onClick={() => onGoToCategories?.(menu.id)}
                    className="text-[--primary-1] bg-[--status-primary-1] px-3 py-1.5 rounded-lg hover:bg-[--status-primary-2] transition-colors"
                  >
                    Kategorileri Gör{" "}
                    <i className="fa-solid fa-arrow-right ml-1" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuList;

import CustomInput from "../../../common/customInput";
import CustomCheckbox from "../../../common/customCheckbox";
import { DeleteI, DragI } from "../../../../assets/icon";

const OptionRow = ({
  item,
  onUpdate,
  onDelete,
  dragHandleProps,
  isDragging,
}) => {
  return (
    <div
      className={`grid grid-cols-12 gap-3 items-center py-3 rounded-lg transition-all group animate-fade-in bg-[var(--white-1)] border-[var(--border-1)] hover:border-[var(--primary-1)] hover:bg-[var(--white-2)] ${
        isDragging ? "shadow-lg scale-[1.01]" : ""
      }`}
    >
      <div
        className="col-span-1 flex justify-center text-[var(--gr-3)] cursor-grab active:cursor-grabbing"
        {...dragHandleProps}
      >
        <DragI />
      </div>
      <div className="col-span-3">
        <CustomInput
          required
          type="text"
          value={item.name}
          onChange={(v) => onUpdate({ name: v })}
          className="w-full p-2 rounded text-sm outline-none transition-all bg-[var(--white-1)] border-[var(--border-1)] focus:ring-2 focus:ring-[var(--primary-1)]"
          placeholder="Seçenek Adı"
        />
      </div>
      <div className="col-span-2">
        <CustomInput
          required
          type="number"
          value={item.price}
          onChange={(v) => onUpdate({ price: parseFloat(v) || 0 })}
          className="w-full p-2 rounded text-sm outline-none transition-all bg-[var(--white-1)] border-[var(--border-1)] focus:ring-2 focus:ring-[var(--primary-1)]"
          placeholder="Fiyatı"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <CustomCheckbox
          checked={item.isDefault}
          onChange={(e) => onUpdate({ isDefault: e.target.checked })}
          size="5"
        />
      </div>
      <div className="col-span-1 flex justify-center">
        <CustomCheckbox
          checked={item.isMandatory}
          onChange={(e) => onUpdate({ isMandatory: e.target.checked })}
          size="5"
        />
      </div>
      <div className="col-span-1">
        <CustomInput
          required
          type="number"
          value={item.minQuantity}
          onChange={(v) => onUpdate({ minQuantity: parseInt(v) || 0 })}
          className="w-full p-2 rounded text-sm text-center bg-transparent border-[var(--border-1)] text-[var(--black-1)]"
        />
      </div>
      <div className="col-span-1">
        <CustomInput
          required
          type="number"
          value={item.maxQuantity}
          onChange={(v) => onUpdate({ maxQuantity: parseInt(v) || 1 })}
          className="w-full p-2 rounded text-sm text-center bg-transparent border-[var(--border-1)] text-[var(--black-1)]"
        />
      </div>
      <div className="col-span-1 flex justify-end">
        <button
          type="button"
          onClick={onDelete}
          className="p-2 text-[var(--gr-3)] hover:text-[var(--red-1)] transition-colors"
          title="Sil"
        >
          <DeleteI className="size-[1.2rem]" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
};

export default OptionRow;

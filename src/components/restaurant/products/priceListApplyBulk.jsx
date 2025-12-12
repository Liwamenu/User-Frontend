import { useState } from "react";
import { TurnLeftI } from "../../../assets/icon";
import CheckI from "../../../assets/icon/check";
import CustomInput from "../../common/customInput";
import CustomSelect from "../../common/customSelector";
import toast from "react-hot-toast";

const PriceListApplyBulk = ({ list, setList }) => {
  const [bulkType, setBulkType] = useState({
    label: "Yüzde (%) Artır",
    value: "percent-increase",
  });
  const [bulkValue, setBulkValue] = useState("");
  const [bulkTarget, setBulkTarget] = useState({
    label: "Sadece Normal Fiyat",
    value: "price",
  });
  const [history, setHistory] = useState(null);

  const bulkTypeOptions = [
    { label: "Yüzde (%) Artır", value: "percent-increase" },
    { label: "Yüzde (%) İndir", value: "percent-decrease" },
    { label: "Tutar (+) Ekle", value: "amount-add" },
    { label: "Tutar (-) Çıkar", value: "amount-subtract" },
  ];

  const bulkTargetOptions = [
    { label: "Sadece Normal Fiyat", value: "price" },
    { label: "Sadece Kampanya Fiyatı", value: "discountedPrice" },
    { label: "Her İkisi", value: "both" },
  ];

  const applyBulkUpdate = () => {
    if (!bulkValue || isNaN(bulkValue)) {
      toast.error("Lütfen geçerli bir değer girin", { id: "applyInBulk" });
      return;
    }

    // Save current state for undo
    setHistory([...list]);

    const value = parseFloat(bulkValue);
    const updatedList = list.map((product) => {
      const newProduct = { ...product };
      newProduct.portions = (product.portions || []).map((portion) => {
        const newPortion = { ...portion };
        const currentPrice = parseFloat(newPortion.price) || 0;
        const currentDiscounted = parseFloat(newPortion.discountedPrice) || 0;

        let newPrice = currentPrice;
        let newDiscountedPrice = currentDiscounted;

        // Apply to normal price
        if (bulkTarget.value === "price" || bulkTarget.value === "both") {
          if (bulkType.value === "percent-increase") {
            newPrice = currentPrice * (1 + value / 100);
          } else if (bulkType.value === "percent-decrease") {
            newPrice = currentPrice * (1 - value / 100);
          } else if (bulkType.value === "amount-add") {
            newPrice = currentPrice + value;
          } else if (bulkType.value === "amount-subtract") {
            newPrice = currentPrice - value;
          }
        }

        // Apply to discounted price
        if (
          bulkTarget.value === "discountedPrice" ||
          bulkTarget.value === "both"
        ) {
          if (bulkType.value === "percent-increase") {
            newDiscountedPrice = currentDiscounted * (1 + value / 100);
          } else if (bulkType.value === "percent-decrease") {
            newDiscountedPrice = currentDiscounted * (1 - value / 100);
          } else if (bulkType.value === "amount-add") {
            newDiscountedPrice = currentDiscounted + value;
          } else if (bulkType.value === "amount-subtract") {
            newDiscountedPrice = currentDiscounted - value;
          }
        }

        newPortion.price = Math.max(0, newPrice).toFixed(2);
        newPortion.discountedPrice = Math.max(0, newDiscountedPrice).toFixed(2);

        return newPortion;
      });

      return newProduct;
    });

    setList(updatedList);
    setBulkValue("");
  };

  const handleUndo = () => {
    if (history) {
      setList(history);
      setHistory(null);
    }
  };

  return (
    <div className="bg-[#222265] rounded-2xl p-6 mb-8 text-white shadow-lg relative">
      <div className="relative z-10">
        {/* Title & Desc */}
        <div className="flex-1 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-xl font-bold">Toplu Fiyat Güncelleme</h2>
          </div>
          <p className="text-indigo-200 text-sm max-w-md leading-relaxed">
            Tüm ürünlerde geçerli olacak değişiklikleri buradan yapabilirsiniz.
          </p>
        </div>

        {/* Inputs Grid */}
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          {/* İşlem Türü */}
          <div className="w-full sm:w-48">
            <CustomSelect
              label="İşlem Türü"
              value={bulkType}
              options={bulkTypeOptions}
              onChange={(opt) => setBulkType(opt)}
              isSearchable={false}
              className="text-sm font-light"
              style={{
                backgroundColor: "#36368d",
                color: "white",
                padding: "0px",
              }}
              singleValueStyle={{ color: "white" }}
            />
          </div>

          {/* Değer */}
          <div className="w-full sm:w-36">
            <CustomInput
              label="Değer"
              type="number"
              placeholder="Örn: 10"
              value={bulkValue}
              onChange={(v) => setBulkValue(v)}
              className="bg-[#3D3D8A] border-[#4F4F9E] text-white placeholder-indigo-400 focus:ring-2 focus:ring-indigo-400 py-[6px]"
            />
          </div>

          {/* Hedef */}
          <div className="w-full sm:w-56">
            <CustomSelect
              label="Hedef"
              value={bulkTarget}
              options={bulkTargetOptions}
              onChange={(opt) => setBulkTarget(opt)}
              isSearchable={false}
              className="text-sm font-light"
              style={{
                backgroundColor: "#36368d",
                color: "white",
                padding: "0px",
              }}
              singleValueStyle={{ color: "white" }}
            />
          </div>

          {/* Geri Al Button */}
          {history && (
            <div className="flex flex-col justify-end">
              <button
                onClick={handleUndo}
                className="flex items-center justify-center gap-2 bg-[#4F4F9E] hover:bg-[#5A5AAF] text-white font-light py-1.5 px-4 rounded-lg transition-all whitespace-nowrap"
                title="Son işlemi geri al"
              >
                Geri Al
              </button>
            </div>
          )}

          {/* Uygula Button */}
          <div className="flex flex-col justify-end w-full sm:w-auto">
            <button
              onClick={applyBulkUpdate}
              className="w-full sm:w-auto bg-[#6366F1] hover:bg-[#5558E3] text-white font-light py-1.5 px-6 rounded-lg flex items-center justify-center gap-2"
            >
              <CheckI className="size-[1.1rem]" />
              Uygula
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceListApplyBulk;

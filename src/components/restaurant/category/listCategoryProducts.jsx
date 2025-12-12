import { useMemo, useState } from "react";
import CustomCheckbox from "../../common/customCheckbox";

const ListCategoryProduct = ({
  onClose,
  onAddSelected,
  products = [],
  categories = [],
  activeCategoryId,
}) => {
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // Products eligible to add (not already in active category)
  const availableProducts = useMemo(() => {
    const list = Array.isArray(products) ? products : products?.Products || [];
    return list.filter((p) => p.categoryId !== activeCategoryId);
  }, [products, activeCategoryId]);

  // Filter by search
  const filtered = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    if (!q) return availableProducts;
    return availableProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [availableProducts, searchText]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleAdd = () => {
    onAddSelected?.(selectedIds);
    setSelectedIds([]);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm z-[70] flex items-center justify-center transition-all duration-300">
      <div className="bg-[--white-1] rounded-2xl shadow-2xl w-full max-w-lg p-6 transform scale-95 transition-all duration-300 modal-content relative flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[--border-1] pb-4">
          <h3 className="text-xl font-bold text-[--black-1]">Ürün Seçimi</h3>
          <button
            onClick={onClose}
            className="text-[--gr-1] hover:text-[--black-2] transition-colors"
            aria-label="Kapat"
          >
            <i className="fa-solid fa-xmark text-xl" />
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Ürün adı ara..."
            className="w-full px-4 py-2 rounded-lg border border-[--border-1] bg-[--white-1] focus:ring-2 focus:ring-[--primary-1] focus:border-[--primary-1] outline-none text-sm text-[--black-2]"
          />
        </div>

        {/* List */}
        <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 mb-4 pr-1">
          {filtered.length === 0 ? (
            <div className="text-center p-4 text-[--gr-1] text-sm italic">
              Eklenebilecek uygun ürün bulunamadı.
            </div>
          ) : (
            filtered.map((prod) => {
              const currentCat = categories.find(
                (c) => c.id === prod.categoryId
              );
              const catName = currentCat ? currentCat.name : "Kategorisiz";
              const checked = selectedIds.includes(prod.id);
              return (
                <label
                  key={prod.id}
                  className="flex items-center p-3 rounded-lg border border-[--border-1] hover:bg-[--status-primary-1] cursor-pointer transition-colors gap-3"
                >
                  <CustomCheckbox
                    checked={checked}
                    onChange={() => toggleSelect(prod.id)}
                    className="text-[--primary-1] border-[--border-1] rounded focus:ring-[--primary-1]"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-[--black-1]">
                      {prod.name}
                    </div>
                    <div className="text-xs text-[--gr-1]">
                      Kategori:{" "}
                      <span className="text-[--primary-1] font-medium">
                        {catName}
                      </span>
                    </div>
                  </div>
                </label>
              );
            })
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-[--border-1]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[--black-2] bg-[--white-1] border border-[--border-1] rounded-lg hover:bg-[--light-1] transition-colors"
          >
            İptal
          </button>
          <button
            onClick={handleAdd}
            disabled={selectedIds.length === 0}
            className="px-4 py-2 text-sm font-medium text-white bg-[--primary-1] rounded-lg shadow hover:bg-[--primary-2] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            Seçilenleri Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListCategoryProduct;

//MODULES
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

//COMP
import CustomInput from "../common/customInput";

const ProductCategories = ({ data, catData }) => {
  const [categories, setCategories] = useState([{ name: "", icon: "" }]);
  const [categoriesData, setCategoriesData] = useState(
    catData || [{ name: "test", icon: "🇹🇷", id: "this is the fucking IDD" }]
  );
  const [isEdit, setIsEdit] = useState(true);
  const [activePicker, setActivePicker] = useState(null);

  // Add a new blank category row
  const addCategory = () => {
    setCategories((prev) => [...prev, { name: "", icon: "" }]);
  };

  // Update a field in a category row
  const updateCategory = (index, key, value) => {
    isEdit
      ? setCategoriesData((prev) =>
          prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
        )
      : setCategories((prev) =>
          prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
        );
  };

  // Remove a category row
  const removeCategory = (index) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isEdit ? "It's Edit" : "It's Add", {
      restaurantId: data.id,
      categories: isEdit ? categoriesData : categories,
    });
  };

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col">
        <h1 className="self-center text-2xl font-bold">Kategoriler</h1>

        <div className="p-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Tüm kategorilerinizi hızlıca eklemek veya düzenlemek için aşağıdaki
            seçenekleri kullanın. Ayrıca aşağıdan tek tek kategori ekleyebilir
            veya mevcut kategorileri düzenleyebilirsiniz.
          </p>
        </div>

        <div className="sm:px-14 flex gap-2 my-8">
          <button
            className={`${
              isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(true)}
          >
            Katagorileri Düzenle
          </button>
          <button
            className={`${
              !isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(false)}
          >
            Katagori Ekle
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sm:px-14 mt-6 p-3 max-w-xl-">
          <div className="flex gap-4 max-sm:gap-2 items-end">
            <p className="w-[19rem]">Kategori Adı</p>
            <p className="w-full">Kategori İkonu</p>
          </div>

          {(isEdit ? categoriesData : categories).map((cat, index) => (
            <div key={index} className="flex gap-4 max-sm:gap-2 items-end">
              <div className="flex gap-4 max-sm:gap-1">
                <CustomInput
                  required
                  type="text"
                  value={cat.name}
                  placeholder="Kategori adı giriniz"
                  onChange={(e) => updateCategory(index, "name", e)}
                />
                <div
                  className="border rounded p-2 cursor-pointer text-xl w-16 flex items-end justify-center mt-4 sm:mt-8"
                  onClick={() =>
                    setActivePicker(activePicker === index ? null : index)
                  }
                >
                  <p>{cat.icon || "➕"}</p>
                </div>
                {activePicker === index && (
                  <div className="absolute z-50 mt-2">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => {
                        updateCategory(index, "icon", emojiData.emoji);
                        setActivePicker(null);
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeCategory(index)}
                className="text-[--red-1] font-semibold"
              >
                Sil
              </button>
            </div>
          ))}

          <div
            className={`flex items-center pt-4 mt-6 ${
              isEdit ? "justify-end" : "justify-between"
            }`}
          >
            {!isEdit && (
              <button
                type="button"
                onClick={addCategory}
                className="px-6 py-2 rounded-md bg-[--primary-2] text-white font-semibold"
              >
                Ekle
              </button>
            )}

            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-[--primary-1] text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCategories;

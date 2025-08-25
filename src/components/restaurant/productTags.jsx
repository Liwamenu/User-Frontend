//MODULES
import { useState } from "react";

//COMP
import CustomInput from "../common/customInput";

const ProductTags = ({ data, tgsData }) => {
  const [tags, setTags] = useState([{ name: "", price: "" }]);
  const [tagsData, setTagsData] = useState(
    tgsData || [{ name: "test", price: 0, id: "this is the fucking IDD" }]
  );
  const [isEdit, setIsEdit] = useState(true);

  // Add a new blank tags row
  const addCategory = () => {
    setTags((prev) => [...prev, { name: "", price: "" }]);
  };

  // Update a field in a tags row
  const updateCategory = (index, key, value) => {
    isEdit
      ? setTagsData((prev) =>
          prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
        )
      : setTags((prev) =>
          prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
        );
  };

  // Remove a tags row
  const removeCategory = (index) => {
    setTags((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isEdit ? "It's Edit" : "It's Add", {
      restaurantId: data.id,
      tags: isEdit ? tagsData : tags,
    });
  };

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col">
        <h1 className="self-center text-2xl font-bold">Ürün Etiketler</h1>

        <div className="p-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Tüm Etiketlerinizi hızlıca eklemek veya düzenlemek için aşağıdaki
            seçenekleri kullanın. Ayrıca aşağıdan tek tek etiketler ekleyebilir
            veya mevcut etiketleri düzenleyebilirsiniz.
          </p>
        </div>

        <div className="sm:px-14 flex gap-2 my-8">
          <button
            className={`${
              isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(true)}
          >
            Etiketleri Düzenle
          </button>
          <button
            className={`${
              !isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(false)}
          >
            Etiket Ekle
          </button>
        </div>

        <form onSubmit={handleSubmit} className="sm:px-14 mt-6 p-3">
          <div className="flex gap-4 max-sm:gap-2 items-end">
            <p className="w-[19rem]">Etiket Adı</p>
            <p className="w-full">Etiket Fiyatı</p>
          </div>

          <div className="flex flex-col gap-2">
            {(isEdit ? tagsData : tags).map((cat, index) => (
              <div key={index} className="flex gap-4 max-sm:gap-2 items-end">
                <div className="flex gap-4 max-sm:gap-1">
                  <CustomInput
                    required
                    type="text"
                    value={cat.name}
                    placeholder="Etiket adı giriniz"
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    onChange={(e) => updateCategory(index, "name", e)}
                  />
                  <CustomInput
                    required
                    name="price"
                    value={cat.price}
                    placeholder="Etiket fiyatı giriniz"
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    onChange={(e) => updateCategory(index, "price", e)}
                  />
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
          </div>

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

export default ProductTags;

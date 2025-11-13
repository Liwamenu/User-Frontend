//MODULES
import { useState } from "react";

//COMP
import CustomInput from "../common/customInput";

const ProductOptions = ({ data: restaurant, optsData }) => {
  const [options, setOptions] = useState([{ name: "", price: "" }]);
  const [optionsData, setOptionsData] = useState(
    optsData || [{ name: "test", price: 0 }]
  );
  const [isEdit, setIsEdit] = useState(true);

  // Add a new blank options row
  const addOptions = () => {
    setOptions((prev) => [...prev, { name: "", price: "" }]);
  };

  // Update a field in a options row
  const updateOptions = (index, key, value) => {
    isEdit
      ? setOptionsData((prev) =>
          prev.map((opt, i) => (i === index ? { ...opt, [key]: value } : opt))
        )
      : setOptions((prev) =>
          prev.map((opt, i) => (i === index ? { ...opt, [key]: value } : opt))
        );
  };

  // Remove a options row
  const removeOptions = (index) => {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isEdit ? "It's Edit" : "It's Add", {
      restaurantId: restaurant.id,
      options: isEdit ? optionsData : options,
    });
  };

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold">
          Ürün Seçenekler{" "}
          <span className="text-[--primary-1]"> {restaurant.name} </span>
          Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Tüm Seçeneklerinizi hızlıca eklemek veya düzenlemek için aşağıdaki
            seçenekleri kullanın. Ayrıca aşağıdan tek tek seçeneklerler
            ekleyebilir veya mevcut seçeneklerleri düzenleyebilirsiniz.
          </p>
        </div>

        <div className="flex gap-2 my-4">
          <button
            className={`${
              isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(true)}
          >
            Seçenekleri Düzenle
          </button>
          <button
            className={`${
              !isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(false)}
          >
            Seçenek Ekle
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 p-3">
          <div className="flex gap-4 max-sm:gap-2 items-end">
            <p className="w-[19rem]">Seçenek Adı</p>
            <p className="w-full">Seçenek Fiyatı</p>
          </div>

          <div className="flex flex-col gap-2">
            {(isEdit ? optionsData : options).map((opt, index) => (
              <div key={index} className="flex gap-4 max-sm:gap-2 items-end">
                <div className="flex gap-4 max-sm:gap-1">
                  <CustomInput
                    required
                    type="text"
                    value={opt.name}
                    placeholder="Seçenek adı giriniz"
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    onChange={(e) => updateOptions(index, "name", e)}
                  />
                  <CustomInput
                    required
                    name="price"
                    value={opt.price}
                    placeholder="Seçenek fiyatı giriniz"
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    onChange={(e) => updateOptions(index, "price", e)}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => removeOptions(index)}
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
                onClick={addOptions}
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

export default ProductOptions;

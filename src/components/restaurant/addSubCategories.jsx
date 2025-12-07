import { useState } from "react";
import CustomInput from "../common/customInput";
import CustomFileInput from "../common/customFileInput";
import CustomSelect from "../common/customSelector";
import dumyCategories from "../../assets/js/Categories.json";
import { Link } from "react-router-dom";
import { CloudUI } from "../../assets/icon";

const AddSubCategories = ({ data: restaurant }) => {
  const formattedCategoriesForSelect = dumyCategories.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    ...cat,
  }));

  const [rows, setRows] = useState([
    {
      categoryId: formattedCategoriesForSelect?.[0]?.value || "",
      name: "",
      image: null,
    },
  ]);

  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        categoryId: formattedCategoriesForSelect?.[0]?.value || "",
        name: "",
        image: null,
      },
    ]);

  const removeRow = (index) =>
    setRows((prev) => prev.filter((_, i) => i !== index));

  const updateRow = (index, key, value) =>
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("restaurantId", restaurant?.id ?? "");
    formData.append(
      "newSubCategories",
      JSON.stringify(
        rows.map((r, i) => ({
          categoryId: r.categoryId,
          name: r.name,
          sortOrder: i,
        }))
      )
    );

    rows.forEach((r, i) => {
      if (r.image) formData.append(`image_new_${i}`, r.image);
    });

    // debug output
    // for (const pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }

    console.log(
      rows.map((r, i) => ({
        categoryId: r.categoryId,
        name: r.name,
        sortOrder: i,
      }))
    );
  };

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Alt Kategori Ekle {restaurant?.name} Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Yeni alt kategori ekleyin. Önce kategori seçin, sonra ad ve görsel
            girin.
          </p>
        </div>

        <div className=" flex gap-2 my-4">
          <Link
            to={`/restaurant/sub_categories/${restaurant?.id}/edit`}
            className="bg-[--light-3] p-2"
          >
            Alt Kategorileri Düzenle
          </Link>
          <Link
            to={`/restaurant/sub_categories/${restaurant?.id}/add`}
            className="bg-[--primary-1] text-white p-2"
          >
            Alt Kategori Ekle
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 py-3">
          {rows.map((row, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="w-full min-w-md">
                <CustomSelect
                  required
                  value={formattedCategoriesForSelect.find(
                    (c) => c.value === row.categoryId
                  )}
                  classname="mt-[0] sm:mt-[0]"
                  className2="mt-[0] sm:mt-[0]"
                  options={formattedCategoriesForSelect}
                  onChange={(sel) => updateRow(idx, "categoryId", sel.value)}
                  placeholder="Kategori seç"
                />
              </div>

              <div className="w-full">
                <CustomInput
                  required
                  type="text"
                  value={row.name}
                  placeholder="Alt kategori adı"
                  onChange={(v) => updateRow(idx, "name", v)}
                  className="mt-[0] sm:mt-[0]"
                  className2="mt-[0] sm:mt-[0]"
                />
              </div>

              <div className="max-w-md w-full">
                <CustomFileInput
                  value={row.image}
                  onChange={(file) => updateRow(idx, "image", file)}
                  accept={"image/png, image/jpeg"}
                  className="h-[3rem]"
                  msg={<CustomFileInputMsg />}
                />
              </div>

              <button
                type="button"
                onClick={() => removeRow(idx)}
                className="text-[--red-1] font-semibold"
              >
                Sil
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={addRow}
              className="px-6 py-2 rounded-md bg-[--primary-2] text-white font-semibold"
            >
              Yeni Satır Ekle
            </button>

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

export default AddSubCategories;

export const CustomFileInputMsg = () => {
  return (
    <div className="flex items-center text-xs">
      <CloudUI className="size-[1.5rem] mt-2" strokeWidth={1.5} />
      <p>Kategori görseli yükleyin</p>
    </div>
  );
};

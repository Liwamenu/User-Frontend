import { useState, useRef } from "react";
import CustomInput from "../common/customInput";
import { Link } from "react-router-dom";

const AddOrderTagsAndItems = ({ data: restaurant, onSubmit }) => {
  const [tags, setTags] = useState([
    {
      name: "",
      minSelected: 0,
      maxSelected: 1,
      orderTagItems: [{ name: "", price: "", maxQuantity: 1 }],
    },
  ]);
  const containerRef = useRef(null);

  const addTag = () =>
    setTags((s) => [
      ...s,
      {
        name: "",
        minSelected: 0,
        maxSelected: 1,
        orderTagItems: [{ name: "", price: "", maxQuantity: 1 }],
      },
    ]);

  const removeTag = (ti) => setTags((s) => s.filter((_, i) => i !== ti));

  const updateTag = (ti, key, val) =>
    setTags((s) => {
      const next = [...s];
      next[ti] = { ...next[ti], [key]: val };
      return next;
    });

  const addItem = (ti) =>
    setTags((s) => {
      const next = [...s];
      next[ti].orderTagItems.push({ name: "", price: "", maxQuantity: 1 });
      return next;
    });

  const removeItem = (ti, ii) =>
    setTags((s) => {
      const next = [...s];
      next[ti].orderTagItems.splice(ii, 1);
      return next;
    });

  const updateItem = (ti, ii, key, val) =>
    setTags((s) => {
      const next = [...s];
      next[ti].orderTagItems[ii] = {
        ...next[ti].orderTagItems[ii],
        [key]: val,
      };
      return next;
    });

  // keyboard: move between price inputs (Enter / ArrowDown / ArrowUp)
  const handleKeyDown = (e) => {
    const keys = ["Enter", "ArrowDown", "ArrowUp"];
    if (!keys.includes(e.key)) return;
    e.preventDefault();
    const inputs = containerRef.current?.querySelectorAll("input[data-price]");
    if (!inputs?.length) return;
    const arr = Array.from(inputs);
    const cur = arr.indexOf(e.target);
    if (cur === -1) return;
    let next = cur;
    if (e.key === "Enter" || e.key === "ArrowDown") next = cur + 1;
    if (e.key === "ArrowUp") next = cur - 1;
    if (next >= 0 && next < arr.length) {
      arr[next].focus();
      if (typeof arr[next].select === "function") arr[next].select();
    }
  };

  const validate = () => {
    for (const t of tags) {
      if (!t.name || !t.name.trim()) {
        console.error("Order tag name cannot be empty");
        return false;
      }
      if (!t.orderTagItems || t.orderTagItems.length === 0) {
        console.error("Each order tag must have at least one item");
        return false;
      }
      for (const it of t.orderTagItems) {
        if (!it.name || !it.name.trim()) {
          console.error("Order tag item name cannot be empty");
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    // all rows are new -> send them
    const payload = tags.map((t, idx) => ({ ...t, sortOrder: idx }));
    if (typeof onSubmit === "function") onSubmit(payload);
    else {
      const fd = new FormData();
      fd.append("newOrderTags", JSON.stringify(payload));
      console.log("Add payload:", payload);
      for (const pair of fd.entries()) console.log(pair[0], pair[1]);
    }
  };

  return (
    <section className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 md:px-14" ref={containerRef}>
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 md:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Yeni Order Tag & Items Ekle {restaurant?.name} Restoranı
        </h1>

        <div className="flex gap-2 my-4">
          <Link
            to={`/restaurant/tags/${restaurant?.id}/edit`}
            className="bg-[--light-3] p-2"
          >
            Etiketleri Düzenle
          </Link>
          <Link
            to={`/restaurant/tags/${restaurant?.id}/add`}
            className="bg-[--primary-1] text-white p-2"
          >
            Etiket Ekle
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {tags.map((t, ti) => (
            <div
              key={ti}
              className="border border-[--border-1] p-3 pt-7 rounded mb-3"
            >
              <div className="flex gap-2 items-end">
                <div className="w-full">
                  <CustomInput
                    required
                    value={t.name}
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    label="Etiket Adı(ör: Baharat Seçimi)"
                    placeholder="Etiket adı (ör: Baharat Seçimi)"
                    onChange={(v) => updateTag(ti, "name", v)}
                  />
                </div>

                <div className="max-md:w-1/2">
                  <CustomInput
                    type="number"
                    value={t.minSelected}
                    label="En Az Seçim"
                    placeholder="En Az Seçim"
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    onChange={(v) =>
                      updateTag(ti, "minSelected", Number(v || 0))
                    }
                  />
                </div>

                <div className="max-md:w-1/2">
                  <CustomInput
                    type="number"
                    label="En Çok Seçim"
                    value={t.maxSelected}
                    placeholder="En Çok Seçim"
                    className="mt-[0] sm:mt-[0]"
                    className2="mt-[0] sm:mt-[0]"
                    onChange={(v) =>
                      updateTag(ti, "maxSelected", Number(v || 0))
                    }
                  />
                </div>

                <button
                  type="button"
                  className="text-[--red-1] whitespace-nowrap"
                  onClick={() => removeTag(ti)}
                >
                  Etiketi Sil
                </button>
              </div>

              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Etiket İçeriği</p>
                  <button
                    type="button"
                    className="text-[--primary-1] text-sm"
                    onClick={() => addItem(ti)}
                  >
                    + Ürün Ekle
                  </button>
                </div>

                {t.orderTagItems.map((it, ii) => (
                  <div key={ii} className="flex gap-2 items-center mb-2">
                    <div className="w-full">
                      <CustomInput
                        required
                        value={it.name}
                        placeholder="Seçenek adı"
                        label={ii === 0 ? "Seçenek Adı" : ""}
                        className="mt-[0] sm:mt-[0] py-[.3rem]"
                        className2="mt-[0] sm:mt-[0]"
                        onChange={(v) => updateItem(ti, ii, "name", v)}
                      />
                    </div>

                    <div className="max-md:w-1/2">
                      <CustomInput
                        type="number"
                        data-price="true"
                        value={it.price}
                        placeholder="Fiyat"
                        className2="mt-[0] sm:mt-[0]"
                        label={ii === 0 ? "Fiyat" : ""}
                        className="mt-[0] sm:mt-[0] py-[.3rem]"
                        onChange={(v) => updateItem(ti, ii, "price", v)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>

                    <div className="max-md:w-1/2">
                      <CustomInput
                        type="number"
                        value={it.maxQuantity}
                        placeholder="Max Adet"
                        className2="mt-[0] sm:mt-[0]"
                        className="mt-[0] sm:mt-[0] py-[.3rem]"
                        label={ii === 0 ? "Maksimum Adet" : ""}
                        onChange={(v) =>
                          updateItem(ti, ii, "maxQuantity", Number(v || 0))
                        }
                      />
                    </div>

                    <button
                      type="button"
                      className="text-[--red-1]"
                      onClick={() => removeItem(ti, ii)}
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={addTag}
              className="px-4 py-2 rounded bg-[--primary-2] text-white"
            >
              + Etiket Ekle
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded bg-[--primary-1] text-white"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddOrderTagsAndItems;

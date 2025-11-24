import { useEffect, useRef, useState } from "react";
import CustomInput from "../common/customInput";
import CustomSelect from "../common/customSelector";
import isEqual from "lodash/isEqual";
import origOrderTags from "../../assets/js/OrderTags.json";
import origOrderTagItems from "../../assets/js/OrderTagItems.json";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const EditOrderTagsAndItems = ({ data: restaurant, onSubmit }) => {
  // build initial merged data
  const initial = (origOrderTags.orderTags || []).map((ot) => ({
    ...ot,
    orderTagItems: (origOrderTagItems.orderTagItems || [])
      .filter((it) => it.orderTagId === ot.id)
      .map((it) => ({ ...it })),
  }));
  const [tags, setTags] = useState(initial);
  const snapshotRef = useRef(JSON.parse(JSON.stringify(initial)));
  const containerRef = useRef(null);
  const [bulkVal, setBulkVal] = useState(0);
  const [bulkType, setBulkType] = useState({ label: "Değer", value: "value" });

  useEffect(() => {
    // ensure tags state set from initial on mount
    setTags(initial);
  }, []); // eslint-disable-line

  const updateTag = (ti, key, val) => {
    console.log(ti, key, val);
    if (key === "minSelected") {
      tags[ti].minSelected >= tags[ti].maxSelected;
      toast.error("En az seçim, en çok seçimden büyük olamaz", {
        id: "minmax",
      });
      return;
    }
    if (key === "maxSelected") {
      tags[ti].maxSelected <= tags[ti].minSelected;
      toast.error("En çok seçim, en az seçimden küçük olamaz", {
        id: "minmax",
      });
      return;
    }

    setTags((s) => {
      const next = [...s];
      next[ti] = { ...next[ti], [key]: val };
      return next;
    });
  };

  const removeTag = (ti) => setTags((s) => s.filter((_, i) => i !== ti));

  const addItem = (ti) =>
    setTags((s) => {
      const next = [...s];
      next[ti].orderTagItems.push({
        id: undefined,
        orderTagId: next[ti].id,
        name: "",
        price: "",
        maxQuantity: 1,
      });
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

  // keyboard navigation between price inputs
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

  // bulk modify prices: value or percent (positive/negative allowed)
  const applyBulk = (val, mode) => {
    const delta = parseFloat(val);
    if (isNaN(delta)) return;
    setTags((s) =>
      s.map((t) => ({
        ...t,
        orderTagItems: t.orderTagItems.map((it) => {
          const p = parseFloat(it.price || 0);
          const nextP =
            mode === "percent"
              ? +(p + (p * delta) / 100).toFixed(2)
              : +(p + delta).toFixed(2);
          return { ...it, price: nextP };
        }),
      }))
    );
  };

  const validate = () => {
    for (const t of tags) {
      if (!t.name || !t.name.trim()) {
        console.error("Etiket adı boş olamaz");
        return false;
      }
      if (!t.orderTagItems || t.orderTagItems.length === 0) {
        console.error("Her etiket en az bir öğe içermelidir");
        return false;
      }
    }
    return true;
  };

  const collectChanges = () => {
    const orig = snapshotRef.current;
    const changes = { addedTags: [], removedTags: [], updatedTags: [] };

    // removed tags
    orig.forEach((o) => {
      if (!tags.find((t) => t.id === o.id)) changes.removedTags.push(o);
    });

    // added tags & updated tags
    tags.forEach((t) => {
      if (!t.id) {
        // new tag
        changes.addedTags.push(t);
        return;
      }
      const o = orig.find((x) => x.id === t.id);
      if (!o) {
        changes.addedTags.push(t);
        return;
      }
      // compare tag meta and items (ignore possible transient fields)
      const strip = (x) => {
        const copy = { ...x };
        copy.orderTagItems = (copy.orderTagItems || []).map((it) => {
          const c = { ...it };
          return c;
        });
        return copy;
      };
      if (!isEqual(strip(o), strip(t))) {
        changes.updatedTags.push(t);
      }
    });

    return changes;
  };

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    const changes = collectChanges();
    if (typeof onSubmit === "function") onSubmit(changes);
    else {
      const fd = new FormData();
      fd.append("orderTagChanges", JSON.stringify(changes));
      console.log("OrderTag changes:", changes);
      for (const pair of fd.entries()) console.log(pair[0], pair[1]);
    }
  };

  // prepare select options for moving items between tags
  const tagOptions = tags.map((t) => ({ value: t.id, label: t.name }));
  console.log(tags);

  return (
    <section className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 md:px-14" ref={containerRef}>
        <h2 className="text-2xl font-bold mb-4">Order Tags Düzenle</h2>

        <div className="flex gap-2 my-4">
          <Link
            to={`/restaurant/tags/${restaurant?.id}/edit`}
            className="bg-[--primary-1] text-white p-2"
          >
            Etiketleri Düzenle
          </Link>
          <Link
            to={`/restaurant/tags/${restaurant?.id}/add`}
            className="bg-[--light-3] p-2"
          >
            Etiket Ekle
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Apply bulk price changes */}
          <div className="mb-3 flex gap-2 items-center">
            <p className="font-medium text-sm whitespace-nowrap">
              Tüm fiyatlara uygulama:
            </p>
            <div>
              <CustomInput
                type="number"
                placeholder="Değer"
                onChange={(val) => setBulkVal(Number(val))}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
              />
            </div>

            <div>
              <CustomSelect
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                value={bulkType}
                options={[
                  { value: "value", label: "Değer" },
                  { value: "percent", label: "Yüzde" },
                ]}
                onChange={(selectedOption) => setBulkType(selectedOption)}
                placeholder="Mod"
              />
            </div>

            <button
              type="button"
              className="px-3 py-2 bg-[--primary-1] text-white rounded-sm"
              onClick={() => {
                applyBulk(bulkVal, bulkType.value);
              }}
            >
              Uygula
            </button>
          </div>

          {tags.map((t, ti) => (
            <div
              key={t.id ?? `new-${ti}`}
              className="border border-[--border-1] p-3 rounded mb-3"
            >
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <CustomInput
                    value={t.name}
                    label="Etiket Adı(ör: Baharat Seçimi)"
                    placeholder="Etiket adı"
                    onChange={(v) => updateTag(ti, "name", v)}
                  />
                </div>

                <div className="w-36">
                  <CustomInput
                    type="number"
                    label="En Az Seçim"
                    value={t.minSelected}
                    placeholder="Min"
                    onChange={(v) =>
                      updateTag(ti, "minSelected", Number(v || 0))
                    }
                  />
                </div>

                <div className="w-36">
                  <CustomInput
                    type="number"
                    label="En Çok Seçim"
                    value={t.maxSelected}
                    placeholder="Max"
                    onChange={(v) =>
                      updateTag(ti, "maxSelected", Number(v || 0))
                    }
                  />
                </div>

                <button
                  type="button"
                  className="text-[--red-1]"
                  onClick={() => removeTag(ti)}
                >
                  Etiketi Sil
                </button>
              </div>

              {/* OrderTagItems */}
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium">Seçenekler</p>
                  <button
                    type="button"
                    className="text-[--primary-1] text-sm"
                    onClick={() => addItem(ti)}
                  >
                    + Seçenek Ekle
                  </button>
                </div>

                {t.orderTagItems.map((it, ii) => (
                  <div
                    key={it.id ?? ii}
                    className="flex gap-2 items-center mb-2"
                  >
                    <div className="flex-1">
                      <CustomInput
                        label={ii === 0 ? "Seçenek Adı" : ""}
                        className="mt-[0] sm:mt-[0] py-[.3rem]"
                        className2="mt-[0] sm:mt-[0]"
                        value={it.name}
                        placeholder="Seçenek adı"
                        onChange={(v) => updateItem(ti, ii, "name", v)}
                      />
                    </div>

                    <div className="w-36">
                      <CustomInput
                        label={ii === 0 ? "Fiyat" : ""}
                        className="mt-[0] sm:mt-[0] py-[.3rem]"
                        className2="mt-[0] sm:mt-[0]"
                        type="number"
                        name="price"
                        value={it.price}
                        placeholder="Fiyat"
                        data-price="true"
                        onChange={(v) => updateItem(ti, ii, "price", v)}
                        onKeyDown={handleKeyDown}
                      />
                    </div>

                    <div className="w-36">
                      <CustomInput
                        label={ii === 0 ? "Maksimum Adet" : ""}
                        className="mt-[0] sm:mt-[0] py-[.3rem]"
                        className2="mt-[0] sm:mt-[0]"
                        type="number"
                        value={it.maxQuantity}
                        placeholder="Max Adet"
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

          <div className="flex justify-end gap-2 mt-4">
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

export default EditOrderTagsAndItems;

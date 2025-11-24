import { useEffect, useState, useRef } from "react";
import CustomToggle from "../common/customToggle";
import CustomInput from "../common/customInput";
import { formatToPrice } from "../../utils/utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import Products from "../../assets/js/Products.json";
// /* before it was */ import Products from "../../assets/json/products.js";
import isEqual from "lodash/isEqual";
import { ArrowIR } from "../../assets/icon";

const EditProducts = ({ data: restaurant }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const containerRef = useRef(null);

  const updateField = (index, key, value) => {
    setList((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const updatePortion = (pIndex, portionIndex, key, value) => {
    setList((prev) => {
      const next = [...prev];
      const portions = [...(next[pIndex].portions || [])];
      portions[portionIndex] = { ...portions[portionIndex], [key]: value };
      next[pIndex] = { ...next[pIndex], portions };
      return next;
    });
  };

  useEffect(() => {
    // Products.json exports an object { Products: [...] }
    const productsList = Products?.Products || [];
    // initialize editable local copy
    setList(
      productsList.map((p) => ({
        ...p,
        portions: (p.portions || []).map((pt) => ({
          ...pt,
          name: pt.name ?? "",
          price: pt.price ?? "",
        })),
      }))
    );
  }, [Products]);

  // Submit: find changed Products (deep compare with original Products) and console them
  const handleSaveAll = () => {
    const productsList = Products?.Products || [];
    const changed = list.filter((prod) => {
      const orig = productsList.find((p) => p.id === prod.id);
      // if no original (new product) consider changed
      if (!orig) return true;
      return !isEqual(prod, orig);
    });

    console.log("Changed Products:", changed);
    console.log("Original Products:", productsList);
  };

  // Fast navigation: Enter or ArrowDown => next input, ArrowUp => previous input
  const handleKeyDown = (e) => {
    const key = e.key;
    if (!["Enter", "ArrowDown", "ArrowUp"].includes(key)) return;
    e.preventDefault();

    const inputs = containerRef.current?.querySelectorAll("input[data-edit]");
    if (!inputs || !inputs.length) return;
    const arr = Array.from(inputs);
    const currentIndex = arr.indexOf(e.target);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (key === "Enter" || key === "ArrowDown") nextIndex = currentIndex + 1;
    if (key === "ArrowUp") nextIndex = currentIndex - 1;

    if (nextIndex >= 0 && nextIndex < arr.length) {
      const next = arr[nextIndex];
      next.focus();
      // if the next is number input, select its content for faster editing
      if (typeof next.select === "function") next.select();
    }
  };

  return (
    <section className="w-full py-4 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="px-4 max-w-6xl mx-auto" ref={containerRef}>
        <h1 className="self-center text-2xl font-bold mb-4">
          Ürünleri Düzenle{" "}
          <span className="text-[--primary-1]"> {restaurant?.name} </span>
          Restoranı
        </h1>

        <div className="flex gap-2 my-3">
          <Link className="bg-[--primary-1] text-white p-2">
            Ürünleri Düzenle
          </Link>
          <Link
            to={`/restaurant/products/${id}/add-product`}
            className="text-[--black-1] p-2 bg-[--light-3]"
          >
            Ürün Ekle
          </Link>
        </div>

        <div className="overflow-x-auto border border-[--border-1] rounded">
          <table className="w-full min-w-[55rem] text-[--gr-1]">
            <thead className="bg-[--light-3] text-left text-sm text-nowrap">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Ürün Adı</th>
                <th className="px-4 py-3">Şef Tavsiyesi</th>
                <th className="px-4 py-3">Gizle</th>
                <th className="px-4 py-3">Porsiyonlar</th>
                <th className="px-2 py-3">İşlem</th>
              </tr>
            </thead>

            <tbody>
              {list.map((prod, i) => (
                <tr key={prod.id ?? i} className="border-t border-[--border-1]">
                  <td className="px-4 py-3 align-top">{i + 1}</td>

                  <td className="px-4 align-top w-1/4">
                    <CustomInput
                      type="text"
                      className="mt-[0] sm:mt-[0]s"
                      className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                      value={prod.name || ""}
                      onChange={(v) => updateField(i, "name", v)}
                      onKeyDown={handleKeyDown}
                    />
                  </td>

                  <td className="px-4 py-3 align-top">
                    <CustomToggle
                      className="scale-75"
                      checked={!!prod.recommendation}
                      onChange={() =>
                        updateField(i, "recommendation", !prod.recommendation)
                      }
                    />
                  </td>

                  <td className="px-2 py-3 align-top">
                    <CustomToggle
                      className="scale-75"
                      checked={!!prod.hide}
                      onChange={() => updateField(i, "hide", !prod.hide)}
                    />
                  </td>

                  {/* Portions shown by default for fast editing */}
                  <td className="align-top">
                    <div className="bg-[--white-2] px-2 border-x border-[--gr-4]">
                      <table className="w-full">
                        <thead>
                          {i == 0 && (
                            <tr className="text-sm text-[--gr-1]">
                              <th className="text-left px-2 py-1 text-xs text-nowrap">
                                Porsiyon Adı
                              </th>
                              <th className="text-left px-2 py-1 text-xs text-nowrap">
                                Fiyat
                              </th>
                            </tr>
                          )}
                        </thead>
                        <tbody>
                          {(prod.portions || []).map((portion, pi) => (
                            <tr key={pi}>
                              <td className="px-2 py-1 align-top">
                                <CustomInput
                                  type="text"
                                  className="py-[5px] rounded-sm w-full mt-[0] sm:mt-[0]"
                                  className2="text-sm mt-[0] sm:mt-[0]"
                                  value={portion.name || ""}
                                  onChange={(v) =>
                                    updatePortion(i, pi, "name", v)
                                  }
                                  onKeyDown={handleKeyDown}
                                />
                              </td>
                              <td className="px-2 py-1 align-top w-40">
                                <CustomInput
                                  data-edit={true}
                                  type="number"
                                  className="py-[5px] rounded-sm w-full mt-[0] sm:mt-[0]"
                                  className2="text-sm mt-[0] sm:mt-[0]"
                                  value={formatToPrice(portion.price) ?? ""}
                                  onChange={(v) =>
                                    updatePortion(i, pi, "price", v)
                                  }
                                  onKeyDown={handleKeyDown}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </td>

                  <td
                    className="group cursor-pointer"
                    onClick={() =>
                      navigate(`/restaurant/products/${id}/edit/${prod.id}`, {
                        state: { product: prod },
                      })
                    }
                  >
                    <div className="w-full h-full flex justify-center">
                      <div className="text-[--link-1] group-hover:pl-3 transition-all">
                        <ArrowIR />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-4 py-2 rounded bg-[--primary-1] text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProducts;

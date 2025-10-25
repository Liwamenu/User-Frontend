import { useEffect, useState } from "react";
import CustomSelect from "../common/customSelector";
import CustomInput from "../common/customInput";
import CustomFileInput from "../common/customFileInput";
import CustomToggle from "../common/customToggle";
import { copyToClipboard, formatToPrice } from "../../utils/utils";
import { CopyI, DeleteI } from "../../assets/icon";

const ManageProducts = ({ data: restaurant }) => {
  const cats = [
    { value: "Corbalar", label: "Çorbalar", id: 0 },
    { value: "AnaYemekler", label: "Ana Yemekler", id: 1 },
    { value: "Pilavlar", label: "Pilavlar", id: 2 },
    { value: "HamurIsleri", label: "Hamur İşleri", id: 3 },
    { value: "DenizUrunleri", label: "Deniz Ürünleri", id: 4 },
    { value: "Zeytinyaglilar", label: "Zeytinyağlılar", id: 5 },
    { value: "Tatlilar", label: "Tatlılar", id: 6 },
    { value: "Salatalar", label: "Salatalar", id: 7 },
    { value: "Mezeler", label: "Meze ve Aperatifler", id: 8 },
    { value: "Icecekler", label: "İçecekler", id: 9 },
  ];

  const subCats = [
    { value: "Mercimek Çorbası", label: "Mercimek Çorbası" },
    { value: "Ezogelin Çorbası", label: "Ezogelin Çorbası" },
    { value: "Kuru Fasulye", label: "Kuru Fasulye" },
    { value: "Et Sote", label: "Et Sote" },
    { value: "Tavuk Şiş", label: "Tavuk Şiş" },
    { value: "Bulgur Pilavı", label: "Bulgur Pilavı" },
    { value: "İç Pilav", label: "İç Pilav" },
    { value: "Nohutlu Pilav", label: "Nohutlu Pilav" },
    { value: "Mantı", label: "Mantı" },
    { value: "Gözleme", label: "Gözleme" },
    { value: "Lahmacun", label: "Lahmacun" },
    { value: "Baklava", label: "Baklava" },
    { value: "Künefe", label: "Künefe" },
    { value: "Sütlaç", label: "Sütlaç" },
  ];
  const [previews, setPreviews] = useState([]);
  const [prods, setProds] = useState([
    {
      image: "",
      category: "",
      subCategory: "",
      name: "",
      description: "",
      recommendation: "",
      hide: "",
      portions: [],
    },
  ]);

  // ---- PRODUCT LEVEL ----
  const addProduct = () => {
    setProds([
      ...prods,
      {
        image: "",
        category: "",
        subCategory: "",
        name: "",
        description: "",
        recommendation: false,
        hide: false,
        portions: [],
      },
    ]);
  };

  const deleteProduct = (index) => {
    const updated = [...prods];
    updated.splice(index, 1);
    setProds(updated);
  };

  // ---- PORTIONS ----
  const addPortion = (pIndex) => {
    const updated = [...prods];
    updated[pIndex].portions.push({ name: "", price: "", orderTags: [] });
    setProds(updated);
  };

  const deletePortion = (pIndex, portionIndex) => {
    const updated = [...prods];
    updated[pIndex].portions.splice(portionIndex, 1);
    setProds(updated);
  };

  // ---- ORDER TAGS ----
  const addOrderTag = (pIndex, portionIndex) => {
    const updated = [...prods];
    updated[pIndex].portions[portionIndex].orderTags.push({
      name: "",
      orderTagItems: [],
    });
    setProds(updated);
  };

  const deleteOrderTag = (pIndex, portionIndex, tagIndex) => {
    const updated = [...prods];
    updated[pIndex].portions[portionIndex].orderTags.splice(tagIndex, 1);
    setProds(updated);
  };

  // ---- ORDER TAG ITEMS ----
  const addOrderTagItem = (pIndex, portionIndex, tagIndex) => {
    const updated = [...prods];
    updated[pIndex].portions[portionIndex].orderTags[
      tagIndex
    ].orderTagItems.push({
      name: "",
      price: "",
      minSelectedItems: "",
      maxSelectedItems: "",
    });
    setProds(updated);
  };

  const deleteOrderTagItem = (pIndex, portionIndex, tagIndex, itemIndex) => {
    const updated = [...prods];
    updated[pIndex].portions[portionIndex].orderTags[
      tagIndex
    ].orderTagItems.splice(itemIndex, 1);
    setProds(updated);
  };

  //PREVIEW
  useEffect(() => {
    const newPreviews = prods.map((p) =>
      p.image ? URL.createObjectURL(p.image) : null
    );
    setPreviews(newPreviews);
    return () => newPreviews.forEach((url) => url && URL.revokeObjectURL(url));
  }, [prods]);

  return (
    <section className="w-full py-5 mt-10 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>

        {prods.map((product, index) => (
          <main key={index} className="border border-[--primary-1] rounded p-4">
            {/* Delete product */}
            {prods.length > 1 && (
              <div
                className="flex justify-end text-[--red-1] text-sm cursor-pointer mb-2"
                onClick={() => deleteProduct(index)}
              >
                <DeleteI className="size-[1rem]" /> Ürünü Sil
              </div>
            )}

            {/* Product Info */}
            <div className="flex gap-3 justify-between w-full text-[--gr-1]">
              <div className="mt-4 items-center w-full">
                {previews[index] && (
                  <div className="w-full max-w-">
                    <img src={previews[index]} alt="preview_liwamenu" />
                  </div>
                )}
                <CustomFileInput
                  className="h-[8rem] p-4"
                  value={product.image}
                  onChange={(e) => {
                    const updated = [...prods];
                    updated[index].image = e;
                    setProds(updated);
                  }}
                  accept={"image/png, image/jpeg"}
                />
              </div>

              <div className="flex flex-col w-full max-w-80">
                <CustomSelect
                  required={true}
                  label="Kategory"
                  placeholder="Kategory"
                  style={{ padding: "1px 0px" }}
                  className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                  value={{ value: product.category, label: product.category }}
                  options={[{ value: null, label: "Kategory Seç" }, ...cats]}
                  onChange={(e) => {
                    const updated = [...prods];
                    updated[index].category = e.value;
                    setProds(updated);
                  }}
                />

                <CustomSelect
                  required={true}
                  label="Alt Kategory"
                  placeholder="Alt Kategory"
                  style={{ padding: "1px 0px" }}
                  className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                  value={{
                    value: product.subCategory,
                    label: product.subCategory,
                  }}
                  options={[
                    { value: null, label: "Alt Kategory Seç" },
                    ...subCats,
                  ]}
                  onChange={(e) => {
                    const updated = [...prods];
                    updated[index].subCategory = e.value;
                    setProds(updated);
                  }}
                />

                <CustomInput
                  required={true}
                  label="Ürün Adı"
                  placeholder="Ürün Adı"
                  className="py-[.45rem] text-sm "
                  className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                  value={product.name}
                  onChange={(e) => {
                    const updated = [...prods];
                    updated[index].name = e;
                    setProds(updated);
                  }}
                />

                <CustomInput
                  required={true}
                  label="Açıklama"
                  placeholder="Açıklama"
                  className="py-[.45rem] text-sm"
                  className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                  value={product.description}
                  onChange={(e) => {
                    const updated = [...prods];
                    updated[index].description = e;
                    setProds(updated);
                  }}
                />
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between items-center max-w-md">
                    <label className="font-medium">Shef tavsiyesi</label>
                    <CustomToggle
                      checked={product.recommendation}
                      className="scale-[0.8]"
                      onChange={() => {
                        const updated = [...prods];
                        updated[index].recommendation =
                          !updated[index].recommendation;
                        setProds(updated);
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center max-w-md">
                    <label className="font-medium">Gizle</label>
                    <CustomToggle
                      checked={product.hide}
                      className="scale-[0.8]"
                      onChange={() => {
                        const updated = [...prods];
                        updated[index].hide = !updated[index].hide;
                        setProds(updated);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Portions */}
            <div>
              <h3 className="font-semibold mt-4 mb-2">Porsiyonlar</h3>
              <div className="flex justify-end">
                <button
                  onClick={() => addPortion(index)}
                  className="text-sm mb-2 text-blue-600"
                >
                  + Porsiyon Ekle
                </button>
              </div>

              {product.portions.map((portion, pIndex) => (
                <div key={pIndex} className="border p-3 rounded mb-2">
                  <div className="flex gap-4">
                    <CustomInput
                      required={true}
                      label="Porsiyon Adı"
                      placeholder="Porsiyon Adı"
                      className="py-[.45rem] text-sm "
                      className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                      value={portion.name}
                      onChange={(e) => {
                        const updated = [...prods];
                        updated[index].portions[pIndex].name = e;
                        setProds(updated);
                      }}
                    />

                    <CustomInput
                      required={true}
                      type="number"
                      label="Porsiyon Fiyatı"
                      placeholder="Porsiyon Fiyatı"
                      className="py-[.45rem] text-sm "
                      className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                      value={formatToPrice(portion.price)}
                      onChange={(e) => {
                        const updated = [...prods];
                        updated[index].portions[pIndex].price = e;
                        setProds(updated);
                      }}
                    />

                    <div
                      className="text-sm text-[--red-1] flex items-center text-nowrap cursor-pointer"
                      onClick={() => deletePortion(index, pIndex)}
                    >
                      <div className="flex items-center gap-1">
                        <p>Porsiyonu Sil</p>
                        <DeleteI className=" size-[1rem]" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <button
                      onClick={() => addOrderTag(index, pIndex)}
                      className="text-sm text-blue-600"
                    >
                      + Baharat veya Seçimi Ekle
                    </button>

                    {portion.orderTags.map((tag, tIndex) => (
                      <div
                        key={tIndex}
                        className="border mt-2 ml-4 px-2 rounded"
                      >
                        <div className="flex w-full justify-between">
                          <CustomInput
                            required={true}
                            label="Etiket Adı (ör: Baharat Seçimi)"
                            placeholder="Etiket Adı (ör: Baharat Seçimi)"
                            className="py-[.45rem] text-sm max-w-64"
                            className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                            value={tag.name}
                            onChange={(e) => {
                              const updated = [...prods];
                              updated[index].portions[pIndex].orderTags[
                                tIndex
                              ].name = e;
                              setProds(updated);
                            }}
                          />

                          <div
                            className="text-sm text-[--red-1] flex items-center text-nowrap cursor-pointer"
                            onClick={() =>
                              deleteOrderTag(index, pIndex, tIndex)
                            }
                          >
                            <div className="flex items-center gap-1">
                              <p>Baharat veya Seçimi Sil</p>
                              <DeleteI className=" size-[1rem]" />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addOrderTagItem(index, pIndex, tIndex)}
                          className="text-sm text-green-600"
                        >
                          + Seçenek Ekle
                        </button>

                        <div className="flex flex-col border border-[--border-1] px-1 mb-1 rounded ml-4">
                          {tag.orderTagItems.map((item, iIndex) => (
                            <div key={iIndex} className="flex gap-2 my-1">
                              <div className="w-full flex gap-2 max-sm:flex-col">
                                <CustomInput
                                  required={true}
                                  placeholder="Adı"
                                  className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                                  className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                  value={item.name}
                                  onChange={(e) => {
                                    const updated = [...prods];
                                    updated[index].portions[pIndex].orderTags[
                                      tIndex
                                    ].orderTagItems[iIndex].name = e;
                                    setProds(updated);
                                  }}
                                />

                                <CustomInput
                                  required={true}
                                  type="number"
                                  placeholder="Fiyat"
                                  className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                                  className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                  value={formatToPrice(item.price)}
                                  onChange={(e) => {
                                    const updated = [...prods];
                                    updated[index].portions[pIndex].orderTags[
                                      tIndex
                                    ].orderTagItems[iIndex].price = e;
                                    setProds(updated);
                                  }}
                                />
                              </div>

                              <div className="w-full flex gap-2 max-sm:flex-col">
                                <CustomInput
                                  type="number"
                                  required={true}
                                  placeholder="En Az Seçimi"
                                  className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                                  className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                  value={item.minSelectedItems}
                                  onChange={(e) => {
                                    const updated = [...prods];
                                    updated[index].portions[pIndex].orderTags[
                                      tIndex
                                    ].orderTagItems[iIndex].minSelectedItems =
                                      e;
                                    setProds(updated);
                                  }}
                                />
                                <CustomInput
                                  type="number"
                                  required={true}
                                  placeholder="En Fazla Seçimi"
                                  className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                                  className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                  value={item.maxSelectedItems}
                                  onChange={(e) => {
                                    const updated = [...prods];
                                    updated[index].portions[pIndex].orderTags[
                                      tIndex
                                    ].orderTagItems[iIndex].maxSelectedItems =
                                      e;
                                    setProds(updated);
                                  }}
                                />
                              </div>

                              <div
                                className="text-sm text-[--red-1] flex items-center text-nowrap cursor-pointer"
                                onClick={() =>
                                  deleteOrderTagItem(
                                    index,
                                    pIndex,
                                    tIndex,
                                    iIndex
                                  )
                                }
                              >
                                <div className="flex items-center gap-1">
                                  <p>Sil</p>
                                  <DeleteI className=" size-[1rem]" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        ))}

        <button
          onClick={addProduct}
          className="mt-4 text-blue-600 text-sm border border-blue-500 px-3 py-1 rounded"
        >
          + Yeni Ürün Ekle
        </button>

        <div>
          <div className="w-full mt-6 p-4 flex justify-end bg-gray-100 text-[--blue-2]">
            <button
              onClick={() =>
                copyToClipboard({
                  text: JSON.stringify(prods, null, 2),
                  msg: "JSON kopyalandı!",
                })
              }
              className="flex items-center gap-2"
            >
              <CopyI />
            </button>
          </div>
          <pre className=" bg-gray-100 p-3 rounded text-sm">
            {JSON.stringify(prods, null, 2)}
          </pre>
        </div>
      </div>
    </section>
  );
};

export default ManageProducts;

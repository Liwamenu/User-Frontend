import { useState } from "react";
import CustomSelect from "../components/common/customSelector";
import CustomInput from "../components/common/customInput";
import CustomFileInput from "../components/common/customFileInput";
import { useEffect } from "react";
import CustomToggle from "../components/common/customToggle";

const TestPage = () => {
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
  const [preview, setPreview] = useState(null);
  const [product, setProduct] = useState({
    image: "",
    category: "",
    subCategory: "",
    name: "",
    description: "",
    recommendation: "",
    hide: "",
    portions: [],
  });

  const addPortion = () => {
    setProduct({
      ...product,
      portions: [...product.portions, { name: "", price: "", orderTags: [] }],
    });
  };

  const addOrderTag = (pIndex) => {
    const newPortions = [...product.portions];
    newPortions[pIndex].orderTags.push({
      name: "",
      orderTagItems: [],
    });
    setProduct({ ...product, portions: newPortions });
  };

  const addOrderTagItem = (pIndex, tIndex) => {
    const newPortions = [...product.portions];
    newPortions[pIndex].orderTags[tIndex].orderTagItems.push({
      name: "",
      price: "",
    });
    setProduct({ ...product, portions: newPortions });
  };

  //PREVIEW
  useEffect(() => {
    if (!product.image) return;

    // Create a preview URL
    const objectUrl = URL.createObjectURL(product.image);
    setPreview(objectUrl);

    // Free memory when the component unmounts or doc changes
    return () => URL.revokeObjectURL(objectUrl);
  }, [product.image]);

  return (
    <section className="w-full py-5 mt-10 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Yeni Ürün Ekle</h2>

        {/* Product Info */}
        <div className="flex gap-3 justify-between w-full text-[--gr-1]">
          <div className="mt-4 items-center w-full">
            {preview && (
              <div className="w-full max-w-">
                <img src={preview} alt="preview_liwamenu" />
              </div>
            )}
            <CustomFileInput
              className="h-[8rem] p-4"
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e })}
              accept={"image/png, image/jpeg"}
            />
          </div>

          <div className="flex flex-col gap-3 w-full max-w-80">
            <CustomSelect
              required={true}
              label="Kategory"
              placeholder="Kategory"
              style={{ padding: "1px 0px" }}
              className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
              value={{ value: product.category, label: product.category }}
              options={[{ value: null, label: "Kategory Seç" }, ...cats]}
              onChange={(e) => setProduct({ ...product, category: e.value })}
            />

            <CustomSelect
              required={true}
              label="Alt Kategory"
              placeholder="Alt Kategory"
              style={{ padding: "1px 0px" }}
              className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
              value={{ value: product.subCategory, label: product.subCategory }}
              options={[{ value: null, label: "Alt Kategory Seç" }, ...subCats]}
              onChange={(e) => setProduct({ ...product, subCategory: e.value })}
            />

            <CustomInput
              required={true}
              label="Ürün Adı"
              placeholder="Ürün Adı"
              className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
              className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e })}
            />

            <CustomInput
              required={true}
              label="Açıklama"
              placeholder="Açıklama"
              className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
              className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e })}
            />

            <div className="flex justify-between items-center max-w-md">
              <label className="font-medium">Shef tavsiyesi</label>
              <CustomToggle
                checked={product.recommendation}
                className="scale-[0.8]"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    recommendation: !product.recommendation,
                  })
                }
              />
            </div>

            <div className="flex justify-between items-center max-w-md">
              <label className="font-medium">Gizle</label>
              <CustomToggle
                checked={product.hide}
                className="scale-[0.8]"
                onChange={(e) =>
                  setProduct({
                    ...product,
                    hide: !product.hide,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Portions */}
        <div>
          <h3 className="font-semibold mt-4 mb-2">Porsiyonlar</h3>
          {product.portions.map((portion, pIndex) => (
            <div key={pIndex} className="border p-3 rounded mb-2">
              <input
                placeholder="Porsiyon Adı"
                value={portion.name}
                onChange={(e) => {
                  const newPortions = [...product.portions];
                  newPortions[pIndex].name = e.target.value;
                  setProduct({ ...product, portions: newPortions });
                }}
                className="border p-2 w-full mb-2"
              />
              <input
                placeholder="Fiyat"
                value={portion.price}
                onChange={(e) => {
                  const newPortions = [...product.portions];
                  newPortions[pIndex].price = e.target.value;
                  setProduct({ ...product, portions: newPortions });
                }}
                className="border p-2 w-full mb-2"
              />

              <button
                onClick={() => addOrderTag(pIndex)}
                className="text-sm text-blue-600"
              >
                + Baharat veya Seçim Ekle
              </button>

              {portion.orderTags.map((tag, tIndex) => (
                <div key={tIndex} className="border mt-2 p-2 rounded">
                  <input
                    placeholder="Etiket Adı (ör: Baharat Seçimi)"
                    value={tag.name}
                    onChange={(e) => {
                      const newPortions = [...product.portions];
                      newPortions[pIndex].orderTags[tIndex].name =
                        e.target.value;
                      setProduct({ ...product, portions: newPortions });
                    }}
                    className="border p-2 w-full mb-2"
                  />

                  <button
                    onClick={() => addOrderTagItem(pIndex, tIndex)}
                    className="text-sm text-green-600"
                  >
                    + Seçenek Ekle
                  </button>

                  {tag.orderTagItems.map((item, iIndex) => (
                    <div key={iIndex} className="flex gap-2 mt-1">
                      <input
                        placeholder="Adı"
                        value={item.name}
                        onChange={(e) => {
                          const newPortions = [...product.portions];
                          newPortions[pIndex].orderTags[tIndex].orderTagItems[
                            iIndex
                          ].name = e.target.value;
                          setProduct({ ...product, portions: newPortions });
                        }}
                        className="border p-2 flex-1"
                      />
                      <input
                        placeholder="Fiyat"
                        value={item.price}
                        onChange={(e) => {
                          const newPortions = [...product.portions];
                          newPortions[pIndex].orderTags[tIndex].orderTagItems[
                            iIndex
                          ].price = e.target.value;
                          setProduct({ ...product, portions: newPortions });
                        }}
                        className="border p-2 w-24"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}

          <button onClick={addPortion} className="text-sm mt-2 text-blue-600">
            + Porsiyon Ekle
          </button>
        </div>

        <pre className="mt-6 bg-gray-100 p-3 rounded text-sm">
          {JSON.stringify(product, null, 2)}
        </pre>
      </div>
    </section>
  );
};

export default TestPage;

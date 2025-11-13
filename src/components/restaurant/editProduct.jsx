import { useEffect, useState } from "react";
import CustomSelect from "../common/customSelector";
import CustomInput from "../common/customInput";
import CustomFileInput from "../common/customFileInput";
import CustomToggle from "../common/customToggle";
import { formatToPrice } from "../../utils/utils";
import { ArrowIL, DeleteI } from "../../assets/icon";
import subCats from "../../assets/json/subcats";
import cats from "../../assets/json/categories";
import etikets from "../../assets/json/etikets";
import options from "../../assets/json/options";
import burger from "../../assets/img/burger.jpg";
import { Link, useLocation, useParams } from "react-router-dom";
import CustomTextarea from "../common/customTextarea";

const EditProduct = ({ data: restaurant }) => {
  const [preview, setPreview] = useState(null);
  const { id, prodId } = useParams();
  const location = useLocation();
  const product = location.state?.product;
  // console.log(prodId);
  // console.log(id);

  const [prodData, setProdData] = useState(
    product || {
      url: burger,
      category: "Çorbalar",
      subCategory: "Et Sote",
      name: "Burger",
      description: "This is a delicious burger",
      recommendation: false,
      hide: false,
      portions: [
        {
          name: "Normal",
          price: 2,
          orderTags: [],
        },
      ],
    }
  );

  // ---- PORTIONS ----
  const addPortion = () => {
    const updated = { ...prodData };
    updated.portions.push({ name: "", price: "", orderTags: [] });
    setProdData(updated);
  };

  const deletePortion = (portionIndex) => {
    const updated = { ...prodData };
    updated.portions.splice(portionIndex, 1);
    setProdData(updated);
  };

  // ---- ORDER TAGS ----
  const addOrderTag = (portionIndex) => {
    const updated = { ...prodData };
    updated.portions[portionIndex].orderTags.push({
      name: "",
      orderTagItems: [],
    });
    setProdData(updated);
  };

  const deleteOrderTag = (portionIndex, tagIndex) => {
    const updated = { ...prodData };
    updated.portions[portionIndex].orderTags.splice(tagIndex, 1);
    setProdData(updated);
  };

  // ---- ORDER TAG ITEMS ----
  const addOrderTagItem = (portionIndex, tagIndex) => {
    const updated = { ...prodData };
    updated.portions[portionIndex].orderTags[tagIndex].orderTagItems.push({
      name: "",
      price: 0,
      minSelectedItems: "",
      maxSelectedItems: "",
    });
    setProdData(updated);
  };

  // ---- DELETE ORER TAG ITEMS ----
  const deleteOrderTagItem = (portionIndex, tagIndex, itemIndex) => {
    const updated = { ...prodData };
    updated.portions[portionIndex].orderTags[tagIndex].orderTagItems.splice(
      itemIndex,
      1
    );
    setProdData(updated);
  };

  // -- Handle Submit ---
  const handleProductSubmit = (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("productsData", JSON.stringify(prodData));
      formData.append(`image_${0}`, prodData?.image);

      // Now you can send formData to your server using fetch or axios
      console.log("Form Data prepared for submission:", formData);
      console.log("prodData Data prepared for submission:", prodData);
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  //PREVIEW
  useEffect(() => {
    const prodReview = prodData.url || null;

    setPreview(prodReview);
    return () => prodReview && URL.revokeObjectURL(prodReview);
  }, [prodData]);

  return (
    <section className="w-full py-4 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="px-4 max-w-4xl mx-auto">
        <div>
          <Link
            to={`/restaurant/products/${id}`}
            className="w-max flex items-center text-[--primary-1] p-1 rounded mb-2"
          >
            <ArrowIL className="size-[1.3rem]" /> Geri Dön
          </Link>
        </div>

        <h1 className="self-center text-2xl font-bold">
          Ürün Düzenle{" "}
          <span className="text-[--primary-1]"> {restaurant.name} </span>
          Restoranı
        </h1>

        <form onSubmit={handleProductSubmit}>
          {prodData && (
            <main className="border border-[--primary-1] rounded p-4 mb-2">
              {/* Product Info */}
              <div className="flex gap-3 justify-between w-full text-[--gr-1]">
                <div className="mt-4 items-center w-full">
                  {preview && (
                    <div className="w-full max-w-80">
                      <img src={preview} alt="preview_liwamenu" />
                    </div>
                  )}
                  <CustomFileInput
                    className="h-[8rem] p-4"
                    value={prodData.image ? prodData.image : prodData.url}
                    onChange={(e) => {
                      const updated = { ...prodData };
                      updated.image = e;
                      setProdData(updated);
                    }}
                    accept={"image/png, image/jpeg"}
                  />
                </div>

                <div className="flex flex-col w-full max-w-80">
                  <CustomSelect
                    required
                    label="Kategory"
                    placeholder="Kategory"
                    style={{ padding: "1px 0px" }}
                    className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                    value={{
                      value: prodData.category,
                      label: prodData.category,
                    }}
                    options={cats}
                    onChange={(e) => {
                      const updated = { ...prodData };
                      updated.category = e.label;
                      setProdData(updated);
                    }}
                  />

                  <CustomSelect
                    required
                    label="Alt Kategory"
                    placeholder="Alt Kategory"
                    style={{ padding: "1px 0px" }}
                    className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                    value={{
                      value: prodData.subCategory,
                      label: prodData.subCategory,
                    }}
                    options={subCats}
                    onChange={(e) => {
                      const updated = { ...prodData };
                      updated.subCategory = e.value;
                      setProdData(updated);
                    }}
                  />

                  <CustomInput
                    required
                    label="Ürün Adı"
                    placeholder="Ürün Adı"
                    className="py-[.45rem] text-sm "
                    className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                    value={prodData.name}
                    onChange={(e) => {
                      const updated = { ...prodData };
                      updated.name = e;
                      setProdData(updated);
                    }}
                  />

                  <CustomTextarea
                    required
                    label="Açıklama"
                    placeholder="Açıklama"
                    className="py-[.45rem] text-sm"
                    className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                    value={prodData.description}
                    onChange={(e) => {
                      const updated = { ...prodData };
                      updated.description = e.target.value;
                      setProdData(updated);
                    }}
                  />
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="flex justify-between items-center max-w-md">
                      <label className="font-medium">Shef tavsiyesi</label>
                      <CustomToggle
                        checked={prodData.recommendation}
                        className="scale-[0.8]"
                        onChange={() => {
                          const updated = { ...prodData };
                          updated.recommendation = !updated.recommendation;
                          setProdData(updated);
                        }}
                      />
                    </div>

                    <div className="flex justify-between items-center max-w-md">
                      <label className="font-medium">Gizle</label>
                      <CustomToggle
                        checked={prodData.hide}
                        className="scale-[0.8]"
                        onChange={() => {
                          const updated = { ...prodData };
                          updated.hide = !updated.hide;
                          setProdData(updated);
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
                    type="button"
                    onClick={addPortion}
                    className="text-sm mb-2 text-blue-600"
                  >
                    + Porsiyon Ekle
                  </button>
                </div>

                {prodData.portions.map((portion, pIndex) => (
                  <div key={pIndex} className="border p-3 rounded mb-2">
                    <div className="flex gap-4">
                      <CustomInput
                        required
                        label="Porsiyon Adı"
                        placeholder="Porsiyon Adı"
                        className="py-[.45rem] text-sm "
                        className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                        value={portion.name}
                        onChange={(e) => {
                          const updated = { ...prodData };
                          updated.portions[pIndex].name = e;
                          setProdData(updated);
                        }}
                      />

                      <CustomInput
                        required
                        type="number"
                        label="Porsiyon Fiyatı"
                        placeholder="Porsiyon Fiyatı"
                        className="py-[.45rem] text-sm "
                        className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                        value={formatToPrice(portion.price)}
                        onChange={(e) => {
                          const updated = { ...prodData };
                          updated.portions[pIndex].price = e;
                          setProdData(updated);
                        }}
                      />

                      <div
                        className="text-sm text-[--red-1] flex items-center text-nowrap cursor-pointer pt-6"
                        onClick={() => deletePortion(pIndex)}
                      >
                        {pIndex !== 0 && (
                          <div className="flex items-center gap-1">
                            <p>Porsiyonu Sil</p>
                            <DeleteI className=" size-[1rem]" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => addOrderTag(pIndex)}
                        className="text-sm text-blue-600"
                      >
                        + Etiket Ekle
                      </button>

                      {portion.orderTags.map((tag, tIndex) => (
                        <div
                          key={tIndex}
                          className="border mt-2 ml-4 px-2 rounded"
                        >
                          <div className="flex w-full justify-between">
                            <CustomSelect
                              required
                              label="Etiket Adı (ör: Baharat Seçimi)"
                              placeholder="Etiket Adı (ör: Baharat Seçimi)"
                              style={{ padding: "1px 0px" }}
                              className2="py-[.45rem] text-sm mt-[0] sm:mt-[0]  max-w-64"
                              value={{
                                value: tag.name || null,
                                label: tag.name || "Alt Kategory Seç",
                              }}
                              options={etikets}
                              onChange={(e) => {
                                const updated = { ...prodData };
                                updated.portions[pIndex].orderTags[
                                  tIndex
                                ].name = e.label;
                                setProdData(updated);
                              }}
                            />

                            <div
                              className="text-sm text-[--red-1] flex items-center text-nowrap cursor-pointer"
                              onClick={() => deleteOrderTag(pIndex, tIndex)}
                            >
                              <div className="flex items-center gap-1">
                                <p>Etiketi Sil</p>
                                <DeleteI className=" size-[1rem]" />
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addOrderTagItem(pIndex, tIndex)}
                            className="text-sm text-green-600"
                          >
                            + Seçenek Ekle(Ör: Acılı, Tuzsuz)
                          </button>

                          <div
                            className={`flex flex-col ${
                              tag?.orderTagItems?.length &&
                              "border border-[--border-1]"
                            } px-1 mb-1 rounded ml-4`}
                          >
                            {tag.orderTagItems.map((item, iIndex) => (
                              <div key={iIndex} className="flex gap-2 my-1">
                                <div className="w-full flex gap-2 max-sm:flex-col">
                                  <CustomSelect
                                    required
                                    // label="Seçenek Adı"
                                    placeholder="Seçenek Adı"
                                    style={{ padding: "1px 0px" }}
                                    className="text-sm mt-[0] sm:mt-[0]"
                                    className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                    value={{
                                      value: item.name || null,
                                      label: item.name || "Seçenek Seç",
                                    }}
                                    options={options}
                                    onChange={(e) => {
                                      const updated = { ...prodData };
                                      updated.portions[pIndex].orderTags[
                                        tIndex
                                      ].orderTagItems[iIndex].name = e.label;
                                      updated.portions[pIndex].orderTags[
                                        tIndex
                                      ].orderTagItems[iIndex].price = e.price;
                                      setProdData(updated);
                                    }}
                                  />

                                  <CustomInput
                                    readOnly
                                    type="number"
                                    placeholder="Fiyat"
                                    className="py-[.45rem] text-sm mt-[0] sm:mt-[0] cursor-not-allowed"
                                    className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                    value={formatToPrice(item.price)}
                                    onChange={(e) => {
                                      const updated = { ...prodData };
                                      updated.portions[pIndex].orderTags[
                                        tIndex
                                      ].orderTagItems[iIndex].price = e;
                                      setProdData(updated);
                                    }}
                                  />
                                </div>

                                <div className="w-full flex gap-2 max-sm:flex-col">
                                  <CustomInput
                                    type="number"
                                    placeholder="En Az Seçimi"
                                    className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                                    className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                    value={item.minSelectedItems}
                                    onChange={(e) => {
                                      const updated = { ...prodData };
                                      updated.portions[pIndex].orderTags[
                                        tIndex
                                      ].orderTagItems[iIndex].minSelectedItems =
                                        e;
                                      setProdData(updated);
                                    }}
                                  />
                                  <CustomInput
                                    type="number"
                                    placeholder="En Fazla Seçimi"
                                    className="py-[.45rem] text-sm mt-[0] sm:mt-[0]"
                                    className2="py-[0] text-sm mt-[0] sm:mt-[0]"
                                    value={item.maxSelectedItems}
                                    onChange={(e) => {
                                      const updated = { ...prodData };
                                      updated.portions[pIndex].orderTags[
                                        tIndex
                                      ].orderTagItems[iIndex].maxSelectedItems =
                                        e;
                                      setProdData(updated);
                                    }}
                                  />
                                </div>

                                <div
                                  className="text-sm text-[--red-1] flex items-center text-nowrap cursor-pointer"
                                  onClick={() =>
                                    deleteOrderTagItem(pIndex, tIndex, iIndex)
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
          )}

          <div className={`flex w-full justify-between`}>
            <button
              type="button"
              className="mt-4 text-white bg-[--red-1] text-sm border border-[--red-1] px-5 py-1 rounded"
            >
              Ürünü Sil
            </button>
            <button
              type="submit"
              className="mt-4 text-white bg-[--primary-1] text-sm border border-[--primary-1] px-3 py-1 rounded"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default EditProduct;

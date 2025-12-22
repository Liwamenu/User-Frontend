//MODULES
import toast from "react-hot-toast";
import isEqual from "lodash/isEqual";
import { useSelector, useDispatch } from "react-redux";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

//COMP
import ProductsHeader from "./header";
import { StackI } from "../../../assets/icon";
import CustomInput from "../../common/customInput";

//DEMO
import Products from "../../../assets/js/Products.json";
import PriceListApplyBulk from "./priceListApplyBulk";

//REDUX
import {
  updatePriceList,
  resetUpdatePriceList,
} from "../../../redux/products/updatePriceListSlice";
import { getProducts } from "../../../redux/products/getProductsSlice";

const PriceList = ({ data: restaurant }) => {
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const { t } = useTranslation();

  const { products } = useSelector((s) => s.products.get);
  const { success, error } = useSelector((s) => s.products.updatePriceList);

  const [list, setList] = useState([]);
  const [listBefore, setListBefore] = useState([]);
  const [groupedByCategory, setGroupedByCategory] = useState({});

  const updatePortion = (pIndex, portionIndex, key, value) => {
    setList((prev) => {
      const next = [...prev];
      const portions = [...(next[pIndex].portions || [])];
      portions[portionIndex] = { ...portions[portionIndex], [key]: value };
      next[pIndex] = { ...next[pIndex], portions };
      return next;
    });
  };

  // On Products load, set local list state and group by category
  useEffect(() => {
    // Products.json exports an object { Products: [...] }
    const productsList =
      (products?.data.length && products.data) || Products?.Products || [];

    // initialize editable local copy
    const initialList = productsList.map((p) => ({
      ...p,
      portions: (p.portions || []).map((pt) => ({
        ...pt,
        name: pt.name ?? "",
        price: pt.price ?? "",
      })),
    }));
    setList(initialList);
    setListBefore(initialList);

    // Group products by categoryID
    const grouped = {};
    initialList.forEach((product) => {
      const categoryId = product.categoryId || "uncategorized";
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
    });
    setGroupedByCategory(grouped);
  }, [Products, products]);

  // Submit: find changed Products (deep compare with original Products) and console them
  const handleSaveAll = () => {
    const productsList = Products?.Products || [];

    const changed = list.filter((prod) => {
      const orig = productsList.find((p) => p.id === prod.id);
      // if no original (new product) consider changed
      if (!orig) return true;
      return !isEqual(prod, orig);
    });

    //Get only id and price of chnaged products portions
    const changedWithPortions = changed.map((prod) => {
      const orig = productsList.find((p) => p.id === prod.id);
      const changedPortions = (prod.portions || []).filter((pt, index) => {
        const origPortion = (orig?.portions || [])[index];
        return !isEqual(pt, origPortion);
      });
      return {
        id: prod.id,
        portions: changedPortions.map((pt) => ({
          id: pt.id,
          price: pt.price,
          campaignPrice: pt.campaignPrice,
        })),
      };
    });

    console.log("Data to send:", changedWithPortions);
    dispatch(updatePriceList(changedWithPortions));
  };

  // Separate vertical navigation for each column
  const handleKeyDown = (e) => {
    const key = e.key;
    if (!["Enter", "ArrowDown", "ArrowUp"].includes(key)) return;
    e.preventDefault();

    const target = e.target;
    const dataAttr = target.getAttribute("data-edit")
      ? "data-edit"
      : "data-edit-second";

    // Get only inputs from the same column
    const inputs = containerRef.current?.querySelectorAll(`input[${dataAttr}]`);
    if (!inputs || !inputs.length) return;

    const arr = Array.from(inputs);
    const currentIndex = arr.indexOf(target);
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

  //TOAST
  useEffect(() => {
    if (success) {
      toast.success(t("priceList.success"));
      dispatch(getProducts({ restaurantId: restaurant.id }));
      dispatch(resetUpdatePriceList());
    }
    if (error) {
      dispatch(resetUpdatePriceList());
    }
  }, [success, error, list, dispatch]);

  return (
    <section className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="px-4 max-w-6xl mx-auto" ref={containerRef}>
        {/* <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 px-4 sm:px-14 rounded-t-lg">
          Fiyat Listesi {restaurant?.name} Restoranı
        </h1> */}

        <div className="flex flex-wrap gap-2 my-3 text-sm max-sm:grid max-sm:grid-cols-2 max-sm:items-center">
          <ProductsHeader />

          {!isEqual(list, listBefore) && (
            <div className="flex justify-end">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveAll}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md shadow-lg hover:bg-green-700 transition-all"
                >
                  {t("priceList.save_changes")}
                </button>
              </div>
            </div>
          )}
        </div>

        <PriceListApplyBulk list={list} setList={setList} />

        {/* Grouped by Category */}
        <div className="mt-6 overflow-x-auto border border-[--border-1] rounded-xl flex flex-col gap-1 pb-2">
          {Object.entries(groupedByCategory).map(([categoryId, products]) => (
            <div key={categoryId}>
              <table className="w-full min-w-[30rem] text-[--gr-1]">
                <tbody>
                  {products.map((prod, idx) => {
                    const i = list.findIndex((p) => p.id === prod.id);
                    const currentProd = list[i];

                    return (
                      <React.Fragment key={idx}>
                        {idx === 0 && (
                          <tr>
                            <td colSpan="4" className="bg-[--light-4]">
                              <div className="pl-4 py-2 flex w-full  gap-2 text-[--black-2] font-semibold text-sm">
                                <StackI className="size-[1.1rem] text-[--primary-1]" />
                                <p>{prod.categoryName}</p>
                              </div>
                            </td>
                          </tr>
                        )}

                        {(currentProd?.portions || []).map((portion, pi) => (
                          <tr key={pi} className="border-b border-[--light-3]">
                            {/* postion name */}
                            <td className="pl-4 py-2">
                              <p className="text-[--black-1] text-sm">
                                {currentProd?.name}
                              </p>
                              <p className="text-xs font-light">
                                {portion.name}
                              </p>
                            </td>

                            {/* normal price */}
                            <td className="w-32 py-2 pr-3">
                              <label className="text-[10px] text-[--gr-2] uppercase">
                                {t("priceList.normal_price")}
                              </label>
                              <CustomInput
                                data-edit={true}
                                type="number"
                                className="py-[5px] rounded-md w-full text-sm border-[--status-brown] text-[--black-1] bg-[--white-2]"
                                value={portion.price ?? ""}
                                onChange={(v) =>
                                  updatePortion(i, pi, "price", Number(v))
                                }
                                onKeyDown={handleKeyDown}
                              />
                            </td>

                            {/* discounted price */}
                            <td className="pr-4 w-32 py-2">
                              <label className="text-[10px] text-[--green-1] uppercase">
                                {t("priceList.campaign")}
                              </label>
                              <CustomInput
                                data-edit-second={true}
                                type="number"
                                className="py-[5px] rounded-md w-full text-sm text-[--green-1] border-green-400/50 bg-[--white-2]"
                                value={portion.campaignPrice || ""}
                                onChange={(v) =>
                                  updatePortion(
                                    i,
                                    pi,
                                    "campaignPrice",
                                    Number(v)
                                  )
                                }
                                onKeyDown={handleKeyDown}
                              />
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceList;

//MODULES
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

//COMPONENTS & FUNCTIONS
import EditProduct from "../products/editProduct";
import DeleteProduct from "../products/deleteProduct";
import ListCategoryProduct from "./listCategoryProducts";
import fallbackImg from "../../../assets/img/No_Img.svg";
import { usePopup } from "../../../context/PopupContext";
import localProds from "../../../assets/js/Products.json";
import { CancelI, DeleteI, EditI } from "../../../assets/icon";

//REDUX
import {
  getProductsByCategoryId,
  resetGetProductsByCategoryIdState,
} from "../../../redux/products/getProductsByCategoryIdSlice";

const CategoryProducts = ({ categoryId, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { products, success, error } = useSelector(
    (s) => s.products.getByCategoryId
  );

  const localCatProds = localProds.Products.filter(
    (p) => p.categoryId !== categoryId
  );

  const { setSecondPopupContent } = usePopup();
  const [catProdsData, setCatProdsData] = useState(null);

  useEffect(() => {
    if (!catProdsData) {
      dispatch(getProductsByCategoryId({ categoryId }));
    }
  }, [catProdsData, categoryId, dispatch]);

  useEffect(() => {
    if (products) {
      setCatProdsData(products.data);
      dispatch(resetGetProductsByCategoryIdState());
    }
    if (error) {
      setCatProdsData(localCatProds);
      dispatch(resetGetProductsByCategoryIdState());
    }
  }, [products, success, error]);

  // const handleSelectProducts = () => {
  //   setSecondPopupContent(
  //     <ListCategoryProduct
  //       onClose={() => setSecondPopupContent(false)}
  //       onAddSelected={(selectedIds) => {
  //         console.log("Selected product IDs to add:", selectedIds);
  //       }}
  //       products={products}
  //       activeCategoryId={categoryId}
  //     />
  //   );
  // };

  const handleEditProduct = (product) => {
    setSecondPopupContent(<EditProduct product={product} />);
  };

  const handleDeleteProduct = (product) => {
    setSecondPopupContent(<DeleteProduct product={product} />);
  };

  return (
    <div className="flex items-center justify-center transition-all duration-300">
      <div className="bg-[--white-1] rounded-2xl shadow-2xl w-full max-w-2xl p-8 transform scale-95 transition-all duration-300 modal-content relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[--border-1] pb-4">
          <div>
            <h3 className="text-2xl font-bold text-[--black-1]">
              {t("categoryProducts.title")}
            </h3>
            <p className="text-xs text-[--gr-1]">
              {t("categoryProducts.subtitle")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[--gr-1] hover:text-[--black-2] transition-colors"
            aria-label={t("categoryProducts.close")}
          >
            <CancelI className="w-6 h-6" />
          </button>
        </div>

        {/* Actions */}
        {/* <div className="flex justify-end mb-4">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[--primary-1] rounded-lg shadow-lg hover:bg-[--primary-2] transition-all"
            onClick={handleSelectProducts}
          >
            <i className="fa-solid fa-plus mr-2"></i> Mevcut Ürünlerden Ekle
          </button>
        </div> */}

        {/* Products List */}
        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 p-1 pr-2">
          {!catProdsData?.length ? (
            <div className="text-center p-6 text-[--gr-1] italic">
              {t("categoryProducts.no_products")}
            </div>
          ) : (
            catProdsData?.map((prod, index) => {
              const imgUrl = prod.image || fallbackImg;
              const portionsCount = Array.isArray(prod.portions)
                ? prod.portions.length
                : 0;
              return (
                <div
                  key={prod.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border border-[--border-1] hover:border-[--primary-1] transition-all group ${
                    index % 2 === 0 ? "bg-[--table]" : "bg-[--table-odd]"
                  }`}
                >
                  <img
                    src={imgUrl}
                    alt={prod.name}
                    className="w-12 h-12 object-cover rounded-md border border-[--border-1]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[--black-1] truncate">
                      {prod.name}
                    </div>
                    <div className="text-xs text-[--gr-1]">
                      {t("categoryProducts.portions", { count: portionsCount })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleEditProduct(prod);
                      }}
                      className="p-2 text-[--primary-1] bg-[--status-primary-1] hover:bg-[--status-primary-2] rounded-lg transition-all"
                      title={t("categoryProducts.edit")}
                    >
                      <EditI className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteProduct(prod);
                      }}
                      className="p-2 text-[--red-1] bg-[--status-red] hover:bg-[--red-2] rounded-lg transition-all"
                      title={t("categoryProducts.delete")}
                    >
                      <DeleteI strokeWidth={1.5} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;

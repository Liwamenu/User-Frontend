import { useMemo } from "react";
import productsData from "../../../assets/js/Products.json";
import { CancelI, DeleteI, EditI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";
import EditProduct from "../products/editProduct";
import DeleteProduct from "../products/deleteProduct";
import ListCategoryProduct from "./listCategoryProducts";

const CategoryProducts = ({
  categoryId,
  onClose,
  products = productsData, // allow overriding products via props
}) => {
  const catProducts = useMemo(() => {
    if (!categoryId) return [];
    // products can be array or object with Products key
    const list = Array.isArray(products) ? products : products?.Products || [];
    return list.filter((p) => p.categoryId !== categoryId);
  }, [categoryId, products]);

  const { setSecondPopupContent } = usePopup();

  const fallbackImg = "https://placehold.co/150x100/e2e8f0/64748b?text=No+Img";

  const handleSelectProducts = () => {
    setSecondPopupContent(
      <ListCategoryProduct
        onClose={() => setSecondPopupContent(false)}
        onAddSelected={(selectedIds) => {
          console.log("Selected product IDs to add:", selectedIds);
        }}
        products={products}
        activeCategoryId={categoryId}
      />
    );
  };

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
              Kategori Ürünleri
            </h3>
            <p className="text-xs text-[--gr-1]">Ürün Ekleme ve Çıkarma</p>
          </div>
          <button
            onClick={onClose}
            className="text-[--gr-1] hover:text-[--black-2] transition-colors"
            aria-label="Kapat"
          >
            <CancelI className="w-6 h-6" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex justify-end mb-4">
          <button
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[--primary-1] rounded-lg shadow-lg hover:bg-[--primary-2] transition-all"
            onClick={handleSelectProducts}
          >
            <i className="fa-solid fa-plus mr-2"></i> Mevcut Ürünlerden Ekle
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 p-1 pr-2">
          {catProducts.length === 0 ? (
            <div className="text-center p-6 text-[--gr-1] italic">
              Bu kategoride henüz ürün yok.
            </div>
          ) : (
            catProducts.map((prod, index) => {
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
                      {portionsCount} Porsiyon
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleEditProduct(prod);
                      }}
                      className="p-2 text-[--primary-1] bg-[--status-primary-1] hover:bg-[--status-primary-2] rounded-lg transition-all"
                      title="Düzenle"
                    >
                      <EditI className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteProduct(prod);
                      }}
                      className="p-2 text-[--red-1] bg-[--status-red] hover:bg-[--red-2] rounded-lg transition-all"
                      title="Sil"
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

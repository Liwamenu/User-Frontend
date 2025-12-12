//MODULES
import { useMemo, useState } from "react";

//COMP
import ProductsHeader from "./header";
import ProductCard from "./productCard";
import SearchI from "../../../assets/icon/search";
import CustomInput from "../../common/customInput";
import CustomSelect from "../../common/customSelector";

//DEMO
import DUMMY_DATA from "../../../assets/js/Products.json";
import categoriesJSON from "../../../assets/js/Categories.json";

const Products = ({ data: restaurant }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const categoryOptions = useMemo(
    () => [
      { label: "Tüm Kategoriler", value: "" },
      ...categoriesJSON.categories.map((c) => ({
        label: c.name,
        value: c.name,
      })),
    ],
    []
  );

  const statusOptions = useMemo(
    () => [
      { label: "Tüm Durumlar", value: "ALL" },
      { label: "Açık", value: !true }, //it checks if the product is hiden or not
      { label: "Kapalı", value: !false },
    ],
    []
  );

  const [statusFilter, setStatusFilter] = useState(statusOptions[0]);
  const [categoryFilter, setCategoryFilter] = useState(categoryOptions[0]);

  // Filter logic
  const filteredProducts = DUMMY_DATA.Products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.categoryName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !categoryFilter.value ||
      product.categoryName.toLowerCase() === categoryFilter.value.toLowerCase();

    const matchesStatus =
      statusFilter.value === "ALL" || product.hide === statusFilter.value;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <section className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="px-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 px-4 sm:px-14 rounded-t-lg">
          Ürünler {restaurant?.name} Restoranı
        </h1>

        <ProductsHeader />

        <div className="max-w-6xl mx-auto">
          {/* Header Bar */}
          <div className="bg-[--white-1] p-4 rounded-xl shadow-sm border border-[--gr-4] flex flex-col md:flex-row items-center gap-4 mb-8">
            {/* Search Input */}

            <div className="relative flex-1 w-full md:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[--gr-1] z-50">
                <SearchI />
              </div>
              <CustomInput
                type="text"
                placeholder="Ürün Ara..."
                value={searchTerm}
                className="block w-full pl-10 pr-3 py-2.5 border border-[--border-1] rounded-lg leading-5 placeholder-[--gr-2] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-[--gr-1] bg-[--white-1] transition duration-150 ease-in-out"
                onChange={(e) => setSearchTerm(e)}
              />
            </div>

            {/* Filters */}
            <div className="relative w-full md:w-48">
              <CustomSelect
                label=""
                value={categoryFilter}
                options={categoryOptions}
                onChange={(opt) => setCategoryFilter(opt)}
                isSearchable={false}
                className="text-sm font-medium"
                className2="relative w-full"
                menuPlacement="auto"
              />
            </div>

            <div className="relative w-full md:w-48">
              <CustomSelect
                label=""
                value={statusFilter}
                options={statusOptions}
                onChange={(opt) => setStatusFilter(opt)}
                isSearchable={false}
                className="text-sm font-medium"
                className2="relative w-full"
                menuPlacement="auto"
              />
            </div>
          </div>

          {/* Product List */}
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12 text-[--gr-1]">
                Ürün bulunamadı.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Products;

import React, { useState, useMemo, useRef, useEffect } from "react";
import { StackI } from "../../../assets/icon";
import DUMMY_DATA from "../../../assets/js/Products.json";

const PriceList = () => {
  const [products] = useState(DUMMY_DATA.Products);

  // Flattened state for easy input handling
  // We use strings to handle intermediate input states like "300."
  const [prices, setPrices] = useState(() => {
    const initialState = {};
    DUMMY_DATA.Products.forEach((p) => {
      p.portions.forEach((portion) => {
        initialState[portion.id] = {
          price: portion.price.toString(),
          campaignPrice: portion.campaignPrice.toString(),
        };
      });
    });
    return initialState;
  });

  // --- Helpers ---

  // Group products by category
  const groupedProducts = useMemo(() => {
    const groups = {};
    products.forEach((p) => {
      if (!groups[p.categoryName]) {
        groups[p.categoryName] = [];
      }
      groups[p.categoryName].push(p);
    });
    // Sort categories logic could go here, for now using data order
    return groups;
  }, [products]);

  // Flatten portions for sequential index access (for keyboard nav)
  const flattenedPortions = useMemo(() => {
    const list = [];
    Object.keys(groupedProducts).forEach((cat) => {
      groupedProducts[cat].forEach((p) => {
        p.portions.forEach((portion) => {
          list.push({
            productId: p.id,
            portionId: portion.id,
            product: p,
            portion,
          });
        });
      });
    });
    return list;
  }, [groupedProducts]);

  const handlePriceChange = (portionId, field, value) => {
    // Allow digits and one decimal point
    if (!/^\d*\.?\d*$/.test(value)) return;

    setPrices((prev) => ({
      ...prev,
      [portionId]: {
        ...prev[portionId],
        [field]: value,
      },
    }));
  };

  // Keyboard Navigation Logic
  const handleKeyDown = (e, index, field) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();

      let nextIndex = index;
      if (e.key === "ArrowUp") {
        nextIndex = Math.max(0, index - 1);
      } else {
        nextIndex = Math.min(flattenedPortions.length - 1, index + 1);
      }

      const nextInputId = `input-${nextIndex}-${field}`;
      const el = document.getElementById(nextInputId);
      if (el) {
        el.focus();
        el.select(); // Select text on focus for quick editing
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FE] p-4 md:p-8 font-sans text-[#1F2937]">
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Fiyat Listesi</h1>
          <button className="bg-[#10B981] hover:bg-[#059669] text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Değişiklikleri Kaydet
          </button>
        </div>

        {/* Bulk Update Banner */}
        <div className="bg-[#2D2D75] rounded-2xl p-6 mb-8 text-white shadow-lg relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-5 rounded-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-20 -mb-10 w-40 h-40 bg-white opacity-5 rounded-full pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-end gap-6">
            {/* Title & Desc */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-6 h-6 text-indigo-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 3.666A5.976 5.976 0 0117.25 10c1.071 0 2.052.298 2.88.824l-3.23 2.152A4.008 4.008 0 0013 11a4.015 4.015 0 00-3.6 2.308l-3.26-2.174A5.992 5.992 0 019 10.666V7zM4.195 15.658l3.26 2.174a4.014 4.014 0 007.09 0l3.23-2.152a5.974 5.974 0 01-13.58 0z"
                  />
                </svg>
                <h2 className="text-xl font-bold">Toplu Fiyat Güncelleme</h2>
              </div>
              <p className="text-indigo-200 text-sm max-w-md leading-relaxed">
                Tüm ürünlerde geçerli olacak değişiklikleri buradan
                yapabilirsiniz.
              </p>
            </div>

            {/* Inputs Grid */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="flex flex-col gap-1.5 w-full sm:w-40">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                  İşlem Türü
                </label>
                <div className="relative">
                  <select
                    value={bulkType}
                    onChange={(e) => setBulkType(e.target.value)}
                    className="w-full appearance-none bg-[#3D3D8A] border border-[#4F4F9E] text-white rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                  >
                    <option value="percent">Yüzde (%) Artır</option>
                    <option value="amount">Tutar (₺) Ekle</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                    <StackI />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-36">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                  Değer
                </label>
                <input
                  type="number"
                  placeholder="Örn: 10"
                  value={bulkValue}
                  onChange={(e) => setBulkValue(e.target.value)}
                  className="w-full bg-[#3D3D8A] border border-[#4F4F9E] text-white rounded-lg py-2.5 px-3 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5 w-full sm:w-48">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wide">
                  Hedef
                </label>
                <div className="relative">
                  <select
                    value={bulkTarget}
                    onChange={(e) => setBulkTarget(e.target.value)}
                    className="w-full appearance-none bg-[#3D3D8A] border border-[#4F4F9E] text-white rounded-lg py-2.5 px-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent text-sm"
                  >
                    <option value="price">Sadece Normal Fiyat</option>
                    <option value="campaignPrice">
                      Sadece Kampanya Fiyatı
                    </option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-indigo-300">
                    <StackI />
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-end w-full sm:w-auto">
                <button
                  onClick={applyBulkUpdate}
                  className="w-full sm:w-auto bg-[#6366F1] hover:bg-[#5558E3] text-white font-semibold py-2.5 px-6 rounded-lg shadow-lg shadow-indigo-900/50 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Uygula
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product List Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          {Object.entries(groupedProducts).map(
            ([categoryName, catProducts]) => (
              <div
                key={categoryName}
                className="border-b border-gray-100 last:border-0"
              >
                {/* Category Header */}
                <div className="bg-gray-50/50 px-6 py-3 border-b border-gray-100 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-[#6366F1]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <h3 className="font-bold text-gray-800 text-base">
                    {categoryName}
                  </h3>
                </div>

                {/* Products in Category */}
                <div className="divide-y divide-gray-100">
                  {catProducts.map((product) => {
                    return product.portions.map((portion) => {
                      // Find the global index for this portion row
                      const globalIndex = flattenedPortions.findIndex(
                        (item) =>
                          item.productId === product.id &&
                          item.portionId === portion.id
                      );

                      const priceValue = prices[portion.id]?.price ?? "";
                      const offerValue =
                        prices[portion.id]?.campaignPrice ?? "";

                      return (
                        <div
                          key={`${product.id}-${portion.id}`}
                          className="p-6 flex flex-col md:flex-row md:items-center gap-4 hover:bg-gray-50 transition-colors group"
                        >
                          {/* Left: Product Info */}
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg mb-1">
                              {product.name}
                            </h4>
                            <span className="text-gray-500 text-sm font-medium bg-gray-100 px-2 py-0.5 rounded">
                              {portion.name}
                            </span>
                          </div>

                          {/* Right: Price Inputs */}
                          <div className="flex gap-6 w-full md:w-auto">
                            {/* Normal Price */}
                            <div className="flex-1 md:w-40">
                              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 ml-1">
                                Normal Fiyat
                              </label>
                              <div className="relative">
                                <input
                                  id={`input-${globalIndex}-price`}
                                  type="text"
                                  inputMode="decimal"
                                  className="block w-full text-right text-gray-900 font-bold bg-white border border-gray-200 rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                  value={priceValue}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      portion.id,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(e, globalIndex, "price")
                                  }
                                />
                              </div>
                            </div>

                            {/* Campaign Price */}
                            <div className="flex-1 md:w-40">
                              <label className="block text-[10px] font-bold text-[#10B981] uppercase tracking-wider mb-1.5 ml-1">
                                Kampanya
                              </label>
                              <div className="relative">
                                <input
                                  id={`input-${globalIndex}-campaignPrice`}
                                  type="text"
                                  inputMode="decimal"
                                  className={`block w-full text-right font-bold bg-[#F0FDF4] border rounded-lg py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                                    Number(offerValue) > 0
                                      ? "text-green-700 border-green-200"
                                      : "text-gray-400 border-gray-200"
                                  }`}
                                  value={offerValue}
                                  onChange={(e) =>
                                    handlePriceChange(
                                      portion.id,
                                      "campaignPrice",
                                      e.target.value
                                    )
                                  }
                                  onKeyDown={(e) =>
                                    handleKeyDown(
                                      e,
                                      globalIndex,
                                      "campaignPrice"
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer Info */}
        <div className="flex items-start gap-2 text-gray-400 text-sm italic px-2">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <p>
            Manuel değişiklikler anlık olarak hafızaya alınır, kaydet butonu ile
            onaylayabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PriceList;

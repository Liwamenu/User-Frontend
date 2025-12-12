import { Link, useParams } from "react-router-dom";

const ProductsHeader = () => {
  const params = useParams();
  const id = params?.id;
  const path = params["*"]?.split("/")[0];

  const headers = [
    { label: "Ürün Yönetimi", path: "products" },
    { label: "Fiyat Listesi", path: "price-list" },
    { label: "Ürün Ekle", path: "add-product" },
  ];

  return (
    <div className="flex gap-2 my-3 text-sm">
      {headers.map((header) => (
        <Link
          key={header.path}
          to={`/restaurant/${header.path}/${id}`}
          className={`px-3 py-2 rounded-md ${
            path == header.path
              ? "bg-[--primary-1] text-white"
              : "text-[--black-1] bg-[--light-3]"
          }`}
        >
          {header.label}
        </Link>
      ))}
    </div>
  );
};

export default ProductsHeader;

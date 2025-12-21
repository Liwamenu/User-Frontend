import { Link, useParams } from "react-router-dom";

const ProductsHeader = () => {
  const params = useParams();
  const id = params?.id;
  const fullPath = params["*"]?.split("/");
  const thisPath = params["*"]?.split("/")[0];

  const pathMatches = (path) => thisPath === path && fullPath.length == 2;

  const headers = [
    { label: "Ürün Yönetimi", path: "products" },
    { label: "Fiyat Listesi", path: "price-list" },
    { label: "Ürün Ekle", path: "add-product" },
  ];

  return (
    <>
      {headers.map((header) => (
        <div key={header.path} className="max-sm:flex-1 flex sm:justify-end">
          <Link
            key={header.path}
            to={`/restaurant/${header.path}/${id}`}
            className={`max-sm:min-w-28 max-sm:max-h-10 flex justify-center px-3 py-2 rounded-md whitespace-nowrap ${
              pathMatches(header.path)
                ? "bg-[--primary-1] text-white"
                : "text-[--black-1] bg-[--light-3]"
            }`}
          >
            {header.label}
          </Link>
        </div>
      ))}
    </>
  );
};

export default ProductsHeader;

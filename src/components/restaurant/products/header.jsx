import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ProductsHeader = () => {
  const params = useParams();
  const id = params?.id;
  const fullPath = params["*"]?.split("/");
  const thisPath = params["*"]?.split("/")[0];
  const { t } = useTranslation();

  const pathMatches = (path) => thisPath === path && fullPath.length == 2;

  const headers = [
    { label: t("productsHeader.manage"), path: "products" },
    { label: t("productsHeader.price_list"), path: "price-list" },
    { label: t("productsHeader.add_product"), path: "add-product" },
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

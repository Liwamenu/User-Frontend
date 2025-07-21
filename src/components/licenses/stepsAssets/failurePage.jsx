import { Link } from "react-router-dom";
import failed_card from "../../../assets/img/failed_card.png";
const FailurePage = ({ currentPath, actionType }) => {
  return (
    <main className="flex flex-col justify-start items-center pt-16">
      <div className="w-[25rem] overflow-visible">
        <img src={failed_card} alt="failed_card" />
      </div>

      <div className="pt-8 text-center">
        <p className="text-3xl mb-4 text-[--black-2]">Ödeme Başarısız ! 😔</p>
        <p className="text-[--gr-1] px-4">
          İşleminiz teknik bir hata nedeniyle başarısız oldu. Lütfen tekrar
          deneyin.
        </p>
      </div>

      <div className="w-full flex justify-center pt-4">
        <Link
          to={currentPath?.replace(`/${actionType}`, "")}
          className="flex items-center py-2.5 whitespace-nowrap px-4 rounded-md text-sm border-[1.5px] disabled:cursor-not-allowed justify-center text-white bg-[--primary-1] border-[--primary-1] group border-none"
        >
          Lisanslara git
        </Link>
      </div>
    </main>
  );
};

export default FailurePage;

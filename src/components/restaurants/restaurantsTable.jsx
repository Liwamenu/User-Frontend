import { useLocation, useNavigate } from "react-router-dom";
import ChangeRestaurantStatus from "./actions/restaurantIsActive";
import { copyToClipboard } from "../../utils/utils";
import { CopyI } from "../../assets/icon";

const RestaurantsTable = ({ inData, Actions, totalItems, onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};

  const handleClick = (restaurant) => {
    const path = location.pathname.includes("users")
      ? "/users/restaurants/licenses/"
      : "/restaurants/licenses/";

    navigate(`${path}${restaurant.id}`, { state: { user, restaurant } });
  };

  return (
    <main className="max-xl:overflow-x-scroll">
      <div className="min-h-[30rem] border border-solid border-[--light-4] rounded-lg min-w-[60rem] overflow-hidden">
        <table className="w-full text-sm font-light">
          <thead>
            <tr className="bg-[--light-3] h-8 text-left text-[--black-1]">
              <th className="first:pl-4 font-normal">Restoran</th>
              <th className="font-normal">Telefon</th>
              <th className="font-normal">İl</th>
              <th className="font-normal">Durum</th>
              <th className="font-normal text-center">İşlem</th>
            </tr>
          </thead>

          <tbody>
            {inData.map((data, index) => (
              <tr
                key={data.id}
                className={`odd:bg-[--white-1] even:bg-[--table-odd] h-14 border border-solid border-[--light-4] border-x-0 hover:bg-[--light-3] transition-colors ${
                  totalItems < 8 ? "" : "last:border-b-0"
                } `}
              >
                <td
                  onClick={() => handleClick(data)}
                  className="whitespace-nowrap text-[--black-2] pl-4 font-normal cursor-pointer"
                >
                  {data.name}
                </td>
                <td
                  onClick={() =>
                    copyToClipboard({
                      text: data.phoneNumber,
                      msg: "Tel Kopyalandı",
                    })
                  }
                  className="whitespace-nowrap text-[--black-2] font-light hover:text-[--link-1] group cursor-pointer"
                >
                  <div className="flex items-center">
                    {data.phoneNumber}
                    <CopyI className="size-[16px] mx-1 opacity-0 group-hover:opacity-100" />
                  </div>
                </td>
                <td
                  onClick={() => handleClick(data)}
                  className="whitespace-nowrap text-[--black-2] font-light cursor-pointer"
                >
                  {data.city}
                </td>
                <td className="whitespace-nowrap text-[--black-2] font-light">
                  <ChangeRestaurantStatus
                    restaurant={data}
                    onSuccess={onSuccess}
                  />
                </td>
                <td className="whitespace-nowrap w-14 text-[--black-2] font-light relative">
                  <Actions
                    index={index}
                    restaurant={data}
                    onSuccess={onSuccess}
                    totalItems={totalItems}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default RestaurantsTable;

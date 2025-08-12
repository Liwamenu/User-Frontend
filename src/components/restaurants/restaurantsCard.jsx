const RestaurantsCard = ({ inData, Actions, totalItems, onSuccess }) => {
  return (
    <main
      className="flex justify-start gap-4 text-[--black-1]"
      style={{ fontFamily: "Poppins" }}
    >
      {inData.map((r, index) => (
        <div
          className="w-full max-w-80 border border-[--border-1] rounded-md overflow-clip relative"
          key={r.id}
        >
          <div className="w-full flex justify-end absolute top-0 right-0">
            <div className="relative bg-[--white-1]">
              <Actions
                index={index}
                restaurant={r}
                onSuccess={onSuccess}
                totalItems={totalItems}
              />
            </div>
          </div>

          <div>
            <img src={r.imageAbsoluteUrl} alt="liwamenu_restaurant_img" />
          </div>

          <div className="w-full bg-[--light-5] py-5 px-2 flex justify-between items-center mt-2">
            <p className="text-lg min-w-32 font-medium">{r.name}</p>
            <p className="text-xs text-right text-[--black-2]">{`${r.city}/${r.district}/${inData[0].neighbourhood}`}</p>
          </div>

          <div className="py-2 px-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">Restaurant Status:</p>
              <p className="text-xs text-[--green-1] border border-[--green-1] bg-[--light-green] rounded-md w-16 text-center py-1">
                {r.isActive ? "Aktif" : "Pasif"}
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">License Status:</p>
              <p className="text-xs text-[--red-1] border border-[--red-1] bg-[--light-red] rounded-md w-16 text-center py-1">
                Pasif
              </p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium">License:</p>
              <p className="text-xs text-[--white-1] border border-[--primary-1] bg-[--primary-1] rounded-md w-16 text-center py-1">
                Buy
              </p>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};

export default RestaurantsCard;

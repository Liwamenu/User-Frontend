//
// import { getPriceWithKDV } from "../../utils/utils";
import LicensePackagesActions from "./actions/licensePackageActions";

//COMP
import EditPackageIsActive from "./packageIsActive";

const LicensePackagesTable = ({
  inData,
  totalItems = inData.length,
  onSuccess,
  kdvData,
}) => {
  return (
    <main className="max-xl:overflow-x-scroll">
      <div className="min-h-[30rem] border border-solid border-[--light-4] rounded-lg min-w-[60rem] overflow-hidden">
        <div className="w-full text-sm font-light">
          <div className="w-full">
            <div className="flex items-center justify-between bg-[--light-3] text-[--black-1] h-8 font-normal">
              <div className="w-40 text-center">Paket Adı</div>
              <div className="w-40 text-center">Lisans Süresi</div>
              <div className="w-44 text-center">Müşteri Fiyatı KDV Dahil</div>
              <div className="w-44 text-center">Bayi Fiyatı KDV Dahil</div>
              <div className="w-28 text-start">Açıklama</div>
              <div className="w-28 text-center">Durum</div>
              <div className="w-28 text-center pr-2">İşlem</div>
            </div>
          </div>

          <main>
            {inData.map((data, index) => (
              <div
                key={index}
                className={`flex justify-between odd:bg-[--white-1] even:bg-[--table-odd] h-14 border-t last:border-b border-solid border-[--light-4] border-x-0 hover:bg-[--light-3] transition-colors relative group ${
                  totalItems < 8 ? "bg-[--red-1]" : "last:border-b-0"
                } `}
              >
                <div className="w-40 text-[--black-2] flex items-center justify-center">
                  {data.name}
                </div>
                <div className="w-36 text-[--black-2] flex items-center justify-center">
                  {data.time} Yıllık
                </div>
                <div className="w-44 text-[--black-2] flex items-center justify-center">
                  {data.userPrice}
                  {/* {kdvData?.useKDV
                    ? getPriceWithKDV(data.userPrice, kdvData)
                    : data.userPrice} */}
                </div>
                <div className="w-44 text-[--black-2] flex items-center justify-center">
                  {data.dealerPrice}
                  {/* {kdvData?.useKDV
                    ? getPriceWithKDV(data.dealerPrice, kdvData)
                    : data.dealerPrice} */}
                </div>
                <div className="w-28 text-[--black-2] flex items-center justify-start">
                  {data.description}
                </div>
                <div className="w-28 text-[--black-2] flex items-center justify-center">
                  <EditPackageIsActive
                    onSuccess={onSuccess}
                    packageData={data}
                  />
                </div>
                <div className="w-28 text-[--black-2] flex items-center justify-center relative">
                  <LicensePackagesActions
                    index={index}
                    licensePackage={data}
                    itemsPerPage={totalItems}
                    onSuccess={onSuccess}
                  />
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </main>
  );
};

export default LicensePackagesTable;

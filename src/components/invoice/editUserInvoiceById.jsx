//COMP
import CustomInput from "../common/customInput";
import CustomSelect from "../common/customSelector";
import CustomTextarea from "../common/customTextarea";

const EditUserInvoiceById = ({
  cities,
  districts,
  neighs,
  userInvoice,
  setUserInvoice,
}) => {
  return (
    <>
      <div className="flex gap-4 max-sm:flex-col">
        <CustomInput
          required={true}
          label="İsim/Ünvan"
          placeholder="İsim/Ünvan"
          className="py-[.45rem] text-sm"
          value={userInvoice.title || ""}
          maxLength={100}
          onChange={(e) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                title: e,
              };
            });
          }}
        />
      </div>
      <div className="flex gap-4 max-sm:flex-col">
        <CustomInput
          required={true}
          label="VKN veya TCKN"
          placeholder="VKN veya TCKN"
          className="py-[.45rem] text-sm"
          minLength={10}
          maxLength={11}
          name="digit"
          type="text"
          value={userInvoice.taxNumber || ""}
          onChange={(e) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                taxNumber: e,
              };
            });
          }}
        />
        <CustomInput
          required={true}
          label="Vergi Dairesi"
          placeholder="Vergi Dairesi"
          className="py-[.45rem] text-sm"
          maxLength={30}
          value={userInvoice.taxOffice || ""}
          onChange={(e) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                taxOffice: e,
              };
            });
          }}
        />
      </div>
      <div className="flex gap-4 max-sm:flex-col">
        <CustomInput
          type="text"
          label="Tic.Sic.No"
          placeholder="Tic.Sic.No"
          className="py-[.45rem] text-sm"
          maxLength={20}
          value={userInvoice.tradeRegistryNumber || ""}
          onChange={(e) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                tradeRegistryNumber: e,
              };
            });
          }}
        />
        <CustomInput
          type="text"
          label="Mersis No"
          placeholder="Mersis No"
          className="py-[.45rem] text-sm"
          maxLength={20}
          value={userInvoice.mersisNumber || ""}
          onChange={(e) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                mersisNumber: e,
              };
            });
          }}
        />
      </div>
      <div className="flex gap-4 max-sm:flex-col">
        <CustomSelect
          required={true}
          label="Şehir"
          placeholder="Ad"
          style={{ padding: "1px 0px" }}
          className="text-sm"
          value={
            userInvoice.city?.value
              ? userInvoice.city
              : { value: null, label: "Şehir seç" }
          }
          options={[{ value: null, label: "Şehir seç" }, ...cities]}
          onChange={(selectedOption) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                city: selectedOption,
              };
            });
          }}
        />
        <CustomSelect
          required={true}
          label="İlçe"
          placeholder="Ad"
          style={{ padding: "1px 0px" }}
          className="text-sm"
          value={
            userInvoice.district?.value
              ? userInvoice.district
              : { value: null, label: "İlçe seç" }
          }
          options={[{ value: null, label: "İlçe seç" }, ...districts]}
          onChange={(selectedOption) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                district: selectedOption,
              };
            });
          }}
        />
      </div>
      <div className="flex gap-4 max-sm:flex-col">
        <CustomSelect
          required={true}
          label="Mahalle"
          placeholder="Ad"
          style={{ padding: "1px 0px" }}
          className="text-sm"
          value={
            userInvoice.neighbourhood?.value
              ? userInvoice.neighbourhood
              : { value: null, label: "Mahalle Seç" }
          }
          options={[{ value: null, label: "Mahalle Seç" }, ...neighs]}
          onChange={(selectedOption) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                neighbourhood: selectedOption,
              };
            });
          }}
        />
        <CustomTextarea
          required={true}
          label="Adres"
          placeholder="Adres"
          className="pb-14 text-sm"
          value={userInvoice.address || ""}
          onChange={(e) => {
            setUserInvoice((prev) => {
              return {
                ...prev,
                address: e.target.value,
              };
            });
          }}
        />
      </div>
    </>
  );
};

export default EditUserInvoiceById;

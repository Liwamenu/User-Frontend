//MODULE
import { useRef } from "react";
import { useSelector } from "react-redux";

//COMP
import Button from "../../common/button";

//UTILS
import EditUserInvoiceById from "../../invoice/editUserInvoice";
import { useEditUserInvoice } from "../../../../hooks/useEditUserInvoice";

const EditUserInvoice = ({ user }) => {
  const dispatcher = useRef();
  const {
    cities,
    districts,
    neighs,
    userInvoice,
    setUserInvoice,
    handleSubmit,
  } = useEditUserInvoice(dispatcher, user);

  const { loading: addLoading } = useSelector((state) => state.user.addInvoice);
  const { loading: updateLoading } = useSelector(
    (state) => state.user.updateInvoice
  );

  return (
    <section className="flex flex-col items-start pt-3.5 pr-20 pl-6 mt-10 w-full bg-[--white-1] min-h-0 max-md:px-5">
      <form className="w-full" onSubmit={handleSubmit}>
        <>
          <EditUserInvoiceById
            cities={cities}
            districts={districts}
            neighs={neighs}
            userInvoice={userInvoice}
            setUserInvoice={setUserInvoice}
          />
        </>

        <div className="flex justify-end mt-16">
          <Button
            text="Kaydet"
            className="bg-[--primary-1] text-white text-lg rounded-xl py-[.8rem] sm:px-16 border-[0px]"
            type="submit"
            disabled={addLoading || updateLoading}
          />
        </div>
      </form>
    </section>
  );
};

export default EditUserInvoice;

//MODULES
import isEqual from "lodash/isEqual";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import { ArrowID, ArrowIU } from "../../../../assets/icon";

//REDUX
// import EditUserInvoiceById from "../../../invoice/editUserInvoiceById";
// import { useEditUserInvoiceById } from "../../../../../hooks/useEditUserInvoiceById";

const EditUserInvoice = ({
  user,
  cities,
  submit,
  setSubmit,
  setNoChange,
  dispatcher,
}) => {
  const dispatch = useDispatch();
  // const {
  //   districts,
  //   neighs,
  //   userInvoiceBefore,
  //   userInvoice,
  //   setUserInvoice,
  //   handleSubmit,
  // } = useEditUserInvoiceById(dispatcher, user);

  const { error } = useSelector((state) => state.users.updateInvoice);

  const { error: addInvoiceError } = useSelector(
    (state) => state.users.addInvoice
  );

  const [openFatura, setOpenFatura] = useState(false);

  //TOAST TO UPDATE
  useEffect(() => {
    if (error) {
      setSubmit(false);
    }
  }, [error, dispatch]);

  //TOAST TO ADD INVOICE IF THERE IS NO
  useEffect(() => {
    if (addInvoiceError) {
      setSubmit(false);
    }
  }, [addInvoiceError, dispatch]);

  useEffect(() => {
    if (submit) {
      if (openFatura) {
        handleSubmit();
        const equalData = isEqual(userInvoiceBefore, userInvoice);
        if (!equalData) {
          setNoChange((prev) => {
            return {
              ...prev,
              userInv: false,
            };
          });
        } else {
          setSubmit(false);
          setNoChange((prev) => {
            return {
              ...prev,
              userInv: true,
            };
          });
        }
      }
    }
  }, [submit]);

  return (
    <>
      <div
        className="w-full flex border-b border-solid border-[--border-1] cursor-pointer mt-14"
        onClick={() => setOpenFatura(!openFatura)}
      >
        <h1 className="w-full text-center text-lg font-normal text-[--black-3]">
          Fatura Adresi
        </h1>
        <span>
          {openFatura ? (
            <ArrowIU className="size-5" />
          ) : (
            <ArrowID className="size-5" />
          )}
        </span>
      </div>
      {/* {openFatura && (
        <EditUserInvoiceById
          cities={cities}
          districts={districts}
          neighs={neighs}
          userInvoice={userInvoice}
          setUserInvoice={setUserInvoice}
        />
      )} */}
    </>
  );
};

export default EditUserInvoice;

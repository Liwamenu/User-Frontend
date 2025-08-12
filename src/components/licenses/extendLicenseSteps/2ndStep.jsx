//MODULES
import { isEqual } from "lodash";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import BackButton from "../stepsAssets/backButton";
import ForwardButton from "../stepsAssets/forwardButton";
// import InvoiceData from "../stepsAssets/invoiceData";

//REDUX
import { getUser, resetGetUserState } from "../../../redux/user/getUserSlice";

const SecondStep = ({
  step,
  setStep,
  userData,
  setUserData,
  userInvData,
  setUserInvData,
}) => {
  const dispatch = useDispatch();
  let invoiceHandleSubmit = useRef(null);

  const { loading: updateInvLoading } = useSelector(
    (state) => state.user.updateInvoice
  );

  const { loading: addInvLoading } = useSelector(
    (state) => state.user.addInvoice
  );

  const { success: getUserSucc, user } = useSelector(
    (state) => state.user.getUser
  );

  const [openFatura, setOpenFatura] = useState(false);
  const [invoiceBeforeAfter, setInvoiceBeforeAfter] = useState(null);

  //SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    if (addInvLoading || updateInvLoading) return;

    if (
      openFatura &&
      (!invoiceBeforeAfter ||
        !isEqual(
          invoiceBeforeAfter.userInvoice,
          invoiceBeforeAfter.userInvoiceBefore
        ))
    ) {
      if (invoiceHandleSubmit.current) {
        invoiceHandleSubmit.current();
      }
    } else {
      setOpenFatura(false);
      setStep(step + 1);
    }
  }

  //SET USER AND INVOICE
  useEffect(() => {
    if (getUserSucc) {
      setUserData(user);
      setUserInvData(user.userInvoiceAddressDTO);
      dispatch(resetGetUserState());
    }
  }, [user, getUserSucc]);

  //GET USER
  useEffect(() => {
    if (!userData) {
      dispatch(getUser());
    }
  }, [userData]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* <div className="w-full">
        {userData && (
          <InvoiceData
            userData={userData}
            openFatura={openFatura}
            userInvData={userInvData}
            setOpenFatura={setOpenFatura}
            setUserInvData={setUserInvData}
            setInvoiceBeforeAfter={setInvoiceBeforeAfter}
            onSubmit={(submitFn) => {
              invoiceHandleSubmit.current = submitFn;
            }}
            title="Bu ödemenin faturası aşağdaki adrese kesilecektir."
          />
        )}
      </div> */}

      {/* BTNS */}
      <div className="flex gap-3 absolute -bottom-20 -right-0 h-12">
        <BackButton
          text="Geri"
          letIcon={true}
          onClick={() => setStep(step - 1)}
          disabled={updateInvLoading || addInvLoading}
        />
        <ForwardButton
          text={openFatura ? "Kaydet" : "Devam"}
          letIcon={true}
          type="submit"
          disabled={updateInvLoading || addInvLoading}
        />
      </div>
    </form>
  );
};

export default SecondStep;

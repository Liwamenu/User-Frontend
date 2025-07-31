//MODULES
import { isEqual } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

// COMP
import BackButton from "../stepsAssets/backButton";
import InvoiceData from "../stepsAssets/invoiceData";
import ForwardButton from "../stepsAssets/forwardButton";
import { resetGetUser } from "../../../redux/users/getUserByIdSlice";

const ThirdStep = ({
  step,
  setStep,
  userInvData,
  setUserInvData,
  selectedUserData,
  setSelectedUserData,
}) => {
  const dispatch = useDispatch();
  let invoiceHandleSubmit = useRef(null);
  const cartItems = useSelector((state) => state.cart.items);

  const { loading: updateInvLoading } = useSelector(
    (state) => state.users.updateInvoice
  );

  const { loading: addInvLoading } = useSelector(
    (state) => state.users.addInvoice
  );

  const { error: getUserErr, user } = useSelector(
    (state) => state.users.getUser
  );

  const [usersData, setUsersData] = useState(null);
  const [openFatura, setOpenFatura] = useState(false);
  const [invoiceBeforeAfter, setInvoiceBeforeAfter] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
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

  useEffect(() => {
    let uniqeUsers = [];
    cartItems.map((item) => {
      if (!uniqeUsers.some((U) => U?.id === item.userId))
        uniqeUsers.push(item.user);
    });
    setUsersData(uniqeUsers);
    uniqeUsers.length === 1
      ? setSelectedUserData(uniqeUsers[0])
      : setSelectedUserData(null);
  }, [cartItems]);

  //SET USER AND INVOICE
  useEffect(() => {
    if (user) {
      setSelectedUserData(user);
      if (user.userInvoiceAddressDTO)
        setUserInvData(user.userInvoiceAddressDTO);
      dispatch(resetGetUser());
    } else if (getUserErr) {
      dispatch(resetGetUser());
    }
  }, [user, getUserErr]);

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="text-sm">
        <p>Hangi Kullanıcıya fatura kesileceğini seçiniz.</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {usersData &&
            usersData.map((usr) => (
              <button
                key={usr?.id}
                type="button"
                onClick={() => {
                  setOpenFatura(false);
                  setSelectedUserData(usr);
                  setUserInvData(usr.userInvoiceAddressDTO);
                }}
                className={`border rounded-sm px-3 py-1 ${
                  selectedUserData?.id == usr?.id
                    ? "bg-[--status-green] border-[--green-1] text-[--green-1] pointer-events-none"
                    : "bg-[--status-gray] border-[--gray-1] text-[--gray-1]"
                }`}
              >
                {usr?.fullName}
              </button>
            ))}
        </div>
      </div>

      <div className="w-full">
        {selectedUserData && (
          <InvoiceData
            user={selectedUserData}
            title="Bu ödemenin faturası aşağdaki adrese kesilecektir."
            userInvData={userInvData}
            setUserInvData={setUserInvData}
            openFatura={openFatura}
            setOpenFatura={setOpenFatura}
            setInvoiceBeforeAfter={setInvoiceBeforeAfter}
            onSubmit={(submitFn) => {
              invoiceHandleSubmit.current = submitFn;
            }}
          />
        )}
      </div>

      {/* BTNS */}
      <div className="flex gap-3 absolute -bottom-16 -right-0 h-12">
        <BackButton
          text="Geri"
          letIcon={true}
          onClick={() => setStep(step - 1)}
          disabled={updateInvLoading || addInvLoading}
        />
        <ForwardButton
          type="submit"
          letIcon={true}
          text={openFatura ? "Kaydet" : "Devam"}
          disabled={!selectedUserData || updateInvLoading || addInvLoading}
        />
      </div>
    </form>
  );
};

export default ThirdStep;

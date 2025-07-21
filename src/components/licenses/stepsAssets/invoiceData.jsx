//MODULES
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

//HOOKS
import { useEditUserInvoiceById } from "../../../../hooks/useEditUserInvoiceById";

//REDUX
import { getUserById } from "../../../redux/user/getUserByIdSlice";
import EditUserInvoiceById from "../../invoice/editUserInvoiceById";

const InvoiceData = ({
  user,
  onSubmit,
  title,
  openFatura,
  userInvData,
  setOpenFatura,
  setUserInvData,
  setInvoiceBeforeAfter,
}) => {
  const dispatcher = useRef();
  const dispatch = useDispatch();
  const { error: updateInvError, success: updateInvSucc } = useSelector(
    (state) => state.users.updateInvoice
  );

  const { error: addInvError, success: addInvSucc } = useSelector(
    (state) => state.users.addInvoice
  );

  const {
    cities,
    districts,
    neighs,
    userInvoice,
    setUserInvoice,
    userInvoiceBefore,
    handleSubmit,
  } = useEditUserInvoiceById(dispatcher, user);

  useEffect(() => {
    if (userInvoice) {
      const city = userInvoice.city?.label;
      const district = userInvoice.district?.label;
      const neighbourhood = userInvoice.neighbourhood?.label;
      setUserInvData({ ...userInvoice, city, district, neighbourhood });
    } else {
      setOpenFatura(true);
    }
    setInvoiceBeforeAfter({ userInvoice, userInvoiceBefore });
    onSubmit(handleSubmit);
  }, [userInvoice]);

  //ADD OR UPDATE USER INV
  useEffect(() => {
    if (updateInvSucc) {
      setOpenFatura(false);
    }
    if (addInvSucc) {
      setOpenFatura(false);
      const city = userInvoice.city?.label;
      const district = userInvoice.district?.label;
      const neighbourhood = userInvoice.neighbourhood?.label;
      setUserInvData({ ...userInvoice, city, district, neighbourhood });
      dispatch(getUserById({ userId: user.id }));
    }
  }, [addInvError, updateInvError, addInvSucc, updateInvSucc]);

  return (
    <div className="text-xs pt-2 w-full flex flex-col items-center pb-8">
      <div className="w-full flex flex-col items-center">
        <span className="text-[--red-1]">{title}</span>
        {userInvData && !openFatura && (
          <div className="h-full flex justify-end">
            <button
              type="button"
              onClick={() => setOpenFatura(true)}
              className="p-2 mt-3 bg-[--primary-2] text-[--white-1] rounded-md hover:text-[--primary-2] hover:bg-[--white-1] transition-colors duration-300 ease-in-out border border-[--primary-2]"
            >
              Düzenle
            </button>
          </div>
        )}
      </div>

      {userInvData && !openFatura ? (
        <div className="w-[325px] flex justify-start mt-4">
          <div>
            {user && user.fullName}, {userInvData && userInvData.title}
            <p className="pt-1">{userInvData.taxNumber},</p>
            <p>{userInvData.taxOffice},</p>
            <p>
              {userInvData.tradeRegistryNumber &&
                userInvData.tradeRegistryNumber}
              ,
            </p>
            <p>{userInvData.mersisNumber && userInvData.mersisNumber}</p>
            <p>
              {userInvData.address}/{userInvData.city}/{userInvData.district}/
              {userInvData.neighbourhood}
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full px-4">
          <EditUserInvoiceById
            cities={cities ? cities : []}
            districts={districts}
            neighs={neighs}
            userInvoice={userInvoice}
            setUserInvoice={setUserInvoice}
          />
        </div>
      )}
    </div>
  );
};

export default InvoiceData;

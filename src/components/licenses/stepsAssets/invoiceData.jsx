//MODULES
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

//HOOKS
import { useEditUserInvoice } from "../../../../hooks/useEditUserInvoice";

//COMP
import EditUserInvoice from "../../invoice/editUserInvoice";

//REDUX
import { getUser } from "../../../redux/user/getUserSlice";

const InvoiceData = ({
  title,
  onSubmit,
  userData,
  openFatura,
  userInvData,
  setOpenFatura,
  setUserInvData,
  setInvoiceBeforeAfter,
}) => {
  const dispatcher = useRef();
  const dispatch = useDispatch();
  const { error: updateInvError, success: updateInvSucc } = useSelector(
    (state) => state.user.updateInvoice
  );

  const { error: addInvError, success: addInvSucc } = useSelector(
    (state) => state.user.addInvoice
  );

  const {
    cities,
    districts,
    neighs,
    userInvoice,
    setUserInvoice,
    userInvoiceBefore,
    handleSubmit,
  } = useEditUserInvoice(dispatcher, userData);

  useEffect(() => {
    if (userInvData) {
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
      dispatch(getUser());
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
              className="p-2 mt-3 bg-[--primary-2] text-white rounded-md hover:text-[--primary-2] hover:bg-[--white-1] transition-colors duration-300 ease-in-out border border-[--primary-2]"
            >
              Düzenle
            </button>
          </div>
        )}
      </div>

      {userInvData && !openFatura ? (
        <div className="w-[325px] flex justify-start mt-4">
          <div>
            {userData && userData.fullName}, {userInvData && userInvData.title}
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
          <EditUserInvoice
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

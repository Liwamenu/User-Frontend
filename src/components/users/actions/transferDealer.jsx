//MODULES
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//COMP
import ActionButton from "../../common/actionButton";
import { usePopup } from "../../../context/PopupContext";
import CustomCheckbox from "../../common/customCheckbox";
import CustomSelector from "../../common/customSelector";
import { CancelI, TransferI } from "../../../assets/icon";

//REDUX
import {
  transferDealer,
  resetTransferDealerState,
} from "../../../redux/users/transferDealerSlice";
import { getDealers, resetDealers } from "../../../redux/users/getUsersSlice";

const TransferDealer = ({ onSuccess, user }) => {
  const { setPopupContent } = usePopup();

  const handleClick = () => {
    setPopupContent(<TransferDealerPopup onSuccess={onSuccess} user={user} />);
  };
  return (
    <ActionButton
      element={<TransferI className="w-5" strokeWidth="1.8" />}
      element2="Bayi Transfer"
      onClick={handleClick}
    />
  );
};

export default TransferDealer;

function TransferDealerPopup({ onSuccess, user }) {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();
  const { loading, success, error } = useSelector(
    (state) => state.users.transferDealer
  );
  const { dealers } = useSelector((state) => state.users.getUsers);

  const [checked, setChecked] = useState(false);
  // const [checked2, setChecked2] = useState(false);
  const [dealersData, setDealersData] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [currentDealer, setCurrentDealer] = useState(null);

  //SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    if (isEqual(selectedData, currentDealer)) {
      toast.error("Herhangi bir değişiklik yapmadınız.", { id: "NO_CHANGE" });
    } else {
      console.log(selectedData);
      dispatch(transferDealer(selectedData));
    }
  }

  //FORMAT SELECTOR DATA
  function formatDealerData(inData) {
    const formattedData = [];
    inData.map((dealer) => {
      const { fullName, id, phoneNumber } = dealer;
      const selData = {
        dealerUserId: id,
        fullName,
        value: id,
        userId: user.id,
        label: `${fullName},  ${phoneNumber}`,
      };
      formattedData.push(selData);
      if (id == user.dealerId) {
        setSelectedData(selData);
        setCurrentDealer(selData);
      }
    });
    return formattedData;
  }

  //GET DEALERS
  useEffect(() => {
    if (!dealersData) {
      dispatch(
        getDealers({
          active: true,
          verify: true,
          dealer: true,
        })
      );
    }
  }, [dealersData]);

  //SET DEALERS
  useEffect(() => {
    if (dealers) {
      setDealersData(formatDealerData(dealers));
      dispatch(resetDealers());
    }
    if (dealers) {
      dispatch(resetDealers());
    }
  }, [dealers]);

  //TRANSFER TOAST
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    } else if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetTransferDealerState());
    } else if (success) {
      setPopupContent(null);
      onSuccess();
      toast.dismiss(toastId.current);
      toast.success("İşlem Başarılı");
      dispatch(resetTransferDealerState());
    }
  }, [loading, success, error]);

  return (
    <div className="w-full pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base max-h-[95dvh]">
      <div className="flex flex-col bg-[--white-1] relative">
        <div className="absolute -top-6 right-3">
          <div
            className="text-[--primary-2] p-2 border border-solid border-[--primary-2] rounded-full cursor-pointer hover:bg-[--primary-2] hover:text-[--white-1] transition-colors"
            onClick={() => setPopupContent(null)}
          >
            <CancelI />
          </div>
        </div>
        <h1 className="self-center text-2xl font-bold">Bayi Transfer</h1>
        <form
          className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left gap-4"
          onSubmit={handleSubmit}
        >
          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Kullanıcı:</p>
            <p className="text-[--primary-1]">{user.fullName}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Durum:</p>
            <p>● {user.isDealer ? "Bayi" : "Müşteri"}</p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">Bayi:</p>
            <p>
              ●{" "}
              {selectedData
                ? selectedData.label
                : currentDealer
                ? currentDealer.fullName
                : "Loading"}
            </p>
          </div>

          <div className="w-full flex gap-12 items-center">
            <p className="min-w-28">İşlem:</p>
            <CustomSelector
              required
              value={selectedData || currentDealer || { label: "Bayi Seç" }}
              options={dealersData || []}
              onChange={(e) => setSelectedData(e)}
            />
          </div>

          <div className="mt-10 flex flex-col gap-4">
            <CustomCheckbox
              checked={checked}
              onChange={() => setChecked(!checked)}
              label="Transfer Yap"
            />
            {/* <CustomCheckbox
              checked={checked2}
              onChange={() => setChecked2(!checked2)}
              label="Bayi Transfer Bilgilendirmesi gönder"
            /> */}
          </div>

          <div className="w-full flex justify-end mt-6">
            <button
              disabled={loading || !checked}
              className="py-2 px-3 bg-[--primary-1] text-white rounded-lg disabled:cursor-not-allowed"
              type="submit"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

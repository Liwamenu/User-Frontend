//modules
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";

//comp
import { SendI } from "../../../assets/icon";
import CustomInput from "../../common/customInput";
import { usePopup } from "../../../context/PopupContext";
import { resetSendSMS, sendSMS } from "../../../redux/sms/sendSMSSlice";

//redux

const SendSMS = ({ data }) => {
  const { setPopupContent } = usePopup();

  const handlePopup = () => {
    setPopupContent(<SendSMSPopup data={data} />);
  };

  return (
    <div onClick={handlePopup}>
      <SendI strokeWidth={2} className="size-[16px] mx-1 text-[--link-1]" />
    </div>
  );
};

export default SendSMS;

const SendSMSPopup = ({ data }) => {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector((state) => state.sms.send);

  const [sendData, setSendData] = useState({
    phoneNumber: data.phoneNumber,
    message: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(sendSMS(sendData));
  }

  //TOAST DELETE
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    }
    if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetSendSMS());
    }
    if (success) {
      setPopupContent(false);
      toast.dismiss(toastId.current);
      toast.success(
        `Mesaj ${data.phoneNumber} telefon numarasına başarıyla gönderildi.`
      );
      dispatch(resetSendSMS());
    }
  }, [loading, success, error, dispatch]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full max-w-lg pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base">
        <h1 className="self-center text-2xl font-bold">SMS Gönder</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left"
        >
          <div className="flex gap-4">
            <p>Kullanıcı:</p>
            <p>{data.fullName}</p>
          </div>

          <div className="flex gap-4 my-3">
            <p>Tel:</p>
            <p>{data.phoneNumber}</p>
          </div>

          <div>
            <CustomInput
              required
              label="Mesaj"
              placeholder="Message"
              value={sendData.message}
              onChange={(e) => setSendData({ ...sendData, message: e })}
            />
          </div>

          <div className="flex gap-3 self-end max-sm:mt-4 text-white mt-8">
            <button
              type="submit"
              className="px-10 py-2 text-base bg-[--green-1] rounded-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              Gönder
            </button>
            <button
              type="button"
              className="px-6 py-2 text-base bg-[--primary-1] rounded-lg"
              onClick={() => {
                setPopupContent(false);
              }}
            >
              Vazgeç
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

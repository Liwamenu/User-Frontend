//modules
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";

//comp
import { EmailI } from "../../../assets/icon";
import CustomInput from "../../common/customInput";
import { usePopup } from "../../../context/PopupContext";

//redux
import { resetSendEmail, sendEmail } from "../../../redux/email/sendEmailSlice";

const SendEmail = ({ data }) => {
  const { setPopupContent } = usePopup();

  const handlePopup = () => {
    setPopupContent(<SendEmailPopup data={data} />);
  };

  return (
    <div onClick={handlePopup}>
      <EmailI strokeWidth={0.1} className="size-[16px] mx-1 text-[--link-1]" />
    </div>
  );
};

export default SendEmail;

const SendEmailPopup = ({ data }) => {
  const toastId = useRef();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  const { loading, success, error } = useSelector((state) => state.email.send);

  const [sendData, setSendData] = useState({
    toAddress: data.email,
    subject: "",
    body: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(sendEmail(sendData));
  }

  //TOAST DELETE
  useEffect(() => {
    if (loading) {
      toastId.current = toast.loading("İşleniyor...");
    }
    if (error) {
      toast.dismiss(toastId.current);
      dispatch(resetSendEmail());
    }
    if (success) {
      setPopupContent(false);
      toast.dismiss(toastId.current);
      toast.success(`E-posta ${data.email} adresn'ne başarıyla gönderildi.`);
      dispatch(resetSendEmail());
    }
  }, [loading, success, error, dispatch]);

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-full max-w-lg pt-12 pb-8 bg-[--white-1] rounded-lg border-2 border-solid border-[--border-1] text-[--black-2] text-base">
        <h1 className="self-center text-2xl font-bold">E-Posta Gönder</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col px-4 sm:px-14 mt-9 w-full text-left"
        >
          <div className="flex gap-4">
            <p>Kullanıcı:</p>
            <p>{data.fullName}</p>
          </div>

          <div className="flex gap-4">
            <p>E-Posta:</p>
            <p>{data.email}</p>
          </div>

          <div>
            <CustomInput
              required
              label="Başlık"
              placeholder="Subject"
              value={sendData.subject}
              onChange={(e) => setSendData({ ...sendData, subject: e })}
            />
          </div>

          <div>
            <CustomInput
              required
              label="İçerik"
              placeholder="Body"
              value={sendData.body}
              onChange={(e) => setSendData({ ...sendData, body: e })}
            />
          </div>

          <div className="flex gap-3 self-end max-sm:mt-4 mt-2 text-white mt-8">
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

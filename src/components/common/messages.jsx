export const PhoneUserMessage = ({ number }) => {
  return (
    <>
      <span className="text-[--link-1] font-bold">{number}</span> telefon
      numaranıza bir onay kodu gönderdik. Lütfen SMS mesajlarınızı kontrol edin
      ve kodu doğrulama işlemi için girin.
    </>
  );
};

export const EmailUserMessage = ({ mail }) => {
  return (
    <>
      <span className="text-[--link-1] font-bold">{mail}</span> email adresinize
      bir onay kodu gönderdik. Lütfen e-posta mesajlarınızı kontrol edin ve kodu
      doğrulama işlemi için girin.
    </>
  );
};

import BackButton from "../stepsAssets/backButton";
import ForwardButton from "../stepsAssets/forwardButton";

const FourthStepBankPayment = ({ step, setStep }) => {
  //SUBMIT
  function handleSubmit(e) {
    e.preventDefault();
    setStep(step + 1);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <main>
        <h1 className="text-center py-4 text-lg font-bold">
          Pentegrasyon Banka Hesabı
        </h1>
        <div className="flex flex-col gap-0.5 border-2 border-[--light-2] rounded-md">
          <div className="flex gap-2 bg-[--light-1] p-2">
            <p>Banka Adı:</p>
            <p>Garanti Bankası</p>
          </div>
          <div className="flex gap-2 bg-[--light-1] p-2">
            <p>Döviz:</p>
            <p>TL</p>
          </div>
          <div className="flex gap-2 bg-[--light-1] p-2">
            <p>IBAN:</p>
            <p>TR76 0006 2000 4610 0006 2920 57</p>
          </div>
          <div className="flex gap-2 bg-[--light-1] p-2">
            <p>Hesap Adı:</p>
            <p>Liwa Yazılım San. Tic. Ltd. Şti.</p>
          </div>
        </div>
      </main>

      {/* BTNS */}
      <div className="flex gap-3 absolute -bottom-20 -right-0 h-12">
        <BackButton
          text="Geri"
          letIcon={true}
          onClick={() => setStep(step - 1)}
        />
        <ForwardButton text="Devam" letIcon={true} type="submit" />
      </div>
    </form>
  );
};

export default FourthStepBankPayment;

import WarnI from "../assets/icon/warn";
import GobackI from "../assets/icon/goback";

const NotFound = ({ showGoBack = true }) => {
  const goBack = () => {
    window.history.back();
  };
  return (
    <section className="bg-[--white]">
      <div className="container flex pt-48 sm:pt-0 sm:items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 w-32 font-medium text-[--red-1] rounded-full bg-[--light-1]">
            <WarnI />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-[--black-1] md:text-3xl">
            Sayfa bulunmadı
          </h1>
          <p className="mt-4 text-[--gr-1] text-left">
            Aradığınız sayfa bulunmamaktadır.
          </p>

          <div className="flex items-center justify-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            {showGoBack && (
              <button
                onClick={goBack}
                className="flex items-center justify-center w-1/2 px-5 py-2 text-sm transition-colors duration-200 border rounded-lg gap-x-2 sm:w-auto text-[--gr-1] bg-[--white] hover:text-[--white-1] hover:bg-[--primary-1]"
              >
                <GobackI />
                <span>Gri dön</span>
              </button>
            )}
            <button className="w-1/2 px-5 py-2 text-sm tracking-wide text-[--white-1] bg-[--primary-1] transition-colors duration-200 rounded-lg shrink-0 sm:w-auto hover:text-[--gr-1] hover:bg-[--white] border border-solid hover:border-[--light-4]">
              <a href="/">Ana sayfa</a>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;

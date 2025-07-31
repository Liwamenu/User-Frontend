import { AsteriskI } from "../../../assets/icon";
import MasterCard from "../../../assets/img/card/MC.png";

const CardBack = ({ cardData }) => {
  return (
    <main className="flip-card-back  absolute w-full h-full py-5 bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl text-[--light-1]">
      <div className="w-full h-full flex flex-col justify-between">
        <div className="w-full flex justify-end h-12 bg-[--gr-3] px-4">
          <div className="flex justify-start items-center relative min-w-12">
            {cardData.cvv ? (
              <span>{cardData.cvv}</span>
            ) : (
              <>
                <AsteriskI className="size-[15px]" />
                <AsteriskI className="size-[15px]" />
                <AsteriskI className="size-[15px]" />
              </>
            )}
            {/*   <span className="absolute -top-0 left-0 text-xs">CVV</span> */}
          </div>
        </div>

        <div className="flex justify-end px-4 w-[77px]">
          <img src={MasterCard} alt="card" />
        </div>
      </div>
    </main>
  );
};

export default CardBack;

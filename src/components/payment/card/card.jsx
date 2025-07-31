import "./style.css";
import CardBack from "./cardBack";
import CardFront from "./cardFront";

const PaymentCard = ({ className, flip, cardData }) => {
  return (
    <article
      className={`flip-card flex flex-col justify-center w-[325px] h-[190px] ${className}`}
    >
      <div
        className={`flip-card-inner relative w-full h-full text-center transition-transform duration-[.6s] shadow-[8px_10px_16px_rgba(0,0,0,0.05)] ${
          flip && "flip"
        }`}
      >
        <CardFront cardData={cardData} />
        <CardBack cardData={cardData} />
      </div>
    </article>
  );
};

export default PaymentCard;

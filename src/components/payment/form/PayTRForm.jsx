const className =
  "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2";

const PayTRForm = ({ cardData }) => {
  return (
    <>
      <div>
        <label className="hidden text-sm font-medium text-gray-700">
          Kart Sahibi Adı:
        </label>
        <input
          type="hidden"
          name="cc_owner"
          className={className}
          value={cardData.userName}
          onChange={() => {}}
        />
      </div>

      <div>
        <label className="hidden text-sm font-medium text-gray-700">
          Kart Numarası:
        </label>
        <input
          type="hidden"
          name="card_number"
          value={cardData.cardNumber.replace(/\s/g, "")}
          className={className}
          onChange={() => {}}
        />
      </div>

      <div>
        <label className="hidden text-sm font-medium text-gray-700">
          Kart Son Kullanma Ay:
        </label>
        <input
          type="hidden"
          name="expiry_month"
          className={className}
          value={cardData.month}
          onChange={() => {}}
        />
      </div>

      <div>
        <label className="hidden text-sm font-medium text-gray-700">
          Kart Son Kullanma Yıl:
        </label>
        <input
          type="hidden"
          name="expiry_year"
          className={className}
          value={cardData.year}
          onChange={() => {}}
        />
      </div>

      <div>
        <label className="hidden text-sm font-medium text-gray-700">
          Kart Güvenlik Kodu:
        </label>
        <input
          type="hidden"
          name="cvv"
          className={className}
          value={cardData.cvv}
          onChange={() => {}}
        />
      </div>
    </>
  );
};

export default PayTRForm;

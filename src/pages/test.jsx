import { useDispatch, useSelector } from "react-redux";
import { getUserAddress } from "../redux/data/getUserAddressSlice";

const TestPage = () => {
  const dispatch = useDispatch();
  const { address, error, loading } = useSelector(
    (state) => state.data.getUserAddress
  );

  function handleGetUserAddress() {
    dispatch(getUserAddress());
  }

  console.log(address);

  return (
    <section className="mt-20">
      <div className="p-4">
        <button
          onClick={handleGetUserAddress}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {loading ? "Konum Alınıyor..." : "Konumdan Adres Al"}
        </button>

        {address && (
          <p className="mt-3 text-green-600 font-medium">
            📍 Adres: {address.address}
          </p>
        )}

        {error && <p className="mt-3 text-red-500 font-medium">⚠️ {error}</p>}
      </div>
    </section>
  );
};

export default TestPage;

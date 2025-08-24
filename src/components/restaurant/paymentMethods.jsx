//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//COMP
import CustomToggle from "../common/customToggle";

//REDUX
import {
  getPaymentMethods,
  resetGetPaymentMethods,
} from "../../redux/restaurant/getPaymentMethodsSlice";
import {
  setPaymentMethods,
  resetSetPaymentMethods,
} from "../../redux/restaurant/setPaymentMethodsSlice";

const PaymentMethods = () => {
  const dispatch = useDispatch();
  const id = useParams()["*"].split("/")[1];
  const { data } = useSelector((s) => s.restaurant.getPaymentMethods);
  const { loading, success } = useSelector(
    (s) => s.restaurant.setPaymentMethods
  );

  const [paymentMethodsData, setPaymentMethodsData] = useState(null);

  // Is every method enabled?
  const allEnabled =
    paymentMethodsData?.length > 0 &&
    paymentMethodsData.every((pm) => pm.enabled);

  // Master toggle handler
  const toggleAll = () => {
    const next = !allEnabled;
    setPaymentMethodsData((prev) =>
      prev.map((pm) => ({ ...pm, enabled: next }))
    );
  };

  function handleSubmit(e) {
    e.preventDefault();
    // Build array of enabled method IDs
    const enabledMethodIds = paymentMethodsData
      .filter((method) => method.enabled)
      .map((method) => method.id);
    dispatch(
      setPaymentMethods({ restaurantId: id, methodIds: enabledMethodIds })
    );
  }

  // GET THE DATA
  useEffect(() => {
    if (!paymentMethodsData) {
      dispatch(getPaymentMethods({ restaurantId: id }));
    }
  }, [dispatch, id]);

  //SET THE DATA
  useEffect(() => {
    if (data) {
      setPaymentMethodsData(data);
      dispatch(resetGetPaymentMethods());
    }
  }, [data]);

  // TOAST AND RESET
  useEffect(() => {
    if (loading) toast.loading("İşleniyor...");
    if (success) {
      toast.dismiss();
      toast.success("Ödeme Yöntemleri Güncellendi.");
      dispatch(resetSetPaymentMethods());
    }
  }, [loading, success, dispatch]);

  return (
    <div className="w-full p-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col">
        <h1 className="self-center text-2xl font-bold">Ödeme Yöntemleri</h1>

        {paymentMethodsData && (
          <div className="mt-10">
            <p>Restoranınız için ödeme yöntemlerini yapılandırın.</p>
            <div className="flex gap-4 justify-between py-5">
              <p>Tüm ödeme yöntemlerini etkinleştirin</p>
              <CustomToggle checked={allEnabled} onChange={toggleAll} />
            </div>

            <p className="border border-[--border-1] p-2 rounded-md">
              Tüm ödeme yöntemlerini hızlıca etkinleştirmek veya devre dışı
              bırakmak için yukarıdaki düğmeyi açın. Ayrıca aşağıdan tek tek
              yöntemleri de açabilirsiniz.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-4 sm:px-14 mt-6 space-y-5">
          {paymentMethodsData && (
            <div className="flex flex-col gap-2">
              {paymentMethodsData.map((M, i) => (
                <div
                  key={M.id}
                  className="p-2 flex gap-4 items-center justify-between bg-[--light-1] rounded-sm"
                >
                  <div className="flex items-center gap-6">
                    <p className="size-10 flex justify-center items-center rounded-full bg-[--primary-1] text-white">
                      {i + 1}
                    </p>
                    <p>{M.name}</p>
                  </div>
                  <CustomToggle
                    checked={M.enabled}
                    onChange={() => {
                      setPaymentMethodsData((prev) =>
                        prev.map((pm) =>
                          pm.id === M.id ? { ...pm, enabled: !pm.enabled } : pm
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="w-full flex justify-end pt-10">
            <button
              type="submit"
              className="sm:w-auto px-6 py-3 rounded-md bg-[--primary-1] text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentMethods;

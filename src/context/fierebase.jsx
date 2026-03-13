import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initFirebaseMessaging,
  subscribeForegroundMessages,
} from "../firebase";
import { getOrders, resetGetOrders } from "../redux/orders/getOrdersSlice";
import { getAuth } from "../redux/api";

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [pushToken, setPushToken] = useState(null);
  const [ordersData, setOrdersData] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { orders, error } = useSelector((s) => s.orders.get);

  // Ref so the async init can always reach the latest unsubscribe fn
  const unsubscribeRef = useRef(() => {});
  const isAuthenticated = !!getAuth()?.token;

  // ── 1. Initialize Firebase & subscribe to foreground/background messages ────
  useEffect(() => {
    // Handler shared by foreground (FCM onMessage) and background (SW postMessage)
    const handlePush = (data, source) => {
      // Log the RAW data so we can see exactly what the backend sends
      console.log(`[Firebase] 🔔 Push received (${source}):`, data);

      const orderId = data.orderId || data.OrderId;
      const newStatus = data.status || data.Status;

      if (orderId && newStatus) {
        console.log(
          `[Firebase] ✅ Status update: order ${orderId} → ${newStatus}`,
        );
        setOrdersData((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
        );
        setSelectedOrder((prev) =>
          prev?.id === orderId ? { ...prev, status: newStatus } : prev,
        );
      } else {
        console.log(
          "[Firebase] 🆕 New order or unrecognised push – re-fetching orders",
        );
        if (getAuth()?.token) {
          dispatch(getOrders());
        } else {
          console.log(
            "[Firebase] Ignored re-fetch because user is not authenticated",
          );
        }
      }
    };

    // Background messages – SW bridges push events via postMessage
    const onSwMessage = (event) => {
      console.log("[Firebase] SW postMessage raw:", event.data);
      if (event.data?.type !== "FCM_BACKGROUND") return;
      handlePush(event.data?.data || {}, "background-sw");
    };

    navigator.serviceWorker?.addEventListener("message", onSwMessage);

    // Async init – use ref so cleanup always cancels the right listener
    (async () => {
      const { token } = await initFirebaseMessaging();
      if (token) setPushToken(token);

      // Cancel any previous foreground listener before registering a new one
      unsubscribeRef.current();

      // Foreground messages – app tab is active
      unsubscribeRef.current = subscribeForegroundMessages((payload) => {
        console.log("[Firebase] 🔔 Foreground FCM raw payload:", payload);
        handlePush(payload?.data || {}, "foreground");
      });
    })();

    return () => {
      unsubscribeRef.current();
      unsubscribeRef.current = () => {};
      navigator.serviceWorker?.removeEventListener("message", onSwMessage);
    };
  }, [dispatch]);

  // ── 2. Initial orders fetch ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) return;
    dispatch(getOrders());
  }, [dispatch, isAuthenticated]);

  // ── 3. Sync redux response into local state ─────────────────────────────────
  useEffect(() => {
    if (orders) {
      setOrdersData(orders);
      setSelectedOrder((prev) => {
        if (!prev) return orders.length > 0 ? orders[0] : null;
        return orders.find((o) => o.id === prev.id) ?? null;
      });
      dispatch(resetGetOrders());
    }
    if (error) dispatch(resetGetOrders());
  }, [orders, error, dispatch]);

  return (
    <FirebaseContext.Provider
      value={{
        pushToken,
        ordersData,
        setOrdersData,
        selectedOrder,
        setSelectedOrder,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

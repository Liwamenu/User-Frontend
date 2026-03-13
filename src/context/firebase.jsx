import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  initFirebaseMessaging,
  requestPushPermissionToken,
  subscribeForegroundMessages,
} from "../firebase";

const FirebaseContext = createContext();
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [pushToken, setPushToken] = useState(null);
  const [notificationPermission, setNotificationPermission] =
    useState("default");
  const [lastPushMessage, setLastPushMessage] = useState(null);

  // Ref so the async init can always reach the latest unsubscribe fn
  const unsubscribeRef = useRef(() => {});

  // ── Initialize Firebase & expose raw push data stream ──────────────────────
  useEffect(() => {
    const emitPush = (source, data) => {
      console.log(`[Firebase] 🔔 Push received (${source}):`, data);
      setLastPushMessage({ source, data, at: Date.now() });
    };

    // Background messages – SW bridges push events via postMessage
    const onSwMessage = (event) => {
      console.log("[Firebase] SW postMessage raw:", event.data);
      if (event.data?.type !== "FCM_BACKGROUND") return;
      emitPush("background-sw", event.data?.data || {});
    };

    navigator.serviceWorker?.addEventListener("message", onSwMessage);

    // Async init – use ref so cleanup always cancels the right listener
    (async () => {
      const { token, permission } = await initFirebaseMessaging();
      if (permission) setNotificationPermission(permission);
      if (token) setPushToken(token);

      // Cancel any previous foreground listener before registering a new one
      unsubscribeRef.current();

      // Foreground messages – app tab is active
      unsubscribeRef.current = subscribeForegroundMessages((payload) => {
        console.log("[Firebase] 🔔 Foreground FCM raw payload:", payload);
        emitPush("foreground", payload?.data || {});
      });
    })();

    return () => {
      unsubscribeRef.current();
      unsubscribeRef.current = () => {};
      navigator.serviceWorker?.removeEventListener("message", onSwMessage);
    };
  }, []);

  const requestNotificationAccess = async () => {
    const { token, permission } = await requestPushPermissionToken();
    if (permission) setNotificationPermission(permission);
    if (token) setPushToken(token);
    return { token, permission };
  };

  return (
    <FirebaseContext.Provider
      value={{
        pushToken,
        notificationPermission,
        requestNotificationAccess,
        lastPushMessage,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

// PayTR's 3D Secure failure return URL. Mirror of paymentSuccess.jsx —
// PayTR redirects the iframe here when the payment fails, and we relay
// that to the wizard via postMessage. Standalone visits fall through to
// 404 after a brief spinner.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NotFound from "./404";
import LoadingI from "../assets/anim/loading";

const PaymentFailed = () => {
  const location = useLocation();
  const isStandalone = location.pathname === "/payment-failed";
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Post to BOTH window.top and window.parent so the wizard listener
    // gets the signal regardless of iframe nesting depth. Receiver
    // filters on `source: "paytr"` so '*' targetOrigin is safe.
    const payload = { status: "failed", source: "paytr" };
    try { window.top?.postMessage(payload, "*"); } catch { /* cross-origin */ }
    try { window.parent?.postMessage(payload, "*"); } catch { /* cross-origin */ }

    if (isStandalone) {
      const timer = setTimeout(() => setNotFound(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [isStandalone]);

  return notFound ? (
    <NotFound />
  ) : (
    <div className="w-full min-h-40 flex justify-center items-end">
      <LoadingI className="size-10 text-[--primary-1]" />
    </div>
  );
};

export default PaymentFailed;

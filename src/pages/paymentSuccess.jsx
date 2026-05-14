// PayTR's 3D Secure success return URL. PayTR redirects the iframe here
// after a successful payment; the page's only job is to tell the parent
// SPA (the wizard) that we're done, then disappear. If someone reaches
// this URL directly in a browser (no parent), we fall through to 404
// after a short spinner so we don't leave them on a blank page.

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import NotFound from "./404";
import LoadingI from "../assets/anim/loading";

const PaymentSuccess = () => {
  const location = useLocation();
  const isStandalone = location.pathname === "/payment-success";
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Post to BOTH window.top and window.parent — depending on how the
    // wizard is mounted (top-level vs nested iframe) one of them is the
    // SPA window that needs the signal. targetOrigin '*' is fine here
    // because the payload contains no secrets and the receiver filters
    // on `source: "paytr"`.
    const payload = { status: "success", source: "paytr" };
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

export default PaymentSuccess;

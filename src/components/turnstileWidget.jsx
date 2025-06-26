import React, { useEffect } from "react";

const sitekey = import.meta.env.VITE_SITE_KEY;

const TurnstileWidget = ({ pageName }) => {
  // if (pageName === "login") {
  //   console.log("Called Cloudflare", pageName);
  //   useEffect(() => {
  //     const turnstileElement = document.getElementById("cf-turnstile");
  //     if (turnstileElement) {
  //       window.turnstile.render(turnstileElement, {
  //         sitekey,
  //       });
  //     }
  //   }, []);

  //   return <div id="cf-turnstile"></div>;
  // }
  return null;
};

export default TurnstileWidget;

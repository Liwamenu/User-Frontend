// Pickup auth handed off from admin.liwamenu.com.
// Two channels:
//   1) #auth=<base64-JSON> URL fragment (cross-origin, dev, prod)
//   2) liwamenu_auth=<base64-JSON> cookie scoped to .liwamenu.com (prod only)
//
// Must run before any module reads VITE_LOCAL_KEY from localStorage —
// notably src/config/i18n.js. Imported FIRST in main.jsx.

const STORAGE_KEY = import.meta.env.VITE_LOCAL_KEY;

const decode = (raw) => {
  try {
    return JSON.parse(
      decodeURIComponent(escape(atob(decodeURIComponent(raw)))),
    );
  } catch {
    return null;
  }
};

const hashMatch = window.location.hash.match(/^#auth=(.+)$/);
if (hashMatch) {
  const auth = decode(hashMatch[1]);
  if (auth) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search,
    );
  }
}

if (!localStorage.getItem(STORAGE_KEY)) {
  const cookieMatch = document.cookie.match(/(?:^|;\s*)liwamenu_auth=([^;]+)/);
  if (cookieMatch) {
    const auth = decode(cookieMatch[1]);
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      document.cookie =
        "liwamenu_auth=; Path=/; Domain=.liwamenu.com; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
  }
}

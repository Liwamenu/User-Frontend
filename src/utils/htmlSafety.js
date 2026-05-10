// Shared validation rules for HTML content fields where the author writes
// arbitrary markup that will later be rendered to customers (announcement
// popup, external page, …). The trust model is: author = restaurant owner
// (a known, authenticated principal), so we don't try to lock down basic
// HTML / scripting — those are explicitly part of the placeholder promise
// "Tailwind destekli HTML". What we DO refuse to save are patterns that
// have no good-faith use in restaurant content and only show up when
// someone is probing for an injection vector.
//
// Each entry has a regex and a short label. The label gets surfaced in the
// blocking toast so the author can see WHY their content was rejected and
// fix it themselves instead of staring at a generic "save failed".

export const DANGEROUS_HTML_PATTERNS = [
  // <meta http-equiv="refresh"> auto-redirects the page — could yank
  // customers off the menu/announcement to an attacker-controlled URL the
  // moment the content renders. Plain <meta charset>/<meta viewport> stay
  // allowed.
  {
    pattern: /<meta\b[^>]*http-equiv\s*=\s*['"]?\s*refresh/i,
    label: '<meta http-equiv="refresh">',
  },
  // <base href="..."> rewrites the resolution of every relative URL in
  // the document — classic vector for routing assets/links to a hostile
  // origin. No legitimate need inside a restaurant page.
  { pattern: /<base\b/i, label: "<base>" },
  // javascript: / vbscript: / data:text/html schemes used inside href/src.
  // These are the "you typed it on purpose" XSS vectors — unlike a normal
  // <script> block, they exist almost exclusively to defeat naive
  // sanitizers.
  { pattern: /javascript\s*:/i, label: "javascript: URL" },
  { pattern: /vbscript\s*:/i, label: "vbscript: URL" },
  { pattern: /data\s*:\s*text\/html/i, label: "data:text/html URL" },
];

export const SQL_INJECTION_PATTERNS = [
  {
    pattern: /\bDROP\s+(TABLE|DATABASE|SCHEMA|INDEX|VIEW)\b/i,
    label: "DROP …",
  },
  { pattern: /\bDELETE\s+FROM\b/i, label: "DELETE FROM" },
  { pattern: /\bUPDATE\s+\w+\s+SET\b/i, label: "UPDATE … SET" },
  { pattern: /\bINSERT\s+INTO\b/i, label: "INSERT INTO" },
  { pattern: /\bTRUNCATE\s+TABLE\b/i, label: "TRUNCATE TABLE" },
  { pattern: /\bUNION\s+(ALL\s+)?SELECT\b/i, label: "UNION SELECT" },
  // Classic "OR 1=1" / "OR '1'='1'" — number = number with optional quotes.
  {
    pattern: /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+['"]?/i,
    label: "OR 1=1",
  },
  { pattern: /\bEXEC(UTE)?\s*\(/i, label: "EXEC(…)" },
  { pattern: /\bxp_cmdshell\b/i, label: "xp_cmdshell" },
  { pattern: /\bsp_executesql\b/i, label: "sp_executesql" },
  // Trailing inline comment used to chop off the rest of an injected
  // query: `'; --`, `' OR 1=1 --`, etc.
  { pattern: /;\s*--/, label: "SQL trailing comment" },
];

export const detectDangerousContent = (html) => {
  if (!html) return [];
  const found = [];
  for (const { pattern, label } of [
    ...DANGEROUS_HTML_PATTERNS,
    ...SQL_INJECTION_PATTERNS,
  ]) {
    if (pattern.test(html)) found.push(label);
  }
  // De-dupe in case (e.g.) two regexes catch the same label.
  return Array.from(new Set(found));
};

// Build the iframe srcDoc that previews HTML content authored in the admin
// panel. Mirrors the customer-side AnnouncementModal in the menu themes
// repo so what the author sees here matches what their customers see.
//
// If the input is a full HTML document (<!doctype>, <html>) it's used
// verbatim — wrapping a complete document inside our own <body> would
// nest <html>/<body> tags and the browser would render unpredictably.
// Snippets get wrapped with a default Tailwind CDN + sane reset so the
// "Tailwind destekli HTML" promise holds.
export const buildPreviewSrcDoc = (htmlContent) => {
  const content = htmlContent || "";
  if (/<!doctype\s+html|<html[\s>]/i.test(content)) {
    return content;
  }
  return `<!doctype html>
<html lang="tr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script>
      window.tailwind = window.tailwind || {};
      window.tailwind.config = { darkMode: 'class' };
    </script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        background: #ffffff;
        color: #0f172a;
        font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
        -webkit-text-size-adjust: 100%;
      }
      body { padding: 1rem; line-height: 1.5; word-wrap: break-word; }
      img, video, iframe { max-width: 100%; height: auto; display: block; }
      iframe[src*="youtube.com"],
      iframe[src*="youtube-nocookie.com"],
      iframe[src*="vimeo.com"] {
        width: 100% !important;
        height: auto !important;
        aspect-ratio: 16 / 9;
        border-radius: 12px;
        border: 0;
      }
      table { max-width: 100%; }
      pre, code { white-space: pre-wrap; word-break: break-word; }
    </style>
  </head>
  <body>${content}</body>
</html>`;
};

// Sandbox + Permissions Policy attribute strings for the preview iframe.
// Exported as constants so call sites stay in sync with the customer-side
// AnnouncementModal — diverging here would create the same "preview works,
// customer doesn't" class of bugs we just spent time eliminating.
//
// Trade-off note: `allow-same-origin` is intentional. It lets nested
// <iframe>s (YouTube, Vimeo, Maps) load at their actual origin instead of
// being forced to opaque, which is what makes embedded video play. The
// downside is the author's own pasted script can read parent.localStorage
// — acceptable here because the author is previewing their own HTML in
// their own browser; the only entity it could harm is themselves.
export const PREVIEW_SANDBOX =
  "allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-presentation allow-forms";

export const PREVIEW_ALLOW =
  "accelerometer; autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture; web-share";

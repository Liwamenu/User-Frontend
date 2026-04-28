// Generates a thermal-printer-friendly receipt (80mm) in a hidden iframe and triggers print.
// Layout is single-column, monospace, with @page size: 80mm auto for proper paper handling.

const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMoney = (n) =>
  Number(n || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const formatDateTime = (iso, locale = "tr-TR") => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(locale === "tr" ? "tr-TR" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const STATUS_LABEL_KEYS = {
  Pending: "orders.status_pending",
  Accepted: "orders.status_accepted",
  Preparing: "orders.status_preparing",
  OnTheWay: "orders.status_on_the_way",
  Delivered: "orders.status_delivered",
  Cancelled: "orders.status_cancelled",
};

export function printOrder(order, t, lang = "tr") {
  if (!order) return;

  const isInPerson = order.orderType === "InPerson";
  const statusLabel = order.status
    ? t(STATUS_LABEL_KEYS[order.status] || "")
    : "—";

  const heading = order.restaurantName || t("orders.print_receipt_title");

  // Info rows (label / value pairs). Order ID intentionally omitted.
  const infoRows = [];
  infoRows.push([t("orders.print_date"), formatDateTime(order.createdAt, lang)]);
  infoRows.push([
    t("orders.print_order_type"),
    isInPerson
      ? t("orders.order_type_in_person")
      : t("orders.order_type_online"),
  ]);
  infoRows.push([t("orders.print_status"), statusLabel]);
  if (isInPerson && order.tableNumber) {
    infoRows.push([t("orders.print_table"), order.tableNumber]);
  }
  if (order.customerName) {
    infoRows.push([t("orders.print_customer"), order.customerName]);
  }
  if (order.customerTel) {
    infoRows.push([t("orders.print_phone"), order.customerTel]);
  }
  if (order.customerAddress) {
    infoRows.push([t("orders.print_address"), order.customerAddress]);
  }
  if (order.paymentMethodName) {
    infoRows.push([t("orders.print_payment"), order.paymentMethodName]);
  }

  const infoHtml = infoRows
    .map(
      ([label, value]) =>
        `<div class="info"><span class="info-l">${escapeHtml(
          label,
        )}</span><span class="info-v">${escapeHtml(value)}</span></div>`,
    )
    .join("");

  const itemsHtml = (order.items || [])
    .map((item) => {
      const tagsHtml = (item.selectedTags || [])
        .map((tag) => {
          const tagTotal =
            Number(tag.price || 0) *
            Number(tag.quantity || 1) *
            Number(item.quantity || 1);
          const left = `+ ${escapeHtml(tag.itemName)}${
            tag.quantity > 1 ? ` x${escapeHtml(tag.quantity)}` : ""
          }`;
          const right = tagTotal > 0 ? `${formatMoney(tagTotal)}` : "";
          return `<div class="sub"><span>${left}</span><span>${right}</span></div>`;
        })
        .join("");

      const portionHtml =
        item.portionName && item.portionName.toLowerCase() !== "normal"
          ? `<div class="sub"><span>${escapeHtml(
              item.portionName,
            )}</span><span></span></div>`
          : "";

      const noteHtml = item.note
        ? `<div class="sub note"><span>${t(
            "orders.note_label",
          )} ${escapeHtml(item.note)}</span><span></span></div>`
        : "";

      return `
        <div class="item">
          <div class="item-line">
            <span class="qty">${escapeHtml(item.quantity)}x</span>
            <span class="name">${escapeHtml(item.productName || "")}</span>
            <span class="amt">${formatMoney(item.lineTotal)}</span>
          </div>
          ${portionHtml}
          ${tagsHtml}
          ${noteHtml}
        </div>`;
    })
    .join("");

  const summaryRows = [];
  summaryRows.push(
    `<div class="info"><span>${t(
      "orders.subtotal",
    )}</span><span>${formatMoney(order.subTotal)}</span></div>`,
  );
  if (order.deliveryFee != null && Number(order.deliveryFee) > 0) {
    summaryRows.push(
      `<div class="info"><span>${t(
        "orders.delivery_fee",
      )}</span><span>${formatMoney(order.deliveryFee)}</span></div>`,
    );
  }
  if (Number(order.discountAmount) > 0) {
    summaryRows.push(
      `<div class="info"><span>${t(
        "orders.online_discount",
      )}</span><span>-${formatMoney(order.discountAmount)}</span></div>`,
    );
  }

  const notesHtml = [];
  if (order.orderNote) {
    notesHtml.push(
      `<div class="note-block"><div class="note-label">${t(
        "orders.general_note",
      )}</div><div class="note-text">${escapeHtml(order.orderNote)}</div></div>`,
    );
  }
  if (order.customerNote) {
    notesHtml.push(
      `<div class="note-block"><div class="note-label">${t(
        "orders.customer_note",
      )}</div><div class="note-text">${escapeHtml(
        order.customerNote,
      )}</div></div>`,
    );
  }

  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(heading)}</title>
<style>
  @page {
    size: 80mm auto;
    margin: 0;
  }
  * { box-sizing: border-box; color: #000 !important; }
  html, body { margin: 0; padding: 0; background: #fff; }
  body {
    width: 80mm;
    padding: 4mm 3mm;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
    color: #000;
    font-size: 12px;
    line-height: 1.35;
    font-weight: 600;
    font-feature-settings: "tnum" 1;
    font-variant-numeric: tabular-nums;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .center { text-align: center; }
  .bold { font-weight: 700; }
  .heading {
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    text-align: center;
    margin-bottom: 4px;
    word-break: break-word;
  }
  .subheading {
    text-align: center;
    font-size: 11px;
    margin-bottom: 6px;
  }
  .divider {
    border: 0;
    border-top: 1px dashed #000;
    margin: 6px 0;
  }
  .divider.solid { border-top-style: solid; }
  .section-title {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 6px 0 4px;
  }
  .info {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    font-size: 12px;
    margin-bottom: 2px;
    word-break: break-word;
    color: #000;
    font-weight: 700;
  }
  .info-l {
    flex: 0 0 auto;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 0.02em;
    color: #000;
  }
  .info-v {
    flex: 1 1 auto;
    text-align: right;
    font-weight: 700;
    word-break: break-word;
    color: #000;
  }
  .item { margin-bottom: 6px; }
  .item-line {
    display: flex;
    align-items: flex-start;
    gap: 4px;
    font-size: 12px;
    font-weight: 700;
  }
  .item-line .qty {
    flex: 0 0 auto;
    min-width: 22px;
  }
  .item-line .name {
    flex: 1 1 auto;
    word-break: break-word;
  }
  .item-line .amt {
    flex: 0 0 auto;
    white-space: nowrap;
  }
  .sub {
    display: flex;
    justify-content: space-between;
    gap: 6px;
    padding-left: 26px;
    font-size: 11px;
    font-weight: 600;
    color: #000;
  }
  .sub.note { font-style: italic; }
  .total-line {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    margin-top: 4px;
    padding-top: 4px;
    border-top: 1px solid #000;
  }
  .note-block {
    border: 1px dashed #000;
    padding: 4px 6px;
    margin-top: 4px;
    font-size: 11px;
    color: #000;
    font-weight: 600;
  }
  .note-label {
    font-weight: 800;
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.04em;
    margin-bottom: 2px;
    color: #000;
  }
  .note-text { word-break: break-word; color: #000; }
  .footer {
    text-align: center;
    margin-top: 8px;
    font-size: 11px;
    color: #000;
    font-weight: 600;
  }
  .spacer { height: 8mm; }
  @media print {
    body { padding: 2mm 3mm; }
  }
</style>
</head>
<body>
  <div class="heading">${escapeHtml(heading)}</div>
  <hr class="divider solid" />

  ${infoHtml}

  <hr class="divider" />
  <div class="section-title">${t("orders.order_items")}</div>
  ${itemsHtml}

  <hr class="divider" />
  ${summaryRows.join("")}
  <div class="total-line">
    <span>${t("orders.total")}</span>
    <span>${formatMoney(order.totalAmount)}</span>
  </div>

  ${notesHtml.length ? `<hr class="divider" />${notesHtml.join("")}` : ""}

  <hr class="divider" />
  <div class="footer">${t("orders.print_thank_you")}</div>
  <div class="spacer"></div>

<script>
  window.addEventListener("load", function () {
    setTimeout(function () {
      window.focus();
      window.print();
    }, 100);
  });
  window.addEventListener("afterprint", function () {
    if (window.frameElement && window.frameElement.parentNode) {
      window.frameElement.parentNode.removeChild(window.frameElement);
    }
  });
</script>
</body>
</html>`;

  // Hidden iframe — keeps main app state intact.
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.setAttribute("aria-hidden", "true");
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }
  doc.open();
  doc.write(html);
  doc.close();
}

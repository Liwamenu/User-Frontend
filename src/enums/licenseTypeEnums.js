const LicenseTypeEnums = [
  { value: "QRLicensePackage", label: "QR Lisans" },
  { value: "TVLicensePackage", label: "TV Lisans" },
];

export const LICENSE_TYPE_LABELS = {
  QRLicensePackage: "QR Lisans",
  TVLicensePackage: "TV Lisans",
};

export const getLicenseTypeLabel = (type) =>
  LICENSE_TYPE_LABELS[type] || type || "";

export default LicenseTypeEnums;

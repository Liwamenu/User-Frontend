import { QRCodeCanvas } from "qrcode.react";

const QrGenerator = ({ text }) => {
  return (
    <QRCodeCanvas
      value={text || "default text"}
      size={100}
      bgColor={"#ffffff"}
      fgColor={"#000000"}
      level={"L"}
    />
  );
};

export default QrGenerator;

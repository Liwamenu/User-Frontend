import { useState } from "react";
import { CloudUI } from "../../assets/icon";
import toast from "react-hot-toast";

//image/png, image/jpeg, image/gif, application/pdf

const CustomFileInput = ({
  onChange,
  value,
  accept = "image/png, image/jpeg, image/gif, application/pdf",
  className,
  required,
  msg,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];
    if (file && onChange) {
      handleFile(file);
    }
  };

  const handleFile = (file) => {
    const fileType = file.type;
    const allowedTypes = accept.split(",").map((type) => type.trim());
    if (!allowedTypes.includes(fileType)) {
      toast.error("Invalid file type");
      return;
    }
    onChange(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const getReadableAcceptText = (accept) => {
    if (!accept) return "";
    return accept
      .split(",")
      .map((type) => {
        if (type.includes("image/")) return type.split("/")[1].toUpperCase();
        if (type === "application/pdf") return "PDF";
        return type;
      })
      .join(", ");
  };

  return (
    <label
      htmlFor="dropzone-file"
      className={`flex flex-col items-center justify-center w-full h-64 text-[--gr-1] border-2 border-[--light-1] border-dashed rounded-lg cursor-pointer bg-[--white-1] relative ${
        isDragging ? "border-[--primary-1] bg-[--light-3]" : ""
      } ${className}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center cursor-pointer">
        {!value ? (
          msg || (
            <>
              <CloudUI className="size-[2.5rem]" strokeWidth={1.5} />
              <p className="mb-2 text-sm">
                Restoran Logosu Yüklemek için
                <span className="font-semibold"> tıklayın</span> veya
                <span className="font-semibold"> sürükleyip bırakın</span>
              </p>
              <p className="text-xs">
                {getReadableAcceptText(accept)} (MAX. 800x400px)
              </p>
            </>
          )
        ) : (
          <>
            <p className="mb-2 text-sm">
              <span className="font-semibold">Seçilen dosya: </span>
              <span className="font-semibold text-[--primary-1]">
                {value.name?.slice(0, 40)}
                {value.name?.length > 40 && "..."}
              </span>
            </p>
            <p className="text-xs">
              Boyut: {(value.size / 1024).toFixed(2)} KB
            </p>
          </>
        )}
      </div>
      <input
        type="file"
        id="dropzone-file"
        name="dropzone-file"
        className="absolute top-0 inset-0 opacity-0 cursor-pointer"
        onChange={handleInputChange}
        accept={accept}
        required={required}
      />
    </label>
  );
};

export default CustomFileInput;

import { useSelector } from "react-redux";
import { createContext, useState, useContext, useEffect } from "react";
import CustomGeneralLoader from "../components/common/customGeneralLloader";

const PopupContext = createContext();

export const usePopup = () => useContext(PopupContext);

export const PopupProvider = ({ children }) => {
  const { isLoading } = useSelector((state) => state.isLoading);

  let className;
  const [popupContent, setPopupContent] = useState(null);
  const [secondPopupContent, setSecondPopupContent] = useState(null);
  const [contentRef, setContentRef] = useState([]);
  const [loadingComponent, setLoadingComponent] = useState(null);
  const [cropImgPopup, setCropImgPopup] = useState(null);

  const handleClickOutside = (event) => {
    if (contentRef.length > 0) {
      contentRef.forEach((content) => {
        if (content.ref.current) {
          if (content.outRef?.current) {
            if (
              !content.ref.current.contains(event.target) &&
              !content.outRef.current.contains(event.target)
            ) {
              content.callback();
            }
          } else {
            if (!content.ref.current.contains(event.target)) {
              content.callback();
            }
          }
        }
      });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [contentRef]);

  useEffect(() => {
    if (isLoading) {
      className = "loading";
      setLoadingComponent(<CustomGeneralLoader />);
    } else {
      className = null;
      setLoadingComponent(false);
    }
  }, [isLoading]);

  return (
    <PopupContext.Provider
      value={{
        className,
        popupContent,
        setPopupContent,
        secondPopupContent,
        setSecondPopupContent,
        contentRef,
        setContentRef,
        loadingComponent,
        setLoadingComponent,
        cropImgPopup,
        setCropImgPopup,
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};

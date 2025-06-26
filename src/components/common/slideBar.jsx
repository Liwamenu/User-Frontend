import { useEffect, useRef } from "react";
import { useSlideBar } from "../../context/SlideBarContext";

const SlideBar = () => {
  const slideBarRef = useRef();

  const { slideBarContent, setSlideBarContent } = useSlideBar();

  function handleClickOutside(e) {
    if (!slideBarRef.current.contains(e.target)) {
      setSlideBarContent(null);
    }
  }

  useEffect(() => {
    if (slideBarContent) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, [slideBarContent]);

  return (
    <div
      onClick={handleClickOutside}
      className={`fixed top-0 left-0 right-0 bottom-0 items-center transition-colors z-[9999] ${
        slideBarContent ? "flex bg-black/20" : "hidden"
      } ${!slideBarContent?.content && "justify-end"}`}
    >
      <div
        ref={slideBarRef}
        className={`bg-[--btn-txt] w-[90%] max-w-[35rem] rounded-xl transition-all duration-1000 ${
          slideBarContent ? "translate-x-0" : "translate-x-[200%]"
        }`}
      >
        {slideBarContent?.content || slideBarContent}
      </div>
    </div>
  );
};

export default SlideBar;

//modules
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

//redux
import {
  getAdverts,
  resetGetAdverts,
} from "../../redux/generalVars/adverts/getAdvertsSlice";

const Advert = () => {
  const dispatch = useDispatch();
  const { error, adverts } = useSelector(
    (state) => state.generalVars.adverts.get
  );
  const [advertData, setAdvertData] = useState(null);
  const [advertsData, setAdvertsData] = useState(null);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  //get adverts
  useEffect(() => {
    if (!advertsData) {
      dispatch(getAdverts());
    }
  }, [advertsData]);

  //set adverts data
  useEffect(() => {
    if (adverts) {
      // console.log(adverts);
      setAdvertsData(adverts);
      setAdvertData(adverts?.[0]);
      dispatch(resetGetAdverts());
    }
  }, [adverts, error]);

  //show time
  useEffect(() => {
    if (!advertsData?.length) return;
    const currentAd = advertsData[currentAdIndex];
    const showTimeMs = currentAd.showTime * 60 * 1000;

    const timer = setTimeout(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % advertsData.length);
    }, showTimeMs);
    setAdvertData(advertsData?.[currentAdIndex]);

    return () => clearTimeout(timer);
  }, [currentAdIndex, advertsData]);

  const isImage = advertData?.url.match(/\.(jpeg|jpg|png|gif|webp)$/);
  const isVideo = advertData?.url.match(/\.(mp4|webm|ogg)$/);
  const isIframe =
    advertData?.url.includes("youtube.com") ||
    advertData?.url.includes("vimeo.com");

  return advertData ? (
    <main className="h-16 -mb-16 mt-16">
      <a
        target="_blank"
        className="h-full w-full object-scale-down"
        rel="noopener noreferrer"
        href={advertData?.targetURL}
      >
        {isImage ? (
          <img
            src={advertData.url}
            className="h-full w-full object-contain"
            alt="Advertisement"
          />
        ) : isVideo ? (
          <video
            src={advertData.url}
            className="h-full w-full object-contain"
            autoPlay
            loop
            muted
            controls
          />
        ) : (
          <iframe
            src={advertData.url}
            className="h-full w-full pointer-events-none"
            style={{ border: "none" }}
            allowFullScreen
          />
        )}
      </a>
    </main>
  ) : null;
};

export default Advert;

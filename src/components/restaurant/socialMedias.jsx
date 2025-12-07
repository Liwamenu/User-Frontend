//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

//COMP
import { FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";
import CustomInput from "../common/customInput";
import { BsTiktok, BsWhatsapp } from "react-icons/bs";

//REDUX
import {
  getSocialMedias,
  resetGetSocialMedias,
} from "../../redux/restaurant/getSocialMediasSlice";
import {
  setSocialMedias,
  resetSetSocialMedias,
} from "../../redux/restaurant/setSocialMediasSlice";

const SocialMedias = ({ data: restaurant }) => {
  const dispatch = useDispatch();
  const id = useParams()["*"].split("/")[1];
  const { data } = useSelector((s) => s.restaurant.getSocialMedias);
  const { loading, success } = useSelector((s) => s.restaurant.setSocialMedias);

  const [socialMediasData, setSocialMediasData] = useState(null);
  function handleSubmit(e) {
    e.preventDefault();
    dispatch(setSocialMedias(socialMediasData));
  }

  // GET THE DATA
  useEffect(() => {
    if (!socialMediasData) {
      dispatch(getSocialMedias({ restaurantId: id }));
    }
  }, [dispatch, id]);

  //SET THE DATA
  useEffect(() => {
    if (data) {
      setSocialMediasData(data);
      dispatch(resetGetSocialMedias());
    }
  }, [data]);

  // TOAST AND RESET
  useEffect(() => {
    if (loading) toast.loading("İşleniyor...");
    if (success) {
      toast.dismiss();
      toast.success("Sosyal medya linkleri güncellendi.");
      dispatch(resetSetSocialMedias());
    }
  }, [loading, success, dispatch]);

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14 ">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Sosyal Medya {restaurant?.name} Restoranı
        </h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="w-full space-y-5">
            <div className="flex items-center gap-2">
              <FiFacebook />
              <CustomInput
                label={
                  <a
                    className="text-[--primary-1]"
                    href={
                      socialMediasData?.facebookUrl || "https://facebook.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Facebook
                  </a>
                }
                value={socialMediasData?.facebookUrl || ""}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                placeholder="https://facebook.com/sayfanız"
                onChange={(e) =>
                  setSocialMediasData((prev) => {
                    return {
                      ...prev,
                      facebookUrl: e,
                    };
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <FiInstagram />
              <CustomInput
                label={
                  <a
                    className="text-[--primary-1]"
                    href={
                      socialMediasData?.instagramUrl || "https://instagram.com"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                }
                value={socialMediasData?.instagramUrl || ""}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                placeholder="https://instagram.com/sayfanız"
                onChange={(e) =>
                  setSocialMediasData((prev) => {
                    return {
                      ...prev,
                      instagramUrl: e,
                    };
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <BsTiktok />
              <CustomInput
                label={
                  <a
                    className="text-[--primary-1]"
                    href={socialMediasData?.tiktokUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    TikTok
                  </a>
                }
                value={socialMediasData?.tiktokUrl || "https://tiktok.com"}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                placeholder="https://tiktok.com/sayfanız"
                onChange={(e) =>
                  setSocialMediasData((prev) => {
                    return {
                      ...prev,
                      tiktokUrl: e,
                    };
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <FiYoutube />
              <CustomInput
                label={
                  <a
                    className="text-[--primary-1]"
                    href={socialMediasData?.youtubeUrl || "https://youtube.com"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YouTube
                  </a>
                }
                value={socialMediasData?.youtubeUrl || ""}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                placeholder="https://youtube.com/sayfanız"
                onChange={(e) =>
                  setSocialMediasData((prev) => {
                    return {
                      ...prev,
                      youtubeUrl: e,
                    };
                  })
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <BsWhatsapp />
              <CustomInput
                label={
                  <a
                    className="text-[--primary-1]"
                    href={
                      socialMediasData?.whatsappUrl ||
                      "https://wa.me/" + restaurant?.phoneNumber
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                }
                value={socialMediasData?.whatsappUrl || ""}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                placeholder={"https://wa.me/" + restaurant?.phoneNumber}
                onChange={(e) =>
                  setSocialMediasData((prev) => {
                    return {
                      ...prev,
                      whatsappUrl: e,
                    };
                  })
                }
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[--primary-1] text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialMedias;

//MODULES
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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

const SocialMedias = () => {
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
      toast.success("Çalışma saatleri başarıyla güncellendi.");
      dispatch(resetSetSocialMedias());
    }
  }, [loading, success, dispatch]);

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col">
        <h1 className="self-center text-2xl font-bold">Sosyal Medya</h1>

        <form onSubmit={handleSubmit} className="px-4 sm:px-14 mt-6 space-y-5">
          <div className="w-full space-y-5">
            <div className="flex items-center gap-2">
              <FiFacebook />
              <CustomInput
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
                value={socialMediasData?.tiktokUrl || ""}
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
                value={socialMediasData?.whatsappUrl || ""}
                className="mt-[0] sm:mt-[0]"
                className2="mt-[0] sm:mt-[0]"
                placeholder="https://whatsapp.com/sayfanız"
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
              className="w-full sm:w-auto px-6 py-3 rounded-md bg-[--primary-1] text-[--white-1] font-semibold"
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

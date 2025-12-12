import { useEffect, useState } from "react";
import CustomInput from "../../common/customInput";
import CustomToggle from "../../common/customToggle";
import CustomFileInput from "../../common/customFileInput";
import { useTranslation } from "react-i18next";
import { CancelI, CloudUI, WarnI } from "../../../assets/icon";
import { usePopup } from "../../../context/PopupContext";
import {
  addCategories,
  resetAddCategories,
} from "../../../redux/categories/addCategoriesSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";
import {
  editCategories,
  resetEditCategories,
} from "../../../redux/categories/editCategoriesSlice";

const EditCategory = ({ category, onSuccess }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setPopupContent } = usePopup();

  const { success, error } = useSelector((state) => state.categories.edit);

  const [categoryData, setCategoryData] = useState(category);
  const [preview, setPreview] = useState(
    category?.image
      ? URL.createObjectURL(category.image)
      : category?.imageAbsoluteUrl || null
  );
  const [showCampaignWarning, setShowCampaignWarning] = useState(false);

  const handleField = (key, value) => {
    setCategoryData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setCategoryData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCampaignToggle = () => {
    const newCampaignState = !categoryData.campaign;
    handleToggle("campaign");
    setShowCampaignWarning(newCampaignState);
  };

  const handleFileChange = (file) => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    const blobUrl = file ? URL.createObjectURL(file) : null;
    setPreview(blobUrl);
    setCategoryData((prev) => ({
      ...prev,
      image: file || null,
    }));
  };

  const handleSave = () => {
    if (isEqual(categoryData, category)) {
      toast.error("Değişiklik yapılmadı.", { id: "categories" });
      return;
    }
    try {
      const formData = new FormData();

      const { image, ...rest } = categoryData;
      const payloadCategory = [rest];

      formData.append("restaurantId", categoryData?.restaurantId);
      formData.append("categoriesData", JSON.stringify(payloadCategory));

      if (categoryData.image) {
        formData.append(`image_0`, categoryData.image);
      }

      // console.log("Editing categories:", categoryData);
      // for (const pair of formData.entries()) {
      //   console.log(pair[0], pair[1]);
      // }

      dispatch(editCategories(formData));
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  // TOAST
  useEffect(() => {
    if (success) {
      onSuccess(categoryData);
      setPopupContent(null);
      toast.success("Kategoriler başarıyla güncellendi.", { id: "categories" });
      dispatch(resetEditCategories());
    }
    if (error) dispatch(resetEditCategories());
  }, [success, error]);

  return (
    <div className="w-full flex justify-center pb-5- mt-1-  text-[--black-2]">
      <div className="flex flex-col px-4- sm:px-14-">
        {/* <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          {t("editCategories.title", { name: restaurant?.name })}
        </h1>

        <div className="flex justify-between items-center">
          <CategoriesHeader restaurant={restaurant} />
        </div> */}

        <div className="max-w-xl flex bg-[--white-1] rounded-lg items-center justify-center transition-all duration-300">
          <div className="bg-[--white-1] rounded-2xl shadow-2xl w-full p-8 transform scale-100 transition-all duration-300 modal-content relative">
            <div className="flex justify-between items-center mb-8 border-b border-[--light-3] pb-4">
              <h3 className="text-2xl font-bold text-[--black-1]">
                {t("editCategories.edit")}
              </h3>
              <button
                onClick={() => setPopupContent(null)}
                className="text-[--gr-1] hover:text-[--black-2] transition-colors"
                aria-label="Kapat"
              >
                <CancelI clsassName="" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Kategori Adı */}
              <CustomInput
                required
                label="Kategori Adı *"
                placeholder="Örn: Çorbalar"
                className="w-full rounded-xl border-[--border-1] bg-[--light-1] focus:bg-[--white-1] p-3.5 text-[--black-1] border focus:border-[--primary-1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                value={categoryData.name}
                onChange={(v) => handleField("name", v)}
              />

              {/* Kategori Görseli */}
              <div>
                <span className="text-[--black-2] text-sm font-medium mb-2 block">
                  Kategori Görseli (Opsiyonel)
                </span>
                <div className="group border-2 border-dashed border-[--border-1] rounded-xl p-6 text-center hover:border-[--primary-1] transition-all relative cursor-pointer">
                  {preview ? (
                    <div className="mb-3 max-h-40 overflow-hidden flex justify-center items-center rounded-lg mx-auto shadow-md">
                      <img
                        src={preview}
                        className="max-h-40 w-auto object-cover rounded-md"
                        alt="Kategori"
                      />
                    </div>
                  ) : (
                    <div className="group-hover:scale-110 transition-transform duration-300 pointer-events-none">
                      <div className="w-12 h-12 bg-[--status-primary-1] text-[--primary-1] rounded-full flex items-center justify-center mx-auto mb-3">
                        <CloudUI className="size-[1.5rem] pt-1 pl-1" />
                      </div>
                      <p className="text-sm text-[--gr-1] group-hover:text-[--primary-1] font-medium">
                        Görsel Seçmek İçin Tıklayın
                      </p>
                    </div>
                  )}
                  <div className="absolute inset-0 opacity-0">
                    <CustomFileInput
                      required={false}
                      value={categoryData.image}
                      onChange={handleFileChange}
                      accept="image/png, image/jpeg"
                      className="h-full w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Toggle'lar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Durum */}
                <div className="flex flex-col p-4 bg-[--light-1] rounded-xl border border-[--border-1] hover:border-[--primary-1] transition-colors">
                  <span className="text-xs font-semibold text-[--gr-1] uppercase tracking-wider mb-2">
                    Durum
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[--black-2]">
                      Açık
                    </span>
                    <CustomToggle
                      checked={categoryData.isActive}
                      onChange={() => handleToggle("isActive")}
                      className="peer-checked:bg-[var(--green-1)] bg-[--border-1] scale-[.7]"
                    />
                  </div>
                </div>

                {/* Kampanya */}
                <div className="flex flex-col p-4 bg-[--light-1] rounded-xl border border-[--border-1] hover:border-[--primary-1] transition-colors">
                  <span className="text-xs font-semibold text-[--gr-1] uppercase tracking-wider mb-2">
                    Kampanya
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[--black-2]">
                      Aktif
                    </span>
                    <CustomToggle
                      checked={categoryData.campaign}
                      onChange={handleCampaignToggle}
                      className="peer-checked:bg-[var(--green-1)] bg-[--border-1] scale-[.7]"
                    />
                  </div>
                </div>

                {/* Öne Çıkan */}
                <div className="flex flex-col p-4 bg-[--light-1] rounded-xl border border-[--border-1] hover:border-[--primary-1] transition-colors">
                  <span className="text-xs font-semibold text-[--gr-1] uppercase tracking-wider mb-2">
                    Öne Çıkan
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[--black-2]">
                      Aktif
                    </span>
                    <CustomToggle
                      checked={categoryData.featured}
                      onChange={() => handleToggle("featured")}
                      className="peer-checked:bg-[var(--green-1)] bg-[--border-1] scale-[.7]"
                    />
                  </div>
                </div>
              </div>

              {/* Kampanya Uyarısı */}
              {showCampaignWarning && (
                <div className="p-4 bg-[--status-orange] text-[--orange-1] rounded-xl border border-[--border-orange] text-sm font-medium transition-all duration-300 ease-in-out">
                  <div className="flex items-center">
                    <WarnI className="text-[--orange-1] mr-3 size-[1.5rem]" />
                    <span>
                      Kampanya fiyatını <strong>Fiyat Listesi</strong>{" "}
                      sekmesinden ayarlayabilirsiniz.
                    </span>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-[--border-1]">
                <button
                  onClick={() => setPopupContent(null)}
                  className="px-6 py-2.5 text-sm font-medium text-[--black-2] bg-[--white-1] border border-[--border-1] rounded-xl hover:bg-[--light-1] hover:text-[--black-1] transition-all"
                >
                  Vazgeç
                </button>
                <button
                  onClick={handleSave}
                  className="px-8 py-2.5 text-sm font-medium text-white bg-[--primary-1] rounded-xl shadow-lg shadow-[--light-1] hover:bg-[--primary-2] transform hover:-translate-y-0.5 transition-all"
                >
                  Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategory;

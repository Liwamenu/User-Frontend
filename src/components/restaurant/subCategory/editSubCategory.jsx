//MODULES
import toast from "react-hot-toast";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { isEqual } from "lodash";

//COMP
import CustomInput from "../../common/customInput";
import CustomToggle from "../../common/customToggle";
import CustomSelect from "../../common/customSelector";
import CustomFileInput from "../../common/customFileInput";
import { usePopup } from "../../../context/PopupContext";
import { CancelI, CloudUI } from "../../../assets/icon";

//REDUX
import {
  editSubCategories,
  resetEditSubCategories,
} from "../../../redux/subCategories/editSubCategoriesSlice";

//JSON
import categoriesJSON from "../../../assets/js/Categories.json";

const EditSubCategory = ({ subCategory, onSuccess }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setPopupContent } = usePopup();

  const { success, error } = useSelector(
    (state) => state.subCategories?.edit || {}
  );

  const [subCategoryData, setSubCategoryData] = useState(subCategory);
  const [preview, setPreview] = useState(
    subCategory?.image
      ? URL.createObjectURL(subCategory.image)
      : subCategory?.imageAbsoluteUrl || null
  );

  const categories = useMemo(() => categoriesJSON.categories || [], []);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));
  }, [categories]);

  const handleField = (key, value) => {
    setSubCategoryData((prev) => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setSubCategoryData((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFileChange = (file) => {
    if (preview && preview.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    const blobUrl = file ? URL.createObjectURL(file) : null;
    setPreview(blobUrl);
    setSubCategoryData((prev) => ({
      ...prev,
      image: file || null,
    }));
  };

  const handleSave = () => {
    if (isEqual(subCategoryData, subCategory)) {
      toast.error("Değişiklik yapılmadı.", { id: "subCategories" });
      return;
    }

    if (!subCategoryData.name.trim()) {
      toast.error("Alt kategori adı gereklidir!", { id: "subCategories" });
      return;
    }

    if (!subCategoryData.categoryId) {
      toast.error("Kategori seçmelisiniz!", { id: "subCategories" });
      return;
    }

    try {
      const formData = new FormData();

      const { image, ...rest } = subCategoryData;
      const payloadSubCategory = [rest];

      formData.append("restaurantId", subCategoryData?.restaurantId);
      formData.append("subCategoriesData", JSON.stringify(payloadSubCategory));

      if (subCategoryData.image) {
        formData.append(`image_0`, subCategoryData.image);
      }

      console.log("Editing subcategory:", subCategoryData);
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      // dispatch(editSubCategories(formData));

      // Mock success for now
      setTimeout(() => {
        onSuccess && onSuccess(subCategoryData);
        setPopupContent(null);
        toast.success("Alt kategori başarıyla güncellendi.", {
          id: "subCategories",
        });
      }, 500);
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  // TOAST
  useEffect(() => {
    if (success) {
      onSuccess(subCategoryData);
      setPopupContent(null);
      toast.success("Alt kategori başarıyla güncellendi.", {
        id: "subCategories",
      });
      dispatch(resetEditSubCategories());
    }
    if (error) dispatch(resetEditSubCategories());
  }, [success, error]);

  return (
    <div className="w-full flex justify-center pb-5- mt-1-  text-[--black-2]">
      <div className="w-full max-w-xl flex bg-[--white-1] rounded-lg justify-center transition-all duration-300 max-h-[95dvh] overflow-y-auto">
        <div className="bg-[--white-1] rounded-2xl shadow-2xl w-full p-8 transform scale-100 transition-all duration-300 modal-content relative">
          <div className="flex justify-between items-center mb-8 border-b border-[--light-3] pb-4">
            <h3 className="text-2xl font-bold text-[--black-1]">
              Alt Kategoriyi Düzenle
            </h3>
            <button
              onClick={() => setPopupContent(null)}
              className="text-[--gr-1] hover:text-[--black-2] transition-colors"
              aria-label="Kapat"
            >
              <CancelI clsassName="" />
            </button>
          </div>

          <div className="space-y-6 pb-4">
            {/* Alt Kategori Adı */}
            <CustomInput
              required
              label="Alt Kategori Adı *"
              placeholder="Örn: Sıcak Çorbalar"
              className="w-full rounded-xl border-[--border-1] bg-[--light-1] focus:bg-[--white-1] p-3.5 text-[--black-1] border focus:border-[--primary-1] focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
              className2=""
              value={subCategoryData.name}
              onChange={(v) => handleField("name", v)}
            />

            {/* Kategori Seçimi */}
            <div>
              <label className="block text-[--black-2] text-sm font-medium mb-2">
                Ana Kategori *
              </label>
              <CustomSelect
                required
                placeholder="Kategori Seç"
                value={
                  subCategoryData.categoryId
                    ? categoryOptions.find(
                        (opt) => opt.value === subCategoryData.categoryId
                      )
                    : null
                }
                style={{ backgroundColor: "var(--light-1)" }}
                options={categoryOptions}
                onChange={(opt) => handleField("categoryId", opt?.value || "")}
                isSearchable={true}
                className="text-sm"
              />
              <p className="text-xs text-[--gr-1] mt-2">
                Bu alt kategorinin bağlı olduğu ana kategoriyi seçin.
              </p>
            </div>

            {/* Alt Kategori Görseli */}
            <div>
              <span className="text-[--black-2] text-sm font-medium mb-2 block">
                Alt Kategori Görseli (Opsiyonel)
              </span>
              <div className="group border-2 border-dashed border-[--border-1] rounded-xl p-6 text-center hover:border-[--primary-1] transition-all relative cursor-pointer">
                {preview ? (
                  <div className="mb-3 max-h-40 overflow-hidden flex justify-center items-center rounded-lg mx-auto shadow-md">
                    <img
                      src={preview}
                      className="max-h-40 w-auto object-cover rounded-md"
                      alt="Alt Kategori"
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
                    value={subCategoryData.image}
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg"
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>

            {/* Durum Toggle */}
            <div className="flex flex-col p-4 bg-[--light-1] rounded-xl border border-[--border-1] hover:border-[--primary-1] transition-colors">
              <span className="text-xs font-semibold text-[--gr-1] uppercase tracking-wider mb-2">
                Durum
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[--black-2]">
                  Açık
                </span>
                <CustomToggle
                  checked={subCategoryData.isActive}
                  onChange={() => handleToggle("isActive")}
                  className="peer-checked:bg-[var(--green-1)] bg-[--border-1] scale-[.7]"
                />
              </div>
            </div>

            {/* Info Note */}
            <div className="p-4 bg-[--status-primary-1] text-[--primary-1] rounded-xl border border-[--border-1] text-sm">
              <div className="flex items-start">
                <i className="fa-solid fa-circle-info mr-3 mt-0.5"></i>
                <span>
                  Alt kategoriler, ana kategoriler içinde ürünleri daha detaylı
                  gruplamak için kullanılır. Örneğin: "Çorbalar" kategorisi
                  altında "Sıcak Çorbalar" ve "Soğuk Çorbalar" gibi.
                </span>
              </div>
            </div>

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
                Güncelle
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditSubCategory;

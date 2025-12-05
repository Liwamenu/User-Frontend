//MODULES
import { isEqual } from "lodash";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//COMP
import CustomInput from "../common/customInput";
import CustomFileInput from "../common/customFileInput";
import { CloudUI, MenuI } from "../../assets/icon";

//DEMO DATA
import demoCategories from "../../assets/js/Categories.json";

//REDUX
import {
  editCategories,
  resetEditCategories,
} from "../../redux/categories/editCategoriesSlice";
import {
  getCategories,
  resetGetCategoriesState,
} from "../../redux/categories/getCategoriesSlice";

const EditCategories = ({ data: restaurant, catData }) => {
  const dispatch = useDispatch();
  const sourceCategories = catData || demoCategories.categories;

  const { loading, success, error } = useSelector(
    (state) => state.categories.edit
  );
  const { categories } = useSelector((state) => state.categories.get);

  const [categoriesData, setCategoriesData] = useState(sourceCategories);
  const [categoriesDataBefore, setCategoriesDataBefore] =
    useState(sourceCategories);

  // Update field in a category row
  const updateCategory = (index, key, value) => {
    setCategoriesData((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
    );
  };

  // Remove a category row
  const removeCategory = (index) => {
    setCategoriesData((prev) =>
      prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, sortOrder: i }))
    );
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = [...categoriesData];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the index values after reorder
    const updated = items.map((item, i) => ({ ...item, sortOrder: i }));
    setCategoriesData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEqual(categoriesData, categoriesDataBefore)) {
      toast.error("Değişiklik yapılmadı.");
      return;
    }

    try {
      const formData = new FormData();

      const payloadCategories = categoriesData.map((cat) => {
        const { image, ...rest } = cat;
        return rest;
      });

      const deletedCategories = categoriesDataBefore.filter(
        (prevCat) => !categoriesData.some((cat) => cat.id === prevCat.id)
      );

      formData.append("restaurantId", restaurant?.id);
      formData.append("categoriesData", JSON.stringify(payloadCategories));
      formData.append("deletedCategories", JSON.stringify(deletedCategories));

      categoriesData.forEach((cat, index) => {
        if (cat.image) {
          formData.append(`image_${index}`, cat.image);
        }
      });

      console.log("Editing categories:", categoriesData);

      if (deletedCategories.length > 0) {
        console.log("Deleted categories:", deletedCategories);
      }

      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      dispatch(editCategories(formData));
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  //GET CATEGORIES
  useEffect(() => {
    if (!categoriesData) {
      dispatch(getCategories({ restaurantId: restaurant?.id }));
    }
  }, [categoriesData]);

  //SET CATEGORIES WHEN FETCHED
  useEffect(() => {
    if (categories) {
      setCategoriesData(categories);
      setCategoriesDataBefore(categories);
      dispatch(resetGetCategoriesState());
    }
  }, [categories]);

  // TOAST
  useEffect(() => {
    if (success) {
      toast.success("Kategoriler başarıyla güncellendi.", { id: "categories" });
      setCategoriesDataBefore(categoriesData);
      dispatch(resetEditCategories());
    }
  }, [success]);

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold">
          Kategorileri Düzenle{" "}
          <span className="text-[--primary-1]">{restaurant?.name}</span>{" "}
          Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Mevcut kategorilerinizi düzenlemek için aşağıdaki formu kullanın.
            Kategorileri sürükleyip bırakarak sıralayabilirsiniz.
          </p>
        </div>

        <div className="flex gap-2 my-4">
          <Link
            to={`/restaurant/categories/${restaurant?.id}/edit`}
            className="bg-[--primary-1] text-white p-2"
          >
            Kategorileri Düzenle
          </Link>
          <Link
            to={`/restaurant/categories/${restaurant?.id}/add`}
            className="bg-[--light-3] p-2"
          >
            Kategori Ekle
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="py-3">
          <div className="flex gap-4 max-sm:gap-2 items-end mb-4">
            <p className="w-8"></p>
            <p className="w-[19rem]">Kategori Adı</p>
            <p className="w-full">Kategori Görseli</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categoriesData.map((cat, index) => (
                    <Draggable
                      key={cat.id || `temp-${cat.sortOrder}`}
                      draggableId={cat.id || `temp-${cat.sortOrder}`}
                      index={cat.sortOrder}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`flex gap-4 max-sm:gap-2 items-end mb-4 ${
                            snapshot.isDragging ? "bg-[--light-1]" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="w-8 cursor-move flex"
                          >
                            <MenuI className="text-gray-400 text-xl" />
                          </div>

                          <div className="flex gap-4 max-sm:gap-1 w-full">
                            <div className="flex-1 max-w-md">
                              <CustomInput
                                required
                                type="text"
                                value={cat.name}
                                className="mt-[0] sm:mt-[0]"
                                className2="mt-[0] sm:mt-[0]"
                                placeholder="Kategori adı giriniz"
                                onChange={(e) =>
                                  updateCategory(index, "name", e)
                                }
                              />
                            </div>

                            <div className="w-72 cursor-pointer">
                              <CustomFileInput
                                msg={
                                  <div className="flex items-center text-xs">
                                    <CloudUI
                                      className="size-[1.5rem] mt-2"
                                      strokeWidth={1.5}
                                    />
                                    <p>Kategori görseli yükleyin</p>
                                  </div>
                                }
                                value={cat.image}
                                onChange={(file) =>
                                  updateCategory(index, "image", file)
                                }
                                accept={"image/png, image/jpeg"}
                                className="h-[3rem]"
                              />
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="flex text-[--red-1] font-semibold"
                          >
                            Sil
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex items-center pt-4 mt-6 justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-[--primary-1] text-white font-semibold"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategories;

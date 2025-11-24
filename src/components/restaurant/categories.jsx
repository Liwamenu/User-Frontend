//MODULES
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//COMP
import CustomInput from "../common/customInput";
import CustomFileInput from "../common/customFileInput";
import { CloudUI, MenuI } from "../../assets/icon";

//DEMO DATA
import demoCategories from "../../assets/js/Categories.json";

const ProductCategories = ({ data: restaurant, catData }) => {
  const [categories, setCategories] = useState([
    { name: "", image: null, sortOrder: 0 },
  ]);
  const sourceCategories = catData || demoCategories.categories;
  const [categoriesData, setCategoriesData] = useState(sourceCategories);
  const [isEdit, setIsEdit] = useState(true);

  // Add a new blank category row
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: "", image: null, sortOrder: prev.length },
    ]);
  };

  // Update field in a category row
  const updateCategory = (index, key, value) => {
    isEdit
      ? setCategoriesData((prev) =>
          prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
        )
      : setCategories((prev) =>
          prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
        );
  };

  // Remove a category row
  const removeCategory = (index) => {
    isEdit
      ? setCategoriesData((prev) =>
          prev
            .filter((_, i) => i !== index)
            .map((c, i) => ({ ...c, sortOrder: i }))
        )
      : setCategories((prev) =>
          prev
            .filter((_, i) => i !== index)
            .map((c, i) => ({ ...c, sortOrder: i }))
        );
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = isEdit ? [...categoriesData] : [...categories];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the index values after reorder
    const updated = items.map((item, i) => ({ ...item, sortOrder: i }));

    isEdit ? setCategoriesData(updated) : setCategories(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const payloadCategories = (isEdit ? categoriesData : categories).map(
        (cat) => {
          const { image, ...rest } = cat;
          return rest;
        }
      );

      formData.append("restaurantId", restaurant?.id);
      formData.append("categoriesData", JSON.stringify(payloadCategories));

      (isEdit ? categoriesData : categories).forEach((cat, index) => {
        if (cat.image) {
          formData.append(`image_${index}`, cat.image);
        }
      });

      // Example: send formData via fetch
      // fetch('/api/categories', { method: 'POST', body: formData });

      // for debugging, log FormData entries (files won't be stringified)
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
        console.log(pair);
      }

      isEdit
        ? console.log("IT'S EDIT", categoriesData)
        : console.log("IT'S ADD", categories);
      console.log(formData);
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14 ">
        <h1 className="text-2xl font-bold">
          Kategoriler{" "}
          <span className="text-[--primary-1]"> {restaurant?.name} </span>
          Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Tüm kategorilerinizi hızlıca eklemek veya düzenlemek için aşağıdaki
            seçenekleri kullanın. Ayrıca aşağıdan tek tek kategori ekleyebilir
            veya mevcut kategorileri düzenleyebilirsiniz.
          </p>
        </div>

        <div className="flex gap-2 my-4">
          <button
            className={`${
              isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(true)}
          >
            Katagorileri Düzenle
          </button>
          <button
            className={`${
              !isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(false)}
          >
            Katagori Ekle
          </button>
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
                  {(isEdit ? categoriesData : categories).map((cat, index) => (
                    <Draggable
                      key={cat.id || `temp-${cat.sortOrder}`}
                      draggableId={cat.id || `temp-${cat.sortOrder}`}
                      index={cat.sortOrder}
                    >
                      {(provided, snapshot) => (
                        <div
                          className={`flex gap-4 max-sm:gap-2 items-ennd mb-4 ${
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

          <div
            className={`flex items-center pt-4 mt-6 ${
              isEdit ? "justify-end" : "justify-between"
            }`}
          >
            {!isEdit && (
              <button
                type="button"
                onClick={addCategory}
                className="px-6 py-2 rounded-md bg-[--primary-2] text-white font-semibold"
              >
                Ekle
              </button>
            )}

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

export default ProductCategories;

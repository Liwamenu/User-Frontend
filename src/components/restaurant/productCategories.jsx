//MODULES
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//COMP
import CustomInput from "../common/customInput";
import { MenuI } from "../../assets/icon";

const ProductCategories = ({ data: restaurant, catData }) => {
  const [categories, setCategories] = useState([
    { name: "", icon: "", index: 0 },
  ]);
  const [categoriesData, setCategoriesData] = useState(
    catData || [
      { name: "test", icon: "🍽️", index: 0 },
      { name: "test 2", icon: "🍽️", index: 1 },
    ]
  );
  const [isEdit, setIsEdit] = useState(true);
  const [activePicker, setActivePicker] = useState(null);

  // Add a new blank category row
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: "", icon: "", index: prev.length },
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
          prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, index: i }))
        )
      : setCategories((prev) =>
          prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, index: i }))
        );
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = isEdit ? [...categoriesData] : [...categories];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the index values after reorder
    const updated = items.map((item, i) => ({ ...item, index: i }));

    isEdit ? setCategoriesData(updated) : setCategories(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isEdit ? "It's Edit" : "It's Add", {
      restaurantId: restaurant.id,
      categories: isEdit ? categoriesData : categories,
    });
  };

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14 ">
        <h1 className="text-2xl font-bold">
          Kategoriler{" "}
          <span className="text-[--primary-1]"> {restaurant.name} </span>
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
            <p className="w-full">Kategori İkonu</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="categories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {categoriesData.map((cat, index) => (
                    <Draggable
                      key={cat.id || `temp-${index}`}
                      draggableId={cat.id || `temp-${index}`}
                      index={index}
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
                            className="w-8 flex justify-center pb-3 cursor-move"
                          >
                            <MenuI className="text-gray-400 text-xl" />
                          </div>

                          <div className="flex gap-4 max-sm:gap-1">
                            <CustomInput
                              required
                              type="text"
                              value={cat.name}
                              className="mt-[0] sm:mt-[0]"
                              className2="mt-[0] sm:mt-[0]"
                              placeholder="Kategori adı giriniz"
                              onChange={(e) => updateCategory(index, "name", e)}
                            />

                            <div
                              className="border rounded p-2 cursor-pointer text-xl w-16 flex items-end justify-center"
                              onClick={() =>
                                setActivePicker(
                                  activePicker === index ? null : index
                                )
                              }
                            >
                              <p>{cat.icon || "🍽️"}</p>
                            </div>

                            {activePicker === index && (
                              <div className="absolute z-50 mt-2">
                                <EmojiPicker
                                  onEmojiClick={(emojiData) => {
                                    updateCategory(
                                      index,
                                      "icon",
                                      emojiData.emoji
                                    );
                                    setActivePicker(null);
                                  }}
                                />
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => removeCategory(index)}
                            className="text-[--red-1] font-semibold"
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

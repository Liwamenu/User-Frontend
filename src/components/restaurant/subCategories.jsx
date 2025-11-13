//MODULES
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//COMP
import CustomInput from "../common/customInput";
import { MenuI } from "../../assets/icon";

const SubCategories = ({ data: restaurant, subCatData }) => {
  const [subCategories, setSubCategories] = useState([
    { name: "", icon: "", index: 0 },
  ]);
  const [subCategoriesData, setSubCategoriesData] = useState(
    subCatData || [
      { name: "test", icon: "🍽️", index: 0 },
      { name: "test 2", icon: "🍽️", index: 1 },
    ]
  );
  const [isEdit, setIsEdit] = useState(true);
  const [activePicker, setActivePicker] = useState(null);

  // Add a new blank subcategory row
  const addSubCategory = () => {
    const items = isEdit ? [...subCategoriesData] : [...subCategories];
    const added = [...items, { name: "", icon: "", index: items.length }];
    const reindexed = added.map((item, i) => ({ ...item, index: i }));
    setSubCategories(reindexed);
  };

  // Update a field in a subcategory row
  const updateSubCategory = (index, key, value) => {
    isEdit
      ? setSubCategoriesData((prev) =>
          prev.map((subCat, i) =>
            i === index ? { ...subCat, [key]: value } : subCat
          )
        )
      : setSubCategories((prev) =>
          prev.map((subCat, i) =>
            i === index ? { ...subCat, [key]: value } : subCat
          )
        );
  };

  // Remove a subcategory row
  const removeSubCategory = (index) => {
    const items = isEdit ? [...subCategoriesData] : [...subCategories];
    const removed = items.filter((_, i) => i !== index);
    const reindexed = removed.map((item, i) => ({ ...item, index: i }));

    setSubCategories(reindexed);
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = isEdit ? [...subCategoriesData] : [...subCategories];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reindexed = items.map((item, i) => ({ ...item, index: i }));

    if (isEdit) {
      setSubCategoriesData(reindexed);
    } else {
      setSubCategories(reindexed);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(isEdit ? "It's Edit" : "It's Add", {
      restaurantId: restaurant.id,
      subCategories: isEdit ? subCategoriesData : subCategories,
    });
  };

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold">
          Alt Kategoriler{" "}
          <span className="text-[--primary-1]"> {restaurant.name} </span>
          Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Seçili kategori için alt kategorileri hızlıca eklemek veya
            düzenlemek için aşağıdaki seçenekleri kullanın.
          </p>
        </div>

        <div className=" flex gap-2 my-4">
          <button
            className={`${
              isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(true)}
          >
            Alt Kategorileri Düzenle
          </button>
          <button
            className={`${
              !isEdit ? "bg-[--primary-1] text-white p-2" : "bg-[--light-3] p-2"
            }`}
            onClick={() => setIsEdit(false)}
          >
            Alt Kategori Ekle
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 py-3 max-w-xl-">
          <div className="flex gap-4 max-sm:gap-2 items-end mb-4">
            <p className="w-8"></p> {/* Space for drag handle */}
            <p className="w-[19rem]">Alt Kategori Adı</p>
            <p className="w-full">Alt Kategori İkonu</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="subCategories">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {(isEdit ? subCategoriesData : subCategories).map(
                    (subCat, index) => (
                      <Draggable
                        key={subCat.id || index}
                        draggableId={subCat.id || `temp-id-${index}`}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex gap-4 max-sm:gap-2 items-end mb-4 ${
                              snapshot.isDragging ? "bg-[--light-1]" : ""
                            }`}
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
                                value={subCat.name}
                                className="mt-[0] sm:mt-[0]"
                                className2="mt-[0] sm:mt-[0]"
                                placeholder="Alt kategori adı giriniz"
                                onChange={(e) =>
                                  updateSubCategory(index, "name", e)
                                }
                              />
                              <div
                                className="border rounded p-2 cursor-pointer text-xl w-16 flex items-end justify-center"
                                onClick={() =>
                                  setActivePicker(
                                    activePicker === index ? null : index
                                  )
                                }
                              >
                                <p>{subCat.icon || "🍽️"}</p>
                              </div>
                              {activePicker === index && (
                                <div className="absolute z-50 mt-2">
                                  <EmojiPicker
                                    onEmojiClick={(emojiData) => {
                                      updateSubCategory(
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
                              onClick={() => removeSubCategory(index)}
                              className="text-[--red-1] font-semibold"
                            >
                              Sil
                            </button>
                          </div>
                        )}
                      </Draggable>
                    )
                  )}
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
                onClick={addSubCategory}
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

export default SubCategories;

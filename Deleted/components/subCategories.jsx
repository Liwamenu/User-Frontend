//MODULES
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//COMP
import CustomInput from "../common/customInput";
import { CloudUI, MenuI } from "../../assets/icon";
import CustomFileInput from "../common/customFileInput";
import CustomSelect from "../common/customSelector";
import dumyCategories from "../../assets/js/Categories";
import dummySubCategories from "../../assets/js/SubCategories";

const SubCategories = ({ data: restaurant, subCatData }) => {
  const [subCategories, setSubCategories] = useState([
    { name: "", icon: "", index: 0 },
  ]);
  const formattedCategories = dumyCategories.reduce((acc, cat) => {
    acc[cat.id] = dummySubCategories.filter(
      (subCat) => subCat.categoryId === cat.id
    );
    return acc;
  }, {});

  const [subCategoriesData, setSubCategoriesData] = useState(
    subCatData || formattedCategories
  );
  const [isEdit, setIsEdit] = useState(true);

  const formattedCategoriesForSelect = dumyCategories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    ...cat,
  }));

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

  console.log(Object.keys(formattedCategories)[0]);
  console.log(formattedCategories["xncd-sfsfsfs-gsgg23-skroewt"]);

  return (
    <div className="w-full py-5 mt-3 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold">
          Alt Kategoriler{" "}
          <span className="text-[--primary-1]"> {restaurant?.name} </span>
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
            <p className="w-full">Alt Kategori Görseli</p>
          </div>

          {Object.keys(formattedCategories).map((id) => (
            <div key={id}>
              <h2 className="text-lg font-semibold mb-2">
                {dumyCategories.find((cat) => cat.id === id)?.name ||
                  "Bilinmeyen Kategori"}
              </h2>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="subCategories">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {formattedCategories[id].map((subCat, index) => (
                        <Draggable
                          key={subCat.id || `temp-${subCat.sortOrder}`}
                          draggableId={subCat.id || `temp-${subCat.sortOrder}`}
                          index={subCat.sortOrder}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex gap-2 items-end ${
                                snapshot.isDragging ? "bg-[--light-1]" : ""
                              }`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="w-8 flex justify-center pb-3 cursor-move"
                              >
                                <MenuI className="text-gray-400 text-xl" />
                              </div>

                              {/* <div className="min-w-max w-full">
                                <CustomSelect
                                  required={true}
                                  placeholder="Kategori seç"
                                  className="text-sm"
                                  value={formattedCategoriesForSelect.find(
                                    (cat) =>
                                      isEdit
                                        ? cat.value === subCat.categoryId
                                        : {
                                            label: "Kategori Seçiniz",
                                            value: "",
                                          }
                                  )}
                                  options={formattedCategoriesForSelect}
                                  onChange={(selectedOption) => {
                                    updateSubCategory(
                                      index,
                                      "categoryId",
                                      selectedOption.value
                                    );
                                  }}
                                />
                              </div> */}

                              <div className="w-full">
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
                              </div>

                              <div className="max-w-md cursor-pointer w-full">
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
                                  value={subCat.image}
                                  onChange={(file) =>
                                    updateSubCategory(index, "image", file)
                                  }
                                  accept={"image/png, image/jpeg"}
                                  className="h-[3rem]"
                                />
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
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ))}

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

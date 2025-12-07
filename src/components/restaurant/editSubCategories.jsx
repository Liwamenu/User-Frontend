//MODULES
import { useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import isEqual from "lodash/isEqual";

//COMP
import { MenuI } from "../../assets/icon";
import CustomInput from "../common/customInput";
import { CustomFileInputMsg } from "./addSubCategories";
import CustomFileInput from "../common/customFileInput";

//DATA
import dumyCategories from "../../assets/js/Categories.json";
import dummySubCategories from "../../assets/js/SubCategories.json";

const EditSubCategories = ({ data: restaurant, subCatData }) => {
  // formattedCategories: { [categoryId]: [subCat...] }
  const formattedCategoriesInit = dumyCategories.categories.reduce(
    (acc, cat) => {
      acc[cat.id] = (subCatData || dummySubCategories.subCategories)
        .filter((s) => s.categoryId === cat.id)
        .map((sc, idx) => ({ ...sc, sortOrder: sc.sortOrder ?? idx }));
      return acc;
    },
    {}
  );

  const [subCategoriesData, setSubCategoriesData] = useState(
    subCatData ? formattedCategoriesInit : formattedCategoriesInit
  );

  // update name or image for a subcategory within its category
  const updateSubCategory = (categoryId, index, key, value) => {
    setSubCategoriesData((prev) => {
      const copy = { ...prev };
      const items = [...(copy[categoryId] || [])];
      items[index] = { ...items[index], [key]: value };
      copy[categoryId] = items;
      return copy;
    });
  };

  const removeSubCategory = (categoryId, index) => {
    setSubCategoriesData((prev) => {
      const copy = { ...prev };
      const items = [...(copy[categoryId] || [])];
      items.splice(index, 1);
      copy[categoryId] = items.map((it, i) => ({ ...it, sortOrder: i }));
      return copy;
    });
  };

  // allow drag/reorder but only inside same category (droppable per category)
  const handleDragEnd = (categoryId, result) => {
    if (!result.destination) return;
    const src = result.source.index;
    const dest = result.destination.index;

    setSubCategoriesData((prev) => {
      const copy = { ...prev };
      const items = [...(copy[categoryId] || [])];
      const [moved] = items.splice(src, 1);
      items.splice(dest, 0, moved);
      copy[categoryId] = items.map((it, i) => ({ ...it, sortOrder: i }));
      return copy;
    });
  };

  const handleSubmit = (e) => {
    //EXTRACT THE CHANGED ONES FROM ORIGINAL formattedCategoriesInit BEFORE CONVERTING TO FORMDATA AND SENDING
    e.preventDefault();

    // Build changed object by comparing current state with initial snapshot
    const changed = {};

    Object.keys(subCategoriesData).forEach((categoryId) => {
      const origList = formattedCategoriesInit[categoryId] || [];
      const currList = subCategoriesData[categoryId] || [];

      const diffs = [];

      // detect removed (present in orig, not in curr by id)
      origList.forEach((orig) => {
        if (orig?.id && !currList.find((c) => c.id === orig.id)) {
          diffs.push({ ...orig, _action: "removed" });
        }
      });

      // detect added or updated (match by id when possible, fallback to index)
      currList.forEach((curr, idx) => {
        const orig = curr?.id
          ? origList.find((o) => o.id === curr.id)
          : origList[idx];

        // helper: compare objects ignoring image file/url differences (compare non-image fields)
        const equalIgnoringImage = (a, b) => {
          if (!a || !b) return false;
          const aa = { ...a };
          const bb = { ...b };
          delete aa.image;
          delete bb.image;
          return isEqual(aa, bb);
        };

        if (!orig) {
          // new item
          diffs.push({ ...curr, _action: "added", sortOrder: idx });
        } else {
          // if non-image fields differ or sortOrder changed or image replaced -> updated
          const imageChanged =
            !!curr.image &&
            curr.image !== orig.image &&
            curr.image instanceof File;
          const contentChanged =
            !equalIgnoringImage(curr, orig) ||
            curr.sortOrder !== orig.sortOrder;
          if (imageChanged || contentChanged) {
            diffs.push({ ...curr, _action: "updated", sortOrder: idx });
          }
        }
      });

      if (diffs.length) changed[categoryId] = diffs;
    });

    // prepare FormData with only changes
    const formData = new FormData();
    formData.append("restaurantId", restaurant?.id ?? "");
    formData.append("subCategoriesChanges", JSON.stringify(changed));

    // append image files for changed items when provided as File
    Object.keys(changed).forEach((categoryId) => {
      (changed[categoryId] || []).forEach((item, idx) => {
        if (item.image && item.image instanceof File) {
          // use id if available, else index
          const key = `image_${categoryId}_${item.id ?? idx}`;
          formData.append(key, item.image);
        }
      });
    });

    // debug output
    console.log("Changed subCategories payload:", changed);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Alt Kategorileri Düzenle {restaurant?.name} Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Mevcut alt kategorileri düzenleyebilir, yeniden sıralayabilir veya
            silebilirsiniz. (Kategori değiştirme mümkün değildir.)
          </p>
        </div>

        <div className=" flex gap-2 my-4">
          <Link
            to={`/restaurant/sub_categories/${restaurant?.id}/edit`}
            className="bg-[--primary-1] text-white p-2"
          >
            Alt Kategorileri Düzenle
          </Link>
          <Link
            to={`/restaurant/sub_categories/${restaurant?.id}/add`}
            className="bg-[--light-3] p-2"
          >
            Alt Kategori Ekle
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 py-3">
          {Object.keys(subCategoriesData).map((categoryId) => (
            <div key={categoryId} className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                {dumyCategories.categories.find((c) => c.id === categoryId)
                  ?.name || "Bilinmeyen Kategori"}
              </h2>

              <DragDropContext
                onDragEnd={(result) => handleDragEnd(categoryId, result)}
              >
                <Droppable droppableId={categoryId}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {(subCategoriesData[categoryId] || []).map(
                        (subCat, index) => (
                          <Draggable
                            key={subCat.id || `temp-${categoryId}-${index}`}
                            draggableId={
                              subCat.id || `temp-${categoryId}-${index}`
                            }
                            index={index}
                          >
                            {(prov, snap) => (
                              <div
                                ref={prov.innerRef}
                                {...prov.draggableProps}
                                className={`flex gap-2 items-end mb-3 ${
                                  snap.isDragging ? "bg-[--light-1]" : ""
                                }`}
                              >
                                <div
                                  {...prov.dragHandleProps}
                                  className="w-8 flex justify-center pb-3 cursor-move"
                                >
                                  <MenuI className="text-gray-400 text-xl" />
                                </div>

                                <div className="w-full">
                                  <CustomInput
                                    required
                                    type="text"
                                    value={subCat.name}
                                    placeholder="Alt kategori adı"
                                    onChange={(v) =>
                                      updateSubCategory(
                                        categoryId,
                                        index,
                                        "name",
                                        v
                                      )
                                    }
                                    className="mt-[0] sm:mt-[0]"
                                    className2="mt-[0] sm:mt-[0]"
                                  />
                                </div>

                                <div className="max-w-md w-full">
                                  <CustomFileInput
                                    value={subCat.image}
                                    onChange={(file) =>
                                      updateSubCategory(
                                        categoryId,
                                        index,
                                        "image",
                                        file
                                      )
                                    }
                                    accept={"image/png, image/jpeg"}
                                    className="h-[3rem]"
                                    msg={<CustomFileInputMsg />}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSubCategory(categoryId, index)
                                  }
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
            </div>
          ))}

          <div className="flex justify-end mt-4">
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

export default EditSubCategories;

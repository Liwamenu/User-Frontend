//MODULES
import { isEqual } from "lodash";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//ICONS
import { DeleteI, EditI } from "../../../assets/icon";
import { DragI, StackI } from "../../../assets/icon";

//COMP
import SubCategoriesHeader from "./header";
import EditSubCategory from "./editSubCategory";
import DeleteSubCategory from "./deleteSubCategory";
import { usePopup } from "../../../context/PopupContext";

//JSON
import subCategoriesJSON from "../../../assets/js/SubCategories.json";
import categoriesJSON from "../../../assets/js/Categories.json";

//REDUX
import {
  updateSubOrders,
  resetUpdateSubOrders,
} from "../../../redux/subCategories/updateSubOrdersSlice";

const SubCategories = ({ data: restaurant }) => {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setPopupContent } = usePopup();

  // Mock selectors - replace with your actual Redux selectors
  const { subCategories } = useSelector((s) => s.subCategories.get);
  const { success, error } = useSelector(
    (s) => s.subCategories.updateSubOrders
  );

  // Store grouped data directly (array of category groups)
  const [subCategoriesData, setSubCategoriesData] = useState(null);
  const [subCategoriesDataBefore, setSubCategoriesDataBefore] = useState(null);

  // Helper: Convert flat array to grouped structure
  const groupSubCategories = (flatArray) => {
    const groups = {};

    flatArray.forEach((subCat) => {
      const categoryId = subCat.categoryId;
      if (!groups[categoryId]) {
        const category = categoriesJSON.categories.find(
          (c) => c.id === categoryId
        );
        groups[categoryId] = {
          category: category || { id: categoryId, name: "Bilinmeyen Kategori" },
          subCategories: [],
        };
      }
      groups[categoryId].subCategories.push(subCat);
    });

    // Convert to array and sort each group's subcategories by sortOrder
    return Object.values(groups).map((group) => ({
      ...group,
      subCategories: group.subCategories.sort(
        (a, b) => a.sortOrder - b.sortOrder
      ),
    }));
  };

  // Helper: Convert grouped structure back to flat array
  const flattenGroupedData = (groupedData) => {
    if (!groupedData) return [];
    return groupedData.flatMap((group) => group.subCategories);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Extract categoryId from droppableId (format: "subCategories#{categoryId}")
    const sourceCategoryId = source.droppableId.split("#")[1];
    const destCategoryId = destination.droppableId.split("#")[1];

    // Only allow reordering within same category
    if (sourceCategoryId !== destCategoryId) return;

    // Clone the groups array
    const updatedGroups = subCategoriesData.map((group) => {
      // Only update the group that matches the source category
      if (group.category.id !== sourceCategoryId) {
        return group;
      }

      // Clone subcategories array for this group
      const newSubCategories = Array.from(group.subCategories);

      // Perform the reorder
      const [movedItem] = newSubCategories.splice(source.index, 1);
      newSubCategories.splice(destination.index, 0, movedItem);

      // Update sortOrder for all items in this category
      const updatedSubCategories = newSubCategories.map((subCat, index) => ({
        ...subCat,
        sortOrder: index,
      }));

      return {
        ...group,
        subCategories: updatedSubCategories,
      };
    });

    setSubCategoriesData(updatedGroups);
  };

  const handleEditSubCategory = (updatedSubCategory) => {
    const updatedGroups = subCategoriesData.map((group) => ({
      ...group,
      subCategories: group.subCategories.map((subCat) =>
        subCat.id === updatedSubCategory.id
          ? { ...subCat, ...updatedSubCategory }
          : subCat
      ),
    }));

    setSubCategoriesData(updatedGroups);
    setSubCategoriesDataBefore(updatedGroups);
  };

  const handleDelete = (deletedSubCategoryId) => {
    const updatedGroups = subCategoriesData.map((group) => ({
      ...group,
      subCategories: group.subCategories
        .filter((subCat) => subCat.id !== deletedSubCategoryId)
        .map((subCat, index) => ({
          ...subCat,
          sortOrder: index, // Reassign sortOrder after deletion
        })),
    }));

    setSubCategoriesData(updatedGroups);
    setSubCategoriesDataBefore(updatedGroups);
  };

  const getStatusBadge = (value, type) => {
    const configs = {
      isActive: {
        true: { label: "Açık", class: "bg-[--status-green] text-[--green-1]" },
        false: { label: "Kapalı", class: "bg-[--status-gray] text-[--gr-1]" },
      },
    };

    const config = configs[type]?.[value];
    if (!config) return null;

    return (
      <span className={`px-3 py-1 rounded-full text-xs ${config.class}`}>
        {config.label}
      </span>
    );
  };

  const handleAddSubCategory = (subCategory) => {
    const updatedGroups = subCategoriesData.map((group) => {
      // Only add to the matching category group
      if (group.category.id !== subCategory.categoryId) {
        return group;
      }

      const maxSortOrder =
        group.subCategories.length > 0
          ? Math.max(...group.subCategories.map((sc) => sc.sortOrder))
          : -1;

      return {
        ...group,
        subCategories: [
          ...group.subCategories,
          {
            ...subCategory,
            sortOrder: maxSortOrder + 1,
          },
        ],
      };
    });

    setSubCategoriesData(updatedGroups);
    setSubCategoriesDataBefore(updatedGroups);
  };

  //GET SUBCATEGORIES - Replace with actual API call
  useEffect(() => {
    if (!subCategoriesData) {
      // dispatch(getSubCategories({ restaurantId: restaurant?.id }));
      // Mock data from JSON - convert to grouped structure
      const flatData = [...subCategoriesJSON.subCategories];
      const grouped = groupSubCategories(flatData);

      setSubCategoriesData(grouped);
      setSubCategoriesDataBefore(grouped);
    }
  }, [subCategoriesData, restaurant]);

  // TOAST
  useEffect(() => {
    if (success) {
      toast.success("Alt kategoriler başarıyla güncellendi.", {
        id: "subCategories",
      });
      setSubCategoriesDataBefore(subCategoriesData);
      dispatch(resetUpdateSubOrders());
    }
    if (error) {
      dispatch(resetUpdateSubOrders());
    }
  }, [success, error]);

  //SAVE NEW ORDER
  const saveNewOrder = (e) => {
    e?.preventDefault();

    if (isEqual(subCategoriesData, subCategoriesDataBefore)) {
      toast.error("Değişiklik yapılmadı.", { id: "subCategories" });
      return;
    }

    try {
      const formData = new FormData();

      // Flatten both current and before data for comparison
      const currentFlat = flattenGroupedData(subCategoriesData);
      const beforeFlat = flattenGroupedData(subCategoriesDataBefore);

      const changedOnes = currentFlat.filter((a) => {
        const original = beforeFlat.find((b) => b.id === a.id);
        return original && original.sortOrder !== a.sortOrder;
      });

      const dataToSend = changedOnes.map(({ id, categoryId, sortOrder }) => ({
        id,
        categoryId,
        sortOrder,
      }));

      formData.append("restaurantId", restaurant?.id);
      formData.append("subCategoriesData", JSON.stringify(dataToSend));

      console.log("Saving subcategories:", dataToSend);

      dispatch(updateSubOrders(formData));
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          {t("editSubCategories.title", { name: restaurant?.name })}
        </h1>

        <SubCategoriesHeader
          onSuccess={handleAddSubCategory}
          before={subCategoriesDataBefore}
          after={subCategoriesData}
          saveNewOrder={saveNewOrder}
        />

        <div className="space-y-4">
          {/* Render each category group */}
          {!subCategoriesData || subCategoriesData.length === 0 ? (
            <div className="p-8 text-center text-[--gr-1] italic bg-[--light-2] rounded-xl">
              Henüz bir alt kategori bulunmuyor.
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              {subCategoriesData.map((group) => (
                <div
                  key={group.category.id}
                  className="bg-[--light-4] border border-[--light-3] rounded-xl overflow-hidden"
                >
                  {/* Category Header */}
                  <div className="flex items-center gap-4 p-2 bg-[--light-3] border-b border-[--light-3]">
                    <div className="text-center text-[--primary-1]">
                      <StackI className="size-[1.1rem]" />
                    </div>

                    <div>
                      <p className="uppercase font-semibold text-xs tracking-wider text-[--black-2]">
                        {group.category.name}
                      </p>
                      <p className="text-xs text-[--primary-1] bg-[--status-primary-1] px-2 w-max rounded-md">
                        {group.subCategories.length} Alt Kategori
                      </p>
                    </div>
                  </div>

                  {/* SubCategory Rows */}
                  <Droppable droppableId={`subCategories#${group.category.id}`}>
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`${
                          snapshot.isDraggingOver ? "bg-[--light-3]" : ""
                        }`}
                      >
                        {group.subCategories.length === 0 ? (
                          <div className="p-8 text-center text-[--gr-1] italic">
                            Bu kategoride alt kategori bulunmuyor.
                          </div>
                        ) : (
                          group.subCategories.map((subCat, index) => (
                            <Draggable
                              key={subCat.id || `temp-${subCat.sortOrder}`}
                              draggableId={
                                subCat.id || `temp-${subCat.sortOrder}`
                              }
                              index={index}
                            >
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`p-4 grid grid-cols-[0.3fr_4fr_1fr_2fr] gap-4 items-center text-sm border-b border-[--light-3] last:border-b-0 group ${
                                    snapshot.isDragging
                                      ? "bg-[--white-1] px-2 py-1 border border-[--primary-1] border-dashed rounded-md"
                                      : "bg-[--white-1]"
                                  }`}
                                >
                                  <div className="flex justify-center text-[--gr-2] group-hover:text-[--primary-1] transition-colors cursor-move">
                                    <DragI className="size-5" />
                                  </div>

                                  {/* SubCategory Name & Product Count */}
                                  <div className="font-medium text-[--black-2] flex flex-col sm:flex-row sm:items-center gap-2">
                                    <span className="text-base font-semibold text-[--black-1]">
                                      {subCat.name}
                                    </span>
                                    <span className="text-xs text-[--primary-2] font-medium bg-[--status-primary-2] px-2 py-0.5 rounded-md w-fit">
                                      {subCat.productCount || 0} Ürün
                                    </span>
                                  </div>

                                  {/* Status */}
                                  <div className="text-center">
                                    {getStatusBadge(
                                      subCat.isActive,
                                      "isActive"
                                    )}
                                  </div>

                                  {/* Actions */}
                                  <div className="flex space-x-2 justify-end pr-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                    <button
                                      onClick={() =>
                                        setPopupContent(
                                          <EditSubCategory
                                            subCategory={subCat}
                                            onSuccess={handleEditSubCategory}
                                          />
                                        )
                                      }
                                      className="p-2 text-[--primary-1] bg-[--status-primary-1] hover:bg-[--status-primary-2] rounded-lg transition-colors"
                                      title="Düzenle"
                                    >
                                      <EditI
                                        className="size-[1.1rem]"
                                        strokeWidth={1}
                                      />
                                    </button>
                                    <button
                                      onClick={() => {
                                        setPopupContent(
                                          <DeleteSubCategory
                                            onSuccess={handleDelete}
                                            subCategory={subCat}
                                          />
                                        );
                                      }}
                                      className="p-2 text-[--red-1] bg-[--status-red] hover:bg-[--red-2] hover:text-white rounded-lg transition-colors"
                                      title="Sil"
                                    >
                                      <DeleteI
                                        className="size-[1.1rem]"
                                        strokeWidth={1}
                                      />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </DragDropContext>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubCategories;

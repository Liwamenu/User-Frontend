//MODULES
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

//COMP
import CustomInput from "../common/customInput";
import { CloudUI, MenuI } from "../../assets/icon";
import CustomFileInput from "../common/customFileInput";

//REDUX
import {
  addCategories,
  resetAddCategories,
} from "../../redux/categories/addCategoriesSlice";

const AddCategories = ({ data: restaurant }) => {
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(
    (state) => state.categories.add
  );
  const [categories, setCategories] = useState([
    { name: "", image: null, sortOrder: 0 },
  ]);

  // Add a new blank category row
  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      { name: "", image: null, sortOrder: prev.length },
    ]);
  };

  // Update field in a category row
  const updateCategory = (index, key, value) => {
    setCategories((prev) =>
      prev.map((cat, i) => (i === index ? { ...cat, [key]: value } : cat))
    );
  };

  // Remove a category row
  const removeCategory = (index) => {
    setCategories((prev) =>
      prev.filter((_, i) => i !== index).map((c, i) => ({ ...c, sortOrder: i }))
    );
  };

  // Handle drag end
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = [...categories];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the index values after reorder
    const updated = items.map((item, i) => ({ ...item, sortOrder: i }));
    setCategories(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      const payloadCategories = categories.map((cat) => {
        const { image, ...rest } = cat;
        return rest;
      });

      formData.append("restaurantId", restaurant?.id);
      formData.append("categoriesData", JSON.stringify(payloadCategories));

      categories.forEach((cat, index) => {
        if (cat.image) {
          formData.append(`image_${index}`, cat.image);
        }
      });

      console.log("Adding categories:", categories);
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      dispatch(addCategories(formData));
    } catch (error) {
      console.error("Error preparing form data:", error);
    }
  };

  // TOAST
  useEffect(() => {
    if (success) {
      toast.success("Kategoriler başarıyla eklendi.", { id: "categories" });
      setCategories([{ name: "", image: null, sortOrder: 0 }]);
      dispatch(resetAddCategories());
    }
  }, [success]);

  return (
    <div className="w-full pb-5 mt-1 bg-[--white-1] rounded-lg text-[--black-2]">
      <div className="flex flex-col px-4 sm:px-14">
        <h1 className="text-2xl font-bold bg-indigo-800 text-white py-4 -mx-4 sm:-mx-14 px-4 sm:px-14 rounded-t-lg">
          Kategori Ekle {restaurant?.name} Restoranı
        </h1>

        <div className="py-4">
          <p className="border border-[--border-1] p-2 rounded-md">
            Yeni kategoriler eklemek için aşağıdaki formu kullanın. Kategorileri
            sürükleyip bırakarak sıralayabilirsiniz.
          </p>
        </div>

        <div className="flex gap-2 my-4">
          <Link
            to={`/restaurant/categories/${restaurant?.id}/edit`}
            className="bg-[--light-3] p-2"
          >
            Kategorileri Düzenle
          </Link>
          <Link
            to={`/restaurant/categories/${restaurant?.id}/add`}
            className="bg-[--primary-1] text-white p-2"
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
                  {categories.map((cat, index) => (
                    <Draggable
                      key={`temp-${cat.sortOrder}`}
                      draggableId={`temp-${cat.sortOrder}`}
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

                          <div className="flex gap-4 max-sm:gap-1 w-full max-sm:flex-col">
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

                            <div className="flex-1 flex cursor-pointer">
                              {cat.image && (
                                <img
                                  src={URL.createObjectURL(cat.image)}
                                  alt={cat.name}
                                  className="h-[3rem] object-cover rounded"
                                />
                              )}
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
                                // showFileDetails={screen.width > 435}
                                sliceNameAt={
                                  screen.width < 435
                                    ? 10
                                    : screen.width < 1025
                                    ? 20
                                    : 40
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

          <div className="flex items-center pt-4 mt-6 justify-between">
            <button
              type="button"
              onClick={addCategory}
              className="px-6 py-2 rounded-md bg-[--primary-2] text-white font-semibold"
            >
              Ekle
            </button>

            <button
              type="submit"
              disabled={!categories?.length}
              className="px-6 py-2 rounded-md bg-[--primary-1] text-white font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategories;

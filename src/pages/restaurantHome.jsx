//MODULES
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useParams } from "react-router-dom";

//COMP
import Sidebar from "../components/subSidebar/subSidebar";

//REDUX
import {
  getRestaurant,
  resetGetRestaurantState,
} from "../redux/restaurants/getRestaurantSlice";

//PAGES
import NotFound from "./404";
import TestPage from "./test";
import EditRestaurant from "../components/restaurant/editRestaurant";
import WorkingHours from "../components/restaurant/workingHours";
import SocialMedias from "../components/restaurant/socialMedias";
import PaymentMethods from "../components/restaurant/paymentMethods";
import RestaurantSettings from "../components/restaurant/restaurantSettings";
import AddProducts from "../components/restaurant/addProducts";
import EditProduct from "../components/restaurant/editProduct";
import EditProducts from "../components/restaurant/editProducts";
import EditSubCategories from "../components/restaurant/editSubCategories";
import AddSubCategories from "../components/restaurant/addSubCategories";
import EditOrderTagsAndItems from "../components/restaurant/editOrderTagsAndItems";
import AddOrderTagsAndItems from "../components/restaurant/addOrderTagsAndItems";
import AddCategories from "../components/restaurant/addCategories";
import EditCategories from "../components/restaurant/editCategories";

const RestaurantHome = ({ showS1, setShowS1, openSidebar, setOpenSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = useParams()["*"].split("/")[1];

  const { restaurants } = useSelector(
    (state) => state.restaurants.getRestaurants
  );

  const { restaurant: stateRest, success } = useSelector(
    (state) => state.restaurants.getRestaurant
  );
  const { restaurant } = location?.state || {};
  const myRestaurant = restaurants?.data?.filter((r) => r.id === id)[0];
  const [data, setData] = useState(restaurant || myRestaurant);

  // Fetch restaurant if not in state
  useEffect(() => {
    if (!restaurant && !data) {
      dispatch(getRestaurant({ restaurantId: id }));
    }
  }, [data]);

  useEffect(() => {
    setShowS1(false);

    return () => {
      setShowS1(true);
    };
  }, []);

  // Update data when fetched
  useEffect(() => {
    if (success) {
      setData(stateRest);
      dispatch(resetGetRestaurantState());
    }
  }, [success]);

  return (
    <section className="bg-[--white-1]">
      {!showS1 && (
        <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      )}
      <section className="lg:ml-[280px] pt-16 px-[4%] pb-4 grid grid-cols-1 section_row">
        <Routes>
          <Route path="/edit/:id" element={<EditRestaurant data={data} />} />
          <Route path="/hours/:id" element={<WorkingHours data={data} />} />
          <Route path="/social/:id" element={<SocialMedias data={data} />} />
          <Route
            path="/payments/:id"
            element={<PaymentMethods data={data} />}
          />
          <Route
            path="/settings/:id"
            element={<RestaurantSettings data={data} />}
          />
          <Route
            path="/categories/:id/edit"
            element={<EditCategories data={data} />}
          />
          <Route
            path="/categories/:id/add"
            element={<AddCategories data={data} />}
          />
          <Route
            path="/sub_categories/:id/edit"
            element={<EditSubCategories data={data} />}
          />
          <Route
            path="/sub_categories/:id/add"
            element={<AddSubCategories data={data} />}
          />
          <Route
            path="/tags/:id/edit"
            element={<EditOrderTagsAndItems data={data} />}
          />
          <Route
            path="/tags/:id/add"
            element={<AddOrderTagsAndItems data={data} />}
          />
          <Route path="/products/:id" element={<EditProducts data={data} />} />
          <Route
            path="/products/:id/add-product"
            element={<AddProducts data={data} />}
          />
          <Route
            path="/products/:id/edit/:prodId"
            element={<EditProduct data={data} />}
          />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </section>
  );
};

export default RestaurantHome;

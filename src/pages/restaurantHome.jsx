//MODULES
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation, useParams } from "react-router-dom";

//COMP
import Sidebar from "../components/sidebar_2/sidebar_2";

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
import ProductCategories from "../components/restaurant/productCategories";
import ProductTags from "../components/restaurant/productTags";
import ManageProducts from "../components/restaurant/products";

const RestaurantHome = ({ showS1, setShowS1, openSidebar, setOpenSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = useParams()["*"].split("/")[1];
  const { restaurant } = location?.state || {};
  const [data, setData] = useState(restaurant);
  const { restaurant: stateRest, success } = useSelector(
    (state) => state.restaurants.getRestaurant
  );

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

  useEffect(() => {
    if (success) {
      setData(stateRest);
      console.log(data);
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
            path="/categories/:id"
            element={<ProductCategories data={data} />}
          />
          <Route path="/tags/:id" element={<ProductTags data={data} />} />
          <Route
            path="/products/:id"
            element={<ManageProducts data={data} />}
          />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </section>
  );
};

export default RestaurantHome;

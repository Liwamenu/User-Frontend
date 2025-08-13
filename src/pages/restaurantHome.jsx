//MODULES
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, useParams } from "react-router-dom";

//COMP
import Sidebar from "../components/sidebar_2/sidebar_2";

//PAGES
import NotFound from "./404";
import TestPage from "./test";
import EditRestaurant from "../components/restaurant/editRestaurant";
import { useDispatch } from "react-redux";
import { getRestaurant } from "../redux/restaurants/getRestaurantSlice";

const RestaurantHome = ({ showS1, setShowS1, openSidebar, setOpenSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const id = useParams()["*"].split("/")[1];
  const { restaurant } = location?.state || {};
  const [data, setData] = useState(restaurant);

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
  return (
    <section className="bg-[--white-1]">
      {!showS1 && (
        <Sidebar openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
      )}
      <section className="lg:ml-[280px] pt-16 px-[4%] pb-4 grid grid-cols-1 section_row">
        <Routes>
          <Route path="/edit/:id" element={<EditRestaurant data={data} />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </section>
    </section>
  );
};

export default RestaurantHome;

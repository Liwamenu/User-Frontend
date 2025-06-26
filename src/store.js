import { configureStore } from "@reduxjs/toolkit";

// INDEX
import authSlice from "./redux/auth";
import dataSlice from "./redux/data";
// import generalVariablesSlice from "./redux/generalVars";
// import licensePackagesSlice from "./redux/licensePackages";
// import licensesSlice from "./redux/licenses";
// import restaurantsSlice from "./redux/restaurants";
// import userSlice from "./redux/user";
// import getContextSlice from "./redux/payTR/getContextSlice";
// import cartSlice from "./redux/cart/cartSlice";
// import ordersSlice from "./redux/orders";
// import getirYemekSlice from "./redux/getirYemek";
// import dashboardSlice from "./redux/dashboard";
// import couriersSlice from "./redux/couriers";
// import integrationInformationsSlice from "./redux/informations";
// import yemekSepetiSlice from "./redux/yemekSepeti";
// import paymentsSlice from "./redux/payments";
// import messagesSlice from "./redux/messages";
// import migrosYemekSlice from "./redux/migrosYemek";
// import smsSlice from "./redux/sms";
// import emailSlice from "./redux/email";
// import marketplaceRestaurantsSlice from "./redux/marketplaceRestaurants";
import loadingSlice from "./redux/loadingSlice";
import loadingMiddleware from "../middlewares/loadingMiddleware";

const store = configureStore({
  reducer: {
    auth: authSlice,
    // user: userSlice,
    // restaurants: restaurantsSlice,
    // licenses: licensesSlice,
    // licensePackages: licensePackagesSlice,
    data: dataSlice,
    // generalVars: generalVariablesSlice,
    // getContext: getContextSlice,
    // cart: cartSlice,
    // orders: ordersSlice,
    // getirYemek: getirYemekSlice,
    // yemekSepeti: yemekSepetiSlice,
    // migrosYemek: migrosYemekSlice,
    // dashboard: dashboardSlice,
    // couriers: couriersSlice,
    // payments: paymentsSlice,
    // integrationInfos: integrationInformationsSlice,
    // messages: messagesSlice,
    // sms: smsSlice,
    // email: emailSlice,
    // marketplaceRestaurants: marketplaceRestaurantsSlice,
    isLoading: loadingSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loadingMiddleware),
});

export default store;

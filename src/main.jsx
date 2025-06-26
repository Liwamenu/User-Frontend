import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";
import toastOptions from "../config/toast.js";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store.js";
import { PopupProvider } from "./context/PopupContext.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <PopupProvider>
        <App />
        <Toaster toastOptions={toastOptions} />
      </PopupProvider>
    </BrowserRouter>
  </Provider>
);

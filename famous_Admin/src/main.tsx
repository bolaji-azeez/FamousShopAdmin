import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";               // Redux provider
import { store } from "./store/store";                  // Your Redux store
import { RouterProvider } from "react-router-dom";
import  { Toaster }  from "sonner";          // 
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes/AppRouter";          // Your app router

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster position="top-right" autoClose={3000} />
    </Provider>
  </StrictMode>
);


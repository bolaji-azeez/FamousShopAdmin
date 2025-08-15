import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";               // Redux provider
import { store, persistor } from "./store/store";                  // Your Redux store
import { RouterProvider } from "react-router-dom";
import  { Toaster }  from "sonner";          // 
import "react-toastify/dist/ReactToastify.css";
import { router } from "./routes/AppRouter";   
import { PersistGate } from "redux-persist/integration/react";       // Your app router

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
      </PersistGate>
    </Provider>
  </StrictMode>
);


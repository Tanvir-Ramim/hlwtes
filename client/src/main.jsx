import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Toaster } from 'react-hot-toast'
createRoot(document.getElementById("root")).render(
  <>
     <Provider store={store}>
      <App />
      <Toaster></Toaster>
      <ToastContainer />
    </Provider>
  </>
);

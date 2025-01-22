import React from "react";
import { RouterProvider, ScrollRestoration } from "react-router-dom";
import { router } from "./routes/Routes";

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
     
    </>
  );
};

export default App;

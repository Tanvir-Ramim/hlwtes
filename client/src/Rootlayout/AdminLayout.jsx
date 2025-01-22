import React from "react";
import Sidebar from "../components/admin/sidebar/Sidebar";
import { Outlet, ScrollRestoration } from "react-router-dom";
import Header from "../components/admin/Header/Header";

const AdminLayout = () => {
  return (
    <>
      <div className="grid grid-cols-12   h-full  min-h-screen">
        <div className="col-span-2 bg-[#eee] h-full  min-h-screen">
          <Sidebar />
        </div>
        <div className="col-span-10   h-fit">
          <Header />
          <div className="p-8  h-full min-h-screen ">
            <Outlet />
            <ScrollRestoration />
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;

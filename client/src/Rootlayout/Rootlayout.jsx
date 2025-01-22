import React, { useEffect } from "react";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Sidebar from "../components/employee/Sidebar/Sidebar";
import Header from "../components/employee/Header/Header";
import { useDispatch, useSelector } from "react-redux";
import ApiClient from "../axios/ApiClient";
import { logoutUser } from "../redux/authSlice";

const Rootlayout = () => {
  const location = useLocation();
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logoutUser());
  };

  const getEmp = async () => {
    try {
      const res = await ApiClient.get(`/user/${user?._id}`);
      if (res.status === 200) {
        if (!res.data.data?.login_access) {
          handleLogOut();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getEmp();
  }, [location]);
  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-2 h-full min-h-screen">
          <Sidebar />
        </div>
        <div className="col-span-10">
          <Header />
          <div className="p-8">
            <Outlet />
            <ScrollRestoration />
          </div>
        </div>
      </div>
    </>
  );
};

export default Rootlayout;

import React from "react";
import TypeIcon from "../../Icon/Icons";
import user from "../Header/assets/user.jpg";
import { useDispatch, useSelector } from "react-redux";

import { logoutUser } from "../../../redux/authSlice";
import { Link } from "react-router-dom";

const Header = () => {
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
  const today = new Date();
  const mx = today.toLocaleString("en-BD", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",

    hour12: false,
    timeZone: "Asia/Dhaka",
  });
  return (
    <>
      <div className="p-5 bg-[#eee]">
        <div className="flex justify-end">
          <div className="flex gap-8 items-center">
            <div>
              <div className="bg-black w-[80px] h-[80px] rounded-full">
                <picture>
                  <img
                   src={
                    user?.url?.url ||
                    (user?.gender === "Male"
                      ? "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VV7dlZvxOseZJqh0baBIHNre1tzNjcZpXQ&s")
                  }
                    alt="user"
                    className="w-full h-full rounded-full"
                  />
                </picture>
              </div>
            </div>
            <div className="border-r border-black pr-4">
              <p className="text-base text-[#676767] capitalize font-medium ">
                {user?.name}
              </p>
              <p className="text-base text-[#676767] capitalize font-light ">
                {user?.role} {user?.designation}
              </p>
              <p className="text-base text-[#676767] capitalize font-light ">
                {user?.employee_id}
              </p>
              {/* <p className="text-base text-[#676767] capitalize font-light ">
                {mx}
              </p> */}
            </div>
            <div
              onClick={handleLogOut}
              className="text-primary cursor-pointer text-2xl font-bold underline text-center "
            >
              {user ? (
                <span>
                  <TypeIcon type="LogOut" />
                </span>
              ) : (
                <Link to="login">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;

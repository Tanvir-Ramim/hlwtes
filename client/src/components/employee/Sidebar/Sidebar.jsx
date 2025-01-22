import React, { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import weepokaLogo from "../../../assets/main-logo.png";
import TypeIcon from "../../Icon/Icons";
import { format, startOfMonth } from "date-fns";
import { MdHolidayVillage } from "react-icons/md";
import { RiTeamLine } from "react-icons/ri";
const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for programmatic navigation

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth - 1));

  useEffect(() => {
    // Set the active route based on the current location
    setActiveRoute(location.pathname);
  }, [location]);

  const handleDropdownClick = (dropdown, defaultRoute) => {
    // Toggle dropdown and close others
    if (activeDropdown === dropdown) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(dropdown);
      // Navigate to the first route in the dropdown and set it as active
      setActiveRoute(defaultRoute);
      navigate(defaultRoute); // Navigate programmatically
    }
  };

  const handleRouteClick = (route) => {
    // Set active route when clicked
    setActiveRoute(route);
    navigate(route); // Navigate programmatically
  };

  return (
    <div className="bg-[#eee] p-5 h-full flex flex-col border-r-primary/20 border-r-[1px]">
      {/* Logo */}
      <div className=" mx-auto">
        <a href="/">
          <img
            src={weepokaLogo}
            alt="Weepoka logo"
            className="w-full h-full p-2"
          />
        </a>
      </div>

      <div className="flex flex-col justify-center  mt-5 space-y-4 items-center pt-10">
        <div>
          {/* Dashboard */}
          <Link to="/" onClick={() => handleRouteClick("/")}>
            <div
              className={`flex items-center gap-4 py-2 group hover:bg-[#f1f1f1] rounded-md px-3 duration-300 ${
                activeRoute === "/" ? "text-blue-500 " : ""
              }`}
            >
              <span className="group-hover:text-primary duration-300">
                <TypeIcon type="analytics" />
              </span>
              <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                Dashboard
              </p>
            </div>
          </Link>

          {/* My Day */}
          <Link to="my-day" onClick={() => handleRouteClick("/my-day")}>
            <div
              className={`flex items-center gap-4 py-2 group hover:bg-[#f1f1f1] rounded-md px-3 duration-300 ${
                activeRoute === "/my-day" ? "text-blue-500 " : ""
              }`}
            >
              <span className="group-hover:text-primary duration-300">
                <TypeIcon type="ViewDay" />
              </span>
              <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                My Day
              </p>
            </div>
          </Link>

          {/* Manage Attendance */}
          <div className="py-2 group">
            <div
              className="flex items-center gap-4 justify-between px-3 py-2 hover:bg-[#f1f1f1] rounded-md cursor-pointer duration-300"
              onClick={
                () =>
                  handleDropdownClick("attendance", "/correction-attendence") // Pass the first route
              }
            >
              <div className="flex items-center gap-4">
                <span className="group-hover:text-primary duration-300">
                  <TypeIcon type="Calendar" />
                </span>
                <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                  Manage Attendance
                </p>
              </div>
              <span className="pl-5 text-black group-hover:text-primary duration-300">
                <TypeIcon type="downArrow" />
              </span>
            </div>

            <div
              className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                activeDropdown === "attendance"
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Link
                to="/correction-attendence"
                onClick={() => handleRouteClick("/correction-attendence")}
              >
                <p
                  className={`text-sm cursor-pointer font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/correction-attendence"
                      ? "text-blue-500"
                      : ""
                  }`}
                >
                  Correction Attendance
                </p>
              </Link>
              <Link
                to="/correction-list"
                onClick={() => handleRouteClick("/correction-list")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/correction-list" ? "text-blue-500" : ""
                  }`}
                >
                  Correction List
                </p>
              </Link>
              <Link
                to="/daily-attendence"
                onClick={() => handleRouteClick("/daily-attendence")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/daily-attendence" ? "text-blue-500" : ""
                  }`}
                >
                  Daily Report ( {format(firstDayOfMonth, "MMMM yyyy")} )
                </p>
              </Link>
              <Link
                to="/monthly-attendence"
                onClick={() => handleRouteClick("/monthly-attendence")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/monthly-attendence" ? "text-blue-500" : ""
                  }`}
                >
                  Monthly Report
                </p>
              </Link>
            </div>
          </div>

          {/* Manage Leave */}
          <div className="py-2 group">
            <div
              className="flex items-center gap-4 justify-between px-3 py-2 hover:bg-[#f1f1f1] rounded-md cursor-pointer duration-300"
              onClick={() => handleDropdownClick("leave", "/leave-application")} // Pass first route
            >
              <div className="flex items-center gap-4">
                <span className="group-hover:text-primary duration-300">
                  <TypeIcon type="dayOff" />
                </span>
                <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                  Manage Leave
                </p>
              </div>
              <span className="pl-5 text-black group-hover:text-primary duration-300">
                <TypeIcon type="downArrow" />
              </span>
            </div>

            <div
              className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                activeDropdown === "leave"
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Link
                to="/leave-application"
                onClick={() => handleRouteClick("/leave-application")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/leave-application" ? "text-blue-500" : ""
                  }`}
                >
                  Leave Application
                </p>
              </Link>
              <Link
                to="/leave-list"
                onClick={() => handleRouteClick("/leave-list")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/leave-list" ? "text-blue-500" : ""
                  }`}
                >
                  Leave List
                </p>
              </Link>
              <Link
                to="/yearly-leave"
                onClick={() => handleRouteClick("/yearly-leave")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/yearly-leave" ? "text-blue-500" : ""
                  }`}
                >
                  Yearly Leave & Holiday
                </p>
              </Link>
            </div>
          </div>

          {/* Holidays */}
          <div className="py-2 group">
            <div
              className="flex items-center gap-4 justify-between px-3 py-2 hover:bg-[#f1f1f1] rounded-md cursor-pointer duration-300"
              onClick={() => handleDropdownClick("holidays", "/govt-holidays")} // Pass first route
            >
              <div className="flex items-center gap-4">
                <span className="group-hover:text-primary duration-300">
                  <MdHolidayVillage />
                </span>
                <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                  Holidays
                </p>
              </div>
              <span className="pl-5 text-black group-hover:text-primary duration-300">
                <TypeIcon type="downArrow" />
              </span>
            </div>

            <div
              className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                activeDropdown === "holidays"
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <Link
                to="/govt-holidays"
                onClick={() => handleRouteClick("/govt-holidays")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/govt-holidays" ? "text-blue-500" : ""
                  }`}
                >
                  General Holiday
                </p>
              </Link>
              <Link
                to="/weekly-holidays"
                onClick={() => handleRouteClick("/weekly-holidays")}
              >
                <p
                  className={`text-sm font-normal text-black capitalize py-2 hover:bg-[#eeeff] rounded-md duration-300 ${
                    activeRoute === "/weekly-holidays" ? "text-blue-500" : ""
                  }`}
                >
                  Weekly Holidays
                </p>
              </Link>
            </div>
          </div>

          {/* Announcement */}
          <Link
            to="employe-announcement"
            onClick={() => handleRouteClick("/employe-announcement")}
          >
            <div
              className={`flex items-center gap-4 py-2 group hover:bg-[#f1f1f1] rounded-md px-3 duration-300 ${
                activeRoute === "/employe-announcement" ? "text-blue-500 " : ""
              }`}
            >
              <span className="group-hover:text-primary duration-300">
                <TypeIcon type="notification" />
              </span>
              <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                Announcement
              </p>
            </div>
          </Link>
          <Link to="team" onClick={() => handleRouteClick("/team")}>
            <div
              className={`flex items-center gap-4 py-2 group hover:bg-[#f1f1f1] rounded-md px-3 duration-300 ${
                activeRoute === "/team" ? "text-blue-500 " : ""
              }`}
            >
              <span className="group-hover:text-primary duration-300">
                <RiTeamLine />
              </span>
              <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-300">
                My Team
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="mt-20 h-full  flex items-end ">
        <div>
          <div className="flex gap-4 pb-3 justify-center py-">
            <Link to="/facebook">
              <TypeIcon
                type="facebook"
                className="text-xl text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
            <Link to="/google">
              <TypeIcon
                type="google"
                className="text-xl text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
            <Link to="/whatsapp">
              <TypeIcon
                type="whatsapp"
                className="text-xl text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
            <Link to="/phone">
              <TypeIcon
                type="phone"
                className="text-lg text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
          </div>
          <p className="text-center text-sm text-gray-400">
            © Copyright 2024 . All Rights Reserved by Weepoka
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

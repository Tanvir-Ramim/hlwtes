import React, { useState } from "react";
import weepokaLogo from "../../../assets/main-logo.png";
import TypeIcon from "../../Icon/Icons";
import { Link, useLocation } from "react-router-dom";
import { format, startOfMonth } from "date-fns";
import Icon from "../../../components/Icon/Icons";
const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  let [attendance, setAttendence] = useState(false);
  let [leave, setleave] = useState(false);
  let [setting, setsetting] = useState(false);
  let [employee, setemployee] = useState(false);
  let [report, setReport] = useState(false);
  let [holiday, setHoliday] = useState(false);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth - 1));
  let handleattendance = () => {
    setsetting(false);
    setAttendence(!attendance);
    setleave(false);
    setemployee(false);
    setReport(false);
    setHoliday(false);
  };
  let handleleave = () => {
    setsetting(false);
    setAttendence(false);
    setleave(!leave);
    setemployee(false);
    setReport(false);
    setHoliday(false);
  };
  let handleemployee = () => {
    setsetting(false);
    setAttendence(false);
    setleave(false);
    setemployee(!employee);
    setReport(false);
    setHoliday(false);
  };
  let handlereport = () => {
    setsetting(false);
    setAttendence(false);
    setleave(false);
    setemployee(false);
    setHoliday(false);
    setReport(!report);
  };
  // //////////////////////////////////////
  let handleHoliday = () => {
    setsetting(false);
    setAttendence(false);
    setleave(false);
    setemployee(false);
    setReport(false);
    setHoliday(!holiday);
  };
  let handlesetting = () => {
    setsetting(!setting);
    setAttendence(false);
    setleave(false);
    setemployee(false);
    setReport(false);
    setHoliday(false);
  };
  return (
    <>
      <div className="bg-[#eee] p-5  h-full border flex flex-col justify-between border-r-primary/20 border-r-[1px]">
        <div className="">
          <div className="mx-auto ">
            <picture>
              <Link to={"/admin"}>
                <img
                  src={weepokaLogo}
                  alt="weepoka logo"
                  className="w-full h-full p-2"
                />
              </Link>
            </picture>
            <p className="ml-8 font-bold text-[#004282]">Version 2.1</p>
          </div>
          <div className="flex flex-col justify-center mt-5 space-y-4 items-center pt-10">
            <div className="cursor-pointer">
              <Link to="/admin/dashboard">
                <div
                  className={`flex items-center gap-4  py-2 group duration-500 ${
                    isActive("/admin/dashboard")
                      ? "bg-gray-300 text-white px-2"
                      : ""
                  }`}
                >
                  <span className="group-hover:text-primary duration-200">
                    <TypeIcon type="analytics" />
                  </span>
                  <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                    Dashboard
                  </p>
                </div>
              </Link>
              <Link to="/admin/my-day">
                <div
                  className={`flex items-center gap-4 py-2 group duration-500 ${
                    isActive("/admin/my-day")
                      ? "bg-gray-300 text-white px-2"
                      : ""
                  }`}
                >
                  <span className="group-hover:text-primary duration-200">
                    <TypeIcon type="ViewDay" />
                  </span>
                  <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                    My Day
                  </p>
                </div>{" "}
              </Link>
              <div className=" group">
                <Link to="/admin/correction-attendance">
                  <div
                    onClick={() => handleattendance()}
                    className={`flex items-center gap-4 justify-between py-2 duration-500 ${
                      isActive("/admin/correction-attendance")
                        ? "bg-gray-300 text-white px-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="group-hover:text-primary duration-200">
                        <TypeIcon type="Calendar" />
                      </span>
                      <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                        Manage attendance
                      </p>
                    </div>
                    <span className="pl-5 text-black group-hover:text-primary duration-200">
                      <TypeIcon type="downArrow" />
                    </span>
                  </div>
                </Link>
                <div
                  className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                    attendance ? "max-h-56 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {/* <Link to="/admin/correction-attendence">
                    <p
                      className={`text-base font-normal capitalize py-2 hover:bg-[#eeeff] duration-500 ${
                        isActive("/admin/correction-attendence")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Correction Attendance
                    </p>
                  </Link> */}
                  {/* <Link to="/admin/new-attendence">
                    <p
                      className={`text-base font-normal capitalize py-2 hover:bg-[#eeeff] duration-500 ${
                        isActive("/admin/new-attendence")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Add Attendance
                    </p>
                  </Link> */}

                  <Link to="/admin/correction-attendance">
                    <p
                      className={`text-base font-normal capitalize py-2 hover:bg-[#eeeff] duration-500 ${
                        isActive("/admin/correction-attendance")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                     Correction Attendance
                    </p>
                  </Link>
                  <Link to="/admin/monthly-attendance">
                    <p
                      className={`text-base font-normal capitalize py-2 hover:bg-[#eeeff] duration-500 ${
                        isActive("/admin/monthly-attendance")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Monthly Attendance Creation
                      {/* <br />( {format(firstDayOfMonth, "MMMM yyyy")}) */}
                    </p>
                  </Link>
                </div>
              </div>
              <div className="group">
                <Link to="/admin/leave-application">
                  <div
                    onClick={() => handleleave()}
                    className={`flex items-center gap-4 justify-between py-2 duration-500 ${
                      isActive("/admin/leave-application")
                        ? "bg-gray-300 text-white px-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="group-hover:text-primary duration-200">
                        <TypeIcon type="dayOff" />
                      </span>
                      <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                        Manage Leave
                      </p>
                    </div>
                    <span className="pl-5 text-black group-hover:text-primary duration-200">
                      <TypeIcon type="downArrow" />
                    </span>
                  </div>
                </Link>
                <div
                  className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                    leave ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <Link to="/admin/leave-application">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/leave-application")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Leave Application
                    </p>
                  </Link>
                  <Link to="/admin/leave-list">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/leave-list")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Leave Request
                    </p>
                  </Link>
                  <Link to="/admin/absent">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/absent")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Absent History
                    </p>
                  </Link>
                </div>
              </div>

              <div className="group">
                <Link to="/admin/add-employee">
                  <div
                    onClick={() => handleemployee()}
                    className={`flex items-center gap-4 justify-between py-2 duration-500 ${
                      isActive("/admin/add-employee")
                        ? "bg-gray-300 text-white px-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="group-hover:text-primary duration-200">
                        <TypeIcon type="users" />
                      </span>

                      <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                        Employee
                      </p>
                    </div>
                    <span className="pl-5 text-black group-hover:text-primary duration-200">
                      <TypeIcon type="downArrow" />
                    </span>
                  </div>
                </Link>
                <div
                  className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                    employee ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {" "}
                  <Link to="/admin/add-employee">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/add-employee")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Add Employee
                    </p>
                  </Link>
                  <Link to="/admin/employee-list">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/employee-list")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Employee List
                    </p>
                  </Link>
                  <Link to="/admin/home-office">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/home-office")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Home Office
                    </p>
                  </Link>
                </div>
              </div>
              <Link to="/admin/anouncement">
                <div
                  className={`flex items-center gap-4 py-2 group duration-500 ${
                    isActive("/admin/anouncement")
                      ? "bg-gray-300 text-white px-2"
                      : ""
                  }`}
                >
                  <span className="group-hover:text-primary duration-200">
                    <TypeIcon type="notification" />
                  </span>
                  <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                    Announcement List
                  </p>
                </div>{" "}
              </Link>
              {/* <Link to="/admin/weekly-holidays">
                <div
                  className={`flex items-center gap-4 py-2 group duration-500 ${
                    isActive("/admin/weekly-holidays")
                      ? "bg-gray-300 text-white px-2"
                      : ""
                  }`}
                >
                  <span className="group-hover:text-primary duration-200">
                    <TypeIcon type="holiday" />
                  </span>
                  <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                    Weekly Holidy
                  </p>
                </div>{" "}
              </Link> */}
              <div className=" group">
                <Link to="/admin/weekly-holidays">
                  <div
                    onClick={() => handleHoliday()}
                    className={`flex items-center gap-4 py-2 group justify-between duration-500 ${
                      isActive("/admin/weekly-holidays")
                        ? "bg-gray-300 text-white px-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="group-hover:text-primary duration-200">
                        <TypeIcon type="holiday" />
                      </span>
                      <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                        Holiday
                      </p>
                    </div>
                    <span className="pl-5 text-black group-hover:text-primary duration-200">
                      <TypeIcon type="downArrow" />
                    </span>
                  </div>
                </Link>
                <div
                  className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                    holiday ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <Link to="/admin/weekly-holidays">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/weekly-holidays")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Weekly Holiday
                    </p>
                  </Link>
                  <Link to="/admin/govt-holidays">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/govt-holidays")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      General Holiday
                    </p>
                  </Link>
                </div>
              </div>
              <div className=" group">
                <Link to="/admin/report">
                  <div
                    onClick={() => handlereport()}
                    className={`flex items-center gap-4 py-2 group justify-between duration-500 ${
                      isActive("/admin/report")
                        ? "bg-gray-300 text-white px-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="group-hover:text-primary duration-200">
                        <TypeIcon type="report" />
                      </span>
                      <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                        Report
                      </p>
                    </div>
                    <span className="pl-5 text-black group-hover:text-primary duration-200">
                      <TypeIcon type="downArrow" />
                    </span>
                  </div>
                </Link>
                <div
                  className={`pl-8 transition-all duration-500 ease-in-out overflow-hidden ${
                    report ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <Link to="/admin/report">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/report")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Attendence Report
                    </p>
                  </Link>
                  <Link to="/admin/daily-attendence">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/daily-attendence")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Daily Attendence
                    </p>
                  </Link>
                  <Link to="/admin/leave-report">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/leave-report")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Monthly Leave
                    </p>
                  </Link>
                  <Link to="/admin/yearly-leave">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/yearly-leave")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Yearly Leave & Holiday
                    </p>
                  </Link>
                  <Link to="/admin/leave-overview">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/leave-overview")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Leave Overview
                    </p>
                  </Link>
                </div>
              </div>
              <div className="group">
                <Link to="/admin/department">
                  <div
                    onClick={() => handlesetting()}
                    className={`flex items-center gap-4 py-2 group justify-between ${
                      isActive("/admin/department")
                        ? "bg-gray-300 text-white px-2"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="group-hover:text-primary duration-200">
                        <TypeIcon type="Settings" />
                      </span>
                      <p className="text-base font-semibold text-black capitalize group-hover:text-primary duration-200">
                        settings
                      </p>
                    </div>
                    <span className="pl-5 text-black group-hover:text-primary duration-200">
                      <TypeIcon type="downArrow" />
                    </span>
                  </div>
                </Link>
                <div
                  className={`pl-8 transition-all duration-500 ease-in-out  ${
                    setting ? "max-h- opacity-100 " : "max-h-0 opacity-0 hidden"
                  }`}
                >
                  <Link to="/admin/department">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/department")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Department
                    </p>
                  </Link>
                  <Link to="/admin/manage-ip">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/manage-ip")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Manage IP
                    </p>
                  </Link>
                  <Link to="/admin/working-hour">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/working-hour")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Office hour
                    </p>
                  </Link>
                  <Link to="/admin/week-plan">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/week-plan")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Work Plan
                    </p>
                  </Link>
                  <Link to="/admin/leave-types">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/leave-types")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Leave Types
                    </p>
                  </Link>

                  <Link to="/admin/add-categories">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/add-categories")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Add Categories{" "}
                    </p>
                  </Link>
                  <Link to="/admin/add-leave-notification">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/add-leave-notification")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Add Leave Rule{" "}
                    </p>
                  </Link>

                  {/* <p className="text-base font-normal text-black capitalize pt-3">
                  <Link to="/admin/attendence-collection">
                    Attendence penalty
                  </Link>
                </p> */}
                  {/* <p className="text-base font-normal text-black capitalize pt-3 hover:bg-[#eeeff] duration-500 ">
                  <Link to="/admin/govt-holidays">Govt Holidays</Link>
                </p> */}
                  <Link to="/admin/add-announcement">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/add-announcement")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Add Announcement
                    </p>
                  </Link>
                  <Link to="/admin/add-holidays">
                    <p
                      className={`text-base font-normal text-black capitalize py-2 hover:bg-[#eeeff] duration-500${
                        isActive("/admin/add-holidays")
                          ? " text-blue-400 font-bold px-4"
                          : ""
                      }`}
                    >
                      Add Holidays
                    </p>
                  </Link>

                  {/* <p className="text-base font-normal text-black capitalize pt-2">
                  <Link to="/admin/employee-attendence">
                    Employee attendence
                  </Link>
                </p> */}
                  {/* <p className="text-base font-normal text-black capitalize pt-2">
                  <Link to="/admin/leave-notice">leave notice</Link>
                </p> */}
                </div>
              </div>
            </div>
          </div>{" "}
        </div>
        <div>
          <div className="flex gap-4 justify-center py-5">
            <Link to="/facebook">
              <Icon
                type="facebook"
                className="text-xl text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
            <Link to="/google">
              <Icon
                type="google"
                className="text-xl text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
            <Link to="/whatsapp">
              <Icon
                type="whatsapp"
                className="text-xl text-primary hover:text-gray-900 hover:scale-110 duration-200"
              />
            </Link>
            <Link to="/phone">
              <Icon
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
    </>
  );
};

export default Sidebar;

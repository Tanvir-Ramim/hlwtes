import React, { useEffect, useState } from "react";
import { holidays, hrYear, sickleave } from "./constants";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";
import useEmployee from "../../../hooks/useEmployee";
import {
  FaCalendarAlt,
  FaSignInAlt,
  FaLocationArrow,
  FaIdBadge,
  FaEnvelope,
  FaClock,
  FaHourglassEnd,
  FaSignOutAlt,
  FaCalendarDay,
} from "react-icons/fa";

import "./Calendar.css";
import Clock from "./Clock";
import Calendar from "./Calendar";
import WorkPlan from "./WorkPlan";
import Announcement from "./Announcement";
import YearlyReport from "./YearlyReport";
const Home = () => {
  const [toils, settoils] = useState([
    {
      date: "09.09.2024",
      NOs: "0.5",
      Toil: "0",
      Balance: "20.5",
      ToilLeft: "0",
      Note: "for summer",
    },
  ]);
  const [leave, setLeave] = useState([]);
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const { employeeData, loading, error, refetch } = useEmployee({
    employee_id: user?.employee_id,
    employee_name: user?.name,
    leave_type: "Casual Leave",
    status: "approved",
    emp: "true",
  });

  const [attendance, setAttendance] = useState({});
  const [title, setTitle] = useState();

  const getAttendance = async () => {
    try {
      let res;
      if (user?.aid) {
        res = await ApiClient.get(`/attendance?id=${user?.aid}`);
      } else {
        res = await ApiClient.get(`/attendance?emp=${user?.employee_id}`);
      }
      if (res.data.data.lastAttend) {
        setAttendance(res.data.data.lastAttend);
        setTitle(res.data.data.lastDayOffice);
      } else {
        setAttendance(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //  holiday date
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [holidayDate, setHolidayData] = useState([]);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [time, setTIme] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const getHolidayDates = async () => {
    try {
      const res = await ApiClient.get(
        `/setting/holiday?year=${time?.year || currentYear}&month=${
          time?.month
        }`
      );
      setHolidayData(res.data.data[0].holiday_list);
      // setTIme({
      //   month: res.data.data[0].month,
      //   year: res.data.data[0].year,
      // });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!loading && employeeData) {
      console.log("Employee Data:", employeeData);
    }
  }, [employeeData, loading]);
  const getLeave = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-type");
      setLeave(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [toil, setToil] = useState({});
  const getMyToil = async () => {
    try {
      const res = await ApiClient.get(`/toil?employee_id=${user?.employee_id}`);
      setToil(res.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const [employeSelect, setEmployeeSelect] = useState();
  const getEmployees = async () => {
    try {
      const res = await ApiClient.get(`/user/${user?._id}`);
      setEmployeeSelect(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHolidayDates();
  }, [time.month]);

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    getLeave();
    getMyToil();
    getAttendance();
  }, []);
  return (
    <>
      <div className="">
        <p className="text-2xl font-bold text-black pb-4 uppercase">
          Dashboard
        </p>
        <div className="w-full shadow rounded border py-5 px-5 mb-8">
          <div className="w-full bg-white  shadow-sm rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-3 uppercase">
              {title ? title : "Today's Report"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Office Date */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarAlt className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Office Date</p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {attendance?.date?.slice(0, 10)}
                </span>
              </div>

              {/* Login Status */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaSignInAlt className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Login Status
                </p>
                <span
                  className={`ml-auto text-sm capitalize ${
                    attendance?.status === "late" && "text-red-500"
                  } text-gray-700 font-semibold`}
                >
                  {attendance?.status}
                </span>
              </div>

              {/* Logged From */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaLocationArrow className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Logged From</p>
                <span className="ml-auto text-sm text-gray-700 capitalize font-semibold">
                  {attendance?.logged}
                </span>
              </div>

              {/* Login Time */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaClock className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Login Time</p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {attendance?.login_time
                    ? new Date(attendance.login_time).toLocaleString("en-US", {
                        timeZone: "Asia/Dhaka",
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>

              {/* End Status */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaHourglassEnd className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">End Status</p>
                <span className="ml-auto capitalize text-sm text-gray-700 font-semibold">
                  {attendance?.end_status}
                </span>
              </div>

              {/* Logout Time */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaSignOutAlt className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Logout Time{" "}
                </p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {attendance?.logout_time
                    ? new Date(attendance.logout_time).toLocaleString("en-US", {
                        timeZone: "Asia/Dhaka",
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>

              {/* Total Office Hour */}
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarDay className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Total Office Hour:
                </p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {attendance?.working_hours?.toFixed(2)} H
                </span>
              </div>
              <div>
                <Clock></Clock>
              </div>
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarDay className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Overtime:</p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {attendance?.over_time?.toFixed(2)} H
                </span>
              </div>
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarDay className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Login History:
                </p>
                <span className="ml-auto text-sm text-gray-700 font-regular w-full">
                  {attendance?.logHistory?.map((info, i) => (
                    <div key={i}>
                      <div className="flex justify-between">
                        <p>
                          ({i + 1}) Login:{" "}
                          {new Date(info?.login)?.toLocaleString("en-US", {
                            timeZone: "Asia/Dhaka",
                            hour12: true,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}{" "}
                        </p>
                        <p>
                          Logout:{" "}
                          {new Date(info?.logout)?.toLocaleString("en-US", {
                            timeZone: "Asia/Dhaka",
                            hour12: true,
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                        <p>:{info?.duration}H</p>
                      </div>
                    </div>
                  ))}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* my yearly report */}
      

        <YearlyReport
          user={user}
          employeSelect={employeSelect}
          leave={leave}
          employeeData={employeeData}
        />
        <div className="borer  mt-8 py-5 px-5 border shadow  rounded">
          <Announcement></Announcement>
        </div>
        <div className="w-full mt-8  border-2 py-5 px-5 rounded shadow-md ">
          <h2 className="text-xl py-2 px-6 font-semibold text-gray-800 mb-3 uppercase">
            MOnthly Holiday Report
          </h2>
          <div className="flex gap-4 px-6 font-semibold">
            <div className="flex gap-2">
              <h1 className="">Month :</h1>
              <select
                value={time?.month}
                onChange={(e) =>
                  setTIme((prev) => ({ ...prev, month: e.target.value }))
                }
                className="bg-gray-300 rounded"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((monthName, index) => (
                  <option key={index + 1} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <h1>Year:</h1>
              <input
                value={time?.year}
                onChange={(e) =>
                  setTIme((prev) => ({ ...prev, year: e.target.value }))
                }
                placeholder="2024"
                className="bg-gray-300 rounded border px-2 w-24 "
                type="text"
              />
            </div>
          </div>

          {/* <p className="text-white">Monthly Holiday Calender </p> */}
          <div className=" rounded">
            <Calendar
              month={time?.month}
              year={time?.year}
              holidayList={holidayDate}
              user={user}
            ></Calendar>
          </div>
        </div>
        <div className="w-full  border-2 py-5 px-5 mt-8 shadow-md p-4 mb-4">
          <h2 className="text-xl py-2 px-6 font-semibold text-gray-800 mb-3 uppercase">
            Weekly Work Plan
          </h2>
          <div>
            <WorkPlan></WorkPlan>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

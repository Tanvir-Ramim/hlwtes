import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";
import { format, startOfMonth } from "date-fns";
import logo from "../../../assets/main-logo.png";
import "./Print.css";
import toast from "react-hot-toast";
const MonthlyAttendence = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const options = { year: "numeric", month: "long", day: "numeric" };
  const currentDate = new Date().toLocaleDateString(undefined, options);
  const [time, setTime] = useState({
    year: currentYear,
    month: currentMonth,
  });
  const firstDayOfMonth = startOfMonth(new Date(time?.year, time?.month - 1));
  const forUpdate = startOfMonth(new Date(time?.year, time?.month));

  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  const [attendanceInfo, setAttendanceInfo] = useState();
  const [loader, setLoader] = useState(false);

  const getDailyReport = async () => {
    try {
      setLoader(true);
      const res = await ApiClient.get(
        `/report/attendance?employee_id=${user?.employee_id}&year=${time?.year}&month=${time?.month}&page=1&limit=1`
      );
      setLoader(false);

      setAttendanceInfo(res.data.data.responseData[0]);
    } catch (error) {
      setLoader(false);
      toast.error("Report Not Published");
    }
  };
  console.log(attendanceInfo);
  useEffect(() => {
    getDailyReport();
  }, [time?.month]);

  const [showAttendance, setShowAttendance] = useState(false);

  const toggleAttendance = () => {
    setShowAttendance(!showAttendance);
  };
  const invoiceRef = useRef(null);
  const handlePrint = () => {
    const printContents = invoiceRef.current.innerHTML;
    const iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.width = "0px";
    iframe.style.height = "0px";
    iframe.style.border = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            ${[...document.styleSheets]
              .map((styleSheet) => {
                try {
                  return [...styleSheet.cssRules]
                    .map((rule) => rule.cssText)
                    .join("");
                } catch (e) {
                  return "";
                }
              })
              .join("")}
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    doc.close();
    iframe.onload = () => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    };
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl print:w-[70%] mx-auto p-8 bg-white rounded-lg">
        <div className="flex justify-between items-center mb-8">
          {/* Month and Year Selection */}
          <div className="flex gap-6">
            <div className="flex gap-2 items-center">
              <h1 className="text-lg font-semibold text-gray-700">Month:</h1>
              <select
                value={time?.month}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, month: e.target.value }))
                }
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
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

            <div className="flex gap-2 items-center">
              <h1 className="text-lg font-semibold text-gray-700">Year:</h1>
              <input
                value={time?.year}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, year: e.target.value }))
                }
                className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                type="text"
                placeholder="2024"
              />
            </div>
          </div>

          {/* Print Button */}
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition focus:outline-none"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>

        <div ref={invoiceRef} className="w-full">
          <div className="p-6 rounded-lg print:shadow-none w-full border print:border-none bg-white relative">
            <div className="absolute inset-0 opacity-10 flex justify-center items-center">
              <img src={logo} alt="Company Logo" className="" />
            </div>

            <div className="relative z-10">
              <div className="text-center  mb-6">
                <h1 className="text-2xl print:text-xl font-bold mb-2">
                  Attendance Monthly Report
                </h1>

                <div className="flex items-center px-1 justify-between pt-7">
                  <div>
                    <img
                      src={logo}
                      alt="Company Logo"
                      className="mx-auto   max-w-xs"
                    />
                  </div>
                  <div>
                    {attendanceInfo?.employee_id && (
                      <h2 className="text-lg hidden print:block text-gray-700">
                        Employee ID: {attendanceInfo?.employee_id}
                      </h2>
                    )}
                    <h2 className="text-lg mb-2 text-gray-600">
                      {format(firstDayOfMonth, "MMMM yyyy")}
                    </h2>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div className="p-4 bg-gray-50 rounded-lg shadow">
                  <p className="text-md font-medium text-gray-800">
                    Total Working Days
                  </p>
                  <span className="text-xl font-semibold text-blue-600">
                    {attendanceInfo?.attendanceRecords?.length}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg shadow">
                  <p className="text-md font-medium text-gray-800">
                    Total Working Hours
                  </p>
                  <span className="text-xl font-semibold text-blue-600">
                    {attendanceInfo?.totalWorkingHours.toFixed(2)}
                  </span>
                </div>
              </div>
              {/* Shift Start */}
              <div className="mb-6">
                <h1 className="text-lg px-2  font-semibold text-gray-700 mb-4">
                  Shift Start
                </h1>
                <div className="border border-gray-300 p-2 rounded-lg bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Regular Office:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.statusCount?.["regular office"]} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Late:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.statusCount?.["late"]} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Full Day Absent:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.statusCount?.["fullday absent"]} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Half Day Absent:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.statusCount?.["fullday absent"]} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                </div>
              </div>

              <div className="mb-6">
                <h1 className="text-lg font-semibold text-gray-700 px-2 mb-4">
                  Shift End
                </h1>
                <div className="border border-gray-300 p-2 rounded-lg bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Early End:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.endStatusCount?.["early end"]} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Regular End:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.endStatusCount?.["regular end"]} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Overtime:</h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.endStatusCount?.["overtime"]} hours
                    </span>
                  </div>
                </div>
              </div>

              {/* Leave Balance */}
              <div className="">
                <h1 className="text-lg font-semibold px-2  text-gray-700 mb-4">
                  Leave Balance
                </h1>
                <div className="border border-gray-300 p-2 rounded-lg bg-gray-50 space-y-3">
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">Leave Balance:</h1>
                    <span className="font-bold   text-right">
                      {attendanceInfo?.leave_balance} days
                    </span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="grid grid-cols-2 items-center">
                    <h1 className="text-md text-gray-800">
                      Updated Leave Balance for {format(forUpdate, "MMMM yyyy")}
                      :
                    </h1>
                    <span className="font-bold  text-right">
                      {attendanceInfo?.update_leave_balance} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Final Message */}
              <div className="mt-8 px-1.5 flex justify-between">
                <p className="text-md text-gray-700 italic">
                  This report has been carefully reviewed and approved by the
                  CTO.
                </p>
                <p className="text-gray-700 italic">{currentDate}</p>
              </div>
            </div>
          </div>
        </div>

        {showAttendance && attendanceInfo?.attendanceRecords?.length > 0 && (
          <div className="mt-6">
            <table className="min-w-full">
              <thead className="bg-[#eee]">
                <tr>
                  <th className="text-black text-base font-semibold text-center p-4">
                    No
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    Date
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    Start Time
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    End Time
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    Logged Location
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    Working Hours
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    Status
                  </th>
                  <th className="text-black text-base font-semibold text-center p-4">
                    End Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {attendanceInfo?.attendanceRecords?.map((item, i) => (
                  <tr
                    key={i}
                    className={`text-sm font-medium text-gray-900 ${
                      i % 2 === 0 ? "bg-gray-100" : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <td className="py-4 px-6 text-center">{i + 1}</td>
                    <td className="py-4 px-6 text-center">
                      {format(new Date(item?.date), "yyyy-MM-dd")}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item?.start_time}
                    </td>
                    <td className="py-4 px-6 text-center">{item?.end_time}</td>
                    <td className="py-4 px-6 text-center">
                      {item?.logLocation}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {item?.workingHours}
                    </td>
                    <td className="py-4 px-6 text-center">{item?.status}</td>
                    <td className="py-4 px-6 text-center">{item?.endStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlyAttendence;

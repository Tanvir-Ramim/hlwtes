import { format } from "date-fns";
import React, { useRef } from "react";
import logo from "../../../assets/weepokaLogo.png";
import "./list.css";
const AttendanceList = ({ attendanceInfo, firstDayOfMonth, currentDate }) => {
  const componentRef = useRef();
  const handlePrint = () => {
    if (componentRef.current) {
      const printContent = componentRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };
  return (
    <div className="mt-6">
     <div className="flex justify-end">
     <button
        onClick={handlePrint}
        className="mb-4 px-4 print:px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Print
      </button>
     </div>
      <div ref={componentRef} className="printable ">
        <div>
          <div className={`text-center hidden ${attendanceInfo?.attendanceRecords?.length>11 ?"mt-[650px]" : "mt-0"}  print:block  mb-6`}>
            <h1 className="text-2xl print:text-xl font-bold mb-2">
              Attendance  List
            </h1>

            <div className="flex px-1 justify-between pt-7">
              <div>
                <img
                  src={logo}
                  alt="Company Logo"
                  className="mx-auto  mb-4 max-w-xs"
                />
              </div>
              <div>
              <h2 className="text-lg mb-2 text-gray-600">
                  {format(firstDayOfMonth, "MMMM yyyy")}
                </h2>
                <h2 className="text-lg text-center text-gray-700">
                  Employee ID: {attendanceInfo?.employee_id}
                </h2>
              
              </div>
            </div>
          </div>
          <table className="min-w-full">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4 print:p-2">
                  No
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
                  Date
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
                  Start Time
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
                  End Time
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
                  Logged Location
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
                  Working Hours
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
                  Status
                </th>
                <th className="text-black text-base font-semibold text-center p-4  print:p-2">
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
                  <td className="py-4 px-6 print:px-3 text-center">{i + 1}</td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {format(new Date(item?.date), "yyyy-MM-dd")}
                  </td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {item?.login_time
                      ? new Date(item.login_time).toLocaleString("en-US", {
                          timeZone: "Asia/Dhaka",
                          hour12: true,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {item?.logout_time
                      ? new Date(item.logout_time).toLocaleString("en-US", {
                          timeZone: "Asia/Dhaka",
                          hour12: true,
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "N/A"}
                  </td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {item?.logged}
                  </td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {item?.working_hours}
                  </td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {item?.status}
                  </td>
                  <td className="py-4 px-6 print:px-3 text-center">
                    {item?.end_status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-8 px-1.5 hidden print:flex justify-between">
            <p className="text-md text-gray-700 italic">
              This report has been carefully reviewed and approved by the CTO.
            </p>
            <p className="text-gray-700 italic">{currentDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;

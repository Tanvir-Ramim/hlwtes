import React from "react";
import Icon from "../../../components/Icon/Icons";
import { format } from "date-fns";
import { MdDeleteForever } from "react-icons/md";
import ApiClient from "../../../axios/ApiClient";
const NewAList = ({ meow, reset }) => {
  const handleDelete = async (id) => {
    window.confirm("Are You Sure?");
    try {
      const res = await ApiClient.delete(`/attendance/${id}`);
      if (res.status === 204) {
        alert("Successfully Delete");
        reset();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <p className="text-2xl font-bold text-black pb-10 uppercase text-center">
        Attendance List
      </p>
      <div className="flex items-center gap-3"></div>
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
              Employee Name
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
            <th className="text-black text-base font-semibold text-center p-4  print:p-2">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {meow?.map((item, i) => (
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
                  {item?.employee_name}
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
                <td className="py-4 px-6 print:px-3 text-center">
                  {typeof item?.working_hours === "number"
                    ? item.working_hours.toFixed(3)
                    : "N/A"}
                </td>
              </td>
              <td className="py-4 px-6 print:px-3 text-center">
                {item?.status}
              </td>
              <td className="py-4 px-6 print:px-3 text-center">
                {item?.end_status}
              </td>
              <td
                onClick={() => handleDelete(item?._id)}
                className="py-4 cursor-pointer px-6 print:px-3 text-center "
              >
                <MdDeleteForever className="text-center text-red-600 text-2xl" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NewAList;

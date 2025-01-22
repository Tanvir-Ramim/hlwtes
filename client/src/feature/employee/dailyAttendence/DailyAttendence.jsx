import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";
import { format, startOfMonth } from "date-fns";
import { Link } from "react-router-dom";

const DailyAttendence = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  console.log(user);
  const [attendanceInfo, setAttendanceInfo] = useState([]);
  const getDailyReport = async () => {
    try {
      const res = await ApiClient.get(`/attendance?myAll=${user?.employee_id}`);
      setAttendanceInfo(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth - 1));

  // correct request

  const handleCorrection = async (aid) => {
    try {
      const res = await ApiClient.patch(`/attendance/correction/${aid}`);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getDailyReport();
  }, []);

  return (
    <div>
      <div className="">
        <p className="text-2xl font-bold text-black  py-4 uppercase">
          My Daily Attendance List ( {format(firstDayOfMonth, "MMMM yyyy")})
        </p>
        <div className=" mt-5">
          <div className="flex my-4 items-center space-x-6">
            {/* Green Box with Approve Text */}
            <div className="relative flex items-center bg-green-500 text-white p-2 rounded shadow-md">
             
              <div className="w-5 h-5 bg-green-600 rounded-full"></div>
              <div className=" left-full ml-2 text-green-00 font-semibold text-sm">
                Approve
              </div>
            </div>

            {/* Red Box with Pending Text */}
            <div className="relative flex items-center bg-red-400 text-white p-2 rounded shadow-md">
             
              <div className="w-5 h-5 bg-red-600 rounded-full"></div>
              <div className=" left-full ml-2 text-red-800 font-semibold text-sm">
                Pending
              </div>
            </div>

            {/* Yellow Box with Apply Text */}
            <div className="relative flex items-center bg-yellow-200 text-white p-2 rounded shadow-md">
             
              <div className="w-5 h-5 bg-yellow-600 rounded-full"></div>
              <div className=" left-full ml-2 text-yellow-800 font-semibold text-sm">
               Need Apply
              </div>
            </div>
          </div>
          {/* Table structure */}
          <table className="min-w-full ">
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
                <th className="text-black text-base font-semibold text-center p-4">
                  Correction Request
                </th>
              </tr>
            </thead>

            <tbody>
              {attendanceInfo?.map?.((item, i) => (
                <tr
                  key={i}
                  className={`border capitalize ${
                    item?.logHistory?.length > 0 &&
                    !item?.isCorrection_apply &&
                    item?.approved_status == "pending" &&
                    "bg-yellow-200"
                  }   ${
                    item?.approved_status == "approved" && "bg-green-400"
                  }  ${
                    item?.isCorrection_apply &&
                    item?.approved_status == "pending" &&
                    "bg-red-400"
                  } ${i % 2 !== 0 && "bg-gray-200/50"}  text-sm`}
                >
                  <td className="text-black text-base font-normal text-center p-4 border-b">
                    {i + 1}
                  </td>
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.date?.slice(0, 10)}
                  </td>
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {/* {new Date(item?.login_time).toISOString().slice(11, 16)} */}
                    {new Date(item?.login_time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="text-black font-normal text-center p-4 border-b">
                    {new Date(item?.logout_time).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </td>
                  <td className="text-black font-normal text-center p-4 border-b">
                    {item?.logged}
                  </td>
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.working_hours?.toFixed(2)}
                  </td>
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.status}
                  </td>
                  <td className="text-black  font-normal text-center p-4 capitalize border-b">
                    {item?.end_status}
                  </td>
                  <td className="text-black  font-normal text-center p-4 capitalize border-b">
                    {item?.logHistory?.length > 0 &&
                      !item?.isCorrection_apply && (
                        <Link
                          // onClick={() => handleCorrection(item?._id)}
                          state={item?.date?.slice(0, 10)}
                          to={`/correction-attendence`}
                          className="bg-gray-500 text-white py-1 px-2 rounded "
                        >
                          Apply To Correction
                        </Link>
                      )}
                    {item?.isCorrection_apply &&
                      item?.approved_status == "pending" && (
                        <button className="bg-black text-white py-1 px-2 rounded cursor-none">
                          Applied
                        </button>
                      )}
                    {item?.isCorrection_apply &&
                      item?.approved_status == "approved" && (
                        <button className="bg-black text-white py-1 px-2 rounded cursor-none">
                          Approved
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyAttendence;

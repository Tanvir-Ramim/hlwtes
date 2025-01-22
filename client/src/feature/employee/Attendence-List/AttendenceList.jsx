import React, { useEffect, useState } from "react";
import { correctionItem } from "../constants";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import Icon from "../../../components/Icon/Icons";
const AttendenceList = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [noteValue, setNoteValue] = useState("");
  const getReason = (mx) => {
    setNoteValue(mx);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [myCorrect, setMyCorrect] = useState([]);

  const getCorrectList = async () => {
    try {
      const res = await ApiClient.get(
        `/attendance?isCorrect=a&cid=${user?.employee_id}`
      );
      setMyCorrect(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCorrectList();
  }, []);

 function calculateTotalHours(item) {
  const startHour = parseInt(item?.correction_request?.start?.hour, 10);
  const startMinute = parseInt(item?.correction_request?.start?.minute, 10) || 0;
  const startPeriod = item?.correction_request?.start?.period;
  const endHour = parseInt(item?.correction_request?.end?.hour, 10);
  const endMinute = parseInt(item?.correction_request?.end?.minute, 10) || 0;
  const endPeriod = item?.correction_request?.end?.period;
  const start24Hour = convertTo24Hour(startHour, startPeriod);
  const end24Hour = convertTo24Hour(endHour, endPeriod);

  const startTotalMinutes = start24Hour * 60 + startMinute;
  const endTotalMinutes = end24Hour * 60 + endMinute;

  const totalMinutesWorked = endTotalMinutes - startTotalMinutes;
  const hoursWorked = Math.floor(totalMinutesWorked / 60);
  const minutesWorked = totalMinutesWorked % 60; 
  const formattedTime = `${hoursWorked}.${minutesWorked < 10 ? '0' : ''}${minutesWorked}`;

  return formattedTime;
}

function convertTo24Hour(hour, period) {
  if (period === "PM" && hour < 12) {
    return hour + 12;
  }
  if (period === "AM" && hour === 12) {
    return 0;
  }
  return hour;
}

  
  return (
    <>
      <div className="">
        <p className="text-2xl font-bold text-black mt-6 uppercase">
          correction List
        </p>

        <div className="mt-5 p-4 bg-white shadow-lg rounded-lg">
          {/* Main Table */}
          <table className="min-w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-gray-800 text-base font-bold text-center p-3 border border-gray-200">
                  Date
                </th>
                <th className="text-gray-800 text-base font-bold text-center p-3 border border-gray-200">
                  Details
                </th>
                <th className="text-gray-800 text-base font-bold text-center p-3 border border-gray-200">
                  Approved Status
                </th>
                <th className="text-gray-800 text-base font-bold text-center p-3 border border-gray-200">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {myCorrect?.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  <td className="text-gray-600 text-sm font-medium text-center p-3 border-b border-gray-200">
                    {item?.date?.slice(0, 10)}
                  </td>
                  <td className="text-gray-600 text-sm font-normal text-center p-3 border-b border-gray-200">
                    {/* Correction Request Section */}
                    <div className="mb-3">
                      <p className="text-base font-semibold text-gray-700 mb-1">
                        Correction Request
                      </p>
                      <table className="w-full border border-gray-300 rounded mb-3">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-gray-700 text-xs font-semibold text-center p-2 border-b">
                              Start Time
                            </th>
                            <th className="text-gray-700 text-xs font-semibold text-center p-2 border-b">
                              End Time
                            </th>
                            <th className="text-gray-700 text-xs font-semibold text-center p-2 border-b">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-gray-600 text-xs font-normal text-center p-2 border-b">
                              {item?.correction_request?.start?.hour}:
                              {item?.correction_request?.start?.minute}{" "}
                              {item?.correction_request?.start?.period}
                            </td>
                            <td className="text-gray-600 text-xs font-normal text-center p-2 border-b">
                              {item?.correction_request?.end?.hour}:
                              {item?.correction_request?.end?.minute}{" "}
                              {item?.correction_request?.end?.period}
                            </td>
                            <td className="text-green-600 text-xs font-normal text-center p-2 border-b">
                              {calculateTotalHours(item)}  hours
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Log History Section */}
                    <div>
                      <p className="text-base font-semibold text-gray-700 mb-1">
                        Log History
                      </p>
                      <table className="w-full border border-gray-300 rounded">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="text-gray-700 text-xs font-semibold text-center p-2 border-b">
                              Log-in Time
                            </th>
                            <th className="text-gray-700 text-xs font-semibold text-center p-2 border-b">
                              Log-out Time
                            </th>
                            <th className="text-gray-700 text-xs font-semibold text-center p-2 border-b">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-gray-600 text-xs font-normal text-center p-2 border-b">
                              {new Date(item?.login_time).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </td>
                            <td className="text-gray-600 text-xs font-normal text-center p-2 border-b">
                              {new Date(item?.logout_time).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </td>
                            <td className="text-green-600 text-xs font-normal text-center p-2 border-b">
                              {item?.working_hours?.toFixed(2)} hours
                            </td>
                          </tr>
                          {item?.logHistory?.length > 0 &&
                            item?.logHistory?.map((log, i) => (
                              <tr key={i}>
                                <td className="text-gray-600 text-xs font-normal text-center p-2 border-b">
                                  {new Date(log?.login).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </td>
                                <td className="text-gray-600 text-xs font-normal text-center p-2 border-b">
                                  {new Date(log?.logout).toLocaleTimeString(
                                    "en-US",
                                    {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }
                                  )}
                                </td>
                                <td className="text-green-600 text-xs font-normal text-center p-2 border-b">
                                  {log?.duration?.toFixed(2)} hours
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </td>
                  <td
                    className={`text-base font-medium capitalize text-center p-3 border-b border-gray-200 ${
                      item?.approved_status === "approved"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item?.approved_status}
                    {item?.approved_status === "approved" && (
                      <div className="text-sm text-gray-500 mt-1">
                        {item?.updatedAt?.slice(0, 10)}
                      </div>
                    )}
                  </td>
                  <td className="text-gray-600 text-sm font-normal text-center p-3 border-b border-gray-200">
                    <button
                      onClick={() => getReason(item?.approved_note)}
                      className="text-blue-500 hover:text-blue-700 transition duration-300 text-xl rounded-full focus:outline-none"
                    >
                      <Icon type="eye" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center w-full  bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6   modal-slide-down relative">
              <button
                className="absolute top-2   right-3 text-red-400"
                onClick={closeModal}
              >
                <RxCross2 />
              </button>
              <div>
                {noteValue !== "" ? (
                  <p>{noteValue}</p>
                ) : (
                  <p className="text-red-400">Note Currently Not Available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AttendenceList;

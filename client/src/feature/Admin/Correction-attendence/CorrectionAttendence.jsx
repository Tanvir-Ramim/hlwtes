import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { set, startOfMonth } from "date-fns";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaClock,
  FaHourglassEnd,
  FaLocationArrow,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import ApiClient from "../../../axios/ApiClient";
import Clock from "../../employee/Home/Clock";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const CorrectionAttendence = () => {
  const [errors, setErrors] = useState({});
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  
  const [selectedemplyes, setSelecteemploye] = useState(user?.employee_id);
  const [id, setId] = useState("");
  const [formData, setFormData] = useState({
    fromDate: "",
    request_for: "Own",
  });

  const [startTime, setStartTime] = useState({
    hour: "",
    minute: "",
    period: "",
  });
  const [endTime, setEndTime] = useState({
    hour: "",
    minute: "",
    period: "",
  });

  const convertTo12HourFormat = (time) => {
    let [hour, minute] = time.split(":");
    let period = "AM";

    if (hour >= 12) {
      period = "PM";
      if (hour > 12) {
        hour = hour - 12;
      }
    } else if (hour === "00") {
      hour = 12;
    }

    return { hour, minute, period };
  };
  const [showValueStart, setShowValueStart] = useState();
  const [showValueEnd, setShowValueEnd] = useState();
  const handleStartTimeChange = (e) => {
    setShowValueStart(e.target.value);
    const { hour, minute, period } = convertTo12HourFormat(e.target.value);
    setStartTime({ hour, minute, period });
  };

  const handleEndTimeChange = (e) => {
    setShowValueEnd(e.target.value);
    const { hour, minute, period } = convertTo12HourFormat(e.target.value);
    setEndTime({ hour, minute, period });
  };
  const [mess, setMess] = useState("");
  const [okButtonText, setOkButtonText] = useState("Submit");
  const [cancelButtonText, setCancelButtonText] = useState("Cancel");

  // Handle date change
  const handleDateChange = (event) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };

  const [attendance, setAttendanceInfo] = useState({});
  const getDailyReport = async () => {
    try {
      const res = await ApiClient.get(
        `/attendance?date_emp=${id}&date=${formData?.fromDate}`
      );
      setAttendanceInfo(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const firstDayOfMonth = startOfMonth(new Date(currentYear, currentMonth - 1));

  useEffect(() => {
    getDailyReport();
  }, [formData?.fromDate]);

  const validateForm = () => {
    const { fromDate, request_for } = formData;
    const {
      hour: startHour,
      minute: startMinute,
      period: startPeriod,
    } = startTime;
    const { hour: endHour, minute: endMinute, period: endPeriod } = endTime;

    if (
      !fromDate ||
      !request_for ||
      !startHour ||
      !startMinute ||
      !startPeriod ||
      !endHour ||
      !endMinute ||
      !endPeriod
    ) {
      toast.error("All input fields are required.");
      return false;
    }
    return true;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    if (!attendance) {
      alert("No Attendance Record Found. Please Select A Correct  Date");
    }
    try {
      const res = await ApiClient.patch(
        `/attendance/correction/${attendance?._id}`,
        {
          request_for: formData.request_for,
          correction_request: {
            message: mess || "",
            start: startTime,
            end: endTime,
          },
        }
      );
      if (res.status === 200) {
        resetForm();
        toast.success("Successfully Submit");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Handle form reset on Cancel
  const resetForm = () => {
    setFormData({ fromDate: "", request_for: "Own" });
    setSelecteemploye("");
    setMess("");
    setShowValueEnd("");
    setShowValueStart("");
    setStartTime({ hour: "", minute: "", period: "" });
    setEndTime({ hour: "", minute: "", period: "" });

    setOkButtonText("Submit");
  };

  const [userArra, setUserArra] = useState([]);

  const getEmployees = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleReqChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      request_for: event.target.value,
    }));
  };
  useEffect(() => {
    if (formData.request_for === "Own") {
      setId(user?.employee_id);
    }
  }, [formData.request_for]);
  useEffect(() => {
    getEmployees();
  }, []);
  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase ">
          Attendance Correction
        </p>
        <div className="flex gap-4 items-center">
          <p className="text-base text-black font-bold ">
            Correction Request For :
          </p>
          <div className="flex gap-4 ">
            <div className="flex items-center">
              <input
                type="radio"
                id="request_for"
                name="request_for"
                value="Own"
                checked={formData?.request_for === "Own"}
                onChange={handleReqChange}
                className="size-4"
              />
              <span className="text-base text-black capitalize font-normal pl-2">
                <label htmlFor="Own">Own</label>
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="request_for"
                name="request_for"
                value="Others"
                checked={formData.request_for === "Others"}
                onChange={handleReqChange}
                className="size-4"
              />
              <span className="text-base text-black capitalize font-normal pl-2">
                <label htmlFor="Others">Others</label>
              </span>
            </div>
          </div>
          {errors.radioValue && (
            <p className="text-red-500">{errors.radioValue}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-10 pt-5">
          {formData.request_for === "Others" ? (
            <div className="">
              <p className="text-base text-black font-bold pb-5">
                Employee Name
              </p>
              <div className=" gap-10">
                <div>
                  <select
                    id="employee_name"
                    name="employee_name"
                    value={formData?.employee_name}
                    onChange={(e) => {
                      const selectedEmployee = userArra.find(
                        (item) => item.name === e.target.value
                      );
                      setId(selectedEmployee?.employee_id);
                    }}
                    className="bg-[#eeeeee70] w-full p-5   rounded-[12px]"
                  >
                    <option value="" disabled>
                      Employee Name With ID
                    </option>
                    {userArra?.map((item, i) => (
                      <option key={i} value={item?.name}>
                        {item?.name} ({item?.employee_id})
                      </option>
                    ))}
                  </select>

                  {errors.selectedemplyes && (
                    <p className="text-red-500">{errors.selectedemplyes}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <h1 className="text-base text-black font-bold pb-5">My Id</h1>
              <input
                defaultValue={user?.employee_id}
                className="bg-[#eeeeee70] w-full p-5 appearance-none rounded-[12px]"
                type="text"
                disabled
              />
              {errors.employee_name && (
                <p className="text-red-500">{errors.employee_name}</p>
              )}
            </div>
          )}
          <div>
            <p className="text-base text-black font-bold capitalize pb-5">
              Date *
            </p>
            <input
              type="date"
              id="fromDate"
              className="border p-4 w-full rounded-md"
              value={formData.fromDate}
              onChange={handleDateChange}
            />
            {errors.fromDate && (
              <p className="text-red-500">{errors.fromDate}</p>
            )}
          </div>
        </div>

        <div className="pt-10 pb-7 flex  gap-5 justify-between">
          <div className="flex w-[40%] gap-5">
            <div className="bg-[#eeeeee1e] w-[50%] h-fit rounded-md border border-gray-200">
              <h2 className="text-base text-center text-black font-semibold capitalize py-4">
                Start Time
              </h2>
              <div className="pb-5 px-2">
                <input
                  type="time"
                  name="hour"
                  className="border w-full text-center"
                  onChange={handleStartTimeChange}
                  // value={`${startTime?.hour}:${startTime?.minute}`}
                  value={showValueStart}
                />
              </div>
            </div>
            <div className="bg-[#eeeeee1e] w-[50%] h-fit rounded-md border border-gray-200">
              <h2 className="text-base text-center text-black font-semibold capitalize py-4">
                End Time
              </h2>
              <div className="pb-5 px-2">
                <input
                  type="time"
                  name="hour"
                  className="border w-full text-center"
                  onChange={handleEndTimeChange}
                  // value={`${endTime.hour}:${endTime.minute}`}
                  value={showValueEnd}
                />
              </div>
            </div>
          </div>
          <div className="w-[60%]">
            <textarea
              type="text"
              rows={3}
              value={mess}
              onChange={(e) => setMess(e.target.value)}
              className="bg-[#eeeeee1e]  text-black placeholder:text-sm placeholder-gray-700 rounded focus:outline-none border-[#eee] p-4 w-full border "
              placeholder="Note"
            />
          </div>
        </div>

        <div className="text-left">
          <button
            className="bg-primary hover:bg-[#051a30] duration-500 py-1.5 px-4 text-lg font-normal text-white rounded-md mr-4"
            onClick={handleSubmit}
          >
            {okButtonText}
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 duration-500 py-1.5 px-4 text-lg font-normal text-white  rounded-md"
            onClick={resetForm}
          >
            {cancelButtonText}
          </button>
        </div>
        {/* *** my attendance###### */}

        {attendance?.date && (
          <div className="grid border mt-7 rounded grid-cols-1 md:grid-cols-2 gap-4   pt-2">
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
              <p className="text-sm font-medium text-gray-600">Login Status</p>
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
              <p className="text-sm font-medium text-gray-600">Logout Time </p>
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
                {attendance?.working_hours} H
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
        )}
      </div>
    </>
  );
};

export default CorrectionAttendence;

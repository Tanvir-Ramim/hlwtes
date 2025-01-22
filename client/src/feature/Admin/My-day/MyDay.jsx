import React, { useEffect, useState } from "react";
import Clock from "../../employee/Home/Clock";
import ApiClient from "../../../axios/ApiClient";
import { adminInfo, setEndTime, setStartTime } from "../../../redux/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
const MyDay = () => {
  const [date, setDate] = useState(new Date());

  const [currentTime, setCurrentTime] = useState(null);
  const [ip, setIP] = useState("");
  const [location, setLocation] = useState({});
  const [attendance, setAttendance] = useState({});
  console.log(attendance);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const user1 = useSelector((state) => state?.auth?.user?.user);
  const user3 = useSelector((state) => state?.auth?.user?.aid);
  const user2 = useSelector((state) => state?.auth?.user);
  const startTime = useSelector((state) => state.auth.startTime);

  const endTime = useSelector((state) => state.auth.endTime);
  //#### redux info####
  let user;
  let aid;
  if (user1) {
    user = user1;
    aid = user3;
  } else {
    user = user2;
  }

  //### my api #######

  useEffect(() => {
    fetch("https://ipwhois.app/json/")
      .then((response) => response.json())
      .then((data) => {
        setIP(data.ip);
        setLocation(data);
      })
      .catch((error) => console.error("Error fetching location:", error));
  }, []);

  //########office start #####
  const startDay = async () => {
    try {
      const res = await ApiClient.post("/auth/office-start", {
        email: user?.email,
        ip: ip || "192.168.0.154",
      });
      const userData = res.data.data;
      dispatch(adminInfo(userData));
      getAttendance();
      const now = new Date();
      dispatch(setStartTime(now));
      setCurrentTime(now);

      const timer = setInterval(() => setCurrentTime(new Date()), 1000);
      return () => clearInterval(timer);
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  //########## end office ####
  const endDay = async () => {
    let mx;
    if (aid) {
      mx = aid;
    } else {
      mx = attendance?._id;
    }
    if (!mx) {
      alert("Check Your Office Hour)");
      return;
    }
    try {
      const res = await ApiClient.patch(`/auth/${user?._id}`, {
        aid: mx,
      });
      if (res.status === 204) {
        alert("Successfully End");
        getAttendance();
        const now = new Date();
        dispatch(setEndTime(now)); // Save end time in Redux

        setCurrentTime(null);
      }
    } catch (error) {
      alert(error.response.data.error);
    }
  };
  //######### date formation ############
  const formatTime = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    }
    return "";
  };

  //######### attendance info ##########

  const getAttendance = async () => {
    try {
      let res;
      if (user?.aid) {
        res = await ApiClient.get(`/attendance?id=${user?.aid}`);
      } else {
        res = await ApiClient.get(`/attendance?emp=${user?.employee_id}`);
      }

      const attendanceData = res.data.data.lastAttend || res.data.data;
      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  function checkLogoutStatus(data) {
    if (!data?.logout_time) {
      setShow(true);
      return;
    }

    if (data?.logHistory && Array.isArray(data.logHistory)) {
      for (let i = 0; i < data.logHistory.length; i++) {
        if (!data.logHistory[i].logout) {
          setShow(true);
          return;
        }
      }
    }

    setShow(false);
  }
  console.log(attendance);
  //###### log#####

  //##### effect #########
  useEffect(() => {
    getAttendance();
  }, []);

  useEffect(() => {
    if (Object.keys(attendance).length > 1) {
      checkLogoutStatus(attendance);
    }
  }, [attendance]);
  console.log(attendance);

  const onChange = (newDate) => {
    setDate(newDate);
    console.log("Selected Date:", newDate);
  };
  return (
    <>
      <div className="  gap-10 p-6">
        {/* Left Section */}
        <div className="bg-gray-50 max-w-xl mx-auto shadow-lg rounded-lg p-8">
          {/* Title */}
          <div className="text-center mb-8">
            <p className="text-4xl font-extrabold text-gray-800 uppercase tracking-wide">
              My Day
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <p>IPS Name: {location?.org}</p>
              <p>
                IP: <strong>{ip}</strong>
              </p>
              <p>{location?.city}</p>
            </div>
          </div>

          {/* Session Start/End */}
          <div className="bg-white shadow rounded-lg p-6">
            {!show ? (
              <div className="text-center">
                <p className="text-xl font-semibold text-gray-700 mb-6">
                  Start count your working Hours:
                </p>
                <button
                  onClick={startDay}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
                >
                  Start
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-700 mb-4">
                  Start Time:{" "}
                  <span className="font-normal">
                    {" "}
                    {attendance?.login_time
                      ? new Date(attendance?.login_time).toLocaleString(
                          "en-BD",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Dhaka",
                          }
                        )
                      : "00:00:00"}
                  </span>
                </p>
                <div className="mb-6">
                  <Clock />
                </div>
                <button
                  onClick={endDay}
                  className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition duration-300"
                >
                  End
                </button>
              </div>
            )}
          </div>

          {/* Session History */}
          <div className="bg-white mt-8 shadow-md rounded-lg p-4">
            <div className="text-center mb-4">
              <p className="text-lg font-bold text-gray-700">
                Your Last Session
              </p>
              <p className="text-sm text-gray-500">
                {attendance?.date &&
                  new Date(attendance?.date)?.toLocaleString("en-BD", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour12: true,
                    timeZone: "Asia/Dhaka",
                  })}
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2">Session</th>
                    <th className="py-2">Start Time</th>
                    <th className="py-2">End Time</th>
                    <th className="py-2 text-center">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Last Session */}
                  <tr className="border-b">
                    <td className="py-2">Session 1</td>
                    <td className="py-2">
                      {attendance?.login_time
                        ? new Date(attendance?.login_time).toLocaleString(
                            "en-BD",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Dhaka",
                            }
                          )
                        : "00:00:00"}
                    </td>
                    <td className="py-2">
                      {attendance?.logout_time
                        ? new Date(attendance?.logout_time).toLocaleString(
                            "en-BD",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                              hour12: true,
                              timeZone: "Asia/Dhaka",
                            }
                          )
                        : "Ongoing Session"}
                    </td>
                    <td className="py-2 text-center">
                      {attendance?.working_hours?.toFixed(2)} hours
                    </td>
                  </tr>

                  {/* Additional Sessions */}
                  {attendance?.logHistory?.length > 0 &&
                    attendance?.logHistory?.map((session, index) => (
                      <tr className="border-b" key={index}>
                        <td className="py-2">Session {index + 2}</td>
                        <td className="py-2">
                          {new Date(session?.login).toLocaleString("en-BD", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: true,
                            timeZone: "Asia/Dhaka",
                          })}
                        </td>
                        <td className="py-2">
                          {session?.logout
                            ? new Date(session?.logout).toLocaleString(
                                "en-BD",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                  hour12: true,
                                  timeZone: "Asia/Dhaka",
                                }
                              )
                            : "Ongoing Session"}
                        </td>
                        <td className="py-2 text-center">
                          {session?.duration} hours
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            <div className="text-center mt-4">
              <p className="text-base text-gray-700 font-semibold">
                Total Duration:{" "}
                {attendance?.logHistory?.length > 0
                  ? (
                      attendance.logHistory.reduce(
                        (total, session) => total + session.duration || 0,
                        0
                      ) + attendance?.working_hours
                    ).toFixed(2)
                  : attendance?.working_hours?.toFixed(2)}{" "}
                hours
              </p>
            </div>
          </div>
        </div>

        {/* Right Section - Calendar */}
        {/* <div className="p-8 bg-gray-50 shadow-lg rounded-lg">
    <Calendar onChange={onChange} value={date} />
  </div> */}
      </div>
    </>
  );
};

export default MyDay;

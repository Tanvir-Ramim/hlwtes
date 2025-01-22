import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaClock,
  FaHourglassEnd,
  FaLocationArrow,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import NewAList from "./NewAList";

const Newattendance = () => {
  const [attendanceData, setAttendanceData] = useState({
    employee_id: "",
    employee_name: "",
    date: "",
    login_time: "",
    logout_time: "",
    status: "",
    end_status: "",
    isNewAdd: true,
  });
  console.log(attendanceData);
  const [userArra, setUserArra] = useState([]);
  const [show, setShow] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  console.log(attendanceData);

  const [newattendance, setNewattendance] = useState([]);
  const getDailyReport = async () => {
    try {
      const res = await ApiClient.get(`/attendance?&isNewAdd=true`);
      setNewattendance(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(attendanceData);
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "login_time") {
      if (!attendanceData.date) {
        window.alert("Please select a date before picking login time.");
        return;
      }
      // Stack the date with the selected time
      const combinedLoginDateTime = `${attendanceData.date}T${value.split("T")[1]}`;
      setAttendanceData((prev) => ({
        ...prev,
        login_time: combinedLoginDateTime,
        logout_time: "", // Reset logout time when login time changes
      }));
    } else if (name === "logout_time") {
      if (!attendanceData.login_time) {
        window.alert("Please select a login time before picking logout time.");
        return; // Prevent further execution
      }
      // Stack the date with the selected time
      const combinedLogoutDateTime = `${attendanceData.date}T${value.split("T")[1]}`;
  
      // Ensure logout time is greater than login time
      const loginDateTime = new Date(attendanceData.login_time);
      const logoutDateTime = new Date(combinedLogoutDateTime);
  
      if (logoutDateTime <= loginDateTime) {
        window.alert("Logout time must be greater than login time.");
        return; // Prevent further execution
      }
  
      setAttendanceData((prev) => ({
        ...prev,
        logout_time: combinedLogoutDateTime,
      }));
    } else {
      // For other fields
      setAttendanceData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  //#### search #######

  const filteredUsers = userArra.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // (typing and selection)
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true); // Show dropdown while typing
  };

  //  employee from the dropdown
  const handleSelectEmployee = (employee) => {
    setAttendanceData({
      employee_id: employee.employee_id,
      employee_name: employee.name,
    });
    setSearchTerm(employee.name);
    setShowDropdown(false);
  };
  //### send dat ####
  const handleSubmit = async (e) => {
    e.preventDefault();
    window.confirm("Are You Sure");
    try {
      const response = await ApiClient.post("/attendance/new-attendance", {
        attendanceData,
      });

      if (response.status === 201) {
        setShow(response.data.attendance);
        getDailyReport();
        alert("Attendance submitted successfully!");
        setAttendanceData({
          employee_id: "",
          employee_name: "",
          date: "",
          login_time: "",
          logout_time: "",
          status: "",
          end_status: "",
        });
      } else {
        alert("Error submitting attendance: " + response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };
  //### all user ####

  const getEmployees = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      console.log(res);
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(filteredUsers);
  //#### Effect ####
  useEffect(() => {
    getEmployees();
  }, []);

  let handleGetusername = (e) => {
    const id = e.target.value;
    console.log(id);
    const data = userArra?.filter((item) => item._id == id);
    console.log(data);
    setAttendanceData({
      ...attendanceData,
      employee_id: data[0].employee_id,
      employee_name: data[0].name,
    });
  };

  useEffect(() => {
    getDailyReport();
  }, []);
  return (
    <>
      {" "}
      <h1 className="text-center font-bold text-3xl">Add New Attendance</h1>
      <div className=" flex  w-full justify-center py-10 ">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 font-semibold text-sm gap-4 w-[800px]"
        >
          {/* <p>Employee</p>
          <input
            type="text"
            placeholder="Type or select employee name or ID"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setShowDropdown(true)} // Show dropdown when input is focused
            className="bg-[#eeeeee7f] p-4 rounded-[5px] placeholder:font-normal "
          />
        
         
          {showDropdown && (
            <ul className="absolute bg-white  border border-gray-300 max-h-60 w-[500px] z-10 top-[190px]">
              {filteredUsers.length > 0 ? (
                <>
                  {filteredUsers.map((item, i) => (
                    <>
                      <li
                        key={i}
                        onClick={() => handleSelectEmployee(item)}
                        className="p-2 cursor-pointer hover:bg-gray-200"
                      >
                        {item.name} ({item.employee_id})
                      </li>
                    </>
                  ))}
                  <button
                    className="cursor-pointer text-red-600  px-2"
                    onClick={() => setShowDropdown(false)}
                  >
                    X
                  </button>
                </>
              ) : (
                <li
                  onClick={() => setShowDropdown(false)}
                  className="p-1 text-gray-500"
                >
                  No employees found
                </li>
              )}
            </ul>
            )} */}
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-base text-black font-bold pb-5">
                Employee Name
              </p>
              <select
                id="employee_name"
                name="employee_name"
                // value={attendanceData.}
                onChange={(e) => handleGetusername(e)}
                className="bg-[#eeeeee70] w-full p-4 rounded-[12px]"
              >
                <option value="" disabled>
                  Employee Name With ID
                </option>
                {userArra?.map((item, i) => (
                  <option key={i} value={item?._id}>
                    {item?.name} ({item?.employee_id})
                  </option>
                ))}
              </select>

              {/* {errors.selectedemplyes && (
                    <p className="text-red-500">{errors.selectedemplyes}</p>
                  )} */}
            </div>
            <div>
              <p className="text-base text-black font-bold pb-5">
                Working Date (Pick First)
              </p>
              <input
                type="date"
                name="date"
                value={attendanceData.date}
                onChange={handleChange}
                required
                className="border p-4 rounded-[5px] w-full"
              />
            </div>

            <div>
              <p className="text-base text-black font-bold pb-5">Login time </p>
              <input
                type="datetime-local"
                name="login_time"
                placeholder="Login Time"
                value={attendanceData.login_time}
                onChange={handleChange}
                required
                className="border p-4 rounded-[5px] w-full"
                disabled={!attendanceData.date} // Disable until date is selected
              />
            </div>

            <div>
              <p className="text-base text-black font-bold pb-5">Logout time</p>
              <input
                type="datetime-local"
                name="logout_time"
                placeholder="Logout Time"
                value={attendanceData.logout_time}
                onChange={handleChange}
                required
                className="border p-4 rounded-[5px] w-full"
                disabled={!attendanceData.login_time} // Disable until login_time is selected
              />
            </div>
            <select
              name="status"
              value={attendanceData.status}
              onChange={handleChange}
              className="border p-4 rounded-[5px]"
              required
            >
              <option selected disabled value="">
                Login Status
              </option>
              <option value="regular office">Regular Office</option>
              <option value="late">Late</option>
              <option value="halfday absent">Halfday Absent</option>
              <option value="fullday absent">Fullday Absent</option>
            </select>
            <select
              name="end_status"
              value={attendanceData.end_status}
              onChange={handleChange}
              className="border p-4 rounded-[5px]"
              required
            >
              <option selected disabled value="">
                Logout Status
              </option>
              <option value="early end">Early End</option>
              <option value="regular end">Regular End</option>
              <option value="overtime">Overtime</option>
            </select>
          </div>
          <div className="text-center pt-5">
            <button
              type="submit"
              className="bg-blue-500 text-white text-base  font-normal p-2 rounded"
            >
              Submit
            </button>{" "}
          </div>
        </form>
      </div>
      {/* {show?.status && (
        <div className=" shadow-lg rounded-md h-fit  p-4 w-full mx-auto">
 
          {show?.date && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarAlt className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Office Date</p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {show?.date?.slice(0, 10)}
                </span>
              </div>


              <div className="flex items-center p-3 border-b border-gray-200">
                <FaSignInAlt className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Login Status
                </p>
                <span
                  className={`ml-auto text-sm capitalize ${
                    show?.status === "late" && "text-red-500"
                  } text-gray-700 font-semibold`}
                >
                  {show?.status}
                </span>
              </div>

              <div className="flex items-center p-3 border-b border-gray-200">
                <FaLocationArrow className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Logged From</p>
                <span className="ml-auto text-sm text-gray-700 capitalize font-semibold">
                  {show?.logged}
                </span>
              </div>


              <div className="flex items-center p-3 border-b border-gray-200">
                <FaClock className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Login Time</p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {show?.login_time
                    ? new Date(show.login_time).toLocaleString("en-US", {
                        timeZone: "Asia/Dhaka",
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>


              <div className="flex items-center p-3 border-b border-gray-200">
                <FaHourglassEnd className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">End Status</p>
                <span className="ml-auto capitalize text-sm text-gray-700 font-semibold">
                  {show?.end_status}
                </span>
              </div>


              <div className="flex items-center p-3 border-b border-gray-200">
                <FaSignOutAlt className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Logout Time{" "}
                </p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {show?.logout_time
                    ? new Date(show.logout_time).toLocaleString("en-US", {
                        timeZone: "Asia/Dhaka",
                        hour12: true,
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarDay className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">
                  Total Office Hour:
                </p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {show?.working_hours} H
                </span>
              </div>

              <div className="flex items-center p-3 border-b border-gray-200">
                <FaCalendarDay className="text-purple-500 mr-3" />
                <p className="text-sm font-medium text-gray-600">Overtime:</p>
                <span className="ml-auto text-sm text-gray-700 font-semibold">
                  {show?.over_time?.toFixed(2)} H
                </span>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-5">
            {" "}
            <button
              onClick={() => {
                setShow();
              }}
              className="bg-sky-600 w-fit text-white font-semibold text-sm px-2 py-1 rounded-md"
            >
              Reset
            </button>
          </div>
         
        </div>
      )} */}
       <div>
            <NewAList reset={getDailyReport} meow={newattendance}></NewAList>
     
          </div>
    </>
  );
};

export default Newattendance;

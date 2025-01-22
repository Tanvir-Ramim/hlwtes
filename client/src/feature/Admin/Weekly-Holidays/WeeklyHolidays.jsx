import React, { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";
import Icon from "../../../components/Icon/Icons";
import { RxCross2 } from "react-icons/rx";
const WeeklyHolidays = () => {
  // /////////////////////////////////////////////////////////////
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const [attendanceData, setAttendanceData] = useState({
    id: user?._id,
    employee_name: "",
  });
  const [holidayDate, setHolidayData] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [time, setTime] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [userArra, setUserArra] = useState([]);
  const [show, setShow] = useState({});
  const [searchTerm, setSearchTerm] = useState(user?.name);
  const [showDropdown, setShowDropdown] = useState(false);
  //#### search #######

  const filteredUsers = userArra.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item._id
  );

  // (typing and selection)
  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true); // Show dropdown while typing
  };

  //  employee from the dropdown
  const handleSelectEmployee = (employee) => {
    setAttendanceData({
      id: employee._id,
      employee_name: employee.name,
    });
    setSearchTerm(employee.name);
    setShowDropdown(false);
  };
  //### all user ####

  const getEmployees = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //#### Effect ####
  useEffect(() => {
    getEmployees();
  }, []);
  //### get Holiday #######
  const getHolidayDates = async () => {
    try {
      const res = await ApiClient.get(
        `/setting/holiday?year=${time?.year}&month=${time?.month}&weekly=true&emp=${attendanceData?.id}`
      );
      setHolidayData(res.data.data[0].holiday_list);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getHolidayDates();
  }, [time?.month, attendanceData]);


  let handleGetusername = (e) => {
    const id = e.target.value;
    const data = userArra?.filter((item) => item._id == id);
    setAttendanceData({
      ...attendanceData,
      id: data[0]._id,
      employee_name: data[0].name,
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list, setList] = useState();
  const getReason = (mx) => {
    console.log(mx);
    setList(mx);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          My Weekly Holydays
        </p>
        <div className="flex gap-4  font-semibold">
          <div className="flex gap-2 bg-[#eee] p-2">
            <h1 className="">Month :</h1>
            <select
              value={time.month}
              onChange={(e) =>
                setTime((prev) => ({ ...prev, month: e.target.value }))
              }
              className="bg-[#eee] rounded"
              name=""
              id=""
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="flex gap-3 bg-[#eee] p-2">
            <h1>Year:</h1>
            <input
              value={time?.year}
              onChange={(e) =>
                setTime((prev) => ({ ...prev, year: e.target.value }))
              }
              placeholder="2024"
              className="bg-[#eee] rounded border px-2 w-24 "
              type="text"
            />
          </div>
          <div className="flex gap-3 relative bg-[#eee] p-2">
            {/* <h1>Employee:</h1> */}
            {/* <input
              type="text"
              placeholder="Type or select employee name or ID"
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)}
              className="rounded border bg-[#eee]"
            />
            {showDropdown && (
              <ul className="absolute bg-white  border border-gray-300 max-h-60 top-[42px] z-10  ">
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

            <h1>Employee:</h1>

            <select
              id="employee_name"
              name="employee_name"
              // value={attendanceData.}
              onChange={(e) => handleGetusername(e)}
              className="bg-[#eeeeee70] w-full rounded-[12px]"
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

            <button
              onClick={() =>
                setAttendanceData(
                  { id: "", employee_name: "" },
                  setTime({ month: currentMonth, year: currentYear }),
                  setSearchTerm("")
                )
              }
              className="text-black border font-semibold text-sm rounded-full  "
            >
              {" "}
              <Icon type="reset" />
            </button>
          </div>
        </div>
        <div className=" mt-10">
          <table className="min-w-full ">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4">
                  Date
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Type
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {holidayDate?.map?.(
                (item, i) =>
                  item?.name?.split(" - ")[0] === "Developer"  && (
                    <tr key={i} className="border">
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.date?.slice(0, 10)}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.name?.split(" - ")[0]}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                      {item?.name?.split(" - ")[0] === "Developer" ? (
                     <div className="w-full flex justify-center"> <p onClick={()=>getReason(item?.name?.split(" - ")[1])} className="bg-blue-500 w-fit px-2 rounded cursor-pointer flex items-center justify-center    text-white py-1">View List</p></div>
                    ) : (
                      item?.name?.split(" - ")[1]
                    )}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
        {/* Holiday list */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center w-full  bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6   modal-slide-down relative">
              <button
                className="absolute top-2   right-3 text-red-400"
                onClick={closeModal}
              >
                <RxCross2 />
              </button>
              <h1 className="pt-3 pb-4 font-bold">Assigned Employee List</h1>
              <ul className="space-y-2 pl-5  list-disc grid grid-cols-1">
                {list?.split(",")?.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default WeeklyHolidays;

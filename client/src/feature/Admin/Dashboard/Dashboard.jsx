import React, { useEffect, useState } from "react";
import { dashboard } from "./constants";
import ApiClient from "../../../axios/ApiClient";
import { Link } from "react-router-dom";
import IPsetting from "../IPSetting/IPsetting";
import WorkingHour from "../Woking-hour/WorkingHour";
import Calendar from "../../employee/Home/Calendar";
import WorkPlan from "../../employee/Home/WorkPlan";
import "./Dashboard.css";
const Dashboard = () => {
  const [userArray, setUserArray] = useState(0);
  const [dept, setDept] = useState(0);
  const [leav, setLeav] = useState(0);
  const [att, setAtt] = useState(0);

  const getEmployee = async () => {
    try {
      const [user, depo, reqLeav, attRe] = await Promise.all([
        ApiClient.get("/user/all"),
        ApiClient.get("/departments"),
        ApiClient.get("/leave-apply?status=pending&filter=true"),
        ApiClient.get("/attendance?&isApply=a"),
      ]);
      setAtt(attRe.data.data.length);
      setLeav(reqLeav.data.data.length);
      setUserArray(user.data.data.length);
      setDept(depo.data.length);
    } catch (error) {
      console.log(error);
    }
  };

  // for calender
  const [holidayDate, setHolidayData] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
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

      console.log(res.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const [hrYearEndList, setHrYearEndList] = useState([]);
  const [birthdayList, setBirthdayList] = useState([]);
  const getBirthday = async () => {
    try {
      const res = await ApiClient.get(`/user/birth-endHr`);
      // setHrEndBirth(res.data.data[0].holiday_list);
      console.log();
      setHrYearEndList(res.data.data.hrYearEnd || []);
      setBirthdayList(res.data.data.birthdayList || []);
    } catch (error) {
      console.error(error);
    }
  };

  //////// absent
  const absent = async () => {
    try {
      const res = await ApiClient.get(`/attendance/absents`);

      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getBirthday();
    absent();
  }, []);

  useEffect(() => {
    getHolidayDates();
  }, [time.month]);
  useEffect(() => {
    getEmployee();
  }, []);
  return (
    <>
      <div className="">
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Dashboard
        </p>
        <div className="grid md:grid-cols-4 grid-cols-2 gap-5">
          <Link to="/admin/employee-list">
            <div className="border text-center bg-white rounded-[12px] shadow-xl">
              <div className="py-8 col-span-4 flex flex-col justify-between h-full">
                <a className="text-xl text-primary font-bold tracking-wider capitalize pb-5 ">
                  Total Employees
                </a>
                <p className="text-2xl text-primary font-medium">
                  {userArray}{" "}
                </p>
              </div>
            </div>
          </Link>

          <Link to="/admin/department">
            {" "}
            <div className="border text-center bg-white rounded-[12px] shadow-xl">
              <div className="py-8 col-span-4 flex flex-col justify-between h-full">
                <p className="text-xl  text-primary font-bold tracking-wider capitalize pb-5 ">
                  total Department
                </p>
                <p className="text-2xl text-primary font-medium">{dept} </p>
              </div>
            </div>{" "}
          </Link>

          <Link to="/admin/leave-list">
            {" "}
            <div className="border text-center bg-white rounded-[12px] shadow-xl">
              <div className="py-8 col-span-4 flex flex-col justify-between h-full">
                <p className=" text-xl text-primary font-bold tracking-wider capitalize pb-5 ">
                  leave application
                </p>
                <p className="text-2xl text-primary font-medium">
                  {leav} <span className="text-base">(Pending)</span>{" "}
                </p>
              </div>
            </div>
          </Link>
          <Link to="/admin/correction-list">
            {" "}
            <div className="border text-center bg-white rounded-[12px] shadow-xl">
              <div className="py-8 col-span-2 flex flex-col justify-between h-full">
                <p className="text-xl  text-primary font-bold  tracking-wider capitalize pb-5 ">
                  attendance Correction
                </p>
                <p className="text-2xl text-primary font-medium">{att} </p>
              </div>
            </div>
          </Link>
        </div>

        <div className=" mx-auto pt-12">
          <div className="flex justify-between gap-6">
            {/* HR Year End Section */}
            <div className="bg-white w-[50%] border border-gray-300 p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                HR Year End (Upcoming 60 Days)
              </h2>
              {hrYearEndList?.length > 0 ? (
                <div
                  className={`${
                    hrYearEndList > 4
                      ? "h-[250px] overflow-y-scroll "
                      : "h-fit overflow-hidden"
                  } custom-scrollbar `}
                >
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          HR Year End Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hrYearEndList?.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-t border-gray-200">
                            {user?.name}
                          </td>
                          <td className="px-4 py-2 border-t border-gray-200">
                            {user?.personalEmail}
                          </td>
                          <td className="px-4 py-2 border-t border-gray-200">
                            {user?.hr_end_year?.slice(0, 10)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No Employee Found </p>
              )}
            </div>

            {/* Birthday Section */}
            <div className="bg-white border  w-[50%] border-gray-300 p-4 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                Upcoming Birthdays (Next 30 Days)
              </h2>
              {birthdayList?.length > 0 ? (
                <div
                  className={`${
                    birthdayList?.length > 4
                      ? "h-[250px] overflow-y-scroll "
                      : "h-fit overflow-hidden"
                  } custom-scrollbar `}
                >
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Mail
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                          Birthday Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {birthdayList?.map((user, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-2 border-t border-gray-200">
                            {user?.name}
                          </td>
                          <td className="px-4 py-2 border-t border-gray-200">
                            {user?.personalEmail}
                          </td>
                          <td className="px-4 py-2 border-t border-gray-200">
                            {user?.birthday}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No upcoming birthdays.</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center mt-6">
          <div className="w-full mt-8  border-2 py-5 px-5 rounded shadow-md ">
            <h2 className="text-xl py-2 px-6 font-semibold text-gray-800 mb-3 uppercase"></h2>
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

            <div className=" rounded">
              <Calendar
                month={time?.month}
                year={time?.year}
                holidayList={holidayDate}
              ></Calendar>
            </div>
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

export default Dashboard;

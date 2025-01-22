import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";

const DailyAttendance = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("Developer");
  console.log(departments);
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const employees = [
  //   { id: 1, name: 'John Doe', role: 'Developer', present: true },
  //   { id: 2, name: 'Jane Smith', role: 'Marketing', present: false },
  //   { id: 3, name: 'Robert Brown', role: 'Developer', present: true },
  //   { id: 4, name: 'Emily Davis', role: 'HR', present: true },
  // ];

  const [employees, setEmployees] = useState([]);
  const [absent, setAbsent] = useState([]);
  const getEmployee = async () => {
    try {
      const res = await ApiClient.get(
        `/report/attendance/daily-attendance?dpt=${selectedDepartment}`
      );

      const absentData = res.data.data.matchUser.filter(
        (item) =>
          !res.data.data.attendanceRecords.some(
            (present) => present.employee_id === item.employee_id
          )
      );
      setAbsent(absentData);
      console.log(res.data.data);

      setEmployees(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };
  const getCurrentDate = () => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date().toLocaleDateString("en-US", options);
  };
  const [ipData, setIpData] = useState("Present");
  const [show, setShow] = useState(false);
  const handleTog = (da) => {
    setIpData(da);
  };

  useEffect(() => {
    getEmployee();
  }, [selectedDepartment]);

  useEffect(() => {
    getDept();
  }, []);
  return (
    <div>
      <p className="text-2xl font-bold text-black pb-5 pt-8 uppercase ">
        Daily Attendance
      </p>
      <div>
        <div className=" flex items-center justify-between mb-7">
          <div className="mb-5 flex items-center mt-3 gap-2">
            <label className="block text-gray-700 text-base font-bold mb-2">
              Department:
            </label>
            <select
              className="shadow border rounded  text-center py-1  text-gray-700 focus:outline-none"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
            >
              <option value="">Select</option>
              {departments?.map((dept, index) => (
                <option key={index} value={dept?.name}>
                  {dept?.name}
                </option>
              ))}
            </select>
          </div>
          <div className="text-lg flex justify-center font-semibold text-gray-600 mb-4">
            {getCurrentDate()}
          </div>
        </div>
        <div className="pb-6">
          <div className="relative flex   bg-white shadow-inner rounded-lg  w-full max-w-xs ">
            <div
              className={`absolute left-0 top-0 w-1/2 bg-green-600 rounded h-full transition-transform duration-500 ease-in-out transform ${
                ipData === "Present" ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>
            <button
              className={`z-10 w-1/2 text-center py-2 font-semibold transition-colors duration-500 ease-in-out ${
                ipData === "Present" ? "text-white" : "text-green-600"
              }`}
              onClick={() => {
                handleTog("Present", setShow(true));
              }}
            >
              Present
            </button>
            <button
              className={`z-10 w-1/2 text-center py-2 font-semibold transition-colors duration-500 ease-in-out ${
                ipData === "Absent" ? "text-white" : "text-green-600"
              }`}
              onClick={() => {
                handleTog("Absent"), setShow(false), getDept();
              }}
            >
              Absent
            </button>
          </div>
        </div>

        {ipData === "Present" ? (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#EEEEEE]  text-black">
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-300">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-300">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-300">
                    Login Time
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-300">
                    End Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {employees?.attendanceRecords?.map((employee, index) => (
                  <tr
                    key={employee?.employee_id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } `}
                  >
                    <td className="px-6 py-4 border-b border-gray-300">
                      {employee?.employee_id}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300">
                      {employee?.employee_name}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300">
                      {new Date(employee?.login_time).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300">
                      {employee?.logout_time
                        ? new Date(employee?.logout_time).toLocaleTimeString()
                        : "Ongoing Session"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#EEEEEE]  text-black">
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-300">
                    Employee ID
                  </th>
                  <th className="px-6 py-3 text-left font-semibold uppercase tracking-wider border-b border-gray-300">
                    Name
                  </th>
                </tr>
              </thead>
              <tbody>
                {absent?.map((employee, index) => (
                  <tr
                    key={employee?.employee_id}
                    className={`${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } `}
                  >
                    <td className="px-6 py-4 border-b border-gray-300">
                      {employee?.employee_id}
                    </td>
                    <td className="px-6 py-4 border-b border-gray-300">
                      {employee?.name}
                    </td>
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

export default DailyAttendance;

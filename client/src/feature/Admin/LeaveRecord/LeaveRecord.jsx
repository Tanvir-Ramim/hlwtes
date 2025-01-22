import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";
import "./LeaveRecord.css";
import { format, startOfMonth } from "date-fns";
import { GrPowerReset } from "react-icons/gr";
const LeaveRecord = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [time, setTime] = useState({
    year: currentYear,
    month: currentMonth,
  });
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [id, setId] = useState();
  const [userArra, setUserArra] = useState([]);
  const getEmployees = async () => {
    try {
      const res = await ApiClient.get(
        `/user/all?department=${selectedDepartment}`
      );
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [departments, setDepartments] = useState([]);

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [leaveReqAll, setLeaveReqAll] = useState([]);

  const getData = async () => {
    try {
      const res = await ApiClient.get(
        `/leave-apply/monthly?employee_id=${id}&month=${time?.month}&year=${time?.year}&department=${selectedDepartment}`
      );
      setLeaveReqAll(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const recordRef = useRef();
  const handlePrint = () => {
    if (recordRef.current) {
      const printContent = recordRef.current.innerHTML;
      const originalContent = document.body.innerHTML;
      document.body.innerHTML = printContent;
      window.print();
      document.body.innerHTML = originalContent;
      window.location.reload();
    }
  };
  const firstDayOfMonth = startOfMonth(new Date(time?.year, time?.month - 1));
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0"); 
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };
  useEffect(() => {
    getEmployees();
  }, [selectedDepartment]);
  useEffect(() => {
    getDept();
  }, []);
  useEffect(() => {
    getData();
  }, [time?.month, id, selectedDepartment, time?.year]);
  return (
    <div>
      <p className="text-2xl font-bold text-black pb-10 uppercase">
        Leave Report
      </p>
      <div className="mb-5 flex items-center mt-3 gap-2">
        <label className="block text-gray-700 text-base font-bold mb-2">
          Department:
        </label>
        <select
          className="shadow border rounded mr-4 text-center py-1  text-gray-700 focus:outline-none"
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
        <button
          onClick={() => {
            setSelectedDepartment(""), setId("");
          }}
          className=" text-bl p-1 rounded-full border border-gray-400"
        >
          <GrPowerReset />
        </button>
      </div>

      <div className="flex items-center gap-6 pt-6 pb-2">
        <div className="flex gap-2 items-center">
          <h1 className="text-lg font-semibold text-gray-700">Month:</h1>
          <select
            value={time?.month}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, month: e.target.value }))
            }
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
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

        <div className="flex gap-2 items-center">
          <h1 className="text-lg font-semibold text-gray-700">Year:</h1>
          <input
            value={time?.year}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, year: e.target.value }))
            }
            className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
            type="text"
            placeholder="2024"
          />
        </div>

        <div className="flex gap-2 items-center">
          <p className="text-lg font-semibold  flex gap-2 text-gray-700">Employee <span >Name:</span></p>

          <select
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="bg-[#eee] rounded-lg px-4 py-2 w-[60%] focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option selected value="">
              All
            </option>
            {userArra?.map((item, i) => (
              <option key={i} value={item?.employee_id}>
                {item?.name} ({item?.employee_id})
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={handlePrint}
            className=" px-4 print:px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Print
          </button>
        </div>
      </div>
      <div ref={recordRef} className="mt-4">
        <div>
          <div className="text-center hidden print:block py-3 text-3xl font-semibold">
            Leave Report
          </div>
          <h2 className="text-lg mb-2 hidden print:block text-center text-gray-600">
            {format(firstDayOfMonth, "MMMM yyyy")}
          </h2>
          <h4 className="py-4 hidden print:block">
            Employee : {id ? id : "All"}
          </h4>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-2 border">Employee ID</th>
                <th className="text-left p-2 border">Employee Name</th>
                <th className="text-left p-2 border">Employee Department</th>
                <th className="text-left p-2 border">Leave Types</th>
                <th className="text-left p-2 border">Approval Days</th>
                <th className="text-left p-2 border">Approval Date</th>
                <th className="text-left p-2 border">Leave Start</th>
                <th className="text-left p-2 border">Leave End</th>
              </tr>
            </thead>
            <tbody>
              {leaveReqAll
                ?.slice()
                ?.reverse()
                ?.map((leave) => (
                  <tr key={leave._id} className="border-b">
                    <td className="p-2 border">{leave?.employee_id}</td>
                    <td className="p-2 capitalize border">
                      {leave?.employee_name}
                    </td>
                    <td className="p-2 capitalize border">
                      {leave?.employee_department}
                    </td>
                    <td className="p-2   border">{leave?.leave_type}</td>

                    <td className="p-2 border">{leave?.approval_day}</td>

                    <td className="p-2 border">
                      {/* {new Date(leave?.status_update_date)
                        .toLocaleString()
                        ?.slice(0, 9)} */}
                        {leave?.status_update_date ? formatDate(leave?.status_update_date) : ""}
                    </td>
                    <td className="p-2 border">
                      {/* {new Date(leave?.start_date)
                        .toLocaleString()
                        ?.slice(0, 9)} */}
                           {leave?.start_date ? formatDate(leave?.start_date) : ""}
                    </td>
                    <td className="p-2 border">
                      {/* {new Date(leave?.end_date).toLocaleString()?.slice(0, 9)} */}
                      {leave?.end_date ? formatDate(leave?.end_date) : ""}
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

export default LeaveRecord;

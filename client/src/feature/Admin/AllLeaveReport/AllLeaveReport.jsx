import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import useEmployee from "../../../hooks/useEmployee";
import { useSelector } from "react-redux";
const AllLeaveReport = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  console.log(user);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  console.log(selectedDepartment);
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
  const [userArra, setUserArra] = useState([]);
  const [employeSelect, setEmployeeSelect] = useState();
  const getEmployees = async () => {
    try {
      const res = await ApiClient.get(
        `/user/all?department=${selectedDepartment}`
      );
      console.log(res);
      setUserArra(res.data.data);
      if (!selectedDepartment) {
        const newArra = res.data.data?.filter(
          (item) => item?.employee_id === user?.employee_id
        );
        setEmployeeSelect(newArra[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [employeeData, setEmployeeData] = useState(null);
  const [employee_id, setEmployee_id] = useState(user?.employee_id);
  const [employeeName, setEmployeeName] = useState(user?.name);
  const [leave, setLeave] = useState([]);

  const getLeave = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-type");
      setLeave(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handleValue = (value) => {
    const newValue = JSON.parse(value);
    console.log(newValue);
    setEmployee_id(newValue?.employee_id);
    setEmployeeName(newValue?.name);
    handlefitler(newValue);
  };

  const handlefitler = (value) => {
    const newArra = userArra?.filter(
      (item) => item?.employee_id === value?.employee_id
    );

    setEmployeeSelect(newArra[0]);
  };

  const handleGetEmployee = async () => {
    try {
      const res = await ApiClient.get(
        `/leave-apply?employee_id=${employee_id}&employee_name=${employeeName}&leave_type=Casual Leave&status=approved&emp=true`
      );
      console.log(res.data);
      setEmployeeData(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log();
  useEffect(() => {
    getDept();
    getLeave();
  }, []);

  useEffect(() => {
    handleGetEmployee();
  }, [employeeName, employee_id, employeSelect]);
  useEffect(() => {
    getEmployees();
  }, [selectedDepartment]);
  console.log(employeSelect);
  return (
    <div>
      <p className="text-2xl font-bold text-black pb-10 uppercase">
        Leave Overview
      </p>
      <div>
        <div className="flex items-center  gap-6 pt-6 pb-5">
          <div className=" flex items-center  gap-2">
            <label className="block text-gray-700 text-base font-bold mb-2">
              Department:
            </label>
            <select
              className="bg-[#eee] rounded-lg px-4 py-1.5 w-[60%] focus:outline-none focus:ring focus:ring-blue-300"
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

          <div className="flex gap-2  items-center">
            <p className="text-lg font-semibold  gap-2 flex  text-gray-700">
              Employee <span> Name:</span>
            </p>

            <select
              onChange={(e) => handleValue(e.target.value)}
              className="bg-[#eee] rounded-lg px-4 py-2 w-[60%] focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option selected value="">
                select
              </option>
              {userArra?.map((item, i) => (
                <option key={i} value={JSON.stringify(item)}>
                  {item?.name} ({item?.employee_id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="border mt-8 py-6 px-6 shadow-md rounded-lg bg-gray-50">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-6">
          {/* <div className="border text-center rounded-lg shadow-md bg-white">
      <div className="py-6 flex flex-col justify-between h-full">
        <p className="text-lg font-semibold text-gray-800 pb-4">HR Year Start</p>
        <p className="text-gray-600 text-base">{user?.hr_start_year?.slice(0, 10)}</p>
      </div>
    </div>
    <div className="border text-center rounded-lg shadow-md bg-white">
      <div className="py-6 flex flex-col justify-between h-full">
        <p className="text-lg font-semibold text-gray-800 pb-4">HR Year End</p>
        <p className="text-gray-600 text-base">{user?.hr_end_year?.slice(0, 10)}</p>
      </div>
    </div> */}
          {/* <div className="border text-center rounded-lg shadow-md bg-white">
      <div className="py-6 flex flex-col justify-between h-full">
        <p className="text-lg font-semibold text-gray-800 pb-4">Total Yearly Leave</p>
        <p className="text-gray-600 text-base">{user?.total_leaves}</p>
      </div>
    </div>
    <div className="border text-center rounded-lg shadow-md bg-white">
      <div className="py-6 flex flex-col justify-between h-full">
        <p className="text-lg font-semibold text-gray-800 pb-4">Leave Balance</p>
        <p className="text-gray-600 text-base">{user?.leave_balance}</p>
      </div>
    </div> */}
        </div>

        <div className="grid md:grid-cols-4 grid-cols-2 gap-6 mt-6">
          <div className="border text-center rounded-lg shadow-md bg-white">
            <div className="py-6 flex flex-col justify-between h-full">
              <p className="text-lg font-semibold text-gray-800 pb-4">
                Total Yearly Leave
              </p>
              <p className="text-gray-600 text-base">
                {employeSelect?.total_leaves}
              </p>
            </div>
          </div>
          <div className="border text-center rounded-lg shadow-md bg-white">
            <div className="py-6 flex flex-col justify-between h-full">
              <p className="text-lg font-semibold text-gray-800 pb-4">
                Leave Balance
              </p>
              <p className="text-gray-600 text-base">
                {employeSelect?.leave_balance}
              </p>
            </div>
          </div>
          {leave?.map(
            (item, i) =>
              (user?.gender === "Male"
                ? item?.name !== "Maternity Leave"
                : item?.name !== "Paternity Leave") &&
              item?.duration_Type === "Full Day" && ( // Add condition here
                <div
                  key={i}
                  className="border text-center rounded-lg shadow-md bg-white"
                >
                  <div className="py-6 flex flex-col justify-between h-full">
                    <p className="text-lg font-semibold text-gray-800 pb-4">
                      Remaining {item?.name}
                    </p>
                    <p className="text-gray-600 text-base">
                      {/* {item?.day -
                        (employeeData?.leaveSummary?.[`${item?.name}`] || 0)} */}
                          {item?.day -
                              (employeeData?.leaveSummary?.[
                                Object.keys(
                                  employeeData?.leaveSummary || {}
                                ).find((key) =>
                                  key.startsWith(item?.name?.split(" ")[0])
                                )
                              ] || 0)}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AllLeaveReport;

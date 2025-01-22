import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";

const YearlyLeaveHoly = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  const [selectedOption, setSelectedOption] = useState("hrYearly");
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
  console.log(selectedOption);
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
  const getEmployees = async () => {
    try {
      const res = await ApiClient.get(
        `/user/all?department=${selectedDepartment}`
      );
      console.log(res);
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [id, setId] = useState(userArra[0]?.id);
  const [allData, setAllData] = useState({});
  const getData = async () => {
    try {
      const res = await ApiClient.get(
        `/leave-apply/yearly-leave?type=${selectedOption}&employee_id=${
          id ? id : user?._id
        }&year=${time?.year}`
      );
      setAllData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
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
  }, [id, time?.year,selectedOption]);

  return (
    <div>
      <p className="text-2xl font-bold text-black pt-5 pb-8 uppercase">
        Yearly Leave & Holiday Report
      </p>
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
        {/* <div className="flex gap-2 items-center">
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
        </div> */}

        <div className="flex gap-2  items-center">
          <p className="text-lg font-semibold  gap-2 flex  text-gray-700">
            Employee <span> Name:</span>
          </p>

          <select
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="bg-[#eee] rounded-lg px-4 py-2 w-[60%] focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option selected value="">
              select
            </option>
            {userArra?.map((item, i) => (
              <option key={i} value={item?._id}>
                {item?.name} ({item?.employee_id})
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-4">
          {/* Checkbox Section */}
          <div className="flex gap-4 items-center">
            {/* HR Yearly Checkbox */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedOption === "hrYearly"}
                onChange={() =>
                  setSelectedOption(
                    selectedOption === "hrYearly" ? null : "hrYearly"
                  )
                }
                className="mr-2"
              />
              <span className="text-gray-700 flex ">
                HR  <span className="ml-1">Yearly</span>
              </span>
            </label>

            {/* Yearly Checkbox */}
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={selectedOption === "yearly"}
                onChange={() =>
                  setSelectedOption(
                    selectedOption === "yearly" ? null : "yearly"
                  )
                }
                className="mr-2"
              />
              <span className="text-gray-700">Yearly</span>
            </label>
            {selectedOption === "yearly" && (
              <div className="w-fit">
                <input
                  value={time?.year}
                  onChange={(e) =>
                    setTime((prev) => ({ ...prev, year: e.target.value }))
                  }
                  className="bg-gray-200 w-fit text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  type="text"
                  placeholder="2024"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-">
        <div>
          {/* <div className="text-center hidden print:block py-3 text-3xl font-semibold">
            Leave Report Yearly
          </div> */}
          <div className="py-6 flex gap-6">
            <p className="capitalize font-semibold">
              Name :{" "}
              <span className="font-normal text-lg"> {allData?.name} </span>
            </p>
            <p className="capitalize font-semibold">
              Department :{" "}
              <span className="font-normal text-lg">
                {" "}
                {allData?.department}{" "}
              </span>
            </p>
          </div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-2 border">Type</th>
                <th className="text-left p-2 border">Leave Types</th>
                <th className="text-left p-2 border">Leave Start</th>
                <th className="text-left p-2 border">Leave End</th>
              </tr>
            </thead>
            <tbody>
              {allData?.leaveData?.map((leave) => (
                <tr key={leave._id} className="border-b">
                  <td className="p-2 capitalize border">{leave?.type}</td>
                  <td className="p-2   border">
                    {leave?.leave_type?.split(" - ")[0]}
                  </td>

                  <td className="p-2 border">
                    {leave?.start_date ? formatDate(leave.start_date) : ""}
                  </td>
                  <td className="p-2 border">
                    {/* {new Date(leave?.end_date).toLocaleString()?.slice(0, 9)} */}
                    {leave?.end_date ? formatDate(leave.end_date) : ""}
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

export default YearlyLeaveHoly;

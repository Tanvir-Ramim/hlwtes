import { useEffect, useState } from "react";

import ApiClient from "../../../axios/ApiClient";
import { isDate } from "date-fns";

const Department = () => {
  const [userArray, setUserArray] = useState([]);
  const [departmentData, setDepartmentData] = useState({
    name: "",
    description: "",
    head_of_department: "",
  });

  const [message, setMessage] = useState("");
  const [ipData, setIpData] = useState("Department");
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [dept, setDpt] = useState([]);
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData({ ...departmentData, [name]: value });
  };

  // Handle form submission add dept ####
  const handleSubmit = async (e) => {
    window.confirm("Are You Sure?");
    e.preventDefault();
    try {
      const response = await ApiClient.post("/departments", {
        departmentData,
      });

      // const data = await response.json();

      if (response.status === 201) {
        getEmployee();
        getDept();
        setMessage("Department added successfully!");
        setDepartmentData({
          name: "",
          description: "",
          head_of_department: "",
        });
      } else {
        setError(response.response.data.message || "Failed to add department.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };
  //### get DeptEmp###########
  const getEmployee = async () => {
    try {
      const res = await ApiClient.get("/user/all?department=all");

      setUserArray(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //### get Dept###########
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      console.log(res);
      setDpt(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  //### get Dept###########
  const delDept = async (id) => {
    window.confirm("Are You Sure?");
    try {
      const res = await ApiClient.delete(`/departments/${id}`);

      if (res.status === 204) {
        getDept();
        alert("Deleted");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
    getDept();
  }, []);

  const handleTog = (da) => {
    setIpData(da);
  };
  console.log(dept);
  return (
    <>
      <p className="text-2xl  font-bold text-black pb-14 relative uppercase">
        Manage Department
      </p>
      <div className="px-3 py-2 gap-7 flex justify-between">
        <div className=" w-[45%] bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">Add Department</h2>
          {message && <div className="text-green-600">{message}</div>}

          <form onSubmit={handleSubmit}>
            {/* Department Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block pb-2 text-gray-700 font-bold"
              >
                Department Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={departmentData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            {/* Description */}
            <div className="mb-4 hidden">
              <label
                htmlFor="description"
                className="block text-gray-700  font-bold"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={departmentData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
            </div>

            {/* Head of Department */}
            {/* <div className="mb-4 " >
            <label
              htmlFor="head_of_department"
              className="block text-gray-700 font-bold"
            >
              Head of Department
            </label>
            <input
              type="text"
              id="head_of_department"
              name="head_of_department"
              value={departmentData.head_of_department}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div> */}

            {/* Submit Button */}
            <div className="flex mt-8  justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        <div className=" w-[55%]">
          <div className="relative flex  bg-white shadow-inner rounded-lg  justify-end w-full max-w-xs ">
            <div
              className={`absolute left-0 top-0 w-1/2 bg-green-600 rounded h-full transition-transform duration-500 ease-in-out transform ${
                ipData === "Department" ? "translate-x-0" : "translate-x-full"
              }`}
            ></div>
            <button
              className={`z-10 w-1/2 text-center py-1 font-semibold transition-colors duration-500 ease-in-out ${
                ipData === "Department" ? "text-white" : "text-green-600"
              }`}
              onClick={() => {
                handleTog("Department", setShow(true));
              }}
            >
              <span className="text-">Department</span>
            </button>
            <button
              className={`z-10 w-1/2 text-center py-1 font-semibold transition-colors duration-500 ease-in-out ${
                ipData === "Employee" ? "text-white" : "text-green-600"
              }`}
              onClick={() => {
                handleTog("Employee"), setShow(false), getDept();
              }}
            >
              Employee <br />
              <span className="text-xs"> (Department wise)</span>
            </button>
          </div>
          {/* only dept_emp info  */}
          {ipData !== "Department" && (
            <>
              <div className="bg-[#eee] flex justify-between p-4 mt-4">
                <p className="text-black font-bold text-base  text-center p-4 ">
                  Department
                </p>
                <p className="text-black  font-bold  text-base  text-center p-4 capitalize">
                  Total Employees
                </p>
              </div>

              {/* Display All Submitted Data */}
              {userArray?.length > 0 && (
                <div>
                  {userArray?.map((dept, index) => (
                    <div
                      key={index}
                      className="bg-[#eee] flex justify-between items-center p-4 mt-4"
                    >
                      <p className="text-black capitalize text-base font-semibold text-center p-4">
                        {dept?._id}
                      </p>
                      <p className="text-black text-base font-semibold text-center p-4">
                        {dept?.totalUsers}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
          {/* only dept info  */}
          {ipData === "Department" && (
            <>
              <div className="bg-[#eee] flex justify-between p-4 mt-4">
                <p className="text-black font-bold text-base  text-center p-4 ">
                  Department
                </p>
                {/* <p className="text-black  font-bold  text-base  text-center p-4 capitalize">
                Info
              </p> */}
                {/* <p className="text-black  font-bold  text-base  text-center p-4 capitalize">
                Head of Dept
              </p> */}
                <p className="text-black  font-bold  text-base  text-center p-4 capitalize">
                  Action
                </p>
              </div>

              {/* Display All Submitted Data */}
              {dept?.length > 0 && (
                <div>
                  {dept?.map((dept, index) => (
                    <div
                      key={index}
                      className="bg-[#eee] flex justify-between items-center p-4 mt-4"
                    >
                      <p className="text-black capitalize text-base font-semibold text-center p-4">
                        {dept?.name}
                      </p>
                      {/* <p className="text-black  text-base font-semibold text-center p-4">
                      {dept?.description}
                    </p> */}
                      {/* <p className="text-black text-base font-semibold text-center p-4">
                      {dept?.head_of_department}
                    </p> */}
                      <button
                        onClick={() => delDept(dept?._id)}
                        className="text-red-600 text-base font-semibold text-center p-4"
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Department;

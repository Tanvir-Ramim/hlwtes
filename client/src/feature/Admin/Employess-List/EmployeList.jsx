import { useEffect, useState } from "react";

import TypeIcon from "../../../components/Icon/Icons";
import { Link, useAsyncError } from "react-router-dom";
import ApiClient from "../../../axios/ApiClient";
import { RxCross2 } from "react-icons/rx";
import toast from "react-hot-toast";

const EmployeList = () => {
  const [employees, setEmployees] = useState([]);
  const [hr, setHr] = useState(-1);
  const [departmentValue, setDepartmentValue] = useState();
  const getEmployee = async () => {
    try {
      const res = await ApiClient.get(
        `/user/all?hr_year=${hr}&department=${departmentValue}`
      );
      setEmployees(res.data.data);
      // setIs_Active()
    } catch (error) {
      console.log(error);
    }
  };

  const [modalData, setModalData] = useState();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const handleOpenModal = (value) => {
    setModalData(value);
    setIsOpenModal(true);
  };

  const handleActive = async (value, id) => {
    console.log(value);
    const data = {
      login_access: value,
    };
    try {
      const res = await ApiClient.patch(`/user/${id}`, data);
      if (res.status === 204) {
        toast.success("Successfully Update");
        getEmployee();
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, [hr, departmentValue]);

  const [departments, setDepartments] = useState([]);
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDept();
  }, []);
  return (
    <>
      <div>
        <div className="flex items-center gap-4 pb-10 ">
          <p className="text-2xl font-bold text-black  uppercase">
            Employee List
          </p>
          <div>
            {" "}
            <select
              onChange={(e) => setDepartmentValue(e.target.value)}
              name="department"
              className="shadow border rounded  text-sm text-center py-1  text-gray-700 focus:outline-none"
            >
              <option value="">Select</option>
              {departments?.map((dept, index) => (
                <option key={index} value={dept?.name}>
                  {dept?.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="py-2">
          <span> HR Year :</span>
          <button
            onClick={() => (hr === 1 ? setHr(-1) : setHr(1))}
            className="bg-gray-500 text-white px-2 py-[2px]  rounded ml-1"
          >
            {hr === -1 ? "Ending" : "Reset"}
          </button>
        </div>
        <div className="border-t grid grid-cols-4 gap-10 py-10">
          {employees?.map((item, index) => (
            <div key={index} className="border">
              <div className="bg-black relative h-[100px] ">
                <div className="absolute -bottom-10 left-[50%] translate-x-[-50%] w-[100px] h-[100px]">
                  <picture>
                    <img
                      // src={
                      //   item?.url?.url ||
                      //   "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                      // }
                      src={
                        item?.url?.url ||
                        (item?.gender === "Male"
                          ? "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VV7dlZvxOseZJqh0baBIHNre1tzNjcZpXQ&s")
                      }
                      alt=""
                      className="w-full h-full object-contain object-center p- bg-white rounded-full mx-auto "
                    />
                  </picture>
                </div>
              </div>
              <div className="pt-12 w- text-center p-2">
                <p className="text-sm text-black capitalize font-bold">
                  {item?.name}
                </p>
                <p className="text-sm text-black font-normal line-clamp-1 pt-1">
                  {item?.email}
                </p>
                <p className="text-sm text-black capitalize font-normal pt-1">
                  {item?.role} {item?.designation}
                </p>
                <p className="text-sm text-black font-normal pt-1">
                  {item?.employee_id}
                </p>
                <div className="text-sm mt-2 text-red-400 ">
                  {new Date(item?.hr_end_year).getDate() -
                    new Date().getDate() <=
                    7 &&
                  new Date(item?.hr_end_year).getDate() -
                    new Date().getDate() >=
                    1 ? (
                    "HR Year End : " + item?.hr_end_year?.slice(0, 10)
                  ) : (
                    <span className="text-gray-500 ">
                      HR Year End : {item?.hr_end_year?.slice(0, 10)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between p-2">
                <p
                  onClick={() => handleOpenModal(item)}
                  className="capitalize cursor-pointer text-primary text-sm font-semibold"
                >
                  view
                </p>

                <div>
                  <Link to={`/admin/edit-employee/${item?._id}`}>
                    <span className="text-green-600">
                      <TypeIcon type="Edit" />
                    </span>
                  </Link>
                </div>
              </div>
              {/* <div>
                <p
                  className={`${
                    item?.isActive ? "bg-green-600" : "bg-red-600"
                  } text-white font-bold py-1 capitalize border text-center`}
                >
                  {item?.isActive ? "active" : "inactive"}
                </p>
              </div> */}
              <div className="relative flex justify-center items-center bg-white shadow-inner rounded-lg  w-full max-w-xs mx-auto">
                <div
                  className={`absolute left-0 top-0 w-1/2 ${
                    item?.login_access ? "bg-green-600" : "bg-red-500"
                  } rounded h-full transition-transform duration-500 ease-in-out transform ${
                    item?.login_access ? "translate-x-0" : "translate-x-full"
                  }`}
                ></div>
                <button
                  className={`z-10 w-1/2 text-center py-1.5 font-semibold transition-colors duration-500 ease-in-out ${
                    item?.login_access ? "text-white" : "text-gray-600"
                  }`}
                  onClick={() => handleActive(true, item._id)}
                >
                  Active
                </button>
                <button
                  className={`z-10 w-1/2 text-center py-1.5 font-semibold transition-colors duration-500 ease-in-out ${
                    !item?.login_access ? "text-white" : "text-gray-600"
                  }`}
                  onClick={() => handleActive(false, item._id)}
                >
                  Inactive
                </button>
              </div>
            </div>
          ))}
        </div>
        {isOpenModal && (
          <div className="fixed z-50 inset-0 flex items-center justify-center w-full bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl relative modal-slide-down max-w-lg w-full transform transition-transform duration-300">
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition transform hover:scale-110"
                onClick={() => setIsOpenModal(false)}
              >
                <RxCross2 size={20} />
              </button>

              {/* Employee Image and Basic Info */}
              <div className="flex items-center border-b pb-3 mb-2">
                <img
                  src={
                    modalData?.url?.url ||
                    "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                  }
                  alt="Employee Avatar"
                  className="w-20 h-20 rounded-full border-2 border-gray-300 shadow-sm"
                />
                <div className="ml-4">
                  <h2 className="text-2xl font-semibold text-gray-900 leading-tight">
                    {modalData?.name ?? "N/A"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {modalData?.designation ?? "N/A"}
                  </p>
                  <p className="text-xs text-gray-400">
                    Employee ID: {modalData?.employee_id ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* Employee Details */}
              <div className="grid grid-cols-2 gap-6 text-sm text-gray-700">
                <div>
                  <p>
                    <span className="font-medium">Email:</span>{" "}
                    {modalData?.email ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Personal Email:</span>{" "}
                    {modalData?.personalEmail ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {modalData?.phone ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Address:</span>{" "}
                    {modalData?.address ?? "N/A"}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-medium capitalize">Department:</span>{" "}
                    {modalData?.department ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium capitalize">Role:</span>{" "}
                    {modalData?.role ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Job Type:</span>{" "}
                    {modalData?.job_type ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Employment Status:</span>{" "}
                    {modalData?.employment_status ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span>{" "}
                    {modalData?.gender ?? "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-sm flex justify-between items-center text-gray-700 space-y-2">
                {/* <p>
                  <span className="font-medium">Salary:</span>
                  {modalData?.salary ?? 0}
                </p> */}
                <p>
                  <span className="font-medium">Verified:</span>{" "}
                  {modalData?.isVerified ? "Yes" : "No"}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="border p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">Join Date</p>
                  <p>{modalData?.join_date?.slice(0, 10)}</p>
                </div>
                <div className="border p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">Permanent Date</p>

                  <p>{modalData?.permanent_date?.slice(0, 10)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="border p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">HR Start Year</p>
                  <p>{modalData?.hr_start_year?.slice(0, 10)}</p>
                </div>
                <div className="border p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">HR End Year</p>
                  <p>{modalData?.hr_end_year?.slice(0, 10)}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="border p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">Leave Balance</p>
                  <p>{modalData?.leave_balance ?? "N/A"}</p>
                </div>
                <div className="border p-3 rounded-lg text-center">
                  <p className="text-sm font-medium">Total Leaves</p>
                  <p>{modalData?.total_leaves ?? "N/A"}</p>
                </div>
              </div>

              <div className="mt-5 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">
                  Emergency Contact
                </h3>
                <div className="text-sm text-gray-700 space-y-1">
                  <p>
                    <span className="font-medium">Name:</span>{" "}
                    {modalData?.emergency_contact?.name ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Relationship:</span>{" "}
                    {modalData?.emergency_contact?.relationship ?? "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span>{" "}
                    {modalData?.emergency_contact?.phone ?? "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default EmployeList;

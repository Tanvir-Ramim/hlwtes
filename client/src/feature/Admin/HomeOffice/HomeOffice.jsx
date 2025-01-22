import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";
import Modal from "./Modal";
import Icon from "../../../components/Icon/Icons";
const HomeOffice = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const [userArray, setUserArray] = useState([]);
  const [id, setId] = useState("");

  const getEmployee = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      console.log(res);
      setUserArray(res.data.data);
      setArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleSaveSpecialHome = async (employeeId, updatedSpecialHome) => {
    try {
      const res = await ApiClient.patch(`/user/${employeeId}`, {
        speciacl_home: updatedSpecialHome,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
    console.log("Saving special home for:", employeeId, updatedSpecialHome);
  };
  console.log(user);
  useEffect(() => {
    getEmployee();
  }, []);

  const mx = (id) => {
    const filterarry = userArray.filter((item, i) => {
      if (i === id) {
        console.log(item);
        return item;
      } else {
        return [];
      }
    });
    return filterarry;
  };

  const [showModal, setShowModal] = useState(false);
  const [singleValue, setSingleValue] = useState([]);

  const openModal = (value) => {
    setShowModal(true);
    setSingleValue(value);
  };
  //
  const [arra, setArra] = useState([]);
  useEffect(() => {
    if (id !== "") {
      const filter = userArray?.filter((item) => item?.employee_id === id);
      setArra(filter);
    } else {
      getEmployee();
    }
  }, [id]);
  return (
    <>
      <p className="text-2xl font-bold text-black pb-10 uppercase">
        home office
      </p>
      <div className="overflow-x-auto">
      <div className="flex items-center gap-3">
      <p className="font-semibold  text-xl">Filter By:</p>
        <div className="space-x-3 py-6">
          <select
            name="employee_id"
            placeholder="employee_id"
            className="border rounded  bg-gray-200 p-2"
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
          >
         <option value="" disabled>
                Employee Name With ID
              </option>
              {userArray?.map((item, i) => (
                <option key={i} value={item?.employee_id}>
                  {item?.name} ({item?.employee_id})
                </option>
              ))}

          </select>
             <button
              onClick={() => {
                setId("");
              }}
              className=" text-xl border p-1 rounded-full"
            >
              <Icon type="reset" />
            </button>
        </div>
      </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-2 border">Employee ID</th>
              <th className="text-left p-2 border">Info</th>

              <th className="text-left p-2 border">Active Status</th>
              <th className="text-center p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {arra?.map((employee, i) => (
              <tr key={employee._id} className="border-b">
                <td className="p-2 border">{employee?.employee_id}</td>
                <td className="p-2 border">
                  {employee?.name} ({employee?.role})<br />
                  {employee?.email}
                </td>

                <td className="p-2 border">
                  {employee?.isActive ? "Active" : "Inactive"}
                </td>

                <td className="p-2 flex  h-full items-base justify-center gap-3 ">
                  <button
                    onClick={() => handleAddClick(employee)}
                    className=" bg-gray-500 flex items-center h-full text-white p-1 text-sm rounded"
                  >
                    <Icon type="add" />
                  </button>
                  <button
                    onClick={() => openModal(employee?.speciacl_home)}
                    className=" bg-gray-500 flex items-center h-full text-white p-1 text-sm rounded"
                  >
                    <Icon type="eye" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedEmployee && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            employee={selectedEmployee}
            onSave={handleSaveSpecialHome}
          />
        )}
        <div>
          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
              <div className="bg-white p-4 rounded-lg shadow-lg w-[300px]">
                <p
                  onClick={() => setShowModal(false)}
                  className="text-red-400 text-center cursor-pointer shadow-lg  rounded-full text-xl size-[30px] flex justify-center items-center"
                >
                  <Icon type="close" />
                </p>
                <p className="text-center py-2 font-medium">
                  {singleValue?.isActive ? "Active" : "InActive"}
                </p>
                <p className="text-center">
                  {singleValue?.day_list?.map((info, i) => (
                    <span
                      className="flex text-center justify-center mt-1"
                      key={i}
                    >
                      {info?.slice(0, 10)}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeOffice;

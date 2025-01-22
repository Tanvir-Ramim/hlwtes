// import React from "react";
// import TypeIcon from "../../../components/Icon/Icons";

// const LeaveTypes = () => {
//   return (
//     <>
//       <div>
//         <p className="text-2xl font-bold text-black pb-10 uppercase">
//           Leave Types
//         </p>
//         <div className="relative">
//           <button
//             type="button"
//             className="py-2 px-5 bg-primary text-white text-base capitalize font-medium rounded-md"
//           >
//             Add leave
//           </button>
//           <div className="bg-[#eee] p-4 w-[400px] absolute top-[100%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl">
//             <p className="text-black text-base font-semibold text-center p-4 capitalize">
//               add Leave
//             </p>
//             <div>
//               <span className="text-black text-base font-normal text-center capitalize">
//                 <label>Leave Type</label>
//               </span>
//               <div className="mt-3">
//                 <input type="text" className="p-4 bg-white w-full" />
//               </div>
//             </div>
//             <div className="pt-2">
//               <span className="text-black text-base font-normal text-center capitalize">
//                 <label>days</label>
//               </span>
//               <div className="mt-3">
//                 <input type="text" className="p-4 bg-white w-full" />
//               </div>
//             </div>
//             <div className="pt-2">
//               <span className="text-black text-base font-normal text-center capitalize">
//                 <label>descritption</label>
//               </span>
//               <div className="mt-3">
//                 <input type="text" className="p-4 bg-white w-full" />
//               </div>
//             </div>
//             <div className="mt-3 text-center">
//               <button
//                 type="button"
//                 className="py-2 px-5 bg-black text-white text-base capitalize font-medium rounded-md"
//               >
//                 add leaves
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="bg-[#eee] flex justify-between p-4 mt-4">
//           <p className="text-black text-base font-semibold text-center p-4 ">
//             Leave Types
//           </p>
//           <p className="text-black text-base font-semibold text-center p-4 ">
//             Days
//           </p>
//           <p className="text-black text-base font-semibold text-center p-4 ">
//             Description
//           </p>
//           <p className="text-black text-base font-semibold text-center p-4 capitalize">
//             Action
//           </p>
//         </div>

//         <div className="bg-[#eee] flex justify-between p-4 mt-4">
//           <p className="text-black text-base font-semibold text-center p-4 ">
//             annual
//           </p>
//           <p className="text-black text-base font-semibold text-center p-4 ">
//             10
//           </p>
//           <p className="text-black text-base font-semibold text-center p-4 ">
//             anual leave by company
//           </p>
//           <p className="text-black text-base font-semibold text-center p-4 capitalize">
//             Action
//           </p>
//           <span className="text-black text-base font-semibold flex gap-2">
//             <button className="text-blue-500">
//               <TypeIcon type="Edit" />
//             </button>
//             <button className="text-red-500">
//               <TypeIcon type="delete" />
//             </button>
//           </span>
//         </div>
//       </div>
//     </>
//   );
// };

// export default LeaveTypes;
import { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import { RxCross2 } from "react-icons/rx";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";
const LeaveTypes = () => {
  const [editShow, setEditShow] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [updateId, setUpdateId] = useState();
  const [formData, setFormData] = useState({
    name: "",
    day: 0,
    duration_Type: "",
    provision: {
      name: "",
      day: 0,
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
      provision: {
        ...prevFormData.provision,
        name: name === "name" ? value : prevFormData.provision.name,
      },
    }));
  };

  const handleProvisionInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      provision: {
        ...prevFormData.provision,
        [name === "provisionName" ? "name" : name]: value,
      },
    }));
  };

  // get Leave types
  const [allLeaveTypes, setAllLeaveTypes] = useState([]);

  const getLeaveType = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-type");
      setAllLeaveTypes(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getLeaveType();
  }, []);

  const handleAddOrUpdateLeave = async () => {
    if (formData?.name === "") {
      return alert("Please fill in all fields.");
    }
    console.log(formData?.duration_Type);
    if (
      formData?.duration_Type === "" ||
      formData?.duration_Type === "undefined" ||
      formData?.duration_Type === undefined
    ) {
      return alert("Please fill in all fields.");
    }
    try {
      if (editShow) {
        const res = await ApiClient.patch(
          `/setting/leave-type/${updateId}`,
          formData
        );
        setEditShow(false);
        if (res.status === 200) {
          setIsPopupVisible(false);
          toast.success("Successfully Update Leave Types");
          getLeaveType();
          setFormData({
            name: "",
            day: 0,
            provision: {
              name: "",
              day: 0,
            },
          });
        }
      } else {
        const res = await ApiClient.post("/setting/leave-type", formData);
        if (res.status === 201) {
          setIsPopupVisible(false);
          toast.success("Successfully Add Leave Types");
          getLeaveType();
          setFormData({
            name: "",
            day: 0,
            provision: {
              name: "",
              day: 0,
            },
          });
        }
      }
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(error.response.data.error);
    }
  };

  const closePopUp = () => {
    setIsPopupVisible(false);
  };

  // Handle delete leave type
  const handleDelete = async (id) => {
    try {
      const res = await ApiClient.delete(`/setting/leave-type/${id}`);
      if (res.status === 200) {
        toast.success("Successfully Delete Leave Types");
        getLeaveType();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to  Delete Leave Types");
    }
  };

  // Handle edit leave type
  const handleEdit = (value) => {
    console.log(value);
    setUpdateId(value._id);
    setFormData({
      name: value?.name,
      day: value?.day,
      duration_Type: value.duration_Type,
      provision: {
        name: "",
        day: value?.provision?.day,
      },
    });
    setEditShow(true);
    setIsPopupVisible(true);
  };

  // Handle opening the add leave popup
  const handleShowPopup = () => {
    setFormData({
      name: "",
      day: 0,
      provision: {
        name: "",
        day: 0,
      },
    });
    setIsPopupVisible(true);
  };

  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Leave Types
        </p>
        <div className="relative text-right">
          <button
            type="button"
            onClick={handleShowPopup}
            className="py-2 px-5 bg-primary text-white text-base capitalize font-medium rounded-md"
          >
            Add leave
          </button>

          {isPopupVisible && (
            <div className="bg-[#eee] p-4 w-[400px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl">
              <p className="text-end w-full flex justify-end items-end">
                <RxCross2
                  onClick={closePopUp}
                  className="cursor-pointer text-xl text-red-500"
                />
              </p>
              <p className="text-black text-base font-semibold text-center p-4 capitalize">
                {editShow ? "Edit Leave" : "Add Leave"}
              </p>

              <div>
                <p className="text-black text-start text-base font-normal capitalize">
                  <label>Select Duration Type</label>
                </p>
                <div className="mt-3">
                  {/* <input
          type="text"
          className="p-4 bg-white w-full border border-gray-300 rounded-md"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        /> */}
                  <select
                    required
                    value={formData.duration_Type}
                    onChange={handleInputChange}
                    className="p-4 bg-white w-full border border-gray-300 rounded-md"
                    name="duration_Type"
                    id=""
                  >
                    <option value="">select</option>
                    <option value="Full Day">Full Day</option>
                    <option value="Half Day">Half Day</option>
                  </select>
                </div>
              </div>
              <div className="pt-5">
                <p className="text-black text-start text-base font-normal capitalize">
                  <label>Leave Type</label>
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    className="p-4 bg-white w-full border border-gray-300 rounded-md"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="pt-2">
                <p className="text-black text-base text-start font-normal capitalize">
                  <label>Days</label>
                </p>
                <div className="mt-3">
                  <input
                    type="number"
                    className="p-4 bg-white w-full border border-gray-300 rounded-md"
                    name="day"
                    value={formData.day}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <p className="text-black text-base py-5 pb-2 font-normal text-center capitalize">
                <label className="font-semibold">For Provision</label>
              </p>

              <div className="pt-2">
                <p className="text-black text-base text-start font-normal capitalize">
                  <label>Provision Days</label>
                </p>
                <div className="mt-3">
                  <input
                    type="number"
                    className="p-4 bg-white w-full border border-gray-300 rounded-md"
                    name="day"
                    value={formData.provision.day}
                    onChange={handleProvisionInputChange}
                  />
                </div>
              </div>

              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={() => handleAddOrUpdateLeave(formData)}
                  className="py-2 px-5 bg-black text-white text-base capitalize font-medium rounded-md"
                >
                  {editShow ? "Update Leave" : "Add Leave"}
                </button>
              </div>
            </div>
          )}
        </div>
        <div className=" mt-10">
          <table className="min-w-full ">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4">
                  Leave Type
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Duration Type
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Days
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Provision Days
                </th>

                <th className="text-black text-base font-semibold text-center p-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allLeaveTypes?.length > 0 &&
                allLeaveTypes?.map((leave, index) => (
                  <tr key={index} className="border">
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {leave?.name}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {leave?.duration_Type}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {leave?.day}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {leave?.provision?.day}
                    </td>

                    <td className="text-black text-base font-normal text-center p-4 border-b ">
                      <span className="text-black text-base font-semibold flex gap-2 justify-center">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEdit(leave)}
                        >
                          <TypeIcon type="Edit" />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDelete(leave?._id)}
                        >
                          <TypeIcon type="delete" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Display Leave Types */}
      </div>
    </>
  );
};

export default LeaveTypes;

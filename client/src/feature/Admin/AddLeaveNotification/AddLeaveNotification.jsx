import { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";
import { RxCross2 } from "react-icons/rx";
const AddLeaveNotification = () => {
  const [isUpdate, setIsUpdate] = useState(false);
  const [formData, setFormData] = useState({
    leave_type: "",
    notice_period_days: 0,
    description: "",
    duration: 0,
    duration_Type: "",
    isFile: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === "duration" || name === "notice_period_days"
          ? Number(value)
          : value,
    }));
  };
  //   const handleTypeInputChange = (value) => {
  //     console.log(value);
  //     const parsedData = JSON.parse(value);
  //     console.log(parsedData);
  //     setFormData((prevFormData) => ({
  //         ...prevFormData,
  //         leave_type: parsedData?.name,

  //       }));
  //   };

  //    get all leave rules
  const [allLeaveRules, setAllLeaveRules] = useState([]);
  const getAllLeaveRules = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-notification");
      setAllLeaveRules(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get all leave types

  const [allLeaveTypes, setLeaveTypes] = useState([]);
  const getLeaveType = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-type");
      setLeaveTypes(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(formData);
  //   save data
  const handlePost = async () => {
    // formData.isFile ? formData.isFile === "true" : formData.isFile === "false";
    // setFormData(...formData,isFile:formData?.)

    try {
      const res = await ApiClient.post("/setting/leave-notification", formData);
      if (res.status === 201) {
        toast.success("Successfully Add Leave Rules");
        setIsFormVisible(false);
        getAllLeaveRules();
      }
    } catch (error) {
      console.log(error);
    }
  };
  //   update data
  const [updateId, setUpdateId] = useState("");
  const handleUpdate = async () => {
    try {
      console.log();

      const res = await ApiClient.patch(
        `/setting/leave-notification/${updateId}`,
        formData
      );
      if (res.status === 200) {
        toast.success("Successfully Updated Leave Rules");
        getAllLeaveRules();
        setIsFormVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = (value, p) => {
    if (p === "yes") {
      setUpdateId(value?._id);
      setFormData({
        leave_type: value?.leave_type,
        notice_period_days: value?.notice_period_days,
        description: value?.description,
        duration: value?.duration,
        isFile: value?.isFile,
      });
      setIsUpdate(true);
    } else {
      setFormData({
        leave_type: "",
        notice_period_days: null,
        description: "",
        duration: null,
      });
    }
    setIsFormVisible(true);
  };
  const handleClose = () => {
    setIsFormVisible(false);
    setIsUpdate(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await ApiClient.delete(`/setting/leave-notification/${id}`);
      if (res.status === 200) {
        toast.success("Successfully Delete Leave Rules");
        getAllLeaveRules();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaveType();
    getAllLeaveRules();
  }, []);
  console.log(formData);
  return (
    <div>
      <div>
        <div className="flex justify-between py-6">
          <h2 className="text-3xl font-bold text-[#004282] uppercase">
            Add Leave Rules
          </h2>
          <button
            type="button"
            className="py-2 px-5 bg-primary text-white text-base capitalize font-medium rounded-md"
            onClick={() => handleOpen("", "no")}
          >
            Add Leave Rules
          </button>
        </div>

        <div className="relative">
          {isFormVisible && (
            <div className="bg-[#eee] p-4 w-[700px] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl">
              <div className="flex justify-between ">
                <p className="text-black text-base font-semibold text-center p-4 capitalize">
                  Add Leave Rules
                </p>
                <p>
                  <RxCross2
                    onClick={handleClose}
                    className="text-red-400 cursor-pointer text-2xl"
                  />
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="pt-2">
                  <label className="text-black text-base font-normal capitalize">
                    Leave Type
                  </label>
                  <div className="mt-3">
                    <select
                      onChange={handleInputChange}
                      className="p-2 bg-white w-full"
                      value={formData.leave_type}
                      name="leave_type"
                    >
                      <option value="" selected>
                        Select Type
                      </option>
                      {allLeaveTypes?.map((item, i) => (
                        <option key={i} value={item?.name}>
                          {item?.name}{" "}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-black text-base font-normal capitalize text-center">
                    Duration (days)
                  </p>
                  <div className="mt-3">
                    <input
                      type="number"
                      name="duration"
                      defaultValue={formData?.duration}
                      onChange={handleInputChange}
                      className="p-2 bg-white w-full"
                      placeholder="days"
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-black text-base font-normal capitalize text-center">
                    Notice Period Days
                  </p>
                  <div className="mt-3">
                    <input
                      type="number"
                      name="notice_period_days"
                      defaultValue={formData?.notice_period_days}
                      onChange={handleInputChange}
                      className="p-2 bg-white w-full"
                      placeholder="days"
                    />
                  </div>
                </div>
         
                {(formData?.leave_type == "Sick Leave" ||
                  formData?.leave_type == "Sick" ||
                  formData?.leave_type == "sick") && (
                  <div className="mb-4 pt-2 flex gap-2">
                    <label className="block text-gray-700">Upload File :</label>
                    <input
                      type="checkbox"
                      value={true}
                      className="w-4 rounded"
                      checked={formData?.isFile}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFile: e.target.checked ? "true" : "false",
                        })
                      }
                    />
                  </div>
                )}
              </div>
              <div className="pt-2">
                <p className="text-black text-base font-normal capitalize text-center">
                  Description
                </p>
                <div className="mt-3">
                  <textarea
                    type="text"
                    name="description"
                    value={formData?.description}
                    onChange={handleInputChange}
                    className="p-4 bg-white w-full"
                    placeholder="Description"
                  />
                </div>
              </div>

              <div className="mt-3 text-center">
                {isUpdate ? (
                  <button
                    type="button"
                    onClick={handleUpdate}
                    className="py-2 px-5 bg-black text-white text-base capitalize font-medium rounded-md"
                  >
                    Update
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePost}
                    className="py-2 px-5 bg-black text-white text-base capitalize font-medium rounded-md"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-10">
          <table className="min-w-full">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4">
                  Leave Types
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Duration (days)
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Notice Period Days
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Message
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {allLeaveRules?.length > 0 &&
                allLeaveRules?.map((item, index) => (
                  <tr key={index} className="border">
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {item?.leave_type}
          
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {item?.duration}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {item?.notice_period_days}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {item?.description}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b ">
                      <span className="text-black text-base font-semibold flex gap-2 justify-center">
                        <button
                          onClick={() => handleOpen(item, "yes")}
                          className="text-blue-500"
                        >
                          <TypeIcon type="Edit" />
                        </button>
                        <button
                          onClick={() => handleDelete(item?._id)}
                          className="text-red-500"
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
      </div>
    </div>
  );
};

export default AddLeaveNotification;

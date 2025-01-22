import React, { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import Icons from "../../../components/Icon/Icons";
const LeaveApplication = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const [showModal, setShowModal] = useState(false);
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    leave_type: "",
    employee_name: user?.name,
    employee_id: user?.employee_id,
    employee_ref: user?._id,
    employee_department: user?.department,
    start_date: null,
    end_date: null,
    total_days: 0,
    duration: "Full Day",
    reason: "",
    applied_on: getCurrentDate(),
    attachment: null,
    request_for: "Own",
  });

  const [errors, setErrors] = useState({});

  const dateCount = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const differenceInTime = end - start;
    const differenceInDays =
      Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1;
      
    setFormData((prevData) => ({
      ...prevData,
      total_days: differenceInDays,
    }));
  };

  useEffect(() => {
    if (formData.duration === "Full Day") {
      if (formData.start_date && formData.end_date) {
        dateCount(formData.start_date, formData.end_date);
      }
    }else{
      setFormData((prevData) => ({
        ...prevData,
        total_days:0.5,
      })); 
    }
  }, [formData.start_date, formData.end_date]);

  // useEffect(() => {
  //   if (formData.leave_type === "Sick Leave" && formData.total_days > 1) {
  //     setShowModal(true);
  //     setShowModal(false); //
  //   }
  //   else{
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       attachment: null,
  //     }));
  //   }
  // }, [formData.leave_type, formData.total_days]);
  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        attachment: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
      // if(name==="leave_type" ){
      //        if( formData.total_days > 1 ) {
      //           ""
      //        }
      // }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };
  // Handle duration change
  const handleDurationChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      duration: event.target.value,
    }));
  
    setFormData((prevData) => ({
      ...prevData,
      start_date: null,
      end_date: null,
      total_days:0,
    }));
  };

  const handleReqChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      request_for: event.target.value,
    }));
  };

  // Handle date change
  const handleDateChange = (event) => {
    const { id, value } = event.target;
    // if (!formData.duration && formData.duration === "") {
    //   alert("Select Duration first");
    //   return;
    // }
    if (id === "end_date") {
      if (!formData.start_date) {
        alert("Select From Date first");
        return;
      }
      if (formData.duration === "Half Day") {
        if (new Date(value) < new Date(formData.start_date)) {
          alert("To Date must be greater than From Date");
          return;
        }
      } else {
        if (new Date(value) < new Date(formData.start_date)) {
          alert("To Date must be greater than From Date");
          return;
        }
      }
    }
 

    if (formData.duration === "Half Day" && id === "start_date") {

      setFormData((prevData) => ({
        ...prevData,
        start_date: value,
        end_date: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }

    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" }));
  };
  console.log(formData);
  // get employee
  const [leaveTypes, setLeaveTypes] = useState([]);
  const getEmployee = async () => {
    try {
      const res = await ApiClient.get(
        `/setting/leave-type?isFull=${formData?.duration}`
      );
      setLeaveTypes(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [showImageFiled, setShowImageFiled] = useState(false);
  const handleSubmit = async () => {
    const newErrors = {};

    if (!formData.leave_type) {
      newErrors.leave_type = "Leave type is required";
    }
    if (!formData.duration) {
      newErrors.duration = "Select Duration";
    }
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required";
    }
    if (!formData.end_date) {
      newErrors.end_date = "End date is required";
    }
    if (!formData.reason) {
      newErrors.reason = "Reason is required";
    }
    // if (
    //   formData.leave_type === "Sick Leave" &&
    //   formData.total_days > 1 &&
    //   !formData.attachment
    // ) {
    //   newErrors.attachment =
    //     "Doctor's attachment is required for Sick Leave of more than 1 day";
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data = new FormData();
    data.append("leave_type", formData.leave_type);
    data.append("employee_name", formData.employee_name);
    data.append("employee_id", formData.employee_id);
    data.append("start_date", formData.start_date);
    data.append("end_date", formData.end_date);
    data.append("total_days", formData.total_days);
    data.append("duration", formData.duration);
    data.append("reason", formData.reason);
    data.append("employee_ref", formData.employee_ref);
    data.append("applied_on", formData.applied_on);
    data.append("request_for", formData.request_for);
    data.append("employee_department", formData.employee_department);
    if (formData.attachment) {
      data.append("attachment", formData.attachment);
    }

    try {
      const res = await ApiClient.post("/leave-apply", data);
      if (res.status === 201) {
        toast("Successfully Send Your Leave Application", {
          position: "top-center",
        });
        getLeaveApplication();
        setFormData({
          ...formData,
          leave_type: "",
          start_date: null,
          end_date: null,
          total_days: 0,
          duration: "Full Day",
          reason: "",
          attachment: null,
          request_for: "Own",
        });
      }
    } catch (error) {
      toast(error.response?.data?.message, {
        type: "error",
      });
      console.log(error.response.data.message);
      if (
        error.response.data.message ==
        "You need to upload  Doctor's Prescription"
      ) {
        setShowImageFiled(true);
      }
    }
  };

  useEffect(() => {
    setShowImageFiled(false);
    setFormData((prevData) => ({
      ...prevData,
      attachment: null,
    }));
  }, [
    formData.leave_type,
    formData.duration,
    formData.start_date,
    formData.end_date,
    formData.request_for,
  ]);
  const [userArra, setUserArra] = useState([]);

  const getEmployees = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // /leave list
  const [leaveApp, setLeaveApp] = useState([]);
  const getLeaveApplication = async () => {
    try {
      const res = await ApiClient.get(
        `/leave-apply?employee_id=${user?.employee_id}`
      );
      setLeaveApp(res.data.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const [reason, setReason] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const getReason = (mx) => {
    setReason(mx);
    setIsModalOpen(true);
  };

  useEffect(() => {
    getLeaveApplication();
  }, []);

  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    getEmployee();
  }, [formData?.duration]);

  useEffect(() => {
    if (formData.request_for === "Own") {
      setFormData({
        ...formData,
        employee_name: user?.name,
        employee_id: user?.employee_id,
        employee_ref: user?._id,
      });
    }
  }, [formData.request_for]);
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };
  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Leave Application
        </p>
        <div className="">
          <div className="flex items-center gap-24">
            <div className="flex gap-4 items-center">
              <p className="text-base text-black font-bold capitalize">
                Leave Request :
              </p>
              <div className="flex gap-4 ">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="request_for"
                    name="request_for"
                    value="Own"
                    checked={formData?.request_for === "Own"}
                    onChange={handleReqChange}
                    className="size-4"
                  />
                  <span className="text-base text-black capitalize font-normal pl-2">
                    <label htmlFor="Own">Own</label>
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="request_for"
                    name="request_for"
                    value="Others"
                    checked={formData.request_for === "Others"}
                    onChange={handleReqChange}
                    className="size-4"
                  />
                  <span className="text-base text-black capitalize font-normal pl-2">
                    <label htmlFor="Others">Others</label>
                  </span>
                </div>
              </div>
              {errors.radioValue && (
                <p className="text-red-500">{errors.radioValue}</p>
              )}
            </div>
            <div className="p gap-4 flex items-center">
              <p className="text-base text-black font-bold">Duration :</p>
              <div className="flex gap-4 ">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="Full Day"
                    name="duration"
                    value="Full Day"
                    checked={formData.duration === "Full Day"}
                    onChange={handleDurationChange}
                    className="size-4 rounded-[5px]"
                  />
                  <span className="text-base text-black capitalize font-normal pl-2">
                    <label htmlFor="full">Full Day</label>
                  </span>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="Half Day"
                    name="duration"
                    value="Half Day"
                    checked={formData.duration === "Half Day"}
                    onChange={handleDurationChange}
                    className="size-4"
                  />
                  <span className="text-base text-black capitalize font-normal pl-2">
                    <label htmlFor="half">Half Day</label>
                  </span>
                </div>
              </div>
              {errors.duration && (
                <p className="text-red-500">{errors.duration}</p>
              )}
            </div>
          </div>
          <div className="flex gap-7 mt-12 ">
            <div className="w-[50%]">
              {formData.request_for === "Others" ? (
                <div className=" w-full">
                  <p className="text-base text-black font-bold pb-5">
                    Employee Name
                  </p>
                  <div className=" gap-10">
                    <div>
                      <select
                        id="employee_name"
                        name="employee_name"
                        value={formData?.employee_name}
                        onChange={(e) => {
                          const selectedEmployee = userArra.find(
                            (item) => item.name === e.target.value
                          );
                          setFormData({
                            ...formData,
                            employee_name: selectedEmployee?.name,
                            employee_id: selectedEmployee?.employee_id,
                            employee_ref: selectedEmployee?._id,
                          });
                        }}
                        className="bg-[#eeeeee82] w-full p-5 rounded-[5px]"
                      >
                        <option value="" disabled>
                          Employee Name With ID
                        </option>
                        {userArra?.map((item, i) => (
                          <option key={i} value={item?.name}>
                            {item?.name} ({item?.employee_id})
                          </option>
                        ))}
                      </select>

                      {errors.selectedemplyes && (
                        <p className="text-red-500">{errors.selectedemplyes}</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className=" w-full">
                  <div className="gap-10">
                    <div className="relative">
                      <h1 className="text-base text-black font-bold pb-5">
                        My Id
                      </h1>
                      <input
                        defaultValue={user?.employee_id}
                        className="bg-[#eeeeee82] w-full p-5 appearance-none rounded-[5px]"
                        type="text"
                        disabled
                      />
                      {errors.employee_name && (
                        <p className="text-red-500">{errors.employee_name}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="w-[50%]">
              <div className="w-full grid-cols-1 gap-10">
                <div className="relative">
                  <p className="text-base text-black font-bold capitalize pb-5">
                    Leave Type *
                  </p>
                  <select
                    id="leave_type"
                    name="leave_type"
                    value={formData.leave_type}
                    onChange={handleChange}
                    className="bg-[#eeeeee5a] w-full p-5 appearance-none rounded-[5px]"
                  >
                    <option value="" disabled>
                      Select Leave Type
                    </option>
                    {leaveTypes?.map((item, i) =>
                      user?.employee_status !== "intern" ? (
                        <option key={i} value={item?.name}>
                          {item?.name}
                        </option>
                      ) : (
                        <option key={i} value={item?.provision?.name}>
                          {item?.provision?.name}
                        </option>
                      )
                    )}
                  </select>
                  {errors.leave_type && (
                    <p className="text-red-500">{errors.leave_type}</p>
                  )}
                  <span className="absolute right-[20px] top-[70%] -translate-y-[50%]">
                    <TypeIcon type="downArrow" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* )} */}
      </div>
      <div className="flex gap-7 mt-10">
        <div className="w-[50%] gap-10 ">
          <div>
            <p className="text-base text-black font-bold capitalize pb-5">
              From Date *
            </p>
            <input
              type="date"
              id="start_date"
              name="start_date"
              className="border p-4 w-full rounded-[5px]"
              value={formatDate(formData.start_date)}
              onChange={handleDateChange}
            />
            {errors.start_date && (
              <p className="text-red-500">{errors.start_date}</p>
            )}
          </div>
        </div>{" "}
        <div className="w-[50%]">
          <div>
            <p className="text-base text-black font-bold capitalize pb-5">
              To Date *
            </p>
            <input
              type="date"
              disabled={formData.duration === "Half Day" ? true : false}
              name="end_date"
              id="end_date"
              className="border  p-4 w-full rounded-[5px]"
              value={formatDate(formData.end_date)}
              onChange={handleDateChange}
            />
            {errors.end_date && (
              <p className="text-red-500">{errors.end_date}</p>
            )}
          </div>
        </div>
      </div>
      {showImageFiled && (
        <div className="mt-7">
          <p className="text-base text-black font-bold capitalize pb-3">
            Doctor Attachment *
            <span className="text-xs text-red-500">
              (Must add an attachment)
            </span>
          </p>
          <div className="flex flex-col space-y-2">
            <input
              name="attachment"
              onChange={handleChange}
              type="file"
              accept="*/*"
              className="border w-full p-3 text-sm rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      )}
      <div className=" mt-9">
        <div>
          <p className="text-base text-black font-bold capitalize pb-5">
            Reason *
          </p>
          <textarea
            id="reason"
            name="reason"
            rows={4}
            className="border w-full"
            placeholder="write here"
            value={formData.reason}
            onChange={(e) =>
              setFormData((prevData) => ({
                ...prevData,
                reason: e.target.value,
              }))
            }
          ></textarea>
          {errors.reason && <p className="text-red-500">{errors.reason}</p>}{" "}
        </div>
      </div>
      <div className="pt-5 flex justify-center">
        <button
          type="button"
          className="bg-black text-white text-base font-semibold p-2 px-10 rounded-sm capitalize"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      <>
        {formData.request_for === "Own" && (
          <div className="mt-8 mb-12">
            <p className="text-2xl  font-bold text-black uppercase">
              My Leave List
            </p>

            <p className="py-2 pb-7">
              My Leave Balance Remaining : {user?.leave_balance}
            </p>

            <div className="">
              <table className="min-w-full ">
                <thead className="bg-[#eee]">
                  <tr>
                    <th className="text-black text-base font-semibold text-center p-4">
                      No
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Leave Type
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Start Date
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      End Date
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Duration
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Reason
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Approved days
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Approved status
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaveApp?.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {index + 1}
                      </td>

                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.leave_type}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.start_date?.slice(0, 10)}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.end_date?.slice(0, 10)}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.total_days}
                      </td>
                      <td
                        onClick={() => getReason(item?.reason)}
                        className="cursor-pointer text-center p-4 border-b"
                      >
                        <button className="bg-indigo-500 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out">
                          <Icons type="eye" />
                        </button>
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.approval_day}
                      </td>

                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.status} <br />
                        <span>{item?.status_update_date?.slice(0, 10)}</span>
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.approval_note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center w-full  bg-black bg-opacity-50">
                <div className="bg-white rounded-lg p-6   modal-slide-down relative">
                  <button
                    className="absolute top-2   right-3 text-red-400"
                    onClick={closeModal}
                  >
                    <RxCross2 />
                  </button>
                  <div className="space-y-2 ">{reason}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </>
    </>
  );
};

export default LeaveApplication;

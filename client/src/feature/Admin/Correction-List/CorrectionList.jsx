import { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaClock,
  FaEye,
  FaHourglassEnd,
  FaLocationArrow,
  FaSignInAlt,
  FaSignOutAlt,
} from "react-icons/fa";

import { RxCross2 } from "react-icons/rx";
import Icon from "../../../components/Icon/Icons";
const CorrectionList = () => {
  const [selectOption, setSelectOption] = useState("");
  const [days, setDays] = useState("");
  const [notes, setNotes] = useState("");
  const [isApprovedOpen, setIsApprovedOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setSelectOption(value);
    if (value === "approved") {
      setIsApprovedOpen(true); // Open modal for approved
    } else {
      setIsApprovedOpen(false); // Close modal if not approved
    }
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!days) newErrors.days = "Please select the number of days.";
    if (!notes) newErrors.notes = "Please enter notes.";

    if (Object.keys(newErrors).length === 0) {
      console.log("Submitted data", { days, notes });
      setIsApprovedOpen(false); // Close modal on submit
    } else {
      setErrors(newErrors);
    }
  };

  const handleClose = () => {
    setIsApprovedOpen(false); // Close modal manually
  };

  // searce ====
  const [searchQuery, setSearchQuery] = useState(""); // State to store input value

  // Handle input changes
  const handleInputChange = (e) => {
    setSearchQuery(e.target.value); // Update state with input value
  };

  // Handle form submission
  const handleAdd = () => {
    console.log("Search Query:", searchQuery); // Access the input value when the button is clicked
    // You can now perform the search operation or filter data based on the searchQuery value
  };

  const [attendanceData, setAttendanceInfo] = useState([]);
  const getDailyReport = async () => {
    try {
      const res = await ApiClient.get(`/attendance?&isApply=a`);
      setAttendanceInfo(res.data.data);
      
      setMeow(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const [hour, setHour] = useState(0);
  const [note, setNote] = useState("");
  const [appStatus, setappStatus] = useState("");
  const [attendance, setAtttedenceData] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const getReason = (mx) => {
    setAtttedenceData(mx);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [singleEditValue, setSingleEditValue] = useState({
    employee_id: "",
    date: "",
  });
  const [value, setValue] = useState({});
  const openEdit = (mx) => {
    setIsEditOpen(true);
    setSingleEditValue({
      employee_id: mx?.employee_id,
      date: mx?.date,
    });
    setValue(mx?.correction_request);
  };
  function convertTo24Hour(hour, minute, period) {
    let hour24 = parseInt(hour);
    let minute24 = parseInt(minute);
    if (period === "PM" && hour24 !== 12) {
      hour24 += 12;
    }

    if (period === "AM" && hour24 === 12) {
      hour24 = 0;
    }
    return `${hour24}:${minute24}`;
  }
  const hanldeEdit = async () => {
    try {
      const res = await ApiClient.patch(
        `/attendance/${singleEditValue?.employee_id}`,
        {
          working_hours: hour,
          date: singleEditValue?.date,
          approved_note: note,
          approved_status: appStatus,
          login_time: convertTo24Hour(
            value?.start?.hour,
            value?.start?.minute,
            value?.start?.period
          ),
          logout_time: convertTo24Hour(
            value?.end?.hour,
            value?.end?.minute,
            value?.end?.period
          ),
        }
      );
      if (res.status === 200) {
        getDailyReport();
        setIsEditOpen(false);
        alert("Successfully Update");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [meow, setMeow] = useState([]);

  const [isShowReason, setIsShowReason] = useState(false);
  const [reasonData, setReasonData] = useState("");
  const showReason = (value) => {
    setIsShowReason(true);
    setReasonData(value);
  };

  useEffect(() => {
    const filt = attendanceData.filter((it) => it.approved_status === status);
    if (filt?.length > 0) {
      setMeow(filt);
    } else {
      setMeow(attendanceData);
    }
  }, [status]);
  useEffect(() => {
    getDailyReport();
  }, []);

  return (
    <>
      {/* *** my attendance###### */}

      <div>
        <p className="text-2xl font-bold text-black pb-7 uppercase ">
          Attendance Correction List
        </p>
        <div className="flex items-center gap-3">
          <p className="text-xl font-medium text-gray-500">Filter By :</p>
          <div className="space-x-3 py-6">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-400  p-2 rounded-md text-gray-600  font-medium"
            >
              <option selected disabled value="">
                Status
              </option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <button
              onClick={() => {
                setStatus("");
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
              <th className="text-left p-2 border">Employee Name</th>
              <th className="text-left p-2 border">Date</th>
              <th className="text-left p-2 border">Request Message</th>
              <th className="text-left p-2 border">From</th>
              <th className="text-left p-2 border">To</th>
              <th className="text-left p-2 border">Approval Note</th>
              <th className="text-left p-2 border">Approval Status</th>
              <th className="text-left p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {meow?.map((attendance, i) => (
              <tr key={i} className="border-b text-gray-600">
                <td className="p-2 border">{attendance?.employee_id}</td>
                <td className="p-2 border">{attendance?.employee_name}</td>
                <td className="p-2 border">{attendance?.date?.slice(0, 10)}</td>
                <td className="p-2  flex justify-center">
                  {/* {attendance?.correction_request?.message} */}
                  <div
                    onClick={() =>
                      showReason(attendance?.correction_request?.message)
                    }
                    className={`bg-gray-300 flex justify-center mb-2 w-fit p-1 rounded-lg text-center  shadow`}
                  >
                    <FaEye className="text-xl" />
                  </div>
                </td>
                <td className="p-2 border">
                  {attendance?.correction_request?.start?.hour}:{" "}
                  {attendance?.correction_request?.start?.minute}{" "}
                  {attendance?.correction_request?.start?.period}
                </td>
                <td className="p-2 border">
                  {attendance?.correction_request?.end?.hour}:{" "}
                  {attendance?.correction_request?.end?.minute}{" "}
                  {attendance?.correction_request?.end?.period}
                </td>
                <td className="p-2 border">{attendance?.approved_note}</td>
                <td className="py-2 px-3 border capitalize">
                  {attendance?.approved_status} <br />
                  {attendance?.approved_status === "approved" &&
                    `(${attendance?.working_hours} hour)`}{" "}
                  <br />
                  {attendance?.approved_status !== "pending" &&
                    attendance?.updatedAt?.slice(0, 10)}
                </td>

                <td className="p-2 pt-5 space-x-4 flex  justify-center items-center h-full">
                  <button
                    onClick={() => getReason(attendance)}
                    className=" text-gray-700  text-xl rounded "
                  >
                    <Icon type="eye" />
                  </button>
                  <button
                    onClick={() => openEdit(attendance)}
                    className=" text-blue-500  text-xl rounded "
                  >
                    <Icon type="Edit" />
                  </button>
                  {/* <button
                    onClick={() => handleDelete(attendance?._id)}
                    className="bg-red-500 text-white mt-2  px-2 py-1 text-sm rounded "
                  >
                    X
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center w-full  bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6   modal-slide-down relative">
              <button
                className="absolute top-2   right-3 text-red-400"
                onClick={closeModal}
              >
                <RxCross2 />
              </button>
              <div className="space-y-2 ">
                <div className="grid border   grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaCalendarAlt className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Office Date
                    </p>
                    <span className="ml-auto text-sm text-gray-700 font-semibold">
                      {attendance?.date?.slice(0, 10)}
                    </span>
                  </div>

                  {/* Login Status */}
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaSignInAlt className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Login Status
                    </p>
                    <span
                      className={`ml-auto text-sm capitalize ${
                        attendance?.status === "late" && "text-red-500"
                      } text-gray-700 font-semibold`}
                    >
                      {attendance?.status}
                    </span>
                  </div>

                  {/* Logged From */}
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaLocationArrow className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Logged From
                    </p>
                    <span className="ml-auto text-sm text-gray-700 capitalize font-semibold">
                      {attendance?.logged}
                    </span>
                  </div>

                  {/* Login Time */}
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaClock className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Login Time
                    </p>
                    <span className="ml-auto text-sm text-gray-700 font-semibold">
                      {attendance?.login_time
                        ? new Date(attendance.login_time).toLocaleString(
                            "en-US",
                            {
                              timeZone: "Asia/Dhaka",
                              hour12: true,
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )
                        : "N/A"}
                    </span>
                  </div>

                  {/* End Status */}
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaHourglassEnd className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      End Status
                    </p>
                    <span className="ml-auto capitalize text-sm text-gray-700 font-semibold">
                      {attendance?.end_status}
                    </span>
                  </div>

                  {/* Logout Time */}
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaSignOutAlt className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Logout Time{" "}
                    </p>
                    <span className="ml-auto text-sm text-gray-700 font-semibold">
                      {attendance?.logout_time
                        ? new Date(attendance.logout_time).toLocaleString(
                            "en-US",
                            {
                              timeZone: "Asia/Dhaka",
                              hour12: true,
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )
                        : "N/A"}
                    </span>
                  </div>

                  {/* Total Office Hour */}
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaCalendarDay className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Total Office Hour:
                    </p>
                    <span className="ml-auto text-sm text-gray-700 font-semibold">
                      {attendance?.working_hours} H
                    </span>
                  </div>
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaCalendarDay className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Overtime:
                    </p>
                    <span className="ml-auto text-sm text-gray-700 font-semibold">
                      {attendance?.over_time?.toFixed(2)} H
                    </span>
                  </div>
                  <div className="flex items-center p-3 border-b border-gray-200">
                    <FaCalendarDay className="text-purple-500 mr-3" />
                    <p className="text-sm font-medium text-gray-600">
                      Login History:
                    </p>
                    <span className="ml-auto text-sm text-gray-700 font-regular w-full">
                      {attendance?.logHistory?.map((info, i) => (
                        <div key={i}>
                          <div className="flex justify-between">
                            <p>
                              ({i + 1}) Login:{" "}
                              {new Date(info?.login)?.toLocaleString("en-US", {
                                timeZone: "Asia/Dhaka",
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}{" "}
                            </p>
                            <p>
                              Logout:{" "}
                              {new Date(info?.logout)?.toLocaleString("en-US", {
                                timeZone: "Asia/Dhaka",
                                hour12: true,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </p>
                            <p>:{info?.duration}H</p>
                          </div>
                        </div>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          {isEditOpen && (
            <div className="fixed inset-0 flex items-center justify-center w-full  bg-black bg-opacity-50 ">
              <div className="bg-white rounded-lg p-6 relative">
                <button
                  className="absolute top-2 right-3 text-red-400"
                  onClick={() => setIsEditOpen(false)}
                >
                  <RxCross2 />
                </button>

                <h2 className="text-center font-semibold pb-3">
                  Attendence Correction
                </h2>
                <div className="space-y-2 ">
                  <p className="text-sm font-medium">Working Hour</p>
                  <input
                    name="working_hours"
                    type="number"
                    onChange={(e) => setHour(e.target.value)}
                    className="border p-1 rounded bg-gray-200"
                    placeholder="correction hour"
                  />
                  <p className="text-sm font-medium">Approval Note</p>
                  <textarea
                    name="approved_note"
                    type="text"
                    onChange={(e) => setNote(e.target.value)}
                    className="border  w-full h-[35px] p-1 rounded bg-gray-200"
                    placeholder="note"
                  />
                  <select
                    className="border block w-full p-2"
                    onChange={(e) => setappStatus(e.target.value)}
                    name=""
                    id=""
                  >
                    <option selected disabled value="">
                      Status
                    </option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="text-center">
                  <button
                    className="bg-blue-500 text-sm font-semibold rounded mt-4 text-white p-2 text-center"
                    onClick={hanldeEdit}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {isShowReason && (
          <div className="fixed   inset-0 flex items-center justify-center bg-opacity-30 bg-gray-200">
            <div className="bg-white p-6 rounded-lg modal-slide-down shadow-lg max-w-sm w-full">
              <div className="flex justify-between">
                <p className="text-start font-semibold py-1 ">
                  {" "}
                  Request Message{" "}
                </p>
                <p
                  className="text-red-400 text-center cursor-pointer bg-gray-200 t  shadow-lg w-[25px] rounded-full  h-[25px]"
                  onClick={() => setIsShowReason(false)}
                >
                  X
                </p>
              </div>
              <p className="mt-5 text-sm leading-4">{reasonData}</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CorrectionList;

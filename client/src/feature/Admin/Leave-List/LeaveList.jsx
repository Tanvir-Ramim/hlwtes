import { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import LeaveModal from "./LeaveModal";
import Icon from "../../../components/Icon/Icons";
import { RxCross2 } from "react-icons/rx";
import { Icons } from "react-toastify";
import { FaEye } from "react-icons/fa";
const LeaveList = () => {
  const [leaveReqAll, setLeaveReqAll] = useState([]);
  const [error, setError] = useState(null);
  console.log(leaveReqAll);
  // show picture
  const [isShowPic, setIsShowPic] = useState(false);
  const [showPic, setshowPic] = useState("");

  const showPicture = (value) => {
    setIsShowPic(true);
    setshowPic(value);
  };

  const [employee_id, setEmployeeId] = useState("");
  const [employee_name, setEmployee_name] = useState("");
  const [status, setStatus] = useState("");
  const [leaveType, setLeaveType] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [day, setDay] = useState(0);
  const [total_days, setTotal_days] = useState();

  const openModal = (leaveId, days, totaldays) => {
    setSelectedLeaveId(leaveId);
    setDay(days);
    setShowModal(true);
    console.log(totaldays);
    setTotal_days(totaldays);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLeaveId(null);
  };

  const fetchLeaveApplications = async (id, name, status, type) => {
    try {
      console.log(status);
      const response = await ApiClient.get("/leave-apply", {
        params: {
          employee_id: id,
          employee_name: name,
          leave_type: type,
          status: status,
          filter: "true",
        },
      });
      setLeaveReqAll(response.data.data || []);
    } catch (err) {
      setError(err.message);
    }
  };
  const [isShowReason, setIsShowReason] = useState(false);
  const [reasonData, setReasonData] = useState("");
  const showReason = (value) => {
    setIsShowReason(true);
    setReasonData(value);
  };

  const [allLeaveTypes, setAllLeaveTypes] = useState([]);

  const getLeaveType = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-type");
      setAllLeaveTypes(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  // handle delete
  // const handleDelete = async (id) => {
  //   try {
  //     const res = await ApiClient.delete(`/leave-apply/${id}`);
  //     if (res.status === 200) {
  //       toast.success("Successfully Delete");
  //       fetchLeaveApplications();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const [userArra, setUserArra] = useState([]);

  const getEmployees = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (isConfirmed) {
      try {
        const res = await ApiClient.delete(`/leave-apply/${id}`);
        if (res.status === 200) {
          alert("Successfully Deleted");
          fetchLeaveApplications();
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [employeeData, setEmployeeData] = useState(null);
  const [leave, setLeave] = useState([]);
  const getLeave = async () => {
    try {
      const res = await ApiClient.get("/setting/leave-type");
      setLeave(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(employeeData);
  const [showLeave, setShowLeave] = useState(false);
  const [showTotal, stShowTotal] = useState();
  const handleGetEmployee = async (employee_id, employeeName, balance) => {
    stShowTotal(balance);
    try {
      const res = await ApiClient.get(
        `/leave-apply?employee_id=${employee_id}&employee_name=${employeeName}&leave_type=Casual Leave&status=approved&emp=true`
      );
      console.log(res.data);

      setEmployeeData(res.data);
      setShowLeave(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getLeave();
  }, []);

  useEffect(() => {
    fetchLeaveApplications(employee_id, employee_name, status, leaveType);
  }, [employee_id, employee_name, status, leaveType]);

  useEffect(() => {
    fetchLeaveApplications();
    getLeaveType();
    getEmployees();
  }, []);

  if (error) return <div>Error: {error}</div>;
  const rend = (i) => {
    if (i === 1) {
      fetchLeaveApplications();
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Leave Request List ({leaveReqAll?.length})
        </p>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-xl"> Filter By:</h1>
          <div className="space-x-3 py-6">
            <select
              name="employee_id"
              placeholder="Employee id"
              className="border p-2 rounded bg-gray-200 placeholder:font-normal"
              type="text"
              value={employee_id}
              onChange={(e) => setEmployeeId(e.target.value)}
            >
              <option value="" disabled>
                Employee Name With ID
              </option>
              {userArra?.map((item, i) => (
                <option key={i} value={item?.employee_id}>
                  {item?.name} ({item?.employee_id})
                </option>
              ))}
            </select>
            <input
              name="employee_name"
              placeholder="Name"
              className="border p-2 rounded bg-gray-200 placeholder:font-normal"
              type="text"
              value={employee_name}
              onChange={(e) => setEmployee_name(e.target.value)}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              name="status"
              id=""
              className="p-2 rounded  bg-gray-200 border placeholder:font-normal"
            >
              <option value="">Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
              name="leave_type"
              id=""
              className="border p-2 rounded bg-gray-200  placeholder:font-normal "
            >
              <option value="">Type</option>
              {allLeaveTypes?.map((item, i) => (
                <option key={i} value={item?.name}>
                  {item?.name?.split(" ")[0]}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setEmployeeId(""),
                  setEmployee_name(""),
                  setLeaveType(""),
                  setStatus("");
              }}
              className=" text-bl p-1 rounded-full border border-gray-400"
            >
              <Icon type="reset" />
            </button>
          </div>
        </div>
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-2 border">Employee Name</th>
              <th className="text-left p-2 border">Leave & Application</th>
              <th className="text-left p-2 border">Leave Balance</th>
              <th className="text-left p-2 border">Date</th>
              <th className="text-left p-2 border">Apply Days</th>
              <th className="text-left p-2 border">Status</th>
              {/* <th className="text-left p-2 border">Note</th> */}
              <th className="text-left p-2 border">Applied Date</th>
              <th className="text-left p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveReqAll
              ?.slice()
              ?.reverse()
              ?.map((leave) => (
                <tr key={leave._id} className="border-b">
                  {/* <td className="p-2 border">{leave?.employee_id}</td> */}
                  <td className="p-2 capitalize border">
                    {leave?.employee_name} <br />
                    <span className="text-sm">{leave?.employee_id}</span>
                  </td>
                  <td className="p-2  cursor-pointer border">
                    <div
                      onClick={() => showReason(leave?.reason)}
                      className={`bg-gray-300 mb-2 p-1 rounded-lg text-center  shadow`}
                    >
                      <span
                        className={`${
                          leave?.leave_type?.split(" ")[0] === "Sick" &&
                          "text-red-500"
                        }`}
                      >
                        {" "}
                        {leave?.leave_type?.split(" ")[0]}
                      </span>
                    </div>
                    {leave?.attachment?.url && (
                      <div
                        onClick={() => showPicture(leave?.attachment?.url)}
                        className="text-center text-2xl  flex items-center justify-center px-3 py-1  rounded-lg cursor-pointer shadow "
                      >
                        <Icon type="eye" />
                      </div>
                    )}
                  </td>

                  <td className="p-2  cursor-pointer  flex justify-center items-center">
                    {/* {leave?.employee_leave_blance} */}
                    <button
                      className="bg-gray-300 flex justify-center mb-2 w-fit p-1 rounded-lg text-center  shadow "
                      onClick={() =>
                        handleGetEmployee(
                          leave?.employee_id,
                          leave?.employee_name,
                          leave?.employee_leave_blance
                        )
                      }
                    >
                      <FaEye className="text-xl" />
                    </button>
                  </td>
                  <td className="p-2  text-center border">
                    <span className="text-sm">
                      {" "}
                      {leave?.start_date?.slice(0, 10)}
                    </span>{" "}
                    <br />
                    <span className="font-bold">To</span>
                    <br />
                    <span className="text-sm">
                      {leave?.end_date?.slice(0, 10)}
                    </span>
                  </td>

                  <td className="p-2  text-center border">
                    {leave?.total_days} Days
                  </td>

                  <td className="p-2 capitalize border">
                    {leave?.status}
                    <br />
                    {leave?.status_update_date &&
                      // new Date(leave?.status_update_date)
                      //   .toLocaleString()
                      //   ?.slice(0, 9)}
                      formatDate(leave?.status_update_date)}
                    <br />
                    {leave?.approval_day > 0 &&
                      ` Approved : ${leave?.approval_day} day`}
                  </td>
                  {/* <td className="p-2 border">{leave?.approval_note}</td> */}
                  <td className="p-2 border">
                    {/* {new Date(leave?.applied_on).toLocaleString()?.slice(0, 9)} */}
                    {formatDate(leave?.applied_on)}
                  </td>
                  <td className="p-2  space-x-4 border">
                    <button
                      onClick={() =>
                        openModal(
                          leave?._id,
                          leave?.approval_day,
                          leave?.total_days
                        )
                      }
                      className=" px-2 py-1 text-xl rounded text-black "
                    >
                      <Icon type="Edit" />
                    </button>
                    <button
                      onClick={() => handleDelete(leave?._id)}
                      className=" text-red-600 mt-2 text-xl p-1 rounded "
                    >
                      <Icon type="delete" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {showModal && (
          <LeaveModal
            leaveId={selectedLeaveId}
            onClose={closeModal}
            rend={rend}
            day={day}
            total_days={total_days}
          />
        )}
        {isShowReason && (
          <div className="fixed inset-0 flex items-center  justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg  modal-slide-down shadow-lg max-w-sm w-full">
              <div className="flex justify-between">
                <p className="text-start font-semibold py-1 "> Reason </p>
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
        <div>
          {showLeave && (
            <div className="fixed inset-0 flex items-center  justify-center bg-gray-500 bg-opacity-75">
              <div className="bg-white p-6 rounded-lg  modal-slide-down shadow-lg max-w-sm w-full">
                <div className="flex justify-between">
                  <p className=" font-semibold py-5  text-center">
                    {" "}
                    Leave Balance{" "}
                  </p>
                  <p
                    className="text-red-400 text-center cursor-pointer bg-gray-200 t  shadow-lg w-[25px] rounded-full  h-[25px]"
                    onClick={() => setShowLeave(false)}
                  >
                    X
                  </p>
                </div>
                {/* <td className="p-2 border">{leave?.employee_id}</td> */}
                <div className="border text-center rounded-lg shadow-md bg-white">
                  <div className="py-2 flex flex-col justify-between h-full">
                    <p className="text-lg font-semibold text-gray-800 pb-4">
                      Remaining Total Balance
                    </p>
                    <p className="text-gray-600 text-base">{showTotal}</p>
                  </div>
                </div>
                {leave?.map(
                  (item, i) =>
                    item?.name !== "Maternity Leave" &&
                    item?.name !== "Paternity Leave" &&
                    item?.duration_Type === "Full Day" && (
                      <div
                        key={i}
                        className="border mt-3 text-center rounded-lg shadow-md bg-white"
                      >
                        <div className="py-2 flex flex-col justify-between h-full">
                          <p className="text-lg font-semibold text-gray-800 pb-4">
                            Remaining {item?.name}
                          </p>
                          <p className="text-gray-600 text-base">
                            {/* {item?.day -
                              (employeeData?.leaveSummary?.[`${item?.name}`] ||
                                0)} */}
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
          )}
        </div>

        {isShowPic && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full">
              <p
                className="text-red-400 text-center cursor-pointer bg-gray-200 shadow-lg w-[25px] rounded-full flex items-center justify-center h-[25px]"
                onClick={() => setIsShowPic(false)}
              >
                <Icon type="close" />
              </p>
              {(() => {
                const fileExtension = showPic.split(".").pop().toLowerCase();
                if (fileExtension === "pdf") {
                  return (
                    <a
                      className="w-full h-fit rounded mt-5 bg-blue-500 text-white p-2 inline-block text-center"
                      href={showPic}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View or Download PDF
                    </a>
                  );
                } else if (
                  ["jpg", "jpeg", "png", "gif"].includes(fileExtension)
                ) {
                  return (
                    <>
                      <img
                        className="w-full h-fit rounded mt-5"
                        src={showPic}
                        alt="Preview"
                      />
                      <a
                        href={showPic}
                        download
                        className="mt-3 bg-blue-500 text-white p-2 rounded-lg inline-block text-center w-full"
                      >
                        Download Image
                      </a>
                    </>
                  );
                } else {
                  return (
                    <p className="text-red-500">Unsupported file format</p>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LeaveList;

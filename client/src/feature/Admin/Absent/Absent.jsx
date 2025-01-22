import { useEffect, useState } from "react";
import Icon from "../../../components/Icon/Icons.jsx";

import { RxCross2 } from "react-icons/rx";
import { Icons } from "react-toastify";
import { FaEye } from "react-icons/fa";
import ApiClient from "../../../axios/ApiClient";
import LeaveModal from "../Leave-List/LeaveModal";
import AbsentModa from "./AbsentModal.jsx";
const Absent = () => {
  const [leaveReqAll, setLeaveReqAll] = useState([]);
  const [error, setError] = useState(null);

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
  const [date, setDate] = useState();
  const [statusn, setStatusn] = useState();

  const openModal = (leaveId, days, totaldays, date, status) => {
    setSelectedLeaveId(leaveId);
    setDay(days);
    if (["leave_applied", "late_logged"].includes(status)) {
      setShowModal(false);
    } else {
      setShowModal(true);
    }

    console.log(totaldays);
    setTotal_days(totaldays);
    setDate(date);
    setStatus(status);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLeaveId(null);
  };
  const [query, setQuery] = useState({
    from: null,
    to: null,
    status: "",
    emp_id: "",
    department: "",
  });
  const fetchLeaveApplications = async () => {
    try {
      console.log(status);
      const response = await ApiClient.get("/attendance/absents/filter", {
        params: {
          from: query.from,
          to: query.to,
          toDay: new Date(),
          status: query.status,
          emp_id: query.emp_id,
          department: query.department,
        },
      });
      setLeaveReqAll(response.data.data);
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

  //department

  console.log(query);
  const onQueryChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [departments, setDepartments] = useState([]);
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      setDepartments(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const reset = () => {
    setQuery({
      from: null,
      to: null,
      status: "",
      emp_id: "",
      department: "",
    });
  };

  useEffect(() => {
    getLeave();
    getDept();
  }, []);

  useEffect(() => {
    fetchLeaveApplications();
  }, [query]);

  useEffect(() => {
    getLeaveType();
    getEmployees();
  }, []);

  if (error) return <div>Error: {error}</div>;
  const rend = (i) => {
    if (i === 1) {
      fetchLeaveApplications();
    }
  };
  console.log(leaveReqAll && leaveReqAll);
  return (
    <>
      <div className="overflow-x-auto">
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Absent List ({leaveReqAll?.length})
        </p>
        <div className="mb-5 flex items-center mt-3 gap-2">
          <label className="block text-gray-700 text-base font-bold mb-2">
            Department:
          </label>
          <select
            onChange={onQueryChange}
            name="department"
            className="shadow border rounded  text-center py-1  text-gray-700 focus:outline-none"
          >
            <option value="">Select</option>
            {departments?.map((dept, index) => (
              <option key={index} value={dept?.name}>
                {dept?.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex text-sm items-center gap-3">
          <h1 className="font-semibold text-xl"> Filter By:</h1>
          <div className="space-x-3 flex items-center py-6">
            <select
              name="emp_id"
              placeholder="Employee id"
              className="border p-2 rounded bg-gray-200 placeholder:font-normal"
              type="text"
              //   value={employee_id}
              onChange={onQueryChange}
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

            <select
              value={status}
              onChange={onQueryChange}
              name="status"
              id=""
              className="p-2 rounded  capitalize bg-gray-200 border placeholder:font-normal"
            >
              <option value="">Status</option>
              <option value="pending">Pending</option>
              <option value="approved(full)">Absent Full Day</option>
              <option value="approved(half)">Absent Half Day</option>
              <option value="cancel">cancel</option>
              <option value="leave_applied">leave Applied</option>
              <option value="late_logged">Late Logged</option>
            </select>
            <div className="flex text-sm gap-2">
              <p>
                From :{" "}
                <input
                  className="py-1 rounded  capitalize bg-gray-200 border placeholder:font-normal"
                  type="date"
                  name="from"
                  onChange={onQueryChange}
                  id=""
                />
              </p>
              <p>
                TO :{" "}
                <input
                  className="py-1 rounded  capitalize bg-gray-200 border placeholder:font-normal"
                  type="date"
                  name="to"
                  onChange={onQueryChange}
                  id=""
                />
              </p>
            </div>
            <button
              onClick={reset}
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
              <th className="text-left p-2 border">Department</th>
              <th className="text-left p-2 border">Absent Date</th>
              <th className="text-left p-2 border"> Leave Count Status</th>
              <th className="text-left p-2 border">Leave Apply Date</th>
              {/* <th className="text-left p-2 border">Status</th> */}

              <th className="text-left p-2 border">Is Logged</th>
              <th className="text-left p-2 border">Absent Type </th>
              <th className="text-left p-2 border">Note</th>
              <th className="text-left p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {leaveReqAll
              ?.slice()
              ?.reverse()
              ?.map((leave) => (
                <tr key={leave._id} className="border-b text-sm font-normal">
                  {/* <td className="p-2 border">{leave?.employee_id}</td> */}
                  <td className="p-2 text-sm capitalize border">
                    {leave?.name} <br />
                    <span className="text-xs lowercase text-gray-500">
                      {leave?.employee_id}
                    </span>
                  </td>
                  <td className="p-2 capitalize  cursor-pointer border">
                    {leave?.department} <br />
                    {leave?.role}
                  </td>

                  <td className="p-2  cursor-pointer  flex justify-center items-center">
                    {leave?.date?.slice(0, 10)}
                  </td>
                  <td className="p-2 capitalize text-center border">
                    {leave?.absent_type === "leave_applied"
                      ? "Leave Applied"
                      : leave?.absent_type === "late_logged"
                      ? "Late Logged"
                      : leave?.absent_type}
                  </td>

                  <td className="p-2  text-xs text-center border">
                    {leave?.leave_apply_status?.apply_date ? (
                      <p className="text-green-500">
                        {"Apply Date:" +
                          leave?.leave_apply_status?.apply_date?.slice(0, 10)}
                      </p>
                    ) : (
                      "Has Not Applied"
                    )}
                  </td>
                  <td className="p-2  text-center text-xs border">
                    {leave?.login_status?.time ? (
                      <p className="text-green-500">
                        {"Logged Time : " +
                          leave?.login_status?.time?.slice(0, 10)}
                      </p>
                    ) : (
                      "Has Not Logged"
                    )}
                  </td>
                  {/* <td className="capitalize text-center">{leave?.status}</td> */}
                  <td className="capitalize text-center">
                    {" "}
                    {leave?.status === "leave_applied"
                      ? "Leave Applied"
                      : leave?.status === "late_logged"
                      ? "Late Logged"
                      : leave?.status}
                  </td>

                  <td className="p-2 border">{leave?.note}</td>

                  <td className="p-2  space-x-4 border">
                    <button
                      title={
                        ["leave_applied", "late_logged"].includes(
                          leave?.status
                        ) && status
                      }
                      disabled={["leave_applied", "late_logged"].includes(
                        leave?.status
                      )}
                      onClick={() =>
                        openModal(
                          leave?._id,
                          leave?.approval_day,
                          leave?.total_days,
                          leave?.date,
                          leave?.status
                        )
                      }
                      className=" px-2 py-1 text-xl rounded text-black "
                    >
                      <Icon type="Edit" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(leave?._id)}
                      className=" text-red-600 mt-2 text-xl p-1 rounded "
                    >
                      <Icon type="delete" />
                    </button> */}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {showModal && (
          <AbsentModa
            leaveId={selectedLeaveId}
            onClose={closeModal}
            rend={rend}
            day={day}
            refatch={fetchLeaveApplications}
            leaveType={leave?.absent_type}
            date={date}
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

export default Absent;

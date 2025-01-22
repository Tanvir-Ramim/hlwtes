import { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";
import "./LeaveList.css";
const LeaveList = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
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

  return (
    <>
      <div className="">
        <p className="text-2xl font-bold text-black uppercase">Leave List</p>

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
                  Notes
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
                      View
                    </button>
                  </td>
                  <td className="text-black text-base font-normal text-center p-4 border-b">
                    {item?.approval_day}
                  </td>

                  <td className="text-black capitalize text-base font-normal text-center p-4 border-b">
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
    </>
  );
};

export default LeaveList;

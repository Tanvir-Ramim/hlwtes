import React, { useState } from "react";
import axios from "axios";
import ApiClient from "../../../axios/ApiClient";
import Icon from "../../../components/Icon/Icons";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const LeaveModal = ({ leaveId, onClose, rend, day, total_days }) => {
  const [status, setStatus] = useState("pending");
  const [approvalDay, setApprovalDay] = useState("");
  const [approvalNote, setApprovalNote] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loader, setLoader] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoader(true);
      const response = await ApiClient.patch(`/leave-apply/${leaveId}`, {
        status,
        approval_day: status === "approved" ? approvalDay : day,
        approval_note: approvalNote,
      });
      setLoader(false);
      setSuccess(response.data.message);
      rend(1);
      if (onClose) onClose();
    } catch (err) {
      setLoader(false);
      setError(err.response?.data?.message || "Failed to update leave status");
    }
  };

  const handlePushApprovedDate = (value) => {
    if (total_days < value) {
      alert("Please Enter a value Which is less than Apply days");
      return;
    }
    setApprovalDay(value);
  };
  const handlePushStaus = (value) => {
    setApprovalDay("");
    setStatus(value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className="text-right">
          <button
            onClick={onClose}
            className=" bg-gray-500 text-white p-2 rounded "
          >
            <Icon type="close" />
          </button>
        </div>
        <h2 className="py-2 text-black font-bold text-center">
          Update Leave Status
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm">Status</label>
            <select
              value={status}
              onChange={(e) => handlePushStaus(e.target.value)}
              className="border p-2 mt-3 w-full"
              required
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          {status === "approved" && (
            <div className="mb-4">
              <label className="block  text-gray-700 text-sm">
                Approval Day
              </label>
              <input
                type="number"
                value={approvalDay}
                onChange={(e) => handlePushApprovedDate(e.target.value)}
                className="border p-2 w-full mt-3"
                // min="0"
                placeholder="days"
                required
              />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-700 text-sm pb-5"> Note</label>
            <textarea
              value={approvalNote}
              onChange={(e) => setApprovalNote(e.target.value)}
              className="border p-2 w-full"
              rows="4"
            />
          </div>

          <div className="mb-4 text-center">
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded "
            >
              {loader ? (
                <p className="flex items-center gap-2">
                  Update Status{" "}
                  <AiOutlineLoading3Quarters className="animate-spin" />
                </p>
              ) : (
                "Update Status"
              )}
            </button>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default LeaveModal;

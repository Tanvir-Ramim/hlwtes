import { format, startOfMonth, differenceInDays, addDays } from "date-fns";
import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";

const WeekPlan = () => {
  const [workPlan, setWorkPlan] = useState(null);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const getCurrentWeekOfMonth = () => {
    const today = new Date();
    const firstDayOfMonth = startOfMonth(today);
    const diffInDays = differenceInDays(today, firstDayOfMonth);
    const weekNumber = Math.ceil((diffInDays + 1) / 7);
    return Math.min(weekNumber, 4);
  };

  const [time, setTime] = useState({
    month: currentMonth,
    year: currentYear,
    week: getCurrentWeekOfMonth(),
  });

  const getWorkPlan = async () => {
    try {
      const res = await ApiClient.get(
        `/asset/work-plan?week=${time?.week}&month=${time?.month}&year=${time?.year}`
      );
      const fetchedPlan = res.data.data[0];
      setWorkPlan(fetchedPlan);
    } catch (error) {
      console.error(error);
    }
  };

  const [image, setImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const firstDayOfMonth = startOfMonth(new Date(time.year, time.month - 1));

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("week", time.week);
    formData.append("month", time?.month);
    formData.append("year", time?.year);

    formData.append("url", image);

    try {
      const res = await ApiClient.post("/asset/work-plan", formData);
      if (res.status === 201) {
        getWorkPlan();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // handle delete
  const handleDelete = async (id) => {
    window.confirm("Are You Sure?");
    try {
      const res = await ApiClient.delete(`/asset/work-plan/${id}`);
      if (res.status === 200) {
        toast.success("Successfully Delete");
        getWorkPlan();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getWorkPlan();
  }, [time?.week, time?.month]);

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <p className="text-2xl font-bold text-black pb-10 relative uppercase">
        Upload Your Weekly Plan
      </p>
      <div className="flex gap-6 py-5 px-5 font-semibold">
        {/* Week Selection */}
        <div className="flex items-center gap-2">
          <h1>Week:</h1>
          <select
            value={time.week}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, week: e.target.value }))
            }
            className="bg-gray-200 rounded-md border border-gray-400 px-2 py-1"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            {/* <option value="5">5</option> */}
          </select>
        </div>

        {/* Month Selection */}
        <div className="flex items-center gap-2">
          <h1>Month:</h1>
          <select
            value={time.month}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, month: e.target.value }))
            }
            className="bg-gray-200 rounded-md border border-gray-400 px-2 py-1"
          >
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((monthName, index) => (
              <option key={index + 1} value={index + 1}>
                {monthName}
              </option>
            ))}
          </select>
        </div>

        {/* Year Input */}
        <div className="flex items-center gap-3">
          <h1>Year:</h1>
          <input
            value={time.year}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, year: e.target.value }))
            }
            placeholder="2024"
            className="bg-gray-200 rounded-md border border-gray-400 px-3 py-1 w-28"
            type="text"
          />
        </div>
      </div>

      {/* Date Display */}
      <div className="py-4 text-center">
        <h2 className="text-xl text-[#004282] font-bold">
          {format(firstDayOfMonth, "MMMM yyyy")}
        </h2>
        <h1 className="text-sm font-semibold">Week: {time.week}</h1>
      </div>

      {/* Work Plan Section */}
      {workPlan ? (
        <>
          <div className="py-4">
            <img
              className="w-full h-80 object-cover rounded-md shadow-lg"
              src={workPlan?.url?.url}
              alt="Work Plan"
            />
            <div></div>
          </div>
          <div
            onClick={() => handleDelete(workPlan?._id)}
            className="flex justify-center"
          >
            <button className="p bg-red-500 text-white p-2 rounded w-fit h-fit">
              Delete
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
          <h1 className="text-red-500 font-semibold">
            Work Plan Currently Not Available
          </h1>

          {/* Upload Image Section */}
          <div className="mt-4">
            <label className="block font-medium mb-2">Upload Image:</label>
            <div className="flex justify-center">
              <input
                type="file"
                onChange={handleImageUpload}
                className="p-2 rounded border"
              />
            </div>
            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all duration-200"
              onClick={handleUpload}
            >
              Upload
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeekPlan;

import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import { format, startOfMonth, parseISO, differenceInDays } from "date-fns";

const WorkPlan = () => {
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

  const firstDayOfMonth = startOfMonth(new Date(time.year, time.month - 1));
  useEffect(() => {
    getWorkPlan();
  }, [time?.week, time?.month]);

  return (
    <div>
      <div className="flex gap-4  py-5 px-5 font-semibold">
        <div className="flex gap-2">
          <h1>Week:</h1>
          <select
            value={time.week} // Bind to state
            onChange={(e) =>
              setTime((prev) => ({ ...prev, week: e.target.value }))
            } // Update week in state
            className="bg-gray-300 rounded"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div className="flex gap-2">
          <h1>Month:</h1>
          <select
            value={time?.month}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, month: e.target.value }))
            }
            className="bg-gray-300 rounded"
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

        <div className="flex gap-3">
          <h1>Year:</h1>
          <input
            value={time.year}
            onChange={(e) =>
              setTime((prev) => ({ ...prev, year: e.target.value }))
            }
            placeholder="2024"
            className="bg-gray-300 rounded border px-2 w-24"
            type="text"
          />
        </div>
      </div>
      <div className="py-4">
        <h2 className="text-center text-xl text-[#004282] font-bold">
          <h2>{format(firstDayOfMonth, "MMMM yyyy")}</h2>
        </h2>
        <h1 className="text-sm text-center  font-semibold ">
          Week: {time.week}
        </h1>
      </div>
      {workPlan ? (
        <div className="py-2">
          <img
            className="w-full h-[20rem]  px-5"
            src={workPlan?.url?.url}
            alt=""
          />
        </div>
      ) : (
        <p className="text-gray-500 italic text-center mt-4">
          Work Plan Currently Not Available
        </p>
      )}
    </div>
  );
};

export default WorkPlan;

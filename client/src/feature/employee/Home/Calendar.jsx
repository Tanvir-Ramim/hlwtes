import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  addDays,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns";
import "./Calendar.css";
import { data } from "autoprefixer";
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

// eslint-disable-next-line react/prop-types
const Calendar = ({ month, year, holidayList = [] }) => {
  // Helper function to check if a date has an event
  const getEventForDay = (date) => {
    return holidayList?.find((event) => {
      const eventDate = parseISO(event?.date?.slice(0, 10));
      return isSameDay(eventDate, date);
    });
  };

  const firstDayOfMonth = startOfMonth(new Date(year, month - 1));
  const lastDayOfMonth = endOfMonth(firstDayOfMonth);

  const days = [];
  let startDate = startOfWeek(firstDayOfMonth);
  let endDate = endOfWeek(lastDayOfMonth);

  while (startDate <= endDate) {
    days.push([...Array(7)].map((_, i) => addDays(startDate, i)));
    startDate = addDays(startDate, 7);
  }  

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list,setList]=useState()
const getReason = (mx) => {
 console.log(mx);
 setList(mx);
  setIsModalOpen(true);
};
const closeModal = () => {
  setIsModalOpen(false);
};

  return (
    <div className="calendar">
      <div className="calendar-header font-bold text-xl mb-4">
        <h2>{format(firstDayOfMonth, "MMMM yyyy")}</h2>
      </div>
      <div className="calendar-body">
        <div className="day-names-grid border-b border-gray-300 pb-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
            <div
              className="day-name font-semibold text-gray-600 text-center border-b-2 border-transparent hover:border-gray-400 transition duration-300"
              key={dayName}
            >
              {dayName}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {days?.map((week, weekIndex) => (
            <div className="week" key={weekIndex}>
              {week?.map((day, dayIndex) => {
                const event = getEventForDay(day);
                return (
                  <div
                    className={`day ${
                      format(day, "MM") === String(month)?.padStart(2, "0")
                        ? ""
                        : "disabled"
                    }`}
                    key={dayIndex}
                  >
                    <span className="date">{format(day, "d")}</span>
                    {event && (
                      <div className="event">
                        {event?.name && (
                          <div
                            className={`w-fit px-2 py-1 text-sm font-semibold rounded ${
                              event?.name?.includes("Developer")
                                ? "bg-red-400 text-white"
                                : "bg-yellow-400 text-white"
                            }`}
                          >
                            {event?.name?.split(" - ")[0] === "Developer" ? (
                              <p onClick={()=>getReason(event?.name?.split(" - ")[1])} className="flex cursor-pointer gap-2 items-center">{event?.name?.split(" - ")[0]} 
                                <p  className="mt-1  rounded text-xl"><FaEye/></p>
                               </p>
                            ) : (
                              event?.name
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
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
                <h1 className="pt-3 pb-4 font-bold">Assigned  List</h1>
                <ul  className="space-y-2 pl-5  list-disc grid grid-cols-1">{list?.split(",")?.map((item,i)=><li key={i}>{item}</li>)}</ul>
              </div>
            </div>
          )}
    </div>
  );
};

export default Calendar;

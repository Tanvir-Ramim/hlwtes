import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";

const Clock = () => {
    const [bdTime, setBdTime] = useState('');

    useEffect(() => {
      // Function to update the clock
      const updateBdTime = () => {
        const time = new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Dhaka',
          hour12: true, // Set to false if you want 24-hour format
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });
        setBdTime(time);
      };
  
      // Initial call to display the time immediately
      updateBdTime();
  
      // Update every second
      const intervalId = setInterval(updateBdTime, 1000);
  
      // Cleanup interval on component unmount
      return () => clearInterval(intervalId);
    }, []);
  return (
    <div className="flex items-center p-3 border-b border-gray-200">
      <FaHome className="text-purple-500 mr-3" />
      <p className="text-sm font-medium text-gray-600">Current Time:</p>
      <span className="ml-auto text-sm text-gray-700 font-semibold">
        {bdTime}
      </span>
    </div>
  );
};

export default Clock;

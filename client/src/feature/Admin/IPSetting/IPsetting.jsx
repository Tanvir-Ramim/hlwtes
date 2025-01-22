import React, { useState, useEffect } from "react";
import ApiClient from "../../../axios/ApiClient";
import { FaTimes } from "react-icons/fa";

const IPsetting = () => {
  const [ipData, setIpData] = useState({
    ip: [],
    today_log: "IP",
    isStart: false,
  });
  const [newIp, setNewIp] = useState("");
  const [ip, setIP] = useState({});
  const [hasDataChanged, setHasDataChanged] = useState(false);
  const getIp = async () => {
    try {
      const res = await ApiClient.get("/setting/ip");
      setIP(res.data.data);
      setIpData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getIp();
  }, []);

  const handleTodayLogToggle = () => {
    setIpData((prev) => ({
      ...prev,
      today_log: prev.today_log === "IP" ? "Home" : "IP",
    }));
    setHasDataChanged(true);
  };

  const handleIsStartToggle = () => {
    setIpData((prev) => ({
      ...prev,
      isStart: !prev.isStart,
    }));
    setHasDataChanged(true);
  };

  const handleAddIp = () => {
    if (newIp && !ipData.ip.includes(newIp)) {
      setIpData((prev) => ({
        ...prev,
        ip: [...prev.ip, newIp],
      }));
      setNewIp("");
      setHasDataChanged(true);
    }
  };

  const handleRemoveIp = (ipToRemove) => {
    setIpData((prev) => ({
      ...prev,
      ip: prev.ip.filter((ip) => ip !== ipToRemove),
    }));
    setHasDataChanged(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await ApiClient.patch("/setting/ip", ipData);
      if (res.status === 204) {
        getIp();
        setHasDataChanged(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (hasDataChanged) {
      handleUpdate();
    }
  }, [hasDataChanged, ipData]);

  return (
    <>
      {" "}
      <p className="text-2xl font-bold text-black pb-8 relative uppercase">
       Manage Ip
      </p>
      <div className="py-6 w-full flex flex-col mt-9 items-center space-y-6">
        <div className="flex max-w-6xl w-full justify-between space-x-8">
          {/* Left: Login Access Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] space-y-6">
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              Add New IP Address
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Enter a new IP address to allow access.
            </p>

            <div className="flex space-x-3">
              <input
                type="text"
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="Enter new IP address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleAddIp}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Control Panel */}
            <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-6">
              <h3 className="text-lg font-bold text-center text-gray-700">
                Control Panel
              </h3>

              {/* Office/Home Toggle */}
              <div className="relative flex justify-center items-center bg-white shadow-inner rounded-lg max-w-xs mx-auto">
                <div
                  className={`absolute left-0 top-0 w-1/2 bg-[#004282] rounded h-full transition-transform duration-500 ease-in-out transform ${
                    ipData?.today_log === "IP"
                      ? "translate-x-0"
                      : "translate-x-full"
                  }`}
                ></div>
                <button
                  className={`z-10 w-1/2 text-center py-2 font-semibold transition-colors duration-500 ease-in-out ${
                    ipData?.today_log === "IP" ? "text-white" : "text-[#004282]"
                  }`}
                  onClick={handleTodayLogToggle}
                >
                  Office (IP)
                </button>
                <button
                  className={`z-10 w-1/2 text-center py-2 font-semibold transition-colors duration-500 ease-in-out ${
                    ipData?.today_log === "Home"
                      ? "text-white"
                      : "text-[#004282]"
                  }`}
                  onClick={handleTodayLogToggle}
                >
                  Home
                </button>
              </div>

              {/* Start/Stop Toggle */}
              <div className="relative flex justify-center items-center bg-white shadow-inner rounded-lg max-w-xs mx-auto">
                <div
                  className={`absolute left-0 top-0 w-1/2 bg-green-600 rounded h-full transition-transform duration-500 ease-in-out transform ${
                    ipData?.isStart ? "translate-x-0" : "translate-x-full"
                  }`}
                ></div>
                <button
                  className={`z-10 w-1/2 text-center py-2 font-semibold transition-colors duration-500 ease-in-out ${
                    ipData?.isStart ? "text-white" : "text-green-600"
                  }`}
                  onClick={handleIsStartToggle}
                >
                  Start (True)
                </button>
                <button
                  className={`z-10 w-1/2 text-center py-2 font-semibold transition-colors duration-500 ease-in-out ${
                    !ipData?.isStart ? "text-white" : "text-green-600"
                  }`}
                  onClick={handleIsStartToggle}
                >
                  Stop (False)
                </button>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg w-[50%] space-y-4">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Login Access
            </h2>

            {/* List of IP Addresses */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                IPs Allowed:
              </h3>
              <ul className="list-disc list-inside space-y-2">
                {ip?.ip?.map((ip, index) => (
                  <li key={index} className="flex items-center justify-between">
                    <span className="text-blue-600">{ip}</span>
                    <FaTimes
                      className="text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                      onClick={() => handleRemoveIp(ip)}
                    />
                  </li>
                ))}
              </ul>
            </div>

            {/* Today Log and Is Start Info */}
            <div className="flex justify-between">
              <p className="text-md text-gray-600">
                <strong>Today Log:</strong> {ip?.today_log}
              </p>
              <p className="text-md text-gray-600">
                <strong>office Start :</strong> {ip?.isStart ? "True" : "False"}
              </p>
            </div>
          </div>

          {/* Right: Add New IP Address Section */}
        </div>
      </div>
    </>
  );
};

export default IPsetting;

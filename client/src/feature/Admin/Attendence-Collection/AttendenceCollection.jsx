import React, { useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";

const AttendenceCollection = () => {
  const [penalties, setPenalties] = useState([
    {
      type: "annual",
      time: "10",
      description: "annual leave by company",
    },
  ]);
  const [penaltyData, setPenaltyData] = useState({
    type: "",
    time: "",
    description: "",
  });
  const [isFormVisible, setIsFormVisible] = useState(false);

  // Handle form input changes
  const handleInputChange = (e) => {
    setPenaltyData({ ...penaltyData, [e.target.name]: e.target.value });
  };

  // Handle adding new penalty
  const handleAddPenalty = () => {
    setPenalties([...penalties, penaltyData]); // Add new penalty to list
    setPenaltyData({ type: "", time: "", description: "" }); // Reset form
    setIsFormVisible(false); // Hide form after submission
  };

  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Attendance Penalty
        </p>
        <div className="relative text-right">
          <button
            type="button"
            className="py-2 px-5 bg-primary text-white text-base capitalize font-medium rounded-md"
            onClick={() => setIsFormVisible(!isFormVisible)} // Toggle form visibility
          >
            Add Attendance penalty
          </button>

          {/* Penalty Form */}
          {isFormVisible && (
            <div className="bg-[#eee] p-4 w-[400px] absolute top-[100%] left-[50%] translate-x-[-50%] translate-y-[-50%] shadow-2xl">
              <p className="text-black text-base font-semibold text-center p-4 capitalize">
                Add penalty
              </p>
              <div>
                <p className="text-black text-base font-normal capitalize text-center">
                  Late Count After
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    name="type"
                    value={penaltyData.type}
                    onChange={handleInputChange}
                    className="p-4 bg-white w-full"
                  />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-black text-base font-normal capitalize text-center">
                  Half Day Count After
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    name="time"
                    value={penaltyData.time}
                    onChange={handleInputChange}
                    className="p-4 bg-white w-full"
                  />
                </div>
              </div>
              <div className="pt-2">
                <p className="text-black text-base font-normal capitalize text-center">
                  Full Day Count
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    name="description"
                    value={penaltyData.description}
                    onChange={handleInputChange}
                    className="p-4 bg-white w-full"
                  />
                </div>
              </div>
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={handleAddPenalty}
                  className="py-2 px-5 bg-black text-white text-base capitalize font-medium rounded-md"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Penalty List */}

        <div className=" mt-10">
          <table className="min-w-full ">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4">
                  Penalty Type
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Time
                </th>

                <th className="text-black text-base font-semibold text-center p-4">
                  Description
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {penalties.length > 0 &&
                penalties.map((penalty, index) => (
                  <tr key={index} className="border">
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {penalty.type}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {penalty.time}
                    </td>
                    <td className="text-black text-base font-normal text-center p-4 border-b">
                      {penalty.description}
                    </td>

                    <td className="text-black text-base font-normal text-center p-4 border-b ">
                      <span className="text-black text-base font-semibold flex gap-2 justify-center">
                        <button
                          className="text-blue-500"
                          // onClick={() => handleEdit(index)}
                        >
                          <TypeIcon type="Edit" />
                        </button>
                        <button
                          className="text-red-500"
                          // onClick={() => handleDelete(index)}
                        >
                          <TypeIcon type="delete" />
                        </button>
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AttendenceCollection;

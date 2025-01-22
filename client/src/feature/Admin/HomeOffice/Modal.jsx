import { useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import Icon from "../../../components/Icon/Icons";
// Modal Component
const Modal = ({ isOpen, onClose, employee, onSave }) => {
  const [date, setDate] = useState("");
  const [specialHome, setSpecialHome] = useState(
    employee?.special_home || { isActive: false, day_list: [] }
  );
  console.log(employee);
  const handleSave = () => {
    onSave(employee._id, specialHome);
    onClose();
  };

  const getDateArray = () => {
    setSpecialHome((prev) => ({
      ...prev,
      day_list: [...prev.day_list, date],
    }));
    setDate(""); // Clear the date input field
  };

  return isOpen ? (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <div className=" flex justify-end">
          <p
            onClick={onClose}
            className="text-red-400 text-center cursor-pointer shadow-lg  rounded-full text-xl size-[30px] flex justify-center items-center"
          >
            <Icon type="close" />
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-4">Edit Special Home</h3>
        <div className="mb-4">
          <label className="block text-gray-700">Is Active</label>
          <input
            type="checkbox"
            checked={specialHome.isActive}
            onChange={(e) =>
              setSpecialHome({ ...specialHome, isActive: e.target.checked })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Day List</label>
          <div className="flex gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Enter day"
              className="border border-gray-300 rounded-lg p-2 flex-1"
            />
            <button
              onClick={getDateArray}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Day
            </button>
          </div>
          <ul className="mt-2">
            {specialHome.day_list.map((day, index) => (
              <li key={index} className="text-gray-600">
                {day}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center gap-4">
          {/* <button
            onClick={onClose}
            className="bg-gray-300 text-white p-2 rounded"
          >
            Cancel
          </button> */}
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white py-1.5 px-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;

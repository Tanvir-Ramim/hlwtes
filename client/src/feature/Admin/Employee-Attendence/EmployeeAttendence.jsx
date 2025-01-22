import React, { useState } from "react";
import { employeeAttendence } from "../constants";
import TypeIcon from "../../../components/Icon/Icons";

const EmployeeAttendence = () => {
  const [formData, setFormData] = useState({
    employee: "",
    fromDate: "",
    toDate: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Handle form submission
  const handleSearch = () => {
    // Validate inputs (optional)
    if (!formData.employee || !formData.fromDate || !formData.toDate) {
      alert("Please fill in all fields");
      return;
    }

    // Perform search with the collected data
    console.log("Form Data:", formData);
  };
  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Employee Attendence
        </p>
        <div>
          <div className="pt-5">
            <p className="text-base text-black font-bold pb-5">
              select Employes *
            </p>
            <div>
              <div className="grid md:grid-cols-2 grid-cols-1 gap-10 pt-4">
                <div className="relative">
                  <select
                    id="employee"
                    value={formData.employee}
                    onChange={handleInputChange}
                    className="bg-[#eee] w-full p-5  appearance-none "
                  >
                    <option value="" disabled>
                      Employee Name With ID
                    </option>
                    <option value="employee1">Employee 1</option>
                    <option value="employee2">Employee 2</option>
                  </select>{" "}
                  <span className="absolute right-[20px] top-[50%] -translate-y-[50%]">
                    <TypeIcon type="downArrow" />
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 grid-cols-1 gap-10 pt-4">
                <div>
                  <p className="text-base text-black font-bold capitalize pb-5">
                    From Date *
                  </p>
                  <input
                    type="date"
                    id="fromDate"
                    value={formData.fromDate}
                    onChange={handleInputChange}
                    className="border p-4 w-full"
                  />
                </div>

                <div>
                  <p className="text-base text-black font-bold capitalize pb-5">
                    To Date *
                  </p>
                  <input
                    type="date"
                    id="toDate"
                    value={formData.toDate}
                    onChange={handleInputChange}
                    className="border p-4 w-full"
                  />
                </div>
              </div>

              <div className="pt-10">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="text-white text-base font-semibold bg-primary rounded-md py-2 px-5"
                >
                  Search
                </button>
              </div>
            </div>
            <div className="pt-10">
              <table className="min-w-full ">
                <thead className="bg-[#eee]">
                  <tr>
                    <th className="text-black text-base font-semibold text-center p-4">
                      date
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      ID
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Name & Designation
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      In Time
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      Out Time
                    </th>

                    <th className="text-black text-base font-semibold text-center p-4">
                      Holidays
                    </th>
                    <th className="text-black text-base font-semibold text-center p-4">
                      notes
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {employeeAttendence.map((item, index) => (
                    <tr key={index} className="border">
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.date}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.employeeID}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.designation}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.inTime}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.outTime}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.holiday}
                      </td>

                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeAttendence;

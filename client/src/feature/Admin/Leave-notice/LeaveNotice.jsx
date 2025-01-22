import React, { useState } from "react";

const LeaveNotice = () => {
  // State to store the form data
  const [leaveFor, setLeaveFor] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("");
  const [errors, setErrors] = useState({}); // State to store error messages

  // Function to validate the form
  const validateForm = () => {
    const newErrors = {};

    if (!leaveFor) {
      newErrors.leaveFor = "Please select an option for leave.";
    }

    if (!noticePeriod) {
      newErrors.noticePeriod = "Please enter a notice period.";
    }

    return newErrors;
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload on form submission

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set errors if validation fails
      return; // Stop form submission
    }

    // If validation passes, proceed with form submission
    const formData = {
      leaveFor,
      noticePeriod,
    };

    console.log(formData); // Log form data

    // Optionally, clear the form and errors after submission
    setLeaveFor("");
    setNoticePeriod("");
    setErrors({});
  };

  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Leave Types
        </p>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-black text-base font-semibold text-left py-4 capitalize">
                Leave For
              </p>
              <select
                name="leaveFor"
                id="leaveFor"
                className={`w-full bg-white border p-2 ${
                  errors.leaveFor ? "border-red-500" : ""
                }`}
                value={leaveFor}
                onChange={(e) => setLeaveFor(e.target.value)} // Update state on change
              >
                <option value="">Select an option</option>
                <option value="1, 2 more than 2 days">1 days</option>
                <option value="2, 3 days">2 days</option>
                <option value="more than 2 days">more than 2 days</option>
              </select>
              {errors.leaveFor && (
                <p className="text-red-500 text-sm">{errors.leaveFor}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div>
              <p className="text-black text-base font-semibold text-left py-4 capitalize">
                Notice Period
              </p>
              <input
                type="number"
                className={`p-2 bg-white border w-full ${
                  errors.noticePeriod ? "border-red-500" : ""
                }`}
                value={noticePeriod}
                onChange={(e) => setNoticePeriod(e.target.value)} // Update state on change
              />
              {errors.noticePeriod && (
                <p className="text-red-500 text-sm">{errors.noticePeriod}</p>
              )}
            </div>
          </div>
          <div className="pt-10">
            <button
              type="submit" // Make sure the button triggers form submission
              className="text-bold text-lg font-semibold text-white bg-primary capitalize px-4 py-1 hover:bg-[#0f2031] duration-500 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default LeaveNotice;

import React, { useState } from "react";

const Registration = () => {
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    designation: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors as user types
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validate fields
    if (!formData.employeeName)
      validationErrors.employeeName = "Employee Name is required";
    if (!formData.employeeId)
      validationErrors.employeeId = "Employee ID is required";
    if (!formData.designation)
      validationErrors.designation = "Designation is required";
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    // Check if there are errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // No errors, registration successful
      console.log("Registered Data: ", formData);
      alert("Registration successful");

      // Clear form
      setFormData({
        employeeName: "",
        employeeId: "",
        designation: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
      setIsSubmitted(true);
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="w-[600px] mx-auto h-screen flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-[#eee] p-10 w-full rounded-lg shadow-xl"
        >
          <h2 className="text-5xl text-primary font-bold capitalize italic text-center py-5">
            registration
          </h2>

          <div className="pt-5">
            <label className="text-black font-medium capitalize">
              Employee Name
            </label>
            <input
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleInputChange}
              placeholder="Employee Name"
              className="w-full p-4 bg-white my-2"
            />
            {errors.employeeName && (
              <p className="text-red-500">{errors.employeeName}</p>
            )}
          </div>

          <div className="pt-5">
            <label className="text-black font-medium capitalize">
              Employee ID
            </label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              onChange={handleInputChange}
              placeholder="Employee ID"
              className="w-full p-4 bg-white my-2"
            />
            {errors.employeeId && (
              <p className="text-red-500">{errors.employeeId}</p>
            )}
          </div>

          <div className="pt-5">
            <label className="text-black font-medium capitalize">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleInputChange}
              placeholder="Employee Designation"
              className="w-full p-4 bg-white my-2"
            />
            {errors.designation && (
              <p className="text-red-500">{errors.designation}</p>
            )}
          </div>

          <div className="pt-5">
            <label className="text-black font-medium capitalize">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Please provide email"
              className="w-full p-4 bg-white my-2"
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>

          <div className="pt-5">
            <label className="text-black font-medium capitalize">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-4 bg-white my-2"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="pt-5">
            <label className="text-black font-medium capitalize">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-4 bg-white my-2"
            />
            {errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="pt-5 text-center">
            <button
              type="submit"
              className="bg-primary text-2xl py-2 px-4 rounded-md text-white capitalize"
            >
              registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;

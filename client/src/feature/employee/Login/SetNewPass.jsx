import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";

const Login = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: "",
    confirm_pass: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Password field validation
    if (!formData.password) {
      validationErrors.password = "Password is required";
    }

    // Confirm password validation
    if (formData.password !== formData.confirm_pass) {
      validationErrors.confirm_pass = "Passwords do not match";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      try {
        const res = await ApiClient.post(`/auth/set-new-password/${token}`, {
          password: formData.password,
        });
        if (res.status === 204) {
          toast.success("Password set successfully");
          navigate("/login");
        }
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
      // Reset form fields after successful submission
      setFormData({
        password: "",
        confirm_pass: "",
      });
      setErrors({});
    }
  };

  return (
    <div className="overflow-hidden">
      <div className="w-[600px] mx-auto h-screen flex justify-center items-center">
        <form
          onSubmit={handleSubmit}
          className="bg-[#eee] p-10 w-full rounded-lg shadow-xl"
        >
          <h2 className="text-5xl text-primary font-bold capitalize italic text-center pt-5">
            Set Your Password
          </h2>
          <div className="pt-5">
            <label className="text-black font-medium capitalize">Password</label>
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
              name="confirm_pass"
              value={formData.confirm_pass}
              onChange={handleInputChange}
              className="w-full p-4 bg-white my-2"
            />
            {errors.confirm_pass && (
              <p className="text-red-500">{errors.confirm_pass}</p>
            )}
          </div>

          <div className="py-5 text-center">
            <button
              type="submit"
              className="bg-primary text-2xl py-2 px-4 rounded-md text-white capitalize"
            >
              Set Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

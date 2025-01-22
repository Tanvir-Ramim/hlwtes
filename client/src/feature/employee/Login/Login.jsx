import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ApiClient from "../../../axios/ApiClient";
import { useDispatch, useSelector } from "react-redux";
import { adminInfo } from "../../../redux/authSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Login = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const reset = queryParams.get("reset");
  const token = queryParams.get("token");
  console.log(token);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  //

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors as user types
  };
  const dispatch = useDispatch();
  const user = useSelector((state) => state);
  console.log(user);
  const [loader, setLoader] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validate fields
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.password) validationErrors.password = "Password is required";

    // Check if there are errors
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // No errors, login successful
      try {
        setLoader(true);
        const res = await ApiClient.post(`/auth/login`, {
          email: formData.email,
          password: formData.password,
        });
        const userData = res?.data?.data;

        dispatch(adminInfo(userData));
        if (userData?.isAdmin) {
          setLoader(false);
          navigate("/admin");
        } else {
          setLoader(false);
          navigate("/");
        }
      } catch (error) {
        setLoader(false);
        console.log(error);
        if (error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert(error.response.data.error);
        }
      }
    }
  };

  return (
    <>
      <script
        type="application/javascript"
        src="https://api.ipify.org?format=jsonp&callback=getIP"
      ></script>
      <div className="overflow-hidden">
        <div className="w-[600px] mx-auto h-screen flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-[#eee] p-10 w-full rounded-lg shadow-xl"
          >
            {/* <h2 className="text-5xl text-primary font-bold capitalize italic text-center pt-5">
              Login
            </h2> */}
            <h2 className="text-5xl text-primary font-bold capitalize italic text-center pt-5">
              LMS Version 2.1
            </h2>

            <div className="pt-10">
              <label className="text-black font-medium capitalize">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Please provide email"
                className="w-full p-4 bg-white my-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
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
                placeholder="Enter Your Password"
                className="w-full p-4 bg-white my-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}

              <div className="text-right">
                <Link
                  to="/login/reset=new_password"
                  className="text-primary text-sm font-medium italic hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="py-5 text-center">
              <button
                type="submit"
                className="bg-primary text-2xl py-2 px-4 rounded-md text-white capitalize hover:bg-primary-dark transition-all duration-300"
              >
                {loader ? (
                  <p className="flex items-center  gap-2">
                    login <AiOutlineLoading3Quarters className="animate-spin" />
                  </p>
                ) : (
                  "login"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;

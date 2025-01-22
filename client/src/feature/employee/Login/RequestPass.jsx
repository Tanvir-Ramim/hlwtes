import { useState } from "react";
import { Link } from "react-router-dom";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";

const RequestPass = () => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear errors as user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validate fields
    if (!formData.email) validationErrors.email = "Email is required";
    if (!formData.phone) validationErrors.phone = "Password is required";

    // Check if there are errors
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    } else {
      console.log();
    }

    try {
      const res = await ApiClient.post(`/auth/reset-password-request`, {
        email: formData.email,
        phone: formData.phone,
      });
      console.log(res);
      if (res.status === 200) {
        toast.success("Please Check Your Mail");
        setFormData({
          email: "",
          phone: "",
        });
      }
    } catch (error) {
      console.error(error);
      console.log(error);
      if (error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  };

  return (
    <>
      <div className="overflow-hidden">
        <div className="w-[600px] mx-auto h-screen flex justify-center items-center">
          <form
            onSubmit={handleSubmit}
            className="bg-[#eee] p-10 w-full rounded-lg shadow-xl"
          >
            <h2 className="text-5xl text-primary font-bold capitalize italic text-center pt-5">
              New Password Request
            </h2>
            <div>
              <div className="pt-10">
                <label className="text-black font-medium capitalize">
                  Email
                </label>
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
              <div className="pt-10">
                <label className="text-black font-medium capitalize">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Please provide phone"
                  className="w-full p-4 bg-white my-2"
                />
                {errors.phone && <p className="text-red-500">{errors.phone}</p>}
              </div>
            </div>
            <div className="text-right">
          <Link
            to="/login"
            className="text-primary text-sm font-medium italic hover:underline"
          >
            Back To Login
          </Link>
        </div>
            <div className="py-5 text-center">
              <button
                type="submit"
                className="bg-primary text-2xl py-2 px-4 rounded-md text-white capitalize"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RequestPass;

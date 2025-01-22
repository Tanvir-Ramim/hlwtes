import { useEffect, useRef, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import JoditEditor from "jodit-react";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const AddAnnouncement = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const editor = useRef(null);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    posted_by: user?._id,
    target_single_employee_id: "",
    importance: "",
    announcement_type: "",
    expiration_date: null,
  });

  const [userArray, setUserArray] = useState([]);

  const getEmployee = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUserArray(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({ ...prevData, message: content }));
  };

  const handleAdd = async () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.expiration_date)
      newErrors.expiration_date = "Expiration Date is required";
    if (!formData.announcement_type)
      newErrors.announcement_type = "Announcement Type is required";
    if (!formData.importance) newErrors.importance = "Importance is required";
    if (!formData.message) newErrors.message = "Message is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await ApiClient.post("/setting/announcement", formData);
      if (res.status === 201) {
        toast.success("Successfully added announcement");
        setFormData({
          title: "",
          message: "",
          posted_by: user?._id,
          target_single_employee_id: "",
          importance: "",
          announcement_type: "",
          expiration_date: null,
        });
        setErrors({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <p className="text-2xl font-bold text-black pb-10 uppercase">
        Add Announcement
      </p>
      <div>
        <div className="bg-[#eee] p-4">
          <div className="flex gap-8 py-4">
            <div className="flex flex-col w-[70%]">
              <span className="text-black text-base font-medium pb-2">
                <label>Title</label>
              </span>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="p-2 bg-white"
              />
              {errors.title && <p className="text-red-500">{errors.title}</p>}
            </div>
            <div className="flex flex-col w-[30%]">
              <span className="text-black text-base font-medium pb-2">
                <label>Expiration Date</label>
              </span>
              <input
                type="date"
                name="expiration_date"
                className="text-black text-base font-medium py-1.5 px-1"
                value={formData.expiration_date}
                onChange={handleChange}
              />
              {errors.expiration_date && (
                <p className="text-red-500">{errors.expiration_date}</p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-8 py-4">
            <div className="flex flex-col">
              <span className="text-black text-base font-medium pb-2">
                <label>Select Employee (optional)</label>
              </span>
              <div className="relative inline-block w-full">
                <select
                  name="target_single_employee_id"
                  value={formData.target_single_employee_id}
                  onChange={handleChange}
                  className="p-2 w-full bg-white border border-gray-300 rounded-md appearance-none focus:outline-none"
                >
                  <option value="">Select Employee</option>
                  {userArray?.map((userItem, idx) => (
                    <option key={idx} value={userItem?._id}>
                      {userItem?.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {/* {errors.target_single_employee_id && (
                <p className="text-red-500">
                  {errors.target_single_employee_id}
                </p>
              )} */}
            </div>
            <div className="flex flex-col">
              <span className="text-black text-base font-medium pb-2">
                <label>Announcement Type</label>
              </span>
              <div className="relative inline-block w-full">
                <select
                  name="announcement_type"
                  value={formData.announcement_type}
                  onChange={handleChange}
                  className="p-2 w-full bg-white border border-gray-300 rounded-md appearance-none focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="general">General</option>
                  <option value="urgent">Urgent</option>
                  <option value="event">Event</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.announcement_type && (
                <p className="text-red-500">{errors.announcement_type}</p>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-black text-base font-medium pb-2">
                <label>Importance</label>
              </span>
              <div className="relative inline-block w-full">
                <select
                  name="importance"
                  value={formData.importance}
                  onChange={handleChange}
                  className="p-2 w-full bg-white border border-gray-300 rounded-md appearance-none focus:outline-none"
                >
                  <option value="">Select Importance</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
              {errors.importance && (
                <p className="text-red-500">{errors.importance}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col py-4">
            <span className="text-black text-base font-medium pb-2">
              <label>Message</label>
            </span>
            <JoditEditor
              ref={editor}
              value={formData.message}
              onChange={handleEditorChange}
            />
            {errors.message && <p className="text-red-500">{errors.message}</p>}
          </div>
          <div className="flex justify-center pt-5">
            <button
              onClick={handleAdd}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAnnouncement;

import toast from "react-hot-toast";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { useParams } from "react-router-dom";

const EditAnnouncement = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user = user2 || user1;
  console.log();
  const editor = useRef(null);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    posted_by: user?._id,
    target_single_employee_id: "",
    importance: "",
    announcement_type: "",
    expiration_date: "",
  });

  console.log(formData);
  // const userArray = [
  //   { name: "test", user_ref: "66de6f24225c68bbf7134ff1" },
  //   { name: "Ramim", user_ref: "66e57939bb30eeb93baa26d4" },
  //   { name: "Celeste Levine", user_ref: "66e66b2aca4c0df90ccff8b2" },
  // ];

  const [userArray, setUserArray] = useState([]);

  const getEmployee = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      console.log(res);
      setUserArray(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  const getAnnouncement = async () => {
    try {
      const res = await ApiClient.get(`/setting/announcement/${id}`);
      const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toISOString().split("T")[0];
      };
      const expiration_date = formatDate(res.data.data.expiration_date);
      if (res.status === 201) {
        setFormData({
          title: res.data.data.title,
          message: res.data.data.message,
          target_single_employee_id: res.data.data.target_single_employee_id,
          importance: res.data.data.importance,
          announcement_type: res.data.data.announcement_type,
          expiration_date: expiration_date,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditorChange = (content) => {
    setFormData((prevData) => ({ ...prevData, message: content }));
  };

  const handleAdd = async () => {
    try {
      const res = await ApiClient.patch(
        `/setting/announcement/${id}`,
        formData
      );
      if (res.status === 200) {
        toast.success("Successfully Updated announcement");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAnnouncement();
  }, [id]);
  const editorConfig = {
    placeholder: "", // You can set other options here if needed
  };
  console.log(formData);
  return (
    <div>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Edit Announcement
        </p>
        <div className="bg-[#eee] p-4">
          <div className="flex gap-8 py-4">
            <div className="flex flex-col w-[70%]">
              <span className="text-black text-base font-medium pb-2">
                <label>Title</label>
              </span>
              <input
                type="text"
                name="title"
                value={formData?.title}
                onChange={handleChange}
                className="p-2 bg-white"
              />
            </div>
            <div className="flex flex-col w-[30%]">
              <span className="text-black text-base font-medium pb-2">
                <label>Expiration Date</label>
              </span>
              <input
                type="date"
                name="expiration_date"
                className="text-black text-base font-medium py-1.5 px-1"
                value={formData?.expiration_date}
                onChange={handleChange}
              />
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
                  value={formData?.target_single_employee_id}
                  onChange={handleChange}
                  className="p-2 w-full bg-white border border-gray-300 rounded-md appearance-none focus:outline-none"
                >
                  <option value="">Select Employee</option>
                  {userArray?.map((userItem, idx) => (
                    <option key={idx} value={userItem?.user_ref}>
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
            </div>
          </div>
          <div className="flex flex-col py-4">
            <span className="text-black text-base font-medium pb-2">
              <label>Message</label>
            </span>
            <JoditEditor
              ref={editor}
               defaultValue={""}
              value={formData.message}
              onChange={handleEditorChange}
              config={{
                 placeholder:""
              }}
            />
            ;
          </div>
          <div className="flex justify-center pt-5">
            <button
              onClick={handleAdd}
              className="bg-black text-white px-4 py-2 rounded"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAnnouncement;

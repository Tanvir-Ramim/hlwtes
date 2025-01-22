import React, { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import ApiClient from "../../../axios/ApiClient";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditEmployee = () => {
  const { id } = useParams();
  const navigation = useNavigate();
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    designation: "",
    birthday: "",
    personalEmail: "",
    email: "",
    nid: "",
    gender: "",
    department: "",
    employment_status: "",
    address: "",
    role: "",
    job_type: "",
    join_date: "",
    permanent_date: "",
    hr_end_year: "",
    hr_start_year: "",
    url: null,
    leave_balance: null,
    phone: "",
    web_role: "",
    emergency_contact: {
      name: "",
      relationship: "",
      phone: "",
    },
    hr_leave: {
      casual_leave: 10,
      sick_leave: 10,
      paternity_leave: 7,
      maternity_leave: 0,
    },
    provision_leave: {
      casual_leave: 10,
      sick_leave: 10,
    },
  });
  console.log(formData);

  //   get single user
  const [leave, setLeave] = useState(false);
  const [employeeData, setEmployeeData] = useState({});
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const getSingleUser = async () => {
    try {
      const res = await ApiClient(`/user/${id}`);

      if (res.status === 200) {
        setEmployeeData(res.data.data);
        const join_date = formatDate(res.data.data.join_date);
        const hr_end_year = formatDate(res.data.data.hr_end_year);
        const permanent_date = formatDate(res.data.data.permanent_date);
        const hr_start_year = formatDate(res.data.data.hr_start_year);
        const hrEnd = new Date(res.data.data.hr_end_year).getDate();
        const toDay = new Date().getDate();
        if (hrEnd - toDay <= 7 && hrEnd - toDay >= 1) {
          setLeave(true);
        }
        if (hr_end_year)
          setFormData({
            employee_id: res.data.data.employee_id,
            name: res.data.data.name,
            designation: res.data.data.designation,
            birthday: res.data.data.birthday,
            personalEmail: res.data.data.personalEmail,
            email: res.data.data.email,
            nid: res.data.data.nid,
            gender: res.data.data.gender,
            department: res.data.data.department,
            employment_status: res.data.data.employment_status,
            address: res.data.data.address,
            role: res.data.data.role,
            job_type: res.data.data.job_type,
            join_date: join_date,
            permanent_date: permanent_date,
            hr_start_year: hr_start_year,
            hr_end_year: hr_end_year,
            url: res.data.data.url,
            phone: res.data.data.phone,
            web_role: res.data.data.web_role,
            isActive: res.data.data.isActive,

            hr_leave: {
              casual_leave: res.data.data.hr_leave.casual_leave,
              sick_leave: res.data.data.hr_leave.sick_leave,
              paternity_leave: res.data.data.hr_leave.paternity_leave,
              maternity_leave: res.data.data.hr_leave.maternity_leave,
            },
            provision_leave: {
              casual_leave: res.data.data.provision_leave.casual_leave,
              sick_leave: res.data.data.provision_leave.sick_leave,
            },
            emergency_contact: {
              name: res.data.data.emergency_contact.name,
              relationship: res.data.data.emergency_contact.relationship,
              phone: res.data.data.emergency_contact.phone,
            },
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const joinDate = formData.join_date ? Date.parse(formData.join_date) : null;
    if ((name === "permanent_date" || name === "hr_start_year") && !joinDate) {
      alert("Please select the Join Date first.");
      return;
    }
    if (name === "permanent_date") {
      const selectedPermanentDate = Date.parse(value);
      if (selectedPermanentDate < joinDate) {
        alert("Permanent date cannot be earlier than Join Date.");
        return;
      }
    } else if (name === "hr_start_year") {
      const selectedStartYear = Date.parse(value);
      if (selectedStartYear < joinDate) {
        alert("HR Start Year cannot be earlier than Join Date.");
        return;
      }
    } else if (name === "hr_end_year") {
      const startYear = formData.hr_start_year
        ? Date.parse(formData.hr_start_year)
        : null;
      const selectedEndYear = Date.parse(value);
      if (!startYear) {
        alert("Please select HR Start Year first.");
        return;
      } else if (selectedEndYear <= startYear) {
        alert("HR End Year must be later than HR Start Year.");
        return;
      }
    }
    if (name === "gender" && value === "Male") {
      setFormData((prevData) => ({
        ...prevData,
        hr_leave: {
          casual_leave: employeeData.hr_leave.casual_leave,
          sick_leave: employeeData.hr_leave.sick_leave,
          paternity_leave: employeeData.hr_leave.paternity_leave,
          maternity_leave: 0,
        },
      }));
    } else if (name === "gender" && value === "Female") {
      setFormData((prevData) => ({
        ...prevData,
        hr_leave: {
          casual_leave: employeeData.hr_leave.casual_leave,
          sick_leave: employeeData.hr_leave.sick_leave,
          paternity_leave: 0,
          maternity_leave: employeeData.hr_leave.maternity_leave,
        },
      }));
    }
    if (name === "password") {
      setFormData((prevData) => ({
        ...prevData,
        password: value,
        confirm_pass: value,
      }));
    } else if (
      name.startsWith("hr_leave") ||
      name.startsWith("provision_leave")
    ) {
      const fieldName = name.split(".")[1];
      if (name.startsWith("hr_leave")) {
        setFormData((prevData) => ({
          ...prevData,
          hr_leave: {
            ...prevData.hr_leave,
            [fieldName]: Number(value),
          },
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          provision_leave: {
            ...prevData.provision_leave,
            [fieldName]: Number(value),
          },
        }));
      }
    } else if (name.startsWith("emergency_contact.")) {
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        emergency_contact: {
          ...prevData.emergency_contact,
          [fieldName]: value,
        },
      }));
    } else {
      // Handle all other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      url: e.target.files[0],
    }));
  };
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "emergency_contact") {
        Object.keys(formData.emergency_contact).forEach((contactKey) => {
          form.append(
            `emergency_contact[${contactKey}]`,
            formData.emergency_contact[contactKey]
          );
        });
      } else if (key === "hr_leave") {
        Object.keys(formData.hr_leave).forEach((contactKey) => {
          form.append(`hr_leave[${contactKey}]`, formData.hr_leave[contactKey]);
        });
      } else if (key === "provision_leave") {
        Object.keys(formData.provision_leave).forEach((contactKey) => {
          form.append(
            `provision_leave[${contactKey}]`,
            formData.provision_leave[contactKey]
          );
        });
      } else if (key === "url" && formData.url) {
        form.append("url", formData.url);
      } else {
        form.append(key, formData[key]);
      }
    });

    try {
      const res = await ApiClient.patch(`/user/${id}`, form);
      if (res.status === 204) {
        toast.success("Successfully Update");
        navigation(-1);
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };
  //save previous hr leave
  const handleSavePre = async (value) => {
    console.log(value);
    const hr_leave = {};
    hr_leave.casual_leave = value.casual_leave;
    hr_leave.sick_leave = value.sick_leave;
    if (formData.gender === "Female") {
      hr_leave.maternity_leave = value.maternity_leave;
    }
    if (formData.gender === "Male") {
      hr_leave.paternity_leave = value.paternity_leave;
    }
    try {
      const res = await ApiClient.patch(`/user/${id}`, {
        prev_leave: hr_leave,
      });
      if (res.status === 204) {
        toast.success("Successfully Update");
        // navigation(-1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSingleUser();
  }, [id]);

  const [dpt, setDpt] = useState([]);
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      setDpt(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDept();
  }, []);

  return (
    <div>
      <p className="text-2xl font-bold text-black pb-10 uppercase">
        Edit Employee
      </p>
      <div className="bg-[#eee] p-6 rounded-lg space-y-4">
        <div className=" p-3 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Employee Details</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Emp ID
              </label>
              <input
                type="text"
                name="employee_id"
                placeholder="ID"
                value={formData.employee_id}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="p-2 rounded border"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Birthday
              </label>
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Personal Email
              </label>
              <input
                type="email"
                name="personalEmail"
                placeholder="Personal Email"
                value={formData.personalEmail}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                NID Number
              </label>
              <input
                type="text"
                name="nid"
                placeholder="NID Number"
                value={formData.nid}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Photo
              </label>
              <input
                type="file"
                name="url"
                onChange={handleFileChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col col-span-4 w-full ">
              <label className="text-black text-base font-semibold">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                cols={100}
                className="p-2 rounded border"
              />
            </div>
          </div>
        </div>

        {/* Part 2: Company Details */}
        <div className=" p-3 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Company Information</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="p-2 rounded border"
              >
                <option value="">Select Department</option>
                {dpt?.map((item, i) => (
                  <option key={i} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="p-2 rounded border"
              >
                <option value="">Select Role</option>
                <option value="junior">Junior</option>
                <option value="senior">Senior</option>
                <option value="lead">Lead</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Designation
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="p-2 rounded border"
              >
                <option value="">Select Designation</option>
                <option value="developer">Developer</option>
                <option value="manager">Manager</option>
                <option value="analyst">Analyst</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Official Email"
                value={formData.email}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Joining Date
              </label>
              <input
                type="date"
                name="join_date"
                value={formData.join_date}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Permanent Date
              </label>
              <input
                type="date"
                name="permanent_date"
                value={formData.permanent_date}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                HR Year Start
              </label>
              <input
                type="date"
                name="hr_start_year"
                value={formData.hr_start_year}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                HR Year End
              </label>
              <input
                type="date"
                name="hr_end_year"
                value={formData.hr_end_year}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Employee Status
              </label>
              <select
                name="employment_status"
                value={formData.employment_status}
                onChange={handleChange}
                className="p-2 rounded border"
              >
                <option value="">Select Employee Status</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            {/* <div className="flex flex-col">
            <label className="text-black text-base font-semibold">Password</label>
            <input type="text" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="p-2 rounded border" />
      
          </div> */}
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Employee Type
              </label>
              <div className="flex gap-5 pt-2">
                <label>
                  <input
                    type="radio"
                    name="job_type"
                    value="onsite"
                    checked={formData.job_type === "onsite"}
                    onChange={handleRadioChange}
                    className="mr-2"
                  />
                  Onsite
                </label>
                <label>
                  <input
                    type="radio"
                    name="job_type"
                    value="remote"
                    checked={formData.job_type === "remote"}
                    onChange={handleRadioChange}
                    className="mr-2"
                  />
                  Remote
                </label>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base mr-2 font-semibold">
                Access Role
              </label>
              <select
                name="web_role"
                value={formData.web_role}
                onChange={handleChange}
                className="p-2 rounded border"
              >
                <option value="">Select Role</option>
                <option value="employee">Employee</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        {/* leave details */}
        <div className="p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Leave Details</h2>
          {formData.employment_status === "permanent" && (
            <div className="grid grid-cols-4 gap-6">
              <div className="flex flex-col">
                <label className="text-black text-base font-semibold">
                  Casual Leave
                </label>
                <input
                  type="number"
                  name="hr_leave.casual_leave"
                  placeholder="Casual Leave"
                  value={formData.hr_leave.casual_leave}
                  onChange={handleChange}
                  className="p-2 rounded border"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-black text-base font-semibold">
                  Sick Leave
                </label>
                <input
                  type="number"
                  name="hr_leave.sick_leave"
                  placeholder="Sick Leave"
                  value={formData.hr_leave.sick_leave}
                  onChange={handleChange}
                  className="p-2 rounded border"
                />
              </div>
              {formData.gender === "Male" && (
                <div className="flex flex-col">
                  <label className="text-black text-base font-semibold">
                    Paternity Leave
                  </label>
                  <input
                    type="number"
                    name="hr_leave.paternity_leave"
                    placeholder="Relationship"
                    value={formData.hr_leave.paternity_leave}
                    onChange={handleChange}
                    className="p-2 rounded border"
                  />
                </div>
              )}
              {formData.gender === "Female" && (
                <div className="flex flex-col">
                  <label className="text-black text-base font-semibold">
                    Maternity Leave
                  </label>
                  <input
                    type="number"
                    name="hr_leave.maternity_leave"
                    placeholder="  Maternity Leave"
                    value={formData.hr_leave.maternity_leave}
                    onChange={handleChange}
                    className="p-2 rounded border"
                  />
                </div>
              )}
            </div>
          )}
          {formData.employment_status !== "permanent" && (
            <div className="grid grid-cols-4 gap-6">
              <div className="flex flex-col">
                <label className="text-black text-base font-semibold">
                  Casual Leave
                </label>
                <input
                  type="number"
                  name="provision_leave.casual_leave"
                  placeholder="Casual Leave"
                  value={formData.provision_leave.casual_leave}
                  onChange={handleChange}
                  className="p-2 rounded border"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-black text-base font-semibold">
                  Sick Leave
                </label>
                <input
                  type="number"
                  name="provision_leave.sick_leave"
                  placeholder="Sick Leave"
                  value={formData.provision_leave.sick_leave}
                  onChange={handleChange}
                  className="p-2 rounded border"
                />
              </div>
            </div>
          )}
        </div>
        {/* save previous hr rest leave  */}
        {leave && (
          <div className="p-4 shadow rounded-lg">
            <h2 className="text-lg  font-bold mb-4">
              HR{" "}
              <span className="text-gray-600 text-sm font-semibold">
                ( {formatDate(employeeData?.hr_start_year)}
                <span className="px-2">To</span>{" "}
                {formatDate(employeeData.hr_end_year)})
              </span>
            </h2>
            {formData.employment_status === "permanent" && (
              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <label className="text-black text-base font-semibold">
                    Casual Leave
                  </label>
                  <input
                    type="number"
                    disabled
                    name="hr_leave.casual_leave"
                    placeholder="Casual Leave"
                    value={formData.hr_leave.casual_leave}
                    onChange={handleChange}
                    className="p-2 rounded border"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-black text-base font-semibold">
                    Sick Leave
                  </label>
                  <input
                    type="number"
                    disabled
                    name="hr_leave.sick_leave"
                    placeholder="Sick Leave"
                    value={formData.hr_leave.sick_leave}
                    onChange={handleChange}
                    className="p-2 rounded border"
                  />
                </div>
                {formData.gender === "Male" && (
                  <div className="flex flex-col">
                    <label className="text-black text-base font-semibold">
                      Paternity Leave
                    </label>
                    <input
                      type="number"
                      disabled
                      name="hr_leave.paternity_leave"
                      placeholder="Relationship"
                      value={formData.hr_leave.paternity_leave}
                      onChange={handleChange}
                      className="p-2 rounded border"
                    />
                  </div>
                )}
                {formData.gender === "Female" && (
                  <div className="flex flex-col">
                    <label className="text-black text-base font-semibold">
                      Maternity Leave
                    </label>
                    <input
                      disabled
                      type="number"
                      name="hr_leave.maternity_leave"
                      placeholder="  Maternity Leave"
                      value={formData.hr_leave.maternity_leave}
                      onChange={handleChange}
                      className="p-2 rounded border"
                    />
                  </div>
                )}
              </div>
            )}
            {formData.employment_status !== "permanent" && (
              <div className="grid grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <label className="text-black text-base font-semibold">
                    Casual Leave
                  </label>
                  <input
                    disabled
                    type="number"
                    name="provision_leave.casual_leave"
                    placeholder="Casual Leave"
                    value={formData.provision_leave.casual_leave}
                    onChange={handleChange}
                    className="p-2 rounded border"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-black text-base font-semibold">
                    Sick Leave
                  </label>
                  <input
                    type="number"
                    disabled
                    name="provision_leave.sick_leave"
                    placeholder="Sick Leave"
                    value={formData.provision_leave.sick_leave}
                    onChange={handleChange}
                    className="p-2 rounded border"
                  />
                </div>
              </div>
            )}
            <div>
              <button
                onClick={() => handleSavePre(formData?.hr_leave)}
                className="bg-blue-500 text-white  rounded px-3 py-1 mt-2"
              >
                Store
              </button>
            </div>
          </div>
        )}

        {/* Part 3: Emergency Contact */}
        <div className=" p-3 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                {" "}
                Name
              </label>
              <input
                type="text"
                name="emergency_contact.name"
                placeholder="Contact Name"
                value={formData.emergency_contact.name}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                {" "}
                Phone
              </label>
              <input
                type="tel"
                name="emergency_contact.phone"
                placeholder="Contact Phone"
                value={formData.emergency_contact.phone}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Relationship
              </label>
              <input
                type="text"
                name="emergency_contact.relationship"
                placeholder="Relationship"
                value={formData.emergency_contact.relationship}
                onChange={handleChange}
                className="p-2 rounded border"
              />
            </div>
          </div>
        </div>

        <div className="py-3  flex justify-center">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;

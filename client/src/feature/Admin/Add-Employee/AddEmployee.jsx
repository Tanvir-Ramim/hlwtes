import { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    name: "",
    designation: "",
    birthday: "",
    personalEmail: "",
    email: "",
    nid: "",
    gender: "Male",
    department: "",
    employment_status: "",
    address: "",
    role: "",
    job_type: "",
    join_date: "",
    permanent_date: "",
    hr_end_year: "",
    hr_start_year: "",
    password: "",
    confirm_pass: "",
    url: null,
    phone: "",
    web_role: "",
    isAdmin: false,
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

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    const joinDate = formData.join_date ? Date.parse(formData.join_date) : null;
    if (name === "employment_status") {
      setFormData((prevData) => ({
        ...prevData,
        hr_leave: {
          casual_leave: 10,
          sick_leave: 10,
          paternity_leave: 7,
          maternity_leave: 90,
        },
        provision_leave: {
          casual_leave: 10,
          sick_leave: 10,
        },
      }));
    }
    if (name === "gender" && value === "Male") {
      setFormData((prevData) => ({
        ...prevData,
        hr_leave: {
          casual_leave: 10,
          sick_leave: 10,
          paternity_leave: 7,
          maternity_leave: 0,
        },
      }));
    } else if (name === "gender" && value === "Female") {
      setFormData((prevData) => ({
        ...prevData,
        hr_leave: {
          casual_leave: 10,
          sick_leave: 10,
          paternity_leave: 0,
          maternity_leave: 90,
        },
      }));
    }

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
    if (name === "web_role") {
      if (value === "admin" || value === "hr") {
        setFormData((prevData) => ({
          ...prevData,
          web_role: value,
          isAdmin: true,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          web_role: value,
          isAdmin: false,
        }));
      }
    }

    if (name === "password") {
      setFormData((prevData) => ({
        ...prevData,
        password: value,
        confirm_pass: value,
      }));
    } else if (name.startsWith("emergency_contact.")) {
      const fieldName = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        emergency_contact: {
          ...prevData.emergency_contact,
          [fieldName]: value,
        },
      }));
    }
    
    
    else if (
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
    }
     else {
      // Handle all other fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  console.log(formData);
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
  const fieldLabels = {
    employee_id: "Employee Id",
    hr_end_year: "HR End year",
    name: "Name",
    gender: "Gender",
    birthday: "Birthday",
    personalEmail: "Personal email",
    phone: "Phone number",
    nid: "Nid",
    address: "Address",
    email: "Official email",
    department: "Department",
    role: "Role",
    designation: "Designation",
    join_date: "Join Date",
    permanent_date: "Permanent Date",
    hr_start_year: "HR Start Year",
    employment_status: "Employment Status",
    password: "Password",
    job_type: "Job Type",
    web_role: "Access Role",
    // Add any other fields you want to map
  };
  const validate = () => {
    const newErrors = {};

    const bangladeshiPhoneRegex = /^(?:\+8801|01)[0-9]{9}$/;

    Object.keys(formData).forEach((field) => {
      if (
        !formData[field] &&
        field !== "confirm_pass" &&
        field !== "url" &&
        // field !== "emergency_contact",
        field !== "isAdmin"
      ) {
        newErrors[field] = `${fieldLabels[field] || field} is required`;
      }
    });

    // Personal and official email validations
    if (
      formData.personalEmail &&
      !/\S+@\S+\.\S+/.test(formData.personalEmail)
    ) {
      newErrors.personalEmail = "Personal email is invalid";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Official email is invalid";
    }

    // Password matching validation
    if (
      formData.password &&
      formData.confirm_pass &&
      formData.password !== formData.confirm_pass
    ) {
      newErrors.confirm_pass = "Passwords do not match";
    }

    // Phone number validation
    if (formData.phone && !bangladeshiPhoneRegex.test(formData.phone)) {
      newErrors.phone =
        "Phone number is invalid. It must be a valid Bangladeshi number.";
      toast.error(
        "Phone number is invalid. It must be a valid Bangladeshi number."
      );
    }

    //for leave details
    // if (!formData.hr_leave.casual_leave) {
    //   newErrors["hr_leave.casual_leave"] = "Casual Leave is required";
    // }
    // if (!formData.hr_leave.sick_leave) {
    //   newErrors["hr_leave.sick_leave"] = "Sick Leave is required";
    // }
    // if (!formData.hr_leave.paternity_leave) {
    //   newErrors["hr_leave.paternity_leave"] = "Paternity Leave is required";
    // }
    // if (!formData.hr_leave.maternity_leave) {
    //   newErrors["hr_leave.maternity_leave"] = "Maternity Leave is required";
    // }
    // Emergency contact validation
    if (formData.emergency_contact) {
      if (!formData.emergency_contact.name) {
        newErrors["emergency_contact.name"] =
          "Emergency contact name is required";
      }

      if (
        !formData.emergency_contact.phone ||
        !bangladeshiPhoneRegex.test(formData.emergency_contact.phone)
      ) {
        newErrors["emergency_contact.phone"] =
          " It must be a valid Bangladeshi number.";
        // toast.error("Emergency contact phone number is invalid. It must be a valid Bangladeshi number.");
      }

      if (!formData.emergency_contact.relationship) {
        newErrors["emergency_contact.relationship"] =
          "Emergency contact relationship is required";
      }
    }

    setErrors(newErrors);
    console.log(newErrors);
    return Object?.keys(newErrors)?.length == 0;
  };
  const [loader, setLoader] = useState(false);
  const handleSave = async () => {
    if (validate()) {
      const form = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "emergency_contact") {
          Object.keys(formData.emergency_contact).forEach((contactKey) => {
            form.append(
              `emergency_contact[${contactKey}]`,
              formData.emergency_contact[contactKey]
            );
          });
        } 
        else if (key === "hr_leave") {
          Object.keys(formData.hr_leave).forEach((contactKey) => {
            form.append(
              `hr_leave[${contactKey}]`,
              formData.hr_leave[contactKey]
            );
          });
        } 
        else if (key === "provision_leave") {
          Object.keys(formData.provision_leave).forEach((contactKey) => {
            form.append(
              `provision_leave[${contactKey}]`,
              formData.provision_leave[contactKey]
            );
          });
        } 
        else if (key === "url" && formData.url) {
          form.append("url", formData.url);
        } else {
          form.append(key, formData[key]);
        }
      });

      try {
        setLoader(true);

        const res = await ApiClient.post("/auth/sign-up", form);
        if (res.status === 201) {
          setLoader(false);
          toast.success("Successfully Add Employee");
          navigate("/admin/employee-list");
        }
      } catch (error) {
        console.log(error);
        setLoader(false);
        if (error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert("Failed to Add");
        }
      }

      // Reset form data
      // setFormData({
      //   employee_id: "",
      //   name: "",
      //   designation: "",
      //   birthday: "",
      //   personalEmail: "",
      //   email: "",
      //   nid: "",
      //   gender: "",
      //   department: "",
      //   employment_status: "",
      //   address: "",
      //   role: "",
      //   job_type: "",
      //   join_date: "",
      //   permanent_date: "",
      //   hr_end_year: "",
      //   hr_start_year: "",
      //   password: "",
      //   confirm_pass: "",
      //   url: null,
      //   phone: "",
      //   emergency_contact: {
      //     name: "",
      //     relationship: "",
      //     phone: "",
      //   },
      // });
      setErrors({});
      document.querySelector('input[name="url"]').value = "";
    } else {
      console.log("ffffffffffffffff");
    }
  };

  const [dpt, setDpt] = useState([]);
  const getDept = async () => {
    try {
      const res = await ApiClient.get("/departments");
      setDpt(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [roleData, setRoleData] = useState([]);
  const [degiData, setDegiData] = useState([]);
  //   get Categories
  const getCategories = async () => {
    try {
      const res = await ApiClient.get(`/setting/categories?categoryName=Role`);
      setRoleData(res.data.data);
      const res2 = await ApiClient.get(
        `/setting/categories?categoryName=Designation`
      );
      setDegiData(res2.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDept();
    getCategories();
  }, []);
  console.log(formData);
  return (
    <div>
      <p className="text-2xl font-bold text-black pb-10 uppercase">
        Add Employee
      </p>
      <div className="bg-[#eee] px-4 pt-2 rounded-lg space-y-4">
        <div className=" p-4 shadow rounded-lg">
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
              {errors.employee_id && (
                <p className="text-red-500">{errors.employee_id}</p>
              )}
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
              {errors.name && <p className="text-red-500">{errors.name}</p>}
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
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {errors.gender && <p className="text-red-500">{errors.gender}</p>}
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
              {errors.birthday && (
                <p className="text-red-500">{errors.birthday}</p>
              )}
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
              {errors.personalEmail && (
                <p className="text-red-500">{errors.personalEmail}</p>
              )}
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
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
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
              {errors.nid && <p className="text-red-500">{errors.nid}</p>}
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
              {errors.url && <p className="text-red-500">{errors.url}</p>}
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Address
              </label>
              <textarea
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="p-2 rounded border"
              />
              {errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
            </div>
          </div>
        </div>

        {/* Part 2: Company Details */}
        <div className=" px-4 pt-2 pb-4 shadow rounded-lg">
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
              {errors.department && (
                <p className="text-red-500">{errors.department}</p>
              )}
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
                {roleData?.map((item, i) => (
                  <option key={i} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-red-500">{errors.role}</p>}
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
                {degiData?.map((item, i) => (
                  <option key={i} value={item?.name}>
                    {item?.name}
                  </option>
                ))}
              </select>
              {errors.designation && (
                <p className="text-red-500">{errors.designation}</p>
              )}
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
              {errors.email && <p className="text-red-500">{errors.email}</p>}
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
              {errors.join_date && (
                <p className="text-red-500">{errors.join_date}</p>
              )}
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
              {errors.permanent_date && (
                <p className="text-red-500">{errors.permanent_date}</p>
              )}
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
              {errors.hr_start_year && (
                <p className="text-red-500">{errors.hr_start_year}</p>
              )}
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
              {errors.hr_end_year && (
                <p className="text-red-500">{errors.hr_end_year}</p>
              )}
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
              {errors.employment_status && (
                <p className="text-red-500">{errors.employment_status}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Password
              </label>
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="p-2 rounded border"
              />
              {errors.password && (
                <p className="text-red-500">{errors.password}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
                Job Type
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
              {errors.job_type && (
                <p className="text-red-500">{errors.job_type}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
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
              {errors.web_role && (
                <p className="text-red-500">{errors.web_role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Part 3: Emergency Contact */}
        {formData.employment_status !== "" && (
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
                  {errors["hr_leave.casual_leave"] && (
                    <p className="text-red-500">
                      {errors["hr_leave.casual_leave"]}
                    </p>
                  )}
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
                  {errors["hr_leave.sick_leave"] && (
                    <p className="text-red-500">
                      {errors["hr_leave.sick_leave"]}
                    </p>
                  )}
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
                    {errors["hr_leave.paternity_leave"] && (
                      <p className="text-red-500">
                        {errors["hr_leave.paternity_leave"]}
                      </p>
                    )}
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
                    {errors["hr_leave.maternity_leave"] && (
                      <p className="text-red-500">
                        {errors["hr_leave.maternity_leave"]}
                      </p>
                    )}
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
                  {errors["provision_leave.casual_leave"] && (
                    <p className="text-red-500">
                      {errors["provision_leave.casual_leave"]}
                    </p>
                  )}
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
                  {errors["provision_leave.sick_leave"] && (
                    <p className="text-red-500">
                      {errors["provision_leave.sick_leave"]}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="p-4 shadow rounded-lg">
          <h2 className="text-lg font-bold mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">Name</label>
              <input
                type="text"
                name="emergency_contact.name"
                placeholder="Contact Name"
                value={formData.emergency_contact.name}
                onChange={handleChange}
                className="p-2 rounded border"
              />
              {errors["emergency_contact.name"] && (
                <p className="text-red-500">
                  {errors["emergency_contact.name"]}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="text-black text-base font-semibold">
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
              {errors["emergency_contact.phone"] && (
                <p className="text-red-500">
                  {errors["emergency_contact.phone"]}
                </p>
              )}
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
              {errors["emergency_contact.relationship"] && (
                <p className="text-red-500">
                  {errors["emergency_contact.relationship"]}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="flex py-6 justify-center">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700"
          >
            {loader ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin" />{" "}
              </>
            ) : (
              <>Submit</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;

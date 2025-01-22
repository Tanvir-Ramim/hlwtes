import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";
import HolidayShow from "../Employess-List/HolidayShow";
import MultiSelect from "multiselect-react-dropdown";
const AddHoliday = () => {
  const [holidayFetch, setHolidayFetch] = useState([]);
  const currentYear = new Date().getFullYear();
  const [selectedItem, setSelectedItem] = useState(null);
  const currentMonth = new Date().getMonth() + 1;
  const [time, setTime] = useState({
    month: `${currentMonth}`,
    year: `${currentYear}`,
  });

  const [holidayData, setHolidayData] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [show, setShow] = useState({
    name: "",
    date: "",
  });

  const [noData, setNodata] = useState(false);
  const [loading, setLoading] = useState(false);

  const [filterDate, setFilterDate] = useState();
  const getHolidayDates = async () => {
    try {
      setLoading(true);
      const res = await ApiClient.get(
        `/setting/holiday?year=${time?.year}&month=${time?.month}`
      );

      const holidays = res.data.data[0]?.holiday_list || [];
      setHolidayFetch(holidays);
      setNodata(holidays.length === 0);
      setIsAdding(false);
      const formattedHolidayData = holidays?.map((item) => ({
        date: item.date,
        name: item.name,
        ...(item?.user_ref && { user_ref: item?.user_ref }),
      }));
      setHolidayData(formattedHolidayData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };
  const [user, setUser] = useState([]);

  const getEmployee = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUser(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getEmployee();
  }, []);

  const handleChange = async (index, field, value) => {
    const updatedHolidayData = [...holidayData];

    if (field === "nameOption") {
      const parts = updatedHolidayData[index]?.name?.split(" - ") || [];
      updatedHolidayData[index].name =
        value + (parts[1] ? ` - ${parts[1]}` : "");
      if (value !== "Developer") {
        updatedHolidayData[index]["user_ref"] = [];
      }
    } else if (field === "nameInput") {
      const parts = updatedHolidayData[index]?.name?.split(" - ") || [];
      updatedHolidayData[index].name =
        (parts[0] || "") + (value ? ` - ${value}` : "");
    } else if (field === "user_ref") {
      // Store only the _id from the selected options
      const userIds = value.map((selectedUser) => selectedUser._id);
      updatedHolidayData[index][field] = userIds;

      // Extract the names from the selected users for the 'name' field update
      const selectedUserNames = value.map((selectedUser) => {
        const filterUser = user.find((item) => item._id === selectedUser._id);
        return filterUser ? filterUser.name : "";
      });

      const parts = updatedHolidayData[index]?.name?.split(" - ") || [];
      updatedHolidayData[index].name =
        (parts[0] || "") +
        (selectedUserNames.length ? ` - ${selectedUserNames.join(", ")}` : "");
    } else {
      updatedHolidayData[index][field] = value;
    }

    setHolidayData(updatedHolidayData);
  };
  const [isCalled, setIsCalled] = useState(false);
  const addHoliday = () => {
    const daysInMonth = new Date(time.year, time.month, 0).getDate();
    const newHolidayData = Array.from({ length: daysInMonth }, (_, index) => ({
      date: `${time.year}-${String(time.month).padStart(2, "0")}-${String(
        index + 1
      ).padStart(2, "0")}`,
      name: "",
    }));
    setHolidayData(newHolidayData);
    setIsAdding(true);
    setIsCalled(true);
  };
  // update holiday list
  useEffect(() => {
    if (isCalled) {
      handleAddHoliday();
    }
  }, [isCalled]);
  const updateHoliday = async () => {
    try {
      const res = await ApiClient.patch(
        `/setting/holiday?year=${time?.year}&month=${time?.month}`,
        holidayData
      );
      if (res.status === 200) {
        toast.success("Successfully Update Holiday List");
      }
      setIsAdding(false);
      getHolidayDates();
    } catch (error) {
      console.log(error);
    }
  };

  // add holiday list
  const handleAddHoliday = async () => {
    const data = {
      month: time.month,
      year: time.year,
      holiday_list: holidayData,
    };
    try {
      const res = await ApiClient.post(`/setting/holiday`, data);
      if (res.status === 201) {
        setIsAdding(false);
        getHolidayDates();
        setIsCalled(false);
        toast.success("Successfully Add Holiday List");
      }
    } catch (error) {
      setIsAdding(false);
      console.log(error);
    }
  };

  // delete holiday list
  const handleDelete = async () => {
    try {
      const res = await ApiClient.delete(
        `/setting/holiday?year=${time?.year}&month=${time?.month}`
      );
      if (res.status === 200) {
        toast.success("Successfully Delete Holiday List");
      }
      getHolidayDates();
    } catch (error) {
      console.log(error);
    }
  };

  const padToTwoDigits = (num) => (num < 10 ? `0${num}` : num);
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const getFormattedMinMaxDates = () => {
    const { month, year } = time;
    const firstDay = `${year}-${padToTwoDigits(month)}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const lastDayFormatted = `${year}-${padToTwoDigits(month)}-${lastDay}`;
    setMin(firstDay);
    setMax(lastDayFormatted);
  };
  const [categoriesData, setCategoriesData] = useState([]);
  console.log(categoriesData);
  const getCategories = async () => {
    try {
      const res = await ApiClient.get(
        `/setting/categories?categoryName=Holiday_type`
      );
      console.log(res);
      setCategoriesData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //  get holiday

  useEffect(() => {
    getFormattedMinMaxDates();
  }, [time.month, time.year]);

  useEffect(() => {
    const firstDayOfMonth = `${time.year}-${String(time.month).padStart(
      2,
      "0"
    )}-01`;
    setFilterDate(firstDayOfMonth);
  }, [time.month, time.year]);

  useEffect(() => {
    getHolidayDates();
  }, [time?.month, time?.year]);
  useEffect(() => {
    getCategories();
  }, []);

  // useEffect(() => {
  //   console.log(selectedItem);
  //   const itemNames = selectedItem?.name?.split(" - ")[1]?.split(",") || [];

  //   let filteredUsers = user.filter((u) => !itemNames.includes(u.name));
  // }, [filterDate]);

  return (
    <div>
      <p className="text-2xl font-bold text-black pb-6 relative uppercase">
        Add or Update Holiday List
      </p>
      <div className="flex justify-between ">
        {noData && (
          <div className="flex gap-4 pb-3 font-semibold">
            <div className="flex gap-2">
              <h1>Month:</h1>
              <select
                value={time?.month}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, month: e.target.value }))
                }
                className="bg-gray-300 rounded"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((monthName, index) => (
                  <option key={index + 1} value={index + 1}>
                    {monthName}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <h1>Year:</h1>
              <input
                value={time?.year}
                onChange={(e) =>
                  setTime((prev) => ({ ...prev, year: e.target.value }))
                }
                placeholder="2024"
                className="bg-gray-300 rounded border px-2 w-24"
                type="text"
              />
            </div>
            {holidayFetch?.length > 0 && (
              <div className="flex gap-3">
                <h1>Date:</h1>
                <input
                  className="bg-gray-300 rounded border px-2"
                  type="date"
                  min={min}
                  max={max}
                  // defaultValue={filterDate}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>
            )}
          </div>
        )}
        {!noData && (
          <div className="flex justify-end  w-full">
            <div>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white mr-auto font-semibold py-1 px-4 rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition ease-in-out duration-300"
              >
                Delete Holiday List
              </button>
            </div>
          </div>
        )}
      </div>
      {noData ? (
        <div className="bg-white p-6 rounded-lg text-center mt-6 border border-gray-200">
          <p className="text-gray-600 font-semibold mb-4">
            No holiday data. Click below to add a holiday list.
          </p>
          <button
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-green-500 hover:to-blue-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition ease-in-out duration-300"
            onClick={addHoliday}
          >
            Add Holiday List
          </button>
        </div>
      ) : (
        <div className="flex    gap-48  pt-8">
          <div className="w-[45%] h-[60px]">
            <div className="flex gap-4 pb-3 font-semibold">
              <div className="flex gap-2">
                <h1>Month:</h1>
                <select
                  value={time?.month}
                  onChange={(e) =>
                    setTime((prev) => ({ ...prev, month: e.target.value }))
                  }
                  className="bg-gray-300 rounded"
                >
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((monthName, index) => (
                    <option key={index + 1} value={index + 1}>
                      {monthName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <h1>Year:</h1>
                <input
                  value={time?.year}
                  onChange={(e) =>
                    setTime((prev) => ({ ...prev, year: e.target.value }))
                  }
                  placeholder="2024"
                  className="bg-gray-300 rounded border px-2 w-24"
                  type="text"
                />
              </div>
              {holidayFetch?.length > 0 && (
                <div className="flex gap-3">
                  <h1>Date:</h1>
                  <input
                    className="bg-gray-300 rounded border px-2"
                    type="date"
                    min={min}
                    max={max}
                    // defaultValue={filterDate}
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                  />
                </div>
              )}
            </div>
            {holidayData?.map((item, i) => {
              const itemDate = new Date(item?.date).toISOString().split("T")[0];
              const isVisible = itemDate === filterDate;
              let selectedUsers;
              if (isVisible && selectedItem !== item) {
                // setSelectedItem(item);

                selectedUsers = user.filter((u) =>
                  item?.name
                    ?.split(" - ")[1]
                    ?.split(",")
                    .map((name) => name.trim())
                    .includes(u?.name.trim())
                );
                console.log(selectedUsers);
                setSelectedItem(item);
              }
              return (
                <div
                  className={`bg-white shadow-lg ${
                    !isVisible ? "hidden" : ""
                  } rounded-lg p-4  border border-gray-200`}
                  key={i}
                >
                  <div className="flex justify-center items-center my-2">
                    <p className="text-gray-600 font-bold text-lg text-center">
                      {new Date(item?.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="mb-4">
                    <div className="  items-center mt-2">
                      <div
                        className={`
                          "w-full"
                   
                        `}
                      >
                        <p className="text-gray-600 py-2 block font-semibold">
                          Type:
                        </p>
                        {categoriesData?.length > 0 && (
                          <select
                            value={item?.name?.split(" - ")[0]}
                            className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            onChange={(e) =>
                              handleChange(i, "nameOption", e.target.value)
                            }
                          >
                            <option className="text-red-500" hidden>
                              <span className="text-red-600">Select</span>
                            </option>
                            {categoriesData?.map((categoryItem, idx) => (
                              <option key={idx} value={categoryItem?.name}>
                                {categoryItem?.name}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>

                      {item?.name?.split(" - ")[0] === "Developer" && (
                        <div className="w-full">
                          <p className="text-gray-600 py-3 block font-semibold">
                            Assign Employee:
                          </p>
                          {/* <select
                            value={item?.user_ref || ""}
                            className="border border-gray-300 rounded-lg p-2 w-full  focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-2"
                            onChange={(e) =>
                              handleChange(i, "user_ref", e.target.value)
                            }
                          >
                            <option hidden>Select Here</option>
                            {user?.map((userItem, idx) => (
                              <option key={idx} value={userItem?._id}>
                                {userItem?.name}
                              </option>
                            ))}
                          </select> */}

                          {/* <MultiSelect
                            className="rounded-lg  w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none "
                            options={user}
                            displayValue="name"
                            isObject={true}
                            selectedValues={selectedUsers && selectedUsers}
                            onSelect={(selectedOptions) =>
                              handleChange(i, "user_ref", selectedOptions)
                            }
                            onRemove={(selectedOptions) =>
                              handleChange(i, "user_ref", selectedOptions)
                            }
                          /> */}
                          <MultiSelect
                          
                            className="rounded-lg w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            options={user}
                            displayValue="name"
                            isObject={true}
                            selectedValues={selectedUsers}
                            onSelect={(selectedOptions) =>
                              handleChange(i, "user_ref", selectedOptions)
                            }
                            onRemove={(selectedOptions) =>
                              handleChange(i, "user_ref", selectedOptions)
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  {item?.name?.split(" - ")[0] !== "Developer" && (
                    <div className="mb-4">
                      <p className="text-gray-600 font-semibold">
                        {" "}
                        {item?.name?.split(" - ")[0] === "Developer"
                          ? "Name :"
                          : "Note :"}
                      </p>
                      <textarea
                        cols={20}
                        rows={5}
                        value={item?.name?.split(" - ")[1] || ""}
                        className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        placeholder="text"
                        onChange={(e) =>
                          handleChange(i, "nameInput", e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
            <div className="">
              <div className="flex justify-center items-center h-full mr-5">
                <button
                  className="bg-gradient-to-r my-5 flex  w-fit  from-indigo-500  to-purple-600 text-white font-semibold py-1.5 px-4 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition ease-in-out duration-300"
                  onClick={updateHoliday}
                >
                  {selectedItem?.name?.split(" - ")[0] ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
          <div className="w-[65%]">
            <div className="  border ">
              <HolidayShow
                holidayFetch={holidayFetch}
                time={time}
                refetch={getHolidayDates}
                setFilterDate={setFilterDate}
              ></HolidayShow>
            </div>
          </div>
        </div>
      )}

      {isAdding && (
        <div>
          {holidayData?.map((item, i) => (
            <div
              className="bg-white shadow-lg rounded-lg hidden p-4 mt-4 border border-gray-200"
              key={i}
            >
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 font-semibold">
                  Date: {item?.date?.slice(0, 10)}
                </p>
              </div>
              <div className="mb-4">
                <p className="text-gray-600 font-semibold">Name:</p>
                <input
                  value={item?.name?.split(" - ")[1] || ""}
                  className="border border-gray-300 rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="Enter Name"
                  type="text"
                  onChange={(e) => handleChange(i, "nameInput", e.target.value)}
                />
              </div>
              <div className="mb-4">
                <div className="flex space-x-4 items-center mt-2">
                  <div className="w-1/2">
                    <p className="text-gray-600 py-2 block font-semibold">
                      Type :
                    </p>
                    <select
                      value={item?.name?.split(" - ")[0]}
                      className="border border-gray-300 rounded-lg p-2  w-full   focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      onChange={(e) =>
                        handleChange(i, "nameOption", e.target.value, item)
                      }
                    >
                      <option className="text-red-500" hidden>
                        <span className="text-red-600">Select</span>
                      </option>
                      <option value="Developer">Developer</option>
                      <option value="Working">Working</option>
                      <option value="Gvt.Holiday">Gvt.Holiday</option>
                      <option value="Weekend">Weekend</option>
                    </select>
                  </div>
                  {show?.name === "Developer" &&
                    show?.date === item?.date?.slice(0, 10) && (
                      <div className="w-1/2">
                        <p className="text-gray-600 py-1 block font-semibold">
                          Assign By:
                        </p>
                        <select
                          value={item?.user_ref || ""}
                          className="border border-gray-300 rounded-lg p-2 w-full  focus:ring-2 focus:ring-indigo-500 focus:outline-none mt-2"
                          onChange={(e) =>
                            handleChange(i, "user_ref", e.target.value)
                          }
                        >
                          <option hidden>Select Here</option>
                          {user?.map((userItem, idx) => (
                            <option key={idx} value={userItem?.user_ref}>
                              {userItem?.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
          {/* <div className="fixed bottom-16 right-0 z-[999]">
            <div className="flex justify-center mr-5">
              {" "}
              <button
                onClick={handleAddHoliday}
                className="bg-gradient-to-r  from-[#405d7a] to-purple-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition ease-in-out duration-300"
              >
                Add
              </button>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default AddHoliday;

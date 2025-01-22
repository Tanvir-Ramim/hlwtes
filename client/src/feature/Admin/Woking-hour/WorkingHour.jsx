import { format, parse } from "date-fns";
import { useState, useEffect } from "react";
import ApiClient from "../../../axios/ApiClient";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import toast from "react-hot-toast";
const WorkingHour = () => {
  const [time, setTime] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    in_time: "",
    late_time: "",
    half_day_leave: "",
    full_day_leave: "",
    office_hour: 0,
    office_close: "",
    office_season: "",
  });

  console.log(formData);

  const getTime = async () => {
    try {
      const res = await ApiClient.get("/setting/time");
      setTime(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTime();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      in_time: time.in_time || "00:00",
      late_time: time.late_time || "00:00",
      half_day_leave: time.half_day_leave || "00:00",
      full_day_leave: time.full_day_leave || "00:00",
      office_hour: time.office_hour || 0,
      office_close: time.office_close || "00:00",
      office_season: time.office_season || "Summer",
    });
  };
  const convertTimeToDate = (time) => {
    return parse(time, "h:mm a", new Date());
  };
  const handleTimeChange = (name, value) => {
    const formattedTime = format(new Date(`1970-01-01T${value}:00`), "h:mm a");
    setFormData({
      ...formData,
      [name]: formattedTime,
    });
  };
  const handleTimeChang = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    console.log("Form data submitted:", formData);
    try {
      const res = await ApiClient.patch(`/setting/time`, formData);
      if (res.status === 204) {
        toast.success("Successfully Updated");
        getTime();
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <p className="text-2xl font-bold text-black pb-8 relative uppercase">
        Manage Office Hour
      </p>
      <div className="p-8 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-8">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Office Hour ({time.office_hour})
          <br />
        </h2>

        <div className="grid grid-cols-2 gap-6  p-4 rounded-md ">
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">In Time</p>
            <p className="text-lg">{time?.in_time || "N/A"}</p>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Office Close</p>
            <p className="text-lg">{time?.office_close || "N/A"}</p>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Late Time</p>
            <p className="text-lg">{time?.late_time || "N/A"}</p>
          </div>
          <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
            <p className="font-semibold">Half Day Leave</p>
            <p className="text-lg">{time?.half_day_leave || "N/A"}</p>
          </div>
        </div>

        <div className="flex flex-col items-center bg-white p-4 rounded-lg shadow">
          <p className="font-semibold">Full Day Leave</p>
          <p className="text-lg">{time?.full_day_leave || "N/A"}</p>
        </div>
        <button
          className={`w-full py-2 rounded-md text-white font-semibold ${
            isEditing
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={isEditing ? () => setIsEditing(false) : handleEdit}
        >
          {isEditing ? "Cancel" : "Update"}
        </button>

        {isEditing && (
          <form className="space-y-6 mt-6   bg-gray-50 p-6 rounded-lg shadow-lg">
            <h1 className="text-center">Pick Your Time</h1>
            <div className="grid grid-cols-3 gap-6 ">
              <div>
                {" "}
                <label className="block text-sm w-[90%] font-medium text-gray-700 mb-1">
                  Office Hour
                </label>
                <input
                  name="office_hour"
                  className="w-[80%] px-2"
                  onChange={(value) => handleTimeChang(value)}
                  value={formData?.office_hour}
                  type="number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  In Time
                </label>
                <TimePicker
                  name="in_time"
                  onChange={(value) => handleTimeChange("in_time", value)}
                  value={convertTimeToDate(formData?.in_time)}
                  format="h:mm a"
                  clearIcon={null}
                  disableClock={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Office Close
                </label>
                <TimePicker
                  name="office_close"
                  onChange={(value) => handleTimeChange("office_close", value)}
                  value={convertTimeToDate(formData?.office_close)}
                  format="h:mm a"
                  clearIcon={null}
                  disableClock={true}
                />
              </div>
            </div>

            <div className="flex justify-around mb-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Late Time
                </label>
                <TimePicker
                  name="late_time"
                  onChange={(value) => handleTimeChange("late_time", value)}
                  value={convertTimeToDate(formData?.late_time)}
                  format="h:mm a"
                  clearIcon={null}
                  disableClock={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Half Day Leave
                </label>
                <TimePicker
                  name="half_day_leave"
                  onChange={(value) =>
                    handleTimeChange("half_day_leave", value)
                  }
                  late_time
                  value={convertTimeToDate(formData?.half_day_leave)}
                  format="h:mm a"
                  clearIcon={null}
                  disableClock={true}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Day Leave
                </label>
                <TimePicker
                  name="full_day_leave"
                  onChange={(value) =>
                    handleTimeChange("full_day_leave", value)
                  }
                  value={convertTimeToDate(formData?.full_day_leave)}
                  format="h:mm a"
                  clearIcon={null}
                  disableClock={true}
                />
              </div>
            </div>
            {/* <div className="flex justify-between gap-x-2"> */}
            {/* <div>
              {" "}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Hour
              </label>
              <input
                name="office_hour"
                onChange={(value) => handleTimeChang(value)}
                value={formData?.office_hour}
                type="number"
              />
            </div> */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Office Season
              </label>
              <select
                name="office_season"
                onChange={(value) => handleTimeChang(value)}
                value={formData?.office_season}
                type="text"
              >
                <option selected disabled>
                  Season
                </option>
                <option value="Summer">Summer</option>
                <option value="Winter">Winter</option>
                <option value="Special">Special</option>
              </select>
            </div> */}
            {/* </div> */}
            <button
              type="button"
              className="bg-green-500 text-white w-full py-2 rounded-md font-semibold hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
};

export default WorkingHour;

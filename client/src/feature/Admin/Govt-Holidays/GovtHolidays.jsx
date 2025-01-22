import React, { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import { useSelector } from "react-redux";
import Icon from "../../../components/Icon/Icons";
import ApiClient from "../../../axios/ApiClient";
const GovtHolidays = () => {
  //
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  const [holidayDate, setHolidayData] = useState([]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [time, setTime] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const getHolidayDates = async () => {
    try {
      const res = await ApiClient.get(
        `/setting/holiday?year=${time?.year}&month=${time?.month}`
      );
      setHolidayData(res.data.data[0].holiday_list);

      console.log(res.data.data[0]);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getHolidayDates();
  }, [time?.month]);
  return (
    <>
      <div>
        <p className="text-2xl font-bold text-black pb-10 uppercase">
          Govt Holidays
        </p>
        <div className="flex gap-4  font-semibold">
          <div className="flex gap-2 bg-[#eee] p-2">
            <h1 className="">Month :</h1>
            <select
              value={time.month}
              onChange={(e) =>
                setTime((prev) => ({ ...prev, month: e.target.value }))
              }
              className="bg-[#eee] rounded"
              name=""
              id=""
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="flex gap-3 bg-[#eee] p-2">
            <h1>Year:</h1>
            <input
              value={time?.year}
              onChange={(e) =>
                setTime((prev) => ({ ...prev, year: e.target.value }))
              }
              placeholder="2024"
              className="bg-[#eee] rounded border px-2 w-24 "
              type="text"
            />
          </div>
          <div className="flex gap-3 relative bg-[#eee] p-2">
            <button
              onClick={() =>
                setTime({ month: currentMonth, year: currentYear })
              }
              className="text-black border font-semibold text-sm rounded-full  "
            >
              {" "}
              <Icon type="reset" />
            </button>
          </div>
        </div>
        <div className=" mt-10">
          <table className="min-w-full ">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4">
                  Date
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Type
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {holidayDate?.map?.(
                (item, i) =>
                  item?.name !== "" &&
                  item?.name?.split(" - ")[0] !== "Developer" && (
                    <tr key={i} className="border">
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.date?.slice(0, 10)}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.name?.split(" - ")[0]}
                      </td>
                      <td className="text-black text-base font-normal text-center p-4 border-b">
                        {item?.name?.split(" - ")[1]}
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default GovtHolidays;

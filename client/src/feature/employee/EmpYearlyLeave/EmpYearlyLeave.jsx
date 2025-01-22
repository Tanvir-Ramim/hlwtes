import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ApiClient from "../../../axios/ApiClient";
const EmpYearlyLeave = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  const currentYear = new Date().getFullYear();

  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  const [allData, setAllData] = useState({});
  const getData = async () => {
    try {
      const res = await ApiClient.get(
        `/leave-apply/yearly-leave?employee_id=${user?._id}&year=${currentYear}`
      );
      setAllData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <p className="text-2xl font-bold text-black pt-5 pb-10 uppercase">
        Yearly Leave & Holiday ({currentYear})
      </p>
      <div className="mt-">
        <div>
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-2 border">Type</th>
                <th className="text-left p-2 border">Leave Types</th>
                <th className="text-left p-2 border">Leave Start</th>
                <th className="text-left p-2 border">Leave End</th>
              </tr>
            </thead>
            <tbody>
              {allData?.leaveData?.map((leave) => (
                <tr key={leave._id} className="border-b">
                  <td className="p-2 capitalize border">{leave?.type}</td>
                  <td className="p-2   border">
                    {leave?.leave_type?.split(" - ")[0]}
                  </td>

                  <td className="p-2 border">
                    {leave?.start_date ? formatDate(leave.start_date) : ""}
                  </td>
                  <td className="p-2 border">
                    {/* {new Date(leave?.end_date).toLocaleString()?.slice(0, 9)} */}
                    {leave?.end_date ? formatDate(leave.end_date) : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmpYearlyLeave;

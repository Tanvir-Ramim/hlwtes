import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Announcement = () => {
  const [isType, setIsType] = useState(true);
  const [announcement, setAnnouncement] = useState([]);
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }
  const getAnnouncement = async () => {
    try {
      const res = await ApiClient.get(`/setting/announcement?status=active`);
      setAnnouncement(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  console.log(announcement);
  useEffect(() => {
    getAnnouncement();
  }, []);

  return (
    <div className="flex flex-col  bg-white  rounded-lg mt-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 uppercase flex items-center">
        Latest Announcements
      </h2>
 {  announcement?.length>0? <div className="space-y-6">
        {announcement
          ?.filter(
            (item) =>
              item?.target_single_employee_id === "" ||
              (item?.target_single_employee_id !== "" &&
                item?.target_single_employee_id === user?._id)
          )
          .slice(0, 2)
          .map((item, i) => (
            <div
            key={i}
            className="p-5 bg-gradient-to-r from-gray-200 to-gray-200 border border-gray-200 rounded-xl shadow-lg"
          >
            <div className="flex justify-between items-center"> 
              <h1 className="text-2xl font-bold text-[#004282] capitalize mb-2">
                {item?.title}
              </h1>
              <h2 className="text-md font-semibold text-purple-700 capitalize mb-3">
                {item?.announcement_type}
              </h2>
            </div>
          
            <div
              className="text-gray-800 mt-2 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: item?.message,
              }}
            ></div>
          </div>
          
          ))}
      </div> : <p className="text-gray-500 italic text-center mt-4">
  No announcements available at the moment.
</p>}
   { announcement?.length>2&&  <div className="flex justify-center mt-8">
        <Link
          to="/employe-announcement"
          className="px-6 py-2 bg-[#004182f1] text-white font-semibold rounded-full shadow-md hover:bg-purple-700 transition-all duration-300 ease-in-out"
        >
          See More
        </Link>
      </div>}
    </div>
  );
};

export default Announcement;

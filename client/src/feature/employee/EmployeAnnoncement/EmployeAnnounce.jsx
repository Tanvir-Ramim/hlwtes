import React, { useState, useEffect } from "react";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";

const EmployeAnnounce = () => {
  const [announcements, setAnnouncement] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 10;
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  const getAnnouncement = async (pageNumber) => {
    try {
      const res = await ApiClient.get(
        `/setting/announcement?page=${pageNumber}&status=active`
      );
      setAnnouncement(res.data.data);
      setTotal(res.data.total); // Store total count
      console.log("ramim", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAnnouncement(page);
  }, [page]);

  const totalPages = Math.ceil(total / itemsPerPage);

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="flex flex-col px-6 py-6 bg-white rounded-lg mt-6 w-full">
      <div className=" ">
        <div className="flex gap-4 justify-between">
          <div className="">
            <h2 className="text-3xl font-bold text-[#004282] mb-6 uppercase">
              Announcements
            </h2>
          </div>
          <div>
            <button
              onClick={handlePrevious}
              disabled={page === 1}
              className="px-4 py-1 bg-[#004282] text-white rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              disabled={page === totalPages}
              className="px-4 py-1 mr-4 ml-4 bg-[#004282] text-white rounded-lg shadow-md transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="">
        <div className="">
          {announcements?.length > 0 ? (
            announcements?.map(
              (item, i) =>
                (item?.target_single_employee_id === "" ||
                  (item?.target_single_employee_id !== "" &&
                    item?.target_single_employee_id === user?._id)) && (
                  <div
                    key={i}
                    className="p-5 mt-6 bg-gradient-to-r from-gray-200 to-gray-200 border border-gray-200 rounded-xl shadow-lg"
                  >
                    <div className="flex justify-between items-center">
                      <h1 className="text-2xl font-bold  text-[#004282] capitalize mb-2">
                        {item?.title}
                      </h1>
                      {/* <p>
                        <strong>Importance :</strong> {item?.importance}
                      </p> */}
                       <h2 className="text-md font-semibold text-indigo-600 mb-3">
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
                )
            )
          ) : (
            <p className="text-gray-600">No announcements available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeAnnounce;

import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Announcement = () => {
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
        `/setting/announcement?page=${pageNumber}`
      );
      setAnnouncement(res.data.data);
      setTotal(res.data.total); // Store total count
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
  //  update status
  const handleUpdate = async (value, id) => {
    const data = {
      status: value,
    };
    try {
      const res = await ApiClient.patch(`/setting/announcement/${id}`, data);
      if (res.status === 200) {
        toast.success("Successfully Status Update");
        getAnnouncement();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [userArra, setUserArra] = useState([]);

  const getEmployees = async () => {
    try {
      const res = await ApiClient.get("/user/all");
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };


  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (isConfirmed) {
      try {
        const res = await ApiClient.delete(`/setting/announcement/${id}`);
        if (res.status === 200) {
          alert("Successfully Deleted"); // Replace toast with a simple alert
          getAnnouncement();
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  useEffect(()=>{
    getEmployees()
  },[])
  return (
    <div className="flex flex-col px-6 py-6 bg-white rounded-lg mt-6 w-full">
      <div>
        <div className="flex gap-4 justify-between">
          <div>
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

      <div>
        <div>
          {announcements?.length > 0 ? (
            announcements.map((item) => {
              const user = userArra?.find(
                (u) => u?._id === item?.target_single_employee_id
              );
              return (
                <div
                  key={item?._id}
                  className="relative p-5 mt-6 bg-gradient-to-r from-gray-200 to-gray-200  border border-gray-200 rounded-xl shadow-lg"
                >
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Link to={`/admin/edit-announcement/${item?._id}`}>
                      <button
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(item?._id)}
                      className="p-2  bg-red-500 text-white rounded hover:bg-red-600"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-1 items-center">
                      <h1>Status :</h1>
                      <select
                        onChange={(e) => handleUpdate(e.target.value, item._id)}
                        defaultValue={item?.status}
                        className="p-1 border text-sm  border-gray-300 rounded"
                      >
                        <option value="active">Active</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>
                  <h1 className="text-2xl font-bold text-[#004282] mb-2">
                    {item?.title}
                  </h1>
                  <div className="flex gap-6 mb-1 justify-between">
                    <h2 className="text-md">
                      <strong>Announcement Type : </strong>{" "}
                      {item?.announcement_type}
                    </h2>
                    <p>
                      <strong>Importance :</strong> {item?.importance}
                    </p>
                  </div>

                  <div className="mb-4 text-gray-700">
                    <p>
                      <strong>Employee Name:</strong>{" "}
                      {user ? user?.name : "Not Assign"}
                    </p>
                  </div>

                  <div
                    className="text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: item?.message,
                    }}
                  ></div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-600">No announcements available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Announcement;

import React, { useEffect, useState } from "react";
import ApiClient from "../../../axios/ApiClient";
import { useSelector } from "react-redux";

const Team = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  const [userArra, setUserArra] = useState([]);
  const getEmployees = async () => {
    try {
      const res = await ApiClient.get(
        `/user/all?designation=${user?.designation}`
      );
      console.log(res);
      setUserArra(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(userArra);
  useEffect(() => {
    getEmployees();
  }, []);

  return (
    <section className="py-12 bg-gray-100 px-4">
      <div className="container mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-[#004282] mb-4">Our Team</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A team of talented individuals driving our success forward.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 lg:px-0">
        {userArra?.map((member, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden p-6 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <div className="text-center">
              <img
                src={
                  member?.url?.url ||
                  (member?.gender === "Male"
                    ? "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VV7dlZvxOseZJqh0baBIHNre1tzNjcZpXQ&s")
                }
                alt="user"
                className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-[#004282]"
              />
              
              <h3 className="text-xl font-semibold text-gray-800">
                {member?.name}
              </h3>
              <p className="text-sm capitalize text-gray-500  mt-1">
                {member?.role} {member?.designation}
              </p>
              <span className="text-sm mb-2">{member?.employee_id}</span>
             
              <p className="text-sm capitalize text-gray-600 mt-1">
                {member?.phone}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;

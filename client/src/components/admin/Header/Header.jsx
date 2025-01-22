// import React from "react";
// import TypeIcon from "../../Icon/Icons";
// import user from "../Header/assets/user.jpg";
// import { useDispatch, useSelector } from "react-redux";
// import { logoutUser } from "../../../redux/authSlice";

// const Header = () => {
//   const user1 = useSelector((state) => state?.auth?.user);
//   const user2 = useSelector((state) => state?.auth?.user?.user);
//   let user;
//   if (user2) {
//     user = user2;
//   } else {
//     user = user1;
//   }

//   const dispatch = useDispatch();
//   const handleLogOut = () => {
//     dispatch(logoutUser());
//   };
//   return (
//     <>
//       <div className="p-5 bg-[#eee]">
//         <div className="flex justify-end">
//           <div className="flex gap-8 items-center">
//             <div>
//               <div className="bg-black w-[80px] h-[80px] rounded-full">
//                 <picture>
//                   <img
//                     src={
//                       user?.url?.url ||
//                       "https://cdn-icons-png.flaticon.com/512/21/21104.png"
//                     }
//                     alt="user"
//                     className="w-full h-full rounded-full"
//                   />
//                 </picture>
//               </div>
//             </div>
//             <div className="border-r border-black pr-4">
//               <p className="text-base text-[#676767] capitalize font-medium ">
//                 {user?.name}
//               </p>
//               <p className="text-base text-[#676767] capitalize font-light ">
//                 {user?.role}
//               </p>
//             </div>
//             <div className="text-primary text-2xl font-bold underline text-center cursor-pointer ">
//               <span onClick={handleLogOut}>
//                 <TypeIcon type="LogOut" />
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Header;
import React from "react";
import { motion } from "framer-motion";
import TypeIcon from "../../Icon/Icons";
import user from "../Header/assets/user.jpg";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../../redux/authSlice";
import { Link } from "react-router-dom";

const Header = () => {
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logoutUser());
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.3,
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="p-5 bg-[#eee]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-end">
        <div className="flex gap-8 items-center">
          <motion.div variants={imageVariants}>
            <div className="bg-black w-[80px] h-[80px] rounded-full">
              <picture>
                <img
                  src={
                    user?.url?.url ||
                    (user?.gender === "Male"
                      ? "https://cdn-icons-png.flaticon.com/512/21/21104.png"
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8VV7dlZvxOseZJqh0baBIHNre1tzNjcZpXQ&s")
                  }
                  alt="user"
                  className="w-full h-full rounded-full"
                />
              </picture>
            </div>
          </motion.div>
          <motion.div
            className="border-r border-black pr-4"
            variants={textVariants}
          >
            <p className="text-base text-[#676767] capitalize font-medium ">
              {user?.name}
            </p>
            <p className="text-base text-[#676767] capitalize font-light ">
              {user?.role} {user?.designation}
            </p>
            <p className="text-[12px] text-[#676767] capitalize font-medium ">
              {user?.employee_id}
            </p>
          </motion.div>
          <motion.div
            className="text-primary text-2xl font-bold underline text-center cursor-pointer"
            variants={textVariants}
          >
            <span onClick={handleLogOut}>
              <TypeIcon type="LogOut" />
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Header;

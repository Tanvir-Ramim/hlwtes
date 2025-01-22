import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ComponentLoader from "./ComponentLoader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/authSlice";

const EmployeeRoutes = ({ children }) => {
  const location = useLocation();

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  useEffect(() => {
    setLoading(false);
    if (!user) {
      alert("Login Required");
      navigate(`/login`);
      return;
    }
  }, [1000]);

  const dispatch = useDispatch();
  const handleLogOut = () => {
    dispatch(logoutUser());
  };

  useEffect(() => {
    setLoading(false);
    if (!user?.login_access) {
      toast.error("You need to permission")
      handleLogOut()
    }
  }, []);

  if (loading) {
    return <ComponentLoader />; // You can replace ComponentLoader with your loading component
  }

  if (!user?.login_access) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.web_role === "") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (user?.web_role !== "" && ["employee"].includes(user?.web_role)) {

    return children;
  }

  return (
    <Navigate
      to="/login"
      state={{ from: location }}
      replace
    />
  );
};

export default EmployeeRoutes;

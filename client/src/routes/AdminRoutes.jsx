import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ComponentLoader from "./ComponentLoader";
import { useSelector } from "react-redux";

const AdminRoutes = ({ children }) => {
  const location = useLocation();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const user1 = useSelector((state) => state?.auth?.user);
  const user2 = useSelector((state) => state?.auth?.user?.user);
  let user;
  if (user2) {
    user = user2;
  } else {
    user = user1;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (!user || !user?.isAdmin) {
        alert("Login Required");
        navigate(`/login`);
      }
    }, 2000); 
  
    return () => clearTimeout(timer); 
  }, [user, navigate]);

  if (loading) {
    return <ComponentLoader />; 
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.web_role === "") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
 
  if (user.web_role !== "" && ["admin", "hr"].includes(user?.web_role)) {
    return children;
  }
  if (user?.isAdmin) {
    return children;
  }

  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AdminRoutes;

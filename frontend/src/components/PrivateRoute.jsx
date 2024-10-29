import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "hooks";

const PrivateRoute = ({ element, roles }) => {
   const { user, isAuthenticated } = useAuth();

   useEffect(() => {
      console.log("User Status:", user, "Authenticated:", isAuthenticated);
   }, [user, isAuthenticated]); 

   if (!user) {
      return <Navigate to="/login" />;
   }

   if (roles && !roles.includes(user.role)) {
      return <Navigate to="/unauthorized" />;
   }

   return element;
};

export default PrivateRoute;
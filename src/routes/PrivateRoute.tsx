import { Navigate, useLocation } from "react-router-dom";
import { useContext, type ReactNode } from "react";
import { AuthContext } from "../context/AuthContextProvider";
import { UserRole } from "../context/AuthContextProvider";

type PrivateRouteProps = {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectWithState?: boolean;
  unauthorizedRedirectTo?: string;
};

export function PrivateRoute({
  children,
  allowedRoles,
  redirectWithState = true,
  unauthorizedRedirectTo = "/unauthorized"
}: PrivateRouteProps) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  console.log("isAuthenticated:", isAuthenticated, "user:", user);


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={redirectWithState ? { from: location } : undefined}
      />
    );
  }

  if (allowedRoles && !allowedRoles.includes(user!.role)) {
    return <Navigate to={unauthorizedRedirectTo} replace />;
  }

  if (!user) {
    console.error("Auth state inconsistent: isAuthenticated but no user data");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
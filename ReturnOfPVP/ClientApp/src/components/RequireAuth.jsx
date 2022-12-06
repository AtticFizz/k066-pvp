import useAuth from "../hooks/useAuth";

export default function RequireAuth({ allowedRoles, children }) {
  const { user } = useAuth();

  return allowedRoles.includes(user?.role) ? <>{children}</> : <></>;
}

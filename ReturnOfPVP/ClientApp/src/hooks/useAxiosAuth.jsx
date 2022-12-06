import { axiosAuth } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

export default function useAxiosAuth() {
  const refresh = useRefreshToken();
  const { user } = useAuth();

  useEffect(() => {
    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest?.sent) {
          prevRequest.sent = true;

          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [user, refresh]);

  return axiosAuth;
}

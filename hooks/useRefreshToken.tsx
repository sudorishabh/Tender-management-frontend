import { useRefreshTokenQuery } from "@/Redux/auth/authApi";
import { setIsRefreshing, setUser } from "@/Redux/auth/authSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useRefreshToken = () => {
  const [isSkip, setIsSkip] = useState(true);
  const dispatch = useDispatch();
  const { data, isSuccess, isLoading, isError, error } = useRefreshTokenQuery(
    {},
    { skip: isSkip }
  );

  const refresh = async () => {
    setIsSkip(false);
  };

  useEffect(() => {
    if (isSuccess && data.user) {
      dispatch(setUser(data.user));
    }
  }, [data, isSuccess, dispatch]);

  useEffect(() => {
    dispatch(setIsRefreshing(isLoading));
  }, [isLoading, dispatch]);

  return { refresh, isLoading, isError, error };
};

export default useRefreshToken;

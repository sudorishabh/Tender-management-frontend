"use client";
import { ApiError } from "@/Types";
import { ErrorCodes } from "@/lib/errorCodes";
import { useRefreshTokenQuery } from "@/Redux/auth/authApi";
import { setIsRefreshing, setUser } from "@/Redux/auth/authSlice";
import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

interface Props {
  children: React.ReactNode;
}
const PersistLogin: FC<Props> = ({ children }) => {
  const { data, isSuccess, isLoading, isError, error } = useRefreshTokenQuery(
    {}
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSuccess) {
      dispatch(setUser(data.user));
    }
    if (isError) {
      const apiError = error as ApiError;
      if (apiError?.data?.errorCode && ErrorCodes[apiError.data.errorCode]) {
        toast.error(ErrorCodes[apiError.data.errorCode]);
      }
    }
  }, [data, isSuccess, dispatch, isError, error]);

  useEffect(() => {
    dispatch(setIsRefreshing(isLoading));
  }, [isLoading, dispatch]);

  return children;
};

export default PersistLogin;

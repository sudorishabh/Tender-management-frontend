"use client";
import GeneralWrapper from "@/components/Shared/GeneralWrapper";
import Home from "../components/Home/Home";
import { useGetCategoriesNamesQuery } from "@/Redux/category/categoryApi";
import { setCategories } from "@/Redux/category/categorySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import React, { useEffect } from "react";

const HomePage = () => {
  const dispatch = useDispatch();
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesNamesQuery({});

  const { isLoggedIn, isRefreshing: isLoading } = useSelector(
    (state: RootState) => state.authSlice
  );
  const { activeTenderTab } = useSelector(
    (state: RootState) => state.tenderSlice
  );

  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, dispatch]);

  return (
    <GeneralWrapper>
      <Home
        categoriesData={categoriesData?.categories}
        isCategoriesLoading={isCategoriesLoading}
        isLoggedIn={isLoggedIn}
        isLoading={isLoading}
        activeTenderTab={activeTenderTab}
      />
    </GeneralWrapper>
  );
};

export default HomePage;

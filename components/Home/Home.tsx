"use client";
import React, { useEffect } from "react";
import HomeSidebar from "./HomeSidebar";
import HomeBanner from "./HomeBanner";
import HomeTendersActionBar from "./HomeTendersActionBar";
import LatestTenders from "./LatestTenders";
import { useSelector } from "react-redux";
import { RootState } from "@/Redux/store";
import HomeTenderTabs from "./HomeTenderTabs";
import HomeActiveFilter from "./HomeActiveFilter";
import Testimonial from "./Testimonial";
import CallToAction from "./CallToAction";
import AssignedTenders from "./AssignedTenders";
import { useGetCategoriesNamesQuery } from "@/Redux/category/categoryApi";
import { setCategories } from "@/Redux/category/categorySlice";
import { useDispatch } from "react-redux";
import { homeTabs } from "@/lib/constants";
const Home = () => {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useGetCategoriesNamesQuery({});

  const { isLoggedIn, isRefreshing: isLoading } = useSelector(
    (state: RootState) => state.authSlice
  );
  const { activeTenderTab } = useSelector(
    (state: RootState) => state.tenderSlice
  );

  const dispatch = useDispatch();

  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, dispatch]);

  return (
    <div className='mx-auto px-4 max-w-7xl'>
      <div className='flex flex-row gap-8'>
        <div className='flex flex-1 flex-col'>
          {!isLoggedIn && !isLoading ? <HomeBanner /> : null}
          <HomeTendersActionBar
            categories={categoriesData?.categories}
            isCategoriesLoading={isCategoriesLoading}
          />
          <HomeActiveFilter />
          <HomeTenderTabs />
          {activeTenderTab === homeTabs.Latest ? (
            <LatestTenders />
          ) : (
            <AssignedTenders />
          )}
        </div>
        <HomeSidebar />
      </div>
      <Testimonial />
      <CallToAction />
    </div>
  );
};

export default Home;

import React, { FC } from "react";
import HomeSidebar from "./HomeSidebar";
import HomeBanner from "./HomeBanner";
import HomeTendersActionBar from "./HomeTendersActionBar";
import LatestTenders from "./LatestTenders";
import HomeTenderTabs from "./HomeTenderTabs";
import HomeActiveFilter from "./HomeActiveFilter";
import AssignedTenders from "./AssignedTenders";
import { homeTabs } from "@/lib/constants";
import { ICategoriesResponse } from "../../Types/Category-Types";

interface Props {
  categoriesData: ICategoriesResponse;
  isCategoriesLoading: boolean;
  isLoggedIn: boolean;
  isLoading: boolean;
  activeTenderTab: string;
}

const Home: FC<Props> = ({
  categoriesData,
  isCategoriesLoading,
  isLoggedIn,
  isLoading,
  activeTenderTab,
}) => {
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
    </div>
  );
};

export default Home;

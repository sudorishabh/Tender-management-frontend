"use client";
import { RootState } from "@/Redux/store";
import dynamic from "next/dynamic";
import { homeTabs } from "@/lib/constants";
import { useSelector } from "react-redux";

const AssignedTenders = dynamic(() => import("./AssignedTenders"), {
  ssr: false,
});
const LatestTenders = dynamic(() => import("./LatestTenders"), { ssr: false });

const HomeTenderLists = () => {
  const { activeTenderTab } = useSelector(
    (state: RootState) => state.tenderSlice
  );

  return activeTenderTab === homeTabs.Latest ? (
    <LatestTenders />
  ) : (
    <AssignedTenders />
  );
};

export default HomeTenderLists;

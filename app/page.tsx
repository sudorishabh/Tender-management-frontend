import GeneralWrapper from "@/components/Shared/GeneralWrapper";
import HomeSidebar from "@/components/Home/HomeSidebar";
import HomeBanner from "@/components/Home/HomeBanner";
import HomeTendersActionBar from "@/components/Home/HomeTendersActionBar";
import HomeTenderTabs from "@/components/Home/HomeTenderTabs";
import HomeActiveFilter from "@/components/Home/HomeActiveFilter";
import HomeTenderLists from "@/components/Home/HomeTenderLists";

const Home = () => {
  return (
    <GeneralWrapper>
      <div className='mx-auto px-4 max-w-7xl'>
        <div className='flex flex-row gap-8'>
          <div className='flex flex-1 flex-col'>
            <HomeBanner />
            <HomeTendersActionBar />
            <HomeActiveFilter />
            <HomeTenderTabs />
            <HomeTenderLists />
          </div>
          <HomeSidebar />
        </div>
      </div>
    </GeneralWrapper>
  );
};

export default Home;

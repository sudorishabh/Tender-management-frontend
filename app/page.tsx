import GeneralWrapper from "@/components/Shared/GeneralWrapper";
import Home from "../components/Home/Home";
import Heading from "@/components/Shared/Heading";

export default function Main() {
  return (
    <>
      <Heading
        title='Teri Tender Management | Streamline Vendor Bidding'
        description='Teri Tender Management is a comprehensive platform enabling vendors to discover, bid, and manage tenders efficiently.'
        keywords='Tenders, Vendor Bidding, Tender Management, Procurement Platform, Bid Management System'
      />
      <GeneralWrapper>
        <Home />
      </GeneralWrapper>
    </>
  );
}

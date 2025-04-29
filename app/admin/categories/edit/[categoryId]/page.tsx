import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import CreateEditCategory from "@/components/Categories/For-Admin/CreateEditCategory";
import Heading from "@/components/Shared/Heading";
import { use } from "react";

const Edit = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const resolvedParams = use(params);
  const { categoryId } = resolvedParams;

  return (
    <>
      <Heading
        title='TERI - Tender Management'
        description='A platform for venders to bid'
        keywords='Tender, Vender, Projects'
      />
      <AdminPagesWrapper>
        <CreateEditCategory categoryId={categoryId} />
      </AdminPagesWrapper>
    </>
  );
};

export default Edit;

import AdminPagesWrapper from "@/components/Admin/AdminPagesWrapper";
import CreateEditCategory from "@/components/Categories/For-Admin/CreateEditCategory";
import { use } from "react";

const Edit = ({ params }: { params: Promise<{ categoryId: string }> }) => {
  const resolvedParams = use(params);
  const { categoryId } = resolvedParams;

  return (
    <AdminPagesWrapper>
      <CreateEditCategory categoryId={categoryId} />
    </AdminPagesWrapper>
  );
};

export default Edit;

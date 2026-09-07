import { redirect } from "next/navigation";

/**
 * /super has no dashboard of its own — the super admin landing route is
 * /super/invite. This exists so any stray link to /super redirects instead
 * of 404ing.
 */
const SuperAdminPage = () => {
  redirect("/super/invite");
};

export default SuperAdminPage;

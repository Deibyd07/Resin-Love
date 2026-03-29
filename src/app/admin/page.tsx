import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  toggleProductFieldAction,
  signOutAdminAction,
} from "@/app/admin/actions";
import { requireAdmin } from "@/lib/supabase/admin";
import { getProducts } from "@/lib/supabase/queries";
import { AdminDashboard } from "@/features/admin/components/admin-dashboard";

export default async function AdminPage() {
  await requireAdmin("/admin/login?next=/admin");
  const products = await getProducts();

  return (
    <AdminDashboard
      products={products}
      signOutAction={signOutAdminAction}
      createAction={createProductAction}
      updateAction={updateProductAction}
      deleteAction={deleteProductAction}
      toggleAction={toggleProductFieldAction}
    />
  );
}

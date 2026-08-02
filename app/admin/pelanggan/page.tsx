export const dynamic = "force-dynamic";

import LayoutAdmin from "@/app/component/layout-admin";
import CustomerMonitoringView from "@/app/component/customer-monitoring-view";

export default function AdminPelangganPage() {
  return (
    <LayoutAdmin activeMenuProp="customers">
      <CustomerMonitoringView role="ADMIN" />
    </LayoutAdmin>
  );
}

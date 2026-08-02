export const dynamic = "force-dynamic";

import LayoutOwner from "@/app/component/layout-owner";
import CustomerMonitoringView from "@/app/component/customer-monitoring-view";

export default function OwnerPelangganPage() {
  return (
    <LayoutOwner activeMenuProp="customers">
      <CustomerMonitoringView role="OWNER" />
    </LayoutOwner>
  );
}

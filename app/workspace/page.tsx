import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MainWorkspace } from "@/components/dashboard/main-workspace";

export default function workspace() {
  return (
    <DashboardLayout>
      <MainWorkspace />
    </DashboardLayout>
  );
}

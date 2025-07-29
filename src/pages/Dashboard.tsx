
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MobileOptimizedLayout from "@/components/mobile/MobileOptimizedLayout";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardGeneral from "./DashboardGeneral";
import DashboardCompany from "./DashboardCompany";
import DashboardLaboratory from "./DashboardLaboratory";
import DashboardConsultant from "./DashboardConsultant";

const Dashboard = () => {
  const { profile } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = async () => {
    setRefreshKey(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const renderDashboardByType = () => {
    switch (profile?.user_type) {
      case 'company':
        return <DashboardCompany key={refreshKey} />;
      case 'laboratory':
        return <DashboardLaboratory key={refreshKey} />;
      case 'consultant':
        return <DashboardConsultant key={refreshKey} />;
      default:
        return <DashboardGeneral key={refreshKey} />;
    }
  };

  return (
    <ProtectedRoute>
      <MobileOptimizedLayout
        title="Dashboard"
        showHeader={true}
        showNavigation={true}
        enablePullToRefresh={true}
        enableGestures={true}
        onRefresh={handleRefresh}
        headerProps={{
          showMenu: true,
          rightAction: (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {profile?.first_name} {profile?.last_name}
              </span>
            </div>
          )
        }}
      >
        {renderDashboardByType()}
      </MobileOptimizedLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;

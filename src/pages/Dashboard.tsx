
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import MainLayout from "@/components/layout/MainLayout";
import DashboardGeneral from "./DashboardGeneral";
import DashboardCompany from "./DashboardCompany";
import DashboardLaboratory from "./DashboardLaboratory";
import DashboardConsultant from "./DashboardConsultant";
import UniversalDemoBanner from "@/components/layout/UniversalDemoBanner";

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
      <MainLayout>
        <div className="container mx-auto px-4 py-6">
          <UniversalDemoBanner variant="compact" showToggle={true} className="mb-6" />
          
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Bem-vindo, {profile?.first_name} {profile?.last_name}
                </p>
              </div>
            </div>
          </div>

          {renderDashboardByType()}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
};

export default Dashboard;

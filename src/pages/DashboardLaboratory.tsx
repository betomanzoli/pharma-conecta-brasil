
import React, { useState, useEffect } from 'react';
import { FlaskConical } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import LabMetricsCards from '@/components/dashboard/laboratory/LabMetricsCards';
import CapacityCalendar from '@/components/dashboard/laboratory/CapacityCalendar';
import PendingRequests from '@/components/dashboard/laboratory/PendingRequests';
import AnalysisHistory from '@/components/dashboard/laboratory/AnalysisHistory';

const DashboardLaboratory = () => {
  const { profile } = useAuth();
  const [projectRequests, setProjectRequests] = useState([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectRequests();
  }, [profile]);

  const fetchProjectRequests = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('project_requests')
        .select('*')
        .eq('service_type', 'laboratory_analysis')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching project requests:', error);
        return;
      }

      setProjectRequests(data || []);
    } catch (error) {
      console.error('Error fetching project requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const capacityData = {
    today: 75,
    week: 60,
    month: 45
  };

  const pendingRequests = projectRequests.filter((p: any) => p.status === 'open').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Laboratório
          </h1>
          <p className="text-gray-600">
            Bem-vindo de volta, {profile?.first_name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <FlaskConical className="h-6 w-6 text-[#1565C0]" />
          <span className="text-lg font-medium text-[#1565C0]">Laboratório</span>
        </div>
      </div>

      <LabMetricsCards capacityData={capacityData} pendingRequests={pendingRequests} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CapacityCalendar 
          selectedDate={selectedDate} 
          onDateSelect={setSelectedDate} 
          capacityData={capacityData} 
        />
        <PendingRequests projectRequests={projectRequests} loading={loading} />
      </div>

      <AnalysisHistory />
    </div>
  );
};

export default DashboardLaboratory;

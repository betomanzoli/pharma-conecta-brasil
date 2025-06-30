
import React from 'react';
import Header from '@/components/Header';
import CustomReportBuilder from '@/components/reports/CustomReportBuilder';

const ReportsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomReportBuilder />
      </div>
    </div>
  );
};

export default ReportsPage;

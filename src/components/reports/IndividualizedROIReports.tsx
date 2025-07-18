import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Download, TrendingUp, DollarSign, Clock, Users, FileText, Filter, Calendar } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ROIReport {
  match_id: string;
  partner_name: string;
  partner_type: string;
  match_date: string;
  initial_investment: number;
  revenue_generated: number;
  roi_percentage: number;
  time_to_close: number;
  status: 'active' | 'completed' | 'cancelled';
  value_metrics: {
    direct_revenue: number;
    indirect_benefits: number;
    cost_savings: number;
    market_expansion: number;
  };
  timeline: Array<{
    date: string;
    milestone: string;
    value: number;
  }>;
}

export default function IndividualizedROIReports() {
  const [reports, setReports] = useState<ROIReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<ROIReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<ROIReport | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  useEffect(() => {
    loadROIReports();
  }, [dateRange]);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery, statusFilter, typeFilter]);

  const loadROIReports = async () => {
    try {
      setLoading(true);

      // Get match feedback and performance data
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('match_feedback')
        .select('*')
        .eq('feedback_type', 'accepted')
        .gte('created_at', getDateRange());

      if (feedbackError) throw feedbackError;

      // Generate individualized ROI reports
      const roiReports = await Promise.all(
        feedbackData.map(async (feedback) => {
          const roiData = await generateROIReport(feedback);
          return roiData;
        })
      );

      setReports(roiReports);
      if (roiReports.length > 0) {
        setSelectedReport(roiReports[0]);
      }

    } catch (error) {
      console.error('Error loading ROI reports:', error);
      toast.error('Failed to load ROI reports');
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const days = parseInt(dateRange.replace('d', ''));
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  };

  const generateROIReport = async (feedback: any): Promise<ROIReport> => {
    // Simulate ROI calculation - in production, this would use real financial data
    const initialInvestment = Math.floor(Math.random() * 50000) + 10000;
    const revenueGenerated = Math.floor(Math.random() * 200000) + 50000;
    const roiPercentage = ((revenueGenerated - initialInvestment) / initialInvestment) * 100;

    return {
      match_id: feedback.match_id,
      partner_name: feedback.provider_name || `Partner ${feedback.match_id.slice(-4)}`,
      partner_type: feedback.provider_type || 'laboratory',
      match_date: feedback.created_at,
      initial_investment: initialInvestment,
      revenue_generated: revenueGenerated,
      roi_percentage: roiPercentage,
      time_to_close: Math.floor(Math.random() * 60) + 15,
      status: Math.random() > 0.3 ? 'active' : Math.random() > 0.5 ? 'completed' : 'cancelled',
      value_metrics: {
        direct_revenue: revenueGenerated * 0.7,
        indirect_benefits: revenueGenerated * 0.15,
        cost_savings: revenueGenerated * 0.1,
        market_expansion: revenueGenerated * 0.05
      },
      timeline: generateTimeline(feedback.created_at, revenueGenerated)
    };
  };

  const generateTimeline = (startDate: string, totalRevenue: number) => {
    const milestones = [
      'Initial Contact',
      'Due Diligence',
      'Contract Negotiation',
      'Partnership Launch',
      'First Revenue',
      'Milestone Review'
    ];

    return milestones.map((milestone, index) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (index * 15));
      return {
        date: date.toISOString(),
        milestone,
        value: Math.floor((totalRevenue / milestones.length) * (index + 1))
      };
    });
  };

  const filterReports = () => {
    let filtered = reports;

    if (searchQuery) {
      filtered = filtered.filter(report => 
        report.partner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.match_id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(report => report.partner_type === typeFilter);
    }

    setFilteredReports(filtered);
  };

  const exportReport = async (report: ROIReport) => {
    try {
      // Generate CSV data
      const csvData = [
        ['Metric', 'Value'],
        ['Match ID', report.match_id],
        ['Partner Name', report.partner_name],
        ['Partner Type', report.partner_type],
        ['Match Date', new Date(report.match_date).toLocaleDateString()],
        ['Initial Investment', `R$ ${report.initial_investment.toLocaleString()}`],
        ['Revenue Generated', `R$ ${report.revenue_generated.toLocaleString()}`],
        ['ROI Percentage', `${report.roi_percentage.toFixed(2)}%`],
        ['Time to Close', `${report.time_to_close} days`],
        ['Status', report.status],
        ['', ''],
        ['Value Breakdown', ''],
        ['Direct Revenue', `R$ ${report.value_metrics.direct_revenue.toLocaleString()}`],
        ['Indirect Benefits', `R$ ${report.value_metrics.indirect_benefits.toLocaleString()}`],
        ['Cost Savings', `R$ ${report.value_metrics.cost_savings.toLocaleString()}`],
        ['Market Expansion', `R$ ${report.value_metrics.market_expansion.toLocaleString()}`]
      ];

      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `roi-report-${report.match_id}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Failed to export report');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getROIColor = (roi: number) => {
    if (roi > 200) return 'text-green-600';
    if (roi > 100) return 'text-blue-600';
    if (roi > 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Relatórios de ROI Individualizados</h2>
          <p className="text-muted-foreground">
            Análise detalhada do retorno sobre investimento por match específico
          </p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
            <Button
              key={range}
              variant={dateRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDateRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by partner name or match ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="company">Company</SelectItem>
                <SelectItem value="laboratory">Laboratory</SelectItem>
                <SelectItem value="consultant">Consultant</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              ROI Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {filteredReports.map((report) => (
                <div
                  key={report.match_id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                    selectedReport?.match_id === report.match_id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium truncate">{report.partner_name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(report.match_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ROI:</span>
                    <span className={`font-semibold ${getROIColor(report.roi_percentage)}`}>
                      {report.roi_percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Report Details */}
        <Card className="lg:col-span-2">
          {selectedReport ? (
            <div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedReport.partner_name}</CardTitle>
                    <CardDescription>
                      Match ID: {selectedReport.match_id} • {selectedReport.partner_type}
                    </CardDescription>
                  </div>
                  <Button onClick={() => exportReport(selectedReport)} size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 mx-auto text-green-600 mb-2" />
                        <p className="text-sm text-muted-foreground">Investment</p>
                        <p className="text-lg font-semibold">
                          R$ {selectedReport.initial_investment.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <TrendingUp className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-lg font-semibold">
                          R$ {selectedReport.revenue_generated.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto text-purple-600 mb-2" />
                        <p className="text-sm text-muted-foreground">ROI</p>
                        <p className={`text-lg font-semibold ${getROIColor(selectedReport.roi_percentage)}`}>
                          {selectedReport.roi_percentage.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                        <p className="text-sm text-muted-foreground">Time to Close</p>
                        <p className="text-lg font-semibold">{selectedReport.time_to_close} days</p>
                      </div>
                    </div>

                    {/* ROI Chart */}
                    <div>
                      <h4 className="font-semibold mb-4">Revenue Timeline</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={selectedReport.timeline}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                          />
                          <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`} />
                          <Tooltip 
                            labelFormatter={(value) => new Date(value).toLocaleDateString()}
                            formatter={(value: any) => [`R$ ${value.toLocaleString()}`, 'Revenue']}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3B82F6" 
                            fill="#3B82F6" 
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-4">
                    <h4 className="font-semibold">Partnership Milestones</h4>
                    <div className="space-y-4">
                      {selectedReport.timeline.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">{milestone.milestone}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(milestone.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Revenue: R$ {milestone.value.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="breakdown" className="space-y-6">
                    <h4 className="font-semibold">Value Breakdown</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Direct Revenue:</span>
                          <span className="font-medium">
                            R$ {selectedReport.value_metrics.direct_revenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Indirect Benefits:</span>
                          <span className="font-medium">
                            R$ {selectedReport.value_metrics.indirect_benefits.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost Savings:</span>
                          <span className="font-medium">
                            R$ {selectedReport.value_metrics.cost_savings.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Market Expansion:</span>
                          <span className="font-medium">
                            R$ {selectedReport.value_metrics.market_expansion.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={[
                            { name: 'Direct', value: selectedReport.value_metrics.direct_revenue },
                            { name: 'Indirect', value: selectedReport.value_metrics.indirect_benefits },
                            { name: 'Savings', value: selectedReport.value_metrics.cost_savings },
                            { name: 'Expansion', value: selectedReport.value_metrics.market_expansion }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`} />
                            <Tooltip formatter={(value: any) => `R$ ${value.toLocaleString()}`} />
                            <Bar dataKey="value" fill="#3B82F6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </div>
          ) : (
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a report to view details</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
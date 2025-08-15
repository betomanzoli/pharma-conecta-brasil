
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Database,
  Clock,
  Shield,
  RefreshCw
} from 'lucide-react';
import { useDataMonitoring } from '@/hooks/useDataMonitoring';

const DataHealthDashboard = () => {
  const {
    healthMetrics,
    qualityScores,
    trends,
    activeAlerts,
    isLoading,
    error,
    refreshData,
    analyzeTrends,
    assessQuality,
    startMonitoring,
    stopMonitoring
  } = useDataMonitoring();

  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isMonitoring, setIsMonitoring] = useState(false);

  const handleStartMonitoring = () => {
    startMonitoring(30000); // 30 seconds interval
    setIsMonitoring(true);
  };

  const handleStopMonitoring = () => {
    stopMonitoring();
    setIsMonitoring(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'degrading': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const overallHealthScore = healthMetrics.length > 0 
    ? Math.round(healthMetrics.filter(m => m.status === 'healthy').length / healthMetrics.length * 100)
    : 0;

  const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical').length;
  const warningAlerts = activeAlerts.filter(a => a.severity === 'warning').length;

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Data Health Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time monitoring and analysis of data sources
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span className="text-sm text-muted-foreground">
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Inactive'}
            </span>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            variant={isMonitoring ? 'destructive' : 'default'}
            size="sm"
            onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
          >
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall Health</p>
                <p className="text-2xl font-bold">{overallHealthScore}%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-500" />
            </div>
            <Progress value={overallHealthScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Data Sources</p>
                <p className="text-2xl font-bold">{healthMetrics.length}</p>
              </div>
              <Database className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{warningAlerts}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="health" className="space-y-4">
        <TabsList>
          <TabsTrigger value="health">Health Metrics</TabsTrigger>
          <TabsTrigger value="quality">Data Quality</TabsTrigger>
          <TabsTrigger value="trends">Trends & Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Metrics List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Data Source Health</span>
                </CardTitle>
                <CardDescription>
                  Real-time health status of all monitored data sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {healthMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(metric.status)}
                        <div>
                          <p className="font-medium">{metric.source}</p>
                          <p className="text-sm text-muted-foreground">{metric.metric_name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline" className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                        {getTrendIcon(metric.trend)}
                        <span className="text-sm font-medium">
                          {metric.current_value.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Health Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Health Distribution</CardTitle>
                <CardDescription>
                  Distribution of health statuses across data sources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Healthy', value: healthMetrics.filter(m => m.status === 'healthy').length },
                        { name: 'Warning', value: healthMetrics.filter(m => m.status === 'warning').length },
                        { name: 'Critical', value: healthMetrics.filter(m => m.status === 'critical').length }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Data Quality Assessment</span>
              </CardTitle>
              <CardDescription>
                Comprehensive quality scores for all data sources
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {qualityScores.map((score, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">{score.source}</h3>
                      <Badge variant="outline">
                        Overall: {score.overall_score.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Completeness</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={score.completeness} className="flex-1" />
                          <span className="text-sm font-medium">{score.completeness.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={score.accuracy} className="flex-1" />
                          <span className="text-sm font-medium">{score.accuracy.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Consistency</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={score.consistency} className="flex-1" />
                          <span className="text-sm font-medium">{score.consistency.toFixed(1)}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Timeliness</p>
                        <div className="flex items-center space-x-2">
                          <Progress value={score.timeliness} className="flex-1" />
                          <span className="text-sm font-medium">{score.timeliness.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {score.issues.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-2">Issues Detected:</p>
                        <div className="flex flex-wrap gap-2">
                          {score.issues.map((issue, issueIndex) => (
                            <Badge key={issueIndex} variant="destructive" className="text-xs">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => assessQuality()}
                  disabled={isLoading}
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Reassess Quality
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Trend Analysis</span>
              </CardTitle>
              <CardDescription>
                Historical trends and predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => analyzeTrends('system', selectedTimeframe)}
                    disabled={isLoading}
                  >
                    Analyze Trends
                  </Button>
                  
                  <div className="flex space-x-2">
                    {(['1h', '24h', '7d', '30d'] as const).map((timeframe) => (
                      <Button
                        key={timeframe}
                        variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedTimeframe(timeframe)}
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {trends.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {trends.map((trend, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h3 className="font-semibold mb-4">
                          {trend.source} - {trend.metric}
                        </h3>
                        
                        <ResponsiveContainer width="100%" height={200}>
                          <AreaChart data={trend.values}>
                            <XAxis 
                              dataKey="timestamp" 
                              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                            />
                            <YAxis />
                            <Tooltip 
                              labelFormatter={(value) => new Date(value).toLocaleString()}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#3B82F6" 
                              fillOpacity={0.3}
                              fill="#3B82F6"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                        
                        {trend.anomalies.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-muted-foreground mb-2">
                              Anomalies Detected:
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {trend.anomalies.map((anomaly, anomalyIndex) => (
                                <Badge 
                                  key={anomalyIndex} 
                                  variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}
                                  className="text-xs"
                                >
                                  {anomaly.severity} - {new Date(anomaly.timestamp).toLocaleTimeString()}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Active Alerts</span>
              </CardTitle>
              <CardDescription>
                Current system alerts and notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <p>No active alerts - system is healthy!</p>
                  </div>
                ) : (
                  activeAlerts.map((alert, index) => (
                    <div 
                      key={index} 
                      className={`p-4 border rounded-lg ${
                        alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                        alert.severity === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                        'border-blue-200 bg-blue-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          {getStatusIcon(alert.severity)}
                          <div>
                            <p className="font-semibold">{alert.message}</p>
                            <p className="text-sm text-muted-foreground">
                              Source: {alert.source} • Type: {alert.type}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.triggered_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        
                        <Badge 
                          variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'warning' ? 'secondary' : 'default'
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      
                      {Object.keys(alert.details).length > 0 && (
                        <div className="mt-3 p-2 bg-white rounded border">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Details:</p>
                          <pre className="text-xs text-muted-foreground overflow-x-auto">
                            {JSON.stringify(alert.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataHealthDashboard;

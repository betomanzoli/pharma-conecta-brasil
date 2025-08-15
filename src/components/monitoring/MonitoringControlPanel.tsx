
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Play, 
  Pause, 
  RotateCcw, 
  Bell, 
  Shield, 
  Clock,
  Database,
  Zap
} from 'lucide-react';

interface MonitoringSettings {
  enabled: boolean;
  interval: number;
  thresholds: {
    warning: number;
    critical: number;
  };
  notifications: {
    email: boolean;
    realTime: boolean;
    digest: boolean;
  };
  sources: string[];
  qualityChecks: boolean;
  anomalyDetection: boolean;
  predictiveAlerts: boolean;
}

const MonitoringControlPanel = () => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [settings, setSettings] = useState<MonitoringSettings>({
    enabled: true,
    interval: 60000, // 1 minute
    thresholds: {
      warning: 70,
      critical: 90
    },
    notifications: {
      email: true,
      realTime: true,
      digest: false
    },
    sources: ['anvisa_medicamentos', 'fda_adverse_events', 'regulatory_alerts'],
    qualityChecks: true,
    anomalyDetection: true,
    predictiveAlerts: false
  });

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    console.log('Starting monitoring with settings:', settings);
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
    console.log('Stopping monitoring');
  };

  const handleResetSettings = () => {
    setSettings({
      enabled: true,
      interval: 60000,
      thresholds: {
        warning: 70,
        critical: 90
      },
      notifications: {
        email: true,
        realTime: true,
        digest: false
      },
      sources: ['anvisa_medicamentos', 'fda_adverse_events', 'regulatory_alerts'],
      qualityChecks: true,
      anomalyDetection: true,
      predictiveAlerts: false
    });
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      const keys = path.split('.');
      let current: any = newSettings;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newSettings;
    });
  };

  const formatInterval = (ms: number) => {
    if (ms < 60000) return `${ms / 1000}s`;
    if (ms < 3600000) return `${ms / 60000}m`;
    return `${ms / 3600000}h`;
  };

  return (
    <div className="space-y-6">
      {/* Control Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>Monitoring Control Panel</span>
          </h2>
          <p className="text-muted-foreground">
            Configure and control data monitoring settings
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Badge variant={isMonitoring ? 'default' : 'secondary'}>
            {isMonitoring ? 'Active' : 'Inactive'}
          </Badge>
          
          <Button
            variant={isMonitoring ? 'destructive' : 'default'}
            onClick={isMonitoring ? handleStopMonitoring : handleStartMonitoring}
            disabled={!settings.enabled}
          >
            {isMonitoring ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={handleResetSettings}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Monitoring Frequency</span>
                </CardTitle>
                <CardDescription>
                  How often to check data sources and run health checks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Interval: {formatInterval(settings.interval)}</Label>
                  <Slider
                    value={[settings.interval]}
                    onValueChange={([value]) => updateSetting('interval', value)}
                    min={10000}
                    max={3600000}
                    step={10000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10s</span>
                    <span>1h</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="monitoring-enabled">Enable Monitoring</Label>
                  <Switch
                    id="monitoring-enabled"
                    checked={settings.enabled}
                    onCheckedChange={(checked) => updateSetting('enabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Data Sources</span>
                </CardTitle>
                <CardDescription>
                  Select which data sources to monitor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { key: 'anvisa_medicamentos', label: 'ANVISA Medicamentos' },
                    { key: 'fda_adverse_events', label: 'FDA Adverse Events' },
                    { key: 'regulatory_alerts', label: 'Regulatory Alerts' },
                    { key: 'integration_data', label: 'Integration Data' },
                    { key: 'performance_metrics', label: 'Performance Metrics' }
                  ].map((source) => (
                    <div key={source.key} className="flex items-center justify-between">
                      <Label htmlFor={source.key}>{source.label}</Label>
                      <Switch
                        id={source.key}
                        checked={settings.sources.includes(source.key)}
                        onCheckedChange={(checked) => {
                          const newSources = checked
                            ? [...settings.sources, source.key]
                            : settings.sources.filter(s => s !== source.key);
                          updateSetting('sources', newSources);
                        }}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="thresholds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Alert Thresholds</span>
              </CardTitle>
              <CardDescription>
                Configure when to trigger warning and critical alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label>Warning Threshold: {settings.thresholds.warning}%</Label>
                    <Slider
                      value={[settings.thresholds.warning]}
                      onValueChange={([value]) => updateSetting('thresholds.warning', value)}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label>Critical Threshold: {settings.thresholds.critical}%</Label>
                    <Slider
                      value={[settings.thresholds.critical]}
                      onValueChange={([value]) => updateSetting('thresholds.critical', value)}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Threshold Preview</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Healthy</span>
                        <Badge variant="outline" className="bg-green-100 text-green-800">
                          0-{settings.thresholds.warning}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Warning</span>
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          {settings.thresholds.warning}-{settings.thresholds.critical}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Critical</span>
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          {settings.thresholds.critical}-100%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure how and when to receive alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notification Channels</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive alerts via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => updateSetting('notifications.email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="realtime-notifications">Real-time Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Instant browser notifications
                        </p>
                      </div>
                      <Switch
                        id="realtime-notifications"
                        checked={settings.notifications.realTime}
                        onCheckedChange={(checked) => updateSetting('notifications.realTime', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="digest-notifications">Daily Digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Summary email once per day
                        </p>
                      </div>
                      <Switch
                        id="digest-notifications"
                        checked={settings.notifications.digest}
                        onCheckedChange={(checked) => updateSetting('notifications.digest', checked)}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Email Configuration</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="email-address">Notification Email</Label>
                      <Input
                        id="email-address"
                        type="email"
                        placeholder="admin@company.com"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email-subject">Email Subject Prefix</Label>
                      <Input
                        id="email-subject"
                        placeholder="[PHARMA-CONNECT]"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Advanced Features</span>
                </CardTitle>
                <CardDescription>
                  Enable advanced monitoring capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quality-checks">Data Quality Checks</Label>
                    <p className="text-sm text-muted-foreground">
                      Automated data quality assessment
                    </p>
                  </div>
                  <Switch
                    id="quality-checks"
                    checked={settings.qualityChecks}
                    onCheckedChange={(checked) => updateSetting('qualityChecks', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="anomaly-detection">Anomaly Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      ML-powered anomaly detection
                    </p>
                  </div>
                  <Switch
                    id="anomaly-detection"
                    checked={settings.anomalyDetection}
                    onCheckedChange={(checked) => updateSetting('anomalyDetection', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="predictive-alerts">Predictive Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Predict issues before they occur
                    </p>
                  </div>
                  <Switch
                    id="predictive-alerts"
                    checked={settings.predictiveAlerts}
                    onCheckedChange={(checked) => updateSetting('predictiveAlerts', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Tuning</CardTitle>
                <CardDescription>
                  Optimize monitoring performance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Cache TTL (minutes)</Label>
                  <Input
                    type="number"
                    placeholder="5"
                    min="1"
                    max="60"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Max Concurrent Checks</Label>
                  <Input
                    type="number"
                    placeholder="10"
                    min="1"
                    max="50"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>History Retention (days)</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    min="7"
                    max="365"
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
          <CardDescription>
            Summary of active monitoring settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Status</p>
              <Badge variant={isMonitoring ? 'default' : 'secondary'}>
                {isMonitoring ? 'Running' : 'Stopped'}
              </Badge>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Interval</p>
              <p className="text-sm text-muted-foreground">
                {formatInterval(settings.interval)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Sources</p>
              <p className="text-sm text-muted-foreground">
                {settings.sources.length} active
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm font-medium">Features</p>
              <div className="flex space-x-1">
                {settings.qualityChecks && <Badge variant="outline" className="text-xs">Quality</Badge>}
                {settings.anomalyDetection && <Badge variant="outline" className="text-xs">Anomaly</Badge>}
                {settings.predictiveAlerts && <Badge variant="outline" className="text-xs">Predictive</Badge>}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringControlPanel;

import { useState } from "react";
import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Server, 
  Shield, 
  Database,
  HardDrive,
  Wifi,
  Lock,
  Save,
  RefreshCw,
  AlertTriangle,
  Monitor,
  Cpu,
  Activity
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ITSettings = () => {
  const [settings, setSettings] = useState({
    apiRateLimit: 1000,
    maxUploadSize: 50,
    sessionTimeout: 30,
    enableSSL: true,
    forceHTTPS: true,
    corsEnabled: true,
    debugMode: false,
    logRetention: 90,
    autoScaling: true,
    healthCheckInterval: 60,
    failoverEnabled: true,
    cacheEnabled: true,
    cacheTTL: 3600,
    dbPoolSize: 20,
    dbTimeout: 30,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "System configuration has been updated successfully.",
    });
  };

  return (
    <ITLayout title="System Settings">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="server" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger value="server" className="text-xs sm:text-sm">Server</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
            <TabsTrigger value="database" className="text-xs sm:text-sm">Database</TabsTrigger>
            <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
            <TabsTrigger value="monitoring" className="text-xs sm:text-sm">Monitoring</TabsTrigger>
          </TabsList>

          {/* Server Settings */}
          <TabsContent value="server">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Server className="w-5 h-5" />
                  Server Configuration
                </CardTitle>
                <CardDescription>Configure web server and API settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>API Rate Limit (req/min)</Label>
                    <Input type="number" value={settings.apiRateLimit} onChange={(e) => setSettings({...settings, apiRateLimit: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Upload Size (MB)</Label>
                    <Input type="number" value={settings.maxUploadSize} onChange={(e) => setSettings({...settings, maxUploadSize: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Log Retention (days)</Label>
                    <Input type="number" value={settings.logRetention} onChange={(e) => setSettings({...settings, logRetention: parseInt(e.target.value)})} />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 rounded-lg border border-warning/30 bg-warning/5">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" /> Debug Mode
                    </div>
                    <p className="text-sm text-muted-foreground">Enable detailed error logging (not for production)</p>
                  </div>
                  <Switch checked={settings.debugMode} onCheckedChange={(v) => setSettings({...settings, debugMode: v})} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-5 h-5" />
                  Security Configuration
                </CardTitle>
                <CardDescription>Configure SSL, CORS, and security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "enableSSL", icon: Lock, label: "Enable SSL/TLS", desc: "Encrypt all data in transit" },
                  { key: "forceHTTPS", icon: Shield, label: "Force HTTPS", desc: "Redirect all HTTP requests to HTTPS" },
                  { key: "corsEnabled", icon: Wifi, label: "Enable CORS", desc: "Allow cross-origin requests from trusted domains" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        <item.icon className="w-4 h-4" /> {item.label}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={settings[item.key as keyof typeof settings] as boolean} onCheckedChange={(v) => setSettings({...settings, [item.key]: v})} />
                  </div>
                ))}
                <Separator />
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    <Lock className="w-4 h-4 mr-2" />
                    Regenerate SSL Certificate
                  </Button>
                  <Button variant="outline">
                    <Shield className="w-4 h-4 mr-2" />
                    View Security Audit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Database className="w-5 h-5" />
                  Database Configuration
                </CardTitle>
                <CardDescription>Configure database connection and pooling</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Connection Pool Size</Label>
                    <Input type="number" value={settings.dbPoolSize} onChange={(e) => setSettings({...settings, dbPoolSize: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Query Timeout (seconds)</Label>
                    <Input type="number" value={settings.dbTimeout} onChange={(e) => setSettings({...settings, dbTimeout: parseInt(e.target.value)})} />
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="text-sm font-medium">Database Status</div>
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <Badge className="bg-success">Connected</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Connections</span>
                      <span className="font-medium">14/20</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg Query Time</span>
                      <span className="font-medium">45ms</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button className="btn-gradient">
                    <Database className="w-4 h-4 mr-2" />
                    Run Optimization
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset Connection Pool
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Cpu className="w-5 h-5" />
                  Performance Settings
                </CardTitle>
                <CardDescription>Configure caching and scaling options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium">Enable Caching</div>
                    <p className="text-sm text-muted-foreground">Cache frequently accessed data in memory</p>
                  </div>
                  <Switch checked={settings.cacheEnabled} onCheckedChange={(v) => setSettings({...settings, cacheEnabled: v})} />
                </div>
                <div className="space-y-2">
                  <Label>Cache TTL (seconds)</Label>
                  <Input type="number" value={settings.cacheTTL} onChange={(e) => setSettings({...settings, cacheTTL: parseInt(e.target.value)})} />
                </div>
                <Separator />
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium">Auto-Scaling</div>
                    <p className="text-sm text-muted-foreground">Automatically scale resources based on load</p>
                  </div>
                  <Switch checked={settings.autoScaling} onCheckedChange={(v) => setSettings({...settings, autoScaling: v})} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium">Failover Protection</div>
                    <p className="text-sm text-muted-foreground">Enable automatic failover to backup systems</p>
                  </div>
                  <Switch checked={settings.failoverEnabled} onCheckedChange={(v) => setSettings({...settings, failoverEnabled: v})} />
                </div>
                <Button variant="outline">
                  <HardDrive className="w-4 h-4 mr-2" />
                  Clear All Caches
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Settings */}
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Monitor className="w-5 h-5" />
                  Monitoring Configuration
                </CardTitle>
                <CardDescription>Configure health checks and alerting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Health Check Interval (seconds)</Label>
                  <Input type="number" value={settings.healthCheckInterval} onChange={(e) => setSettings({...settings, healthCheckInterval: parseInt(e.target.value)})} />
                </div>
                <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                  <div className="text-sm font-medium">Current System Health</div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "CPU", value: "45%", status: "good" },
                      { label: "Memory", value: "68%", status: "good" },
                      { label: "Disk", value: "85%", status: "warning" },
                      { label: "Network", value: "32ms", status: "good" },
                    ].map((metric, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-background">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <div className={`w-2 h-2 rounded-full ${metric.status === "good" ? "bg-success" : "bg-warning"}`} />
                        </div>
                        <div className="text-lg font-semibold">{metric.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    View Metrics Dashboard
                  </Button>
                  <Button variant="outline">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Configure Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="btn-gradient">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </ITLayout>
  );
};

export default ITSettings;

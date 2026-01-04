import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Server, 
  Database, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HardDrive
} from "lucide-react";

const systemStatus = [
  { name: "Web Server", status: "Operational", uptime: "99.98%", icon: Server },
  { name: "Database", status: "Operational", uptime: "99.95%", icon: Database },
  { name: "API Gateway", status: "Operational", uptime: "99.99%", icon: Activity },
  { name: "Storage", status: "Warning", uptime: "85% used", icon: HardDrive },
];

const recentAlerts = [
  { message: "High memory usage detected on DB server", time: "10 min ago", severity: "Warning" },
  { message: "Successful backup completed", time: "1 hour ago", severity: "Info" },
  { message: "Failed login attempt from unknown IP", time: "2 hours ago", severity: "Critical" },
  { message: "SSL certificate renewed", time: "1 day ago", severity: "Info" },
];

const ITDashboard = () => (
  <ITLayout title="IT Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {systemStatus.map((system, i) => (
          <Card key={i} className={system.status === "Warning" ? "border-warning" : ""}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${system.status === "Warning" ? "bg-warning/10" : "bg-success/10"}`}>
                  <system.icon className={`w-5 h-5 ${system.status === "Warning" ? "text-warning" : "text-success"}`} />
                </div>
                {system.status === "Operational" ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-warning" />
                )}
              </div>
              <div className="font-medium">{system.name}</div>
              <div className="text-sm text-muted-foreground">{system.uptime}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Security Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-destructive" />
              Security Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="text-2xl font-bold text-success">0</div>
                <div className="text-sm text-muted-foreground">Active Threats</div>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="text-2xl font-bold text-warning">3</div>
                <div className="text-sm text-muted-foreground">Pending Reviews</div>
              </div>
              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <div className="text-2xl font-bold text-info">156</div>
                <div className="text-sm text-muted-foreground">Logins Today</div>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="text-2xl font-bold text-destructive">2</div>
                <div className="text-sm text-muted-foreground">Failed Attempts</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.severity === "Critical" ? "bg-destructive" : 
                  alert.severity === "Warning" ? "bg-warning" : "bg-info"
                }`} />
                <div className="flex-1">
                  <div className="text-sm">{alert.message}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
                <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "Warning" ? "default" : "secondary"}>
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-destructive" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "CPU Usage", value: 45, color: "bg-success" },
              { label: "Memory", value: 68, color: "bg-info" },
              { label: "Storage", value: 85, color: "bg-warning" },
              { label: "Network", value: 32, color: "bg-primary" },
            ].map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{metric.label}</span>
                  <span className="font-medium">{metric.value}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ITLayout>
);

export default ITDashboard;

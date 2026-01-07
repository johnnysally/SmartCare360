import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
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

const storageData = [
  { name: "Used", value: 85, color: "hsl(38, 92%, 50%)" },
  { name: "Free", value: 15, color: "hsl(142, 71%, 45%)" },
];

const trafficData = [
  { hour: "00:00", requests: 120 },
  { hour: "04:00", requests: 80 },
  { hour: "08:00", requests: 450 },
  { hour: "12:00", requests: 680 },
  { hour: "16:00", requests: 520 },
  { hour: "20:00", requests: 320 },
];

const chartConfig = {
  requests: { label: "Requests", color: "hsl(174, 72%, 40%)" },
};

const ITDashboard = () => (
  <ITLayout title="IT Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* System Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStatus.map((system, i) => (
          <Card key={i} className={system.status === "Warning" ? "border-warning" : ""}>
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${system.status === "Warning" ? "bg-warning/10" : "bg-success/10"}`}>
                  <system.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${system.status === "Warning" ? "text-warning" : "text-success"}`} />
                </div>
                {system.status === "Operational" ? (
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
                ) : (
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
                )}
              </div>
              <div className="text-base sm:text-lg font-semibold">{system.name}</div>
              <div className="text-sm text-muted-foreground">{system.uptime}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Security Overview with Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Shield className="w-5 h-5 text-destructive" />
              Storage Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 sm:p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="text-xl sm:text-2xl font-bold text-success">0</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Active Threats</div>
              </div>
              <div className="p-3 sm:p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="text-xl sm:text-2xl font-bold text-warning">3</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Pending Reviews</div>
              </div>
            </div>
            <ChartContainer config={chartConfig} className="h-40 sm:h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={storageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {storageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  alert.severity === "Critical" ? "bg-destructive" : 
                  alert.severity === "Warning" ? "bg-warning" : "bg-info"
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{alert.message}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                  </div>
                </div>
                <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "Warning" ? "default" : "secondary"} className="flex-shrink-0">
                  {alert.severity}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="w-5 h-5 text-primary" />
            API Traffic (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-48 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="requests" fill="hsl(174, 72%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Activity className="w-5 h-5 text-destructive" />
            System Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { label: "CPU Usage", value: 45, color: "bg-success" },
              { label: "Memory", value: 68, color: "bg-info" },
              { label: "Storage", value: 85, color: "bg-warning" },
              { label: "Network", value: 32, color: "bg-primary" },
            ].map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-semibold">{metric.value}%</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full transition-all`} style={{ width: `${metric.value}%` }} />
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

import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import {
  Users,
  UserCog,
  Activity,
  AlertTriangle,
  TrendingUp,
  Server,
  Database,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Active Staff", value: "86", change: "+3%", icon: UserCog, color: "text-info" },
  { label: "System Uptime", value: "99.9%", change: "+0.1%", icon: Server, color: "text-success" },
  { label: "Active Sessions", value: "342", change: "+28%", icon: Activity, color: "text-accent" },
];

const recentActivities = [
  { action: "User login", user: "Dr. Sarah Kimani", time: "2 minutes ago", type: "info" },
  { action: "Password reset", user: "John Mwangi", time: "15 minutes ago", type: "warning" },
  { action: "New staff added", user: "Admin", time: "1 hour ago", type: "success" },
  { action: "Role updated", user: "Admin", time: "2 hours ago", type: "info" },
  { action: "Failed login attempt", user: "Unknown", time: "3 hours ago", type: "error" },
];

const usersByRole = [
  { role: "Doctors", count: 24, color: "hsl(174, 72%, 40%)" },
  { role: "Nurses", count: 38, color: "hsl(199, 89%, 48%)" },
  { role: "Lab Techs", count: 12, color: "hsl(142, 71%, 45%)" },
  { role: "Admin", count: 8, color: "hsl(262, 52%, 55%)" },
  { role: "Reception", count: 4, color: "hsl(24, 95%, 53%)" },
];

const weeklyLogins = [
  { day: "Mon", logins: 156 },
  { day: "Tue", logins: 189 },
  { day: "Wed", logins: 203 },
  { day: "Thu", logins: 178 },
  { day: "Fri", logins: 245 },
  { day: "Sat", logins: 89 },
  { day: "Sun", logins: 67 },
];

const chartConfig = {
  logins: { label: "Logins", color: "hsl(174, 72%, 40%)" },
};

const AdminDashboard = () => {
  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold font-display">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="w-4 h-4 text-success" />
                      <span className="text-sm text-success font-medium">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users by Role - Pie Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
                <Users className="w-5 h-5" />
                Staff Distribution by Role
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={usersByRole}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="count"
                      label={({ role, count }) => `${role}: ${count}`}
                      labelLine={false}
                    >
                      {usersByRole.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Weekly Logins - Bar Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-5 h-5" />
                Weekly Login Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-56 sm:h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyLogins} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="logins" fill="hsl(174, 72%, 40%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
                <Clock className="w-5 h-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        activity.type === 'error' ? 'bg-destructive' :
                        activity.type === 'warning' ? 'bg-warning' :
                        activity.type === 'success' ? 'bg-success' : 'bg-primary'
                      }`} />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{activity.action}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
                <Database className="w-5 h-5" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Database", status: "healthy", load: 45 },
                  { name: "API Server", status: "healthy", load: 32 },
                  { name: "File Storage", status: "healthy", load: 67 },
                  { name: "Auth Service", status: "healthy", load: 23 },
                ].map((system) => (
                  <div key={system.name} className="p-3 sm:p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm sm:text-base">{system.name}</span>
                      <Badge variant="secondary" className="bg-success/20 text-success">
                        {system.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${system.load}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-10 text-right">{system.load}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2 text-base sm:text-lg">
              <AlertTriangle className="w-5 h-5 text-warning" />
              System Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border border-warning/30 bg-warning/10">
                <p className="font-medium text-warning">Storage Warning</p>
                <p className="text-sm text-muted-foreground mt-1">File storage at 67% capacity</p>
              </div>
              <div className="p-4 rounded-lg border border-primary/30 bg-primary/10">
                <p className="font-medium text-primary">Scheduled Maintenance</p>
                <p className="text-sm text-muted-foreground mt-1">System update on Jan 10, 2026</p>
              </div>
              <div className="p-4 rounded-lg border border-success/30 bg-success/10">
                <p className="font-medium text-success">Backup Complete</p>
                <p className="text-sm text-muted-foreground mt-1">Last backup: 2 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

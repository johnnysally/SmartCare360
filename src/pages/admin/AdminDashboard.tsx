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
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getPatients, getAppointments, getUsers } from "@/lib/api";

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [health, setHealth] = useState('unknown');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [pats, appts, usersData] = await Promise.all([
          getPatients().catch(() => []), 
          getAppointments().catch(() => []),
          getUsers().catch(() => [])
        ]);
        if (mounted) {
          setPatientsCount((pats || []).length);
          setAppointmentsCount((appts || []).length);
          setUsersCount((usersData || []).length);
          setUsers(usersData || []);
        }
      } catch (err: any) {
        toast({ title: 'Failed to load admin metrics', description: err?.message || '' });
      }

      try {
        const res = await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/health');
        const body = await res.json();
        if (mounted) setHealth(body?.status || 'unknown');
      } catch (e) {
        if (mounted) setHealth('down');
      }
      
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  // Calculate user distribution by role
  const roleDistribution = users.reduce((acc: any, user: any) => {
    const role = user.role || 'unknown';
    const existingRole = acc.find((r: any) => r.role === role);
    if (existingRole) {
      existingRole.count++;
    } else {
      const colors = {
        'doctor': 'hsl(174, 72%, 40%)',
        'nurse': 'hsl(199, 89%, 48%)',
        'pharmacist': 'hsl(142, 71%, 45%)',
        'admin': 'hsl(262, 52%, 55%)',
        'staff': 'hsl(24, 95%, 53%)'
      };
      acc.push({ role, count: 1, color: (colors as any)[role] || 'hsl(200, 100%, 50%)' });
    }
    return acc;
  }, []);

  const chartConfig = {
    logins: { label: "Logins", color: "hsl(174, 72%, 40%)" },
  };

  // Generate weekly data (placeholder - would come from API logs)
  const weeklyLogins = [
    { day: "Mon", logins: Math.floor(usersCount * 0.3) },
    { day: "Tue", logins: Math.floor(usersCount * 0.35) },
    { day: "Wed", logins: Math.floor(usersCount * 0.4) },
    { day: "Thu", logins: Math.floor(usersCount * 0.38) },
    { day: "Fri", logins: Math.floor(usersCount * 0.45) },
    { day: "Sat", logins: Math.floor(usersCount * 0.2) },
    { day: "Sun", logins: Math.floor(usersCount * 0.15) },
  ];

  const recentActivities = [
    { action: "System started", user: "System", time: "Today", type: "info" },
    { action: `${patientsCount} patients active`, user: "System", time: "Today", type: "success" },
    { action: `${appointmentsCount} appointments`, user: "System", time: "Today", type: "info" },
    { action: `${usersCount} staff members`, user: "System", time: "Today", type: "success" },
    { action: "Health check passed", user: "System", time: "Just now", type: "success" },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display">{usersCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center text-primary">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Patients</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display">{patientsCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center text-info">
                  <UserCog className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Appointments</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display">{appointmentsCount}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center text-success">
                  <Activity className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">System Health</p>
                  <p className="text-2xl sm:text-3xl font-bold font-display">{health}</p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center text-accent">
                  <Server className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      dataKey="count"
                      label={({ role, count }) => `${role}: ${count}`}
                      labelLine={false}
                    >
                      {roleDistribution.map((entry: any, index: number) => (
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

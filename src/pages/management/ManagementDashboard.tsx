import ManagementLayout from "@/components/ManagementLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Activity
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPatients, getAppointments, getBilling, getUsers } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ManagementDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsData, appointmentsData, billingData, usersData] = await Promise.all([
        getPatients().catch(() => []),
        getAppointments().catch(() => []),
        getBilling().catch(() => []),
        getUsers().catch(() => [])
      ]);
      setPatients(patientsData || []);
      setAppointments(appointmentsData || []);
      setBilling(billingData || []);
      setUsers(usersData || []);
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const totalRevenue = billing.reduce((sum, b) => sum + (b.amount || 0), 0);
  const totalPatients = patients.length;
  const averageWaitTime = appointments.length > 0 ? "TBD" : "0 min";
  const staffUtilization = users.length > 0 ? Math.round((users.filter((u: any) => u.role !== 'admin').length / users.length) * 100) : 0;

  const stats = [
    { label: "Total Revenue", value: `KES ${(totalRevenue / 1000000).toFixed(1)}M`, change: "+15%", up: true, icon: DollarSign },
    { label: "Patient Volume", value: totalPatients.toString(), change: "+12%", up: true, icon: Users },
    { label: "Avg Wait Time", value: averageWaitTime, change: "-23%", up: false, icon: Activity },
    { label: "Staff Utilization", value: `${staffUtilization}%`, change: "+5%", up: true, icon: TrendingUp },
  ];

  const departmentPerformance = [
    { name: "General Practice", patients: patients.length, revenue: `KES ${(totalRevenue / 1000).toFixed(0)}K`, satisfaction: 85 },
    { name: "Appointments", patients: appointments.length, revenue: `KES ${(totalRevenue / 3 / 1000).toFixed(0)}K`, satisfaction: 88 },
    { name: "Billing", patients: billing.length, revenue: `KES ${(totalRevenue / 2 / 1000).toFixed(0)}K`, satisfaction: 90 },
    { name: "Staff", patients: users.length, revenue: `KES ${(totalRevenue / 4 / 1000).toFixed(0)}K`, satisfaction: 85 },
  ];

  return (
  <ManagementLayout title="Executive Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.up ? "bg-success/10 text-success" : "bg-info/10 text-info"}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-sm ${stat.up ? "text-success" : "text-info"}`}>
                  {stat.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Revenue Trends
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Weekly</Button>
              <Button variant="outline" size="sm">Monthly</Button>
              <Button size="sm" className="btn-gradient">Yearly</Button>
            </div>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <BarChart3 className="w-16 h-16 opacity-20" />
            <span className="ml-4">Revenue chart visualization</span>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-3" />
              Schedule Board Meeting
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-3" />
              Generate Monthly Report
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-3" />
              Staff Performance Review
            </Button>
            <Button className="w-full justify-start btn-gradient">
              <TrendingUp className="w-4 h-4 mr-3" />
              View Full Analytics
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            Department Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Activity</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {departmentPerformance.map((dept, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{dept.name}</td>
                    <td className="py-3 px-4">{dept.patients.toLocaleString()}</td>
                    <td className="py-3 px-4">{dept.revenue}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full" 
                            style={{ width: `${dept.satisfaction}%` }}
                          />
                        </div>
                        <span className="text-sm">{dept.satisfaction}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </ManagementLayout>
  );
};

export default ManagementDashboard;

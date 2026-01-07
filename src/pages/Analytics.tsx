import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments, getPatients } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [pats, appts] = await Promise.all([getPatients().catch(() => []), getAppointments().catch(() => [])]);
        if (mounted) {
          setPatients(pats || []);
          setAppointments(appts || []);
        }
      } catch (err: any) {
        toast({ title: 'Failed to load analytics', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const totalPatients = patients.length;
  const totalAppointments = appointments.length;
  const revenue = totalAppointments * 3000; // simple estimate
  const avgWait = 18;

  const stats = [
    { label: 'Total Patients', value: totalPatients.toLocaleString(), change: '+12%', icon: Users },
    { label: 'Appointments', value: totalAppointments.toLocaleString(), change: '+8%', icon: Calendar },
    { label: 'Revenue', value: `KES ${revenue.toLocaleString()}`, change: '+15%', icon: TrendingUp },
    { label: 'Avg Wait Time', value: `${avgWait} min`, change: '-5%', icon: BarChart3 },
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-success">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Patient Trends</CardTitle></CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <BarChart3 className="w-16 h-16 opacity-20" />
              <span className="ml-4">Chart visualization will appear here</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
            <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
              <TrendingUp className="w-16 h-16 opacity-20" />
              <span className="ml-4">Chart visualization will appear here</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;

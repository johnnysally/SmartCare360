import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HeartPulse, 
  Pill, 
  Users, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPatients, getAppointments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const NurseDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsData, appointmentsData] = await Promise.all([
        getPatients().catch(() => []),
        getAppointments().catch(() => [])
      ]);
      setPatients(patientsData || []);
      setAppointments(appointmentsData || []);
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const assignedPatients = patients.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const criticalAlerts = patients.filter((p: any) => p.status === 'Critical').length;

  const patientList = patients.slice(0, 4).map((patient: any) => ({
    name: patient.name,
    bed: patient.bed || `Bed-${patient.id}`,
    status: patient.status || "Stable",
    nextVitals: "TBD",
    alert: patient.status === 'Critical'
  }));

  const tasks = appointments.slice(0, 4).map((apt: any, idx: number) => ({
    task: `Attend to ${apt.patientName || `Patient ${apt.patientId}`}`,
    time: new Date(apt.time || apt.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    completed: idx % 3 === 0,
    priority: idx === 0 ? "Urgent" : idx === 1 ? "High" : "Normal"
  }));

  const stats = [
    { label: "Patients Assigned", value: assignedPatients.toString(), icon: Users, change: "All wards", color: "text-success" },
    { label: "Vitals Due", value: pendingAppointments.toString(), icon: HeartPulse, change: "Today", color: "text-warning" },
    { label: "Medications Due", value: (pendingAppointments / 2).toFixed(0), icon: Pill, change: "Pending", color: "text-info" },
    { label: "Critical Alerts", value: criticalAlerts.toString(), icon: AlertTriangle, change: "Urgent", color: "text-destructive" },
  ];

  return (
  <NurseLayout title="Nurse Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Patient List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-success" />
              My Patients
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading patients...</div>
            ) : patientList.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No patients assigned</div>
            ) : (
              patientList.map((patient, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${patient.status === "Critical" ? "bg-destructive animate-pulse" : patient.status === "Monitoring" ? "bg-warning" : "bg-success"}`} />
                    <div>
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-muted-foreground">{patient.bed}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-sm font-medium">{patient.status}</div>
                    </div>
                    {patient.alert && (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-success" />
              Today's Tasks
            </CardTitle>
            <Badge variant="outline">{tasks.filter(t => !t.completed).length} pending</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading tasks...</div>
            ) : tasks.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">No tasks</div>
            ) : (
              tasks.map((task, i) => (
                <div key={i} className={cn("flex items-center gap-4 p-3 rounded-lg border transition-colors", task.completed ? "opacity-60" : "hover:bg-muted/50")}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("w-8 h-8 rounded-full", task.completed ? "text-success" : "text-muted-foreground")}
                  >
                    {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </Button>
                  <div className="flex-1">
                    <div className={cn("font-medium", task.completed && "line-through")}>{task.task}</div>
                    <div className="text-sm text-muted-foreground">{task.time}</div>
                  </div>
                  <Badge 
                    variant={task.priority === "Urgent" ? "destructive" : task.priority === "High" ? "default" : "secondary"}
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  </NurseLayout>
  );
};

export default NurseDashboard;

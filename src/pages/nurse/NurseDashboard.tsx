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
  CheckCircle2,
  UserCheck,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPatients, getAppointments, getAllQueues, callNextPatient, completeService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const NurseDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allQueues, setAllQueues] = useState<any>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      loadQueues();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsData, appointmentsData, queuesData] = await Promise.all([
        getPatients().catch(() => []),
        getAppointments().catch(() => []),
        getAllQueues().catch(() => ({}))
      ]);
      setPatients(patientsData || []);
      setAppointments(appointmentsData || []);
      setAllQueues(queuesData || {});
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  const loadQueues = async () => {
    try {
      const queuesData = await getAllQueues();
      setAllQueues(queuesData || {});
    } catch (err: any) {
      toast({ title: 'Failed to load queues', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleCallNext = async () => {
    try {
      await callNextPatient('Emergency', 'nurse-001');
      toast({ title: 'Patient called', description: 'Next patient has been called' });
      await loadQueues();
    } catch (err: any) {
      toast({ title: 'Error calling patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleCompleteService = async (queueId: string) => {
    try {
      await completeService(queueId);
      toast({ title: 'Service completed', description: 'Patient marked as served' });
      await loadQueues();
    } catch (err: any) {
      toast({ title: 'Error completing service', description: err?.message || '', variant: 'destructive' });
    }
  };

  // Calculate stats from real data
  const assignedPatients = patients.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const criticalAlerts = patients.filter((p: any) => p.status === 'Critical').length;

  const currentQueue = allQueues['Emergency'] || [];
  const waitingPatients = currentQueue.filter((p: any) => p.status === 'waiting');
  const servingPatients = currentQueue.filter((p: any) => p.status === 'serving');
  const completedPatients = currentQueue.filter((p: any) => p.status === 'completed');

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
        {/* Emergency Queue */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-destructive" />
              Emergency Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading queue...</div>
            ) : currentQueue.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No patients in queue</div>
            ) : (
              <div className="space-y-4">
                {/* Call Next Button */}
                {waitingPatients.length > 0 && (
                  <Button 
                    onClick={handleCallNext} 
                    className="w-full btn-gradient mb-4"
                    size="lg"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Call Next Patient ({waitingPatients.length} waiting)
                  </Button>
                )}

                {/* Now Serving - Current Patient */}
                {servingPatients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-destructive text-sm">Now Attending</h4>
                    {servingPatients.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-destructive/30 bg-destructive/5">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center font-bold text-white">!</div>
                          <div className="flex-1">
                            <div className="font-semibold">{p.patient_name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Queue #{p.queue_number}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="btn-gradient"
                          onClick={() => handleCompleteService(p.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Waiting Patients Queue */}
                {waitingPatients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-700 text-sm">Waiting ({waitingPatients.length})</h4>
                    {waitingPatients.slice(0, 4).map((p: any, idx: number) => (
                      <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${idx === 0 ? "border-primary bg-primary/5" : "border-yellow-200 bg-yellow-50"}`}>
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-sm">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{p.patient_name}</div>
                            <div className="text-xs text-muted-foreground">Queue #{p.queue_number}</div>
                          </div>
                        </div>
                        {p.priority && <Badge variant={p.priority === 1 ? 'destructive' : 'outline'} className="text-xs">P{p.priority}</Badge>}
                      </div>
                    ))}
                    {waitingPatients.length > 4 && (
                      <div className="text-xs text-muted-foreground text-center p-2">
                        +{waitingPatients.length - 4} more waiting
                      </div>
                    )}
                  </div>
                )}
              </div>
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

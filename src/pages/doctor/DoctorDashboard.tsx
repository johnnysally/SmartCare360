import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  TrendingUp,
  UserCheck,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments, getPatients, getAllQueues, callNextPatient, completeService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allQueues, setAllQueues] = useState<any>({});
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem('sc360_user') || '{}');

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      loadQueues();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsData, patientsData, queuesData] = await Promise.all([
        getAppointments().catch(() => []),
        getPatients().catch(() => []),
        getAllQueues().catch(() => ({}))
      ]);
      setAppointments(appointmentsData || []);
      setPatients(patientsData || []);
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
      await callNextPatient('OPD', 'doctor-001');
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
  const today = new Date().toDateString();
  const todayAppointments = appointments.filter(a => 
    new Date(a.time || a.createdAt).toDateString() === today
  );
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const recentVisitPatients = patients.slice(-3).reverse();

  const currentQueue = allQueues['OPD'] || [];
  const waitingPatients = currentQueue.filter((p: any) => p.status === 'waiting');
  const servingPatients = currentQueue.filter((p: any) => p.status === 'serving');
  const completedPatients = currentQueue.filter((p: any) => p.status === 'completed');

  const upcomingAppointments = todayAppointments.slice(0, 4).map((apt: any) => ({
    patient: apt.patientName || `Patient ${apt.patientId}`,
    time: new Date(apt.time || apt.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    type: apt.type || "Consultation",
    status: apt.status || "pending"
  }));

  const recentPatients = recentVisitPatients.map((patient: any) => ({
    name: patient.name,
    lastVisit: patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : "Recently added",
    condition: patient.condition || "General checkup",
    status: patient.status || "Stable"
  }));

  const pendingTasks = pendingAppointments.slice(0, 3).map((apt: any, idx: number) => ({
    task: `Review appointment for ${apt.patientName || `Patient ${apt.patientId}`}`,
    priority: idx === 0 ? "high" : idx === 1 ? "medium" : "low"
  }));

  return (
    <DoctorLayout title="Doctor Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-display font-bold">Good Morning, {currentUser.name || 'Doctor'}</h2>
            <p className="text-muted-foreground">You have {todayAppointments.length} appointments scheduled for today</p>
          </div>
          <Button className="btn-gradient">
            <Stethoscope className="w-4 h-4 mr-2" />
            Start Consultation
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{todayAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Today's Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{confirmedAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Confirmed Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{pendingAppointments.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Appointments</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display">{patients.length}</p>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OPD Queue */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                OPD Queue
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
                      <h4 className="font-semibold text-purple-700 text-sm">Now Serving</h4>
                      {servingPatients.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">🔔</div>
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
                      {waitingPatients.slice(0, 5).map((p: any, idx: number) => (
                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${idx === 0 ? "border-primary bg-primary/5" : "border-yellow-200 bg-yellow-50"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-sm">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.patient_name}</div>
                              <div className="text-xs text-muted-foreground">Queue #{p.queue_number}</div>
                            </div>
                          </div>
                          {p.priority && <Badge variant="outline" className="text-xs">P{p.priority}</Badge>}
                        </div>
                      ))}
                      {waitingPatients.length > 5 && (
                        <div className="text-xs text-muted-foreground text-center p-2">
                          +{waitingPatients.length - 5} more waiting
                        </div>
                      )}
                    </div>
                  )}

                  {/* Completed Patients */}
                  {completedPatients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-700 text-sm">Completed Today ({completedPatients.length})</h4>
                      {completedPatients.slice(0, 2).map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border-2 border-green-200 bg-green-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.patient_name}</div>
                              <div className="text-xs text-muted-foreground">Queue #{p.queue_number}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" />
                Pending Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading tasks...</div>
              ) : pendingTasks.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No pending tasks</div>
              ) : (
                <>
                  {pendingTasks.map((task, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          task.priority === "high"
                            ? "bg-destructive"
                            : task.priority === "medium"
                            ? "bg-warning"
                            : "bg-muted-foreground"
                        }`}
                      />
                      <p className="text-sm flex-1">{task.task}</p>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full mt-2">
                    View All Tasks
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Recent Patients
            </CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {loading ? (
                <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">Loading patients...</div>
              ) : recentPatients.length === 0 ? (
                <div className="col-span-3 py-6 text-center text-sm text-muted-foreground">No patients yet</div>
              ) : (
                recentPatients.map((patient, i) => (
                  <div key={i} className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {patient.name.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.lastVisit}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{patient.condition}</span>
                      <Badge
                        variant={
                          patient.status === "Improving"
                            ? "default"
                            : patient.status === "Stable"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;

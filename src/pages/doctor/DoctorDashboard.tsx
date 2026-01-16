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
} from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments, getPatients } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem('sc360_user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsData, patientsData] = await Promise.all([
        getAppointments().catch(() => []),
        getPatients().catch(() => [])
      ]);
      setAppointments(appointmentsData || []);
      setPatients(patientsData || []);
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
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
          {/* Upcoming Appointments */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Schedule
              </CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading appointments...</div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No appointments today</div>
              ) : (
                upcomingAppointments.map((apt, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {apt.patient.split(" ").map((n: string) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{apt.patient}</p>
                        <p className="text-sm text-muted-foreground">{apt.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium">{apt.time}</span>
                      <Badge variant={apt.status === "confirmed" ? "default" : "secondary"}>
                        {apt.status}
                      </Badge>
                    </div>
                  </div>
                ))
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

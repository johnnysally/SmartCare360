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

const upcomingAppointments = [
  { patient: "Grace Njeri", time: "9:00 AM", type: "Follow-up", status: "confirmed" },
  { patient: "James Mwangi", time: "10:30 AM", type: "Consultation", status: "confirmed" },
  { patient: "Mary Wambui", time: "11:00 AM", type: "Check-up", status: "pending" },
  { patient: "Peter Ochieng", time: "2:00 PM", type: "Lab Review", status: "confirmed" },
];

const recentPatients = [
  { name: "Alice Kimani", lastVisit: "Today", condition: "Malaria", status: "Improving" },
  { name: "John Otieno", lastVisit: "Yesterday", condition: "Hypertension", status: "Stable" },
  { name: "Susan Wanjiku", lastVisit: "2 days ago", condition: "Diabetes", status: "Monitor" },
];

const pendingTasks = [
  { task: "Review lab results for Grace Njeri", priority: "high" },
  { task: "Sign prescription for James Mwangi", priority: "medium" },
  { task: "Complete discharge summary", priority: "low" },
];

const DoctorDashboard = () => (
  <DoctorLayout title="Doctor Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold">Good Morning, Dr. Kimani</h2>
          <p className="text-muted-foreground">You have 8 appointments scheduled for today</p>
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
                <p className="text-2xl font-bold font-display">8</p>
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
                <p className="text-2xl font-bold font-display">24</p>
                <p className="text-sm text-muted-foreground">Completed This Week</p>
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
                <p className="text-2xl font-bold font-display">3</p>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
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
                <p className="text-2xl font-bold font-display">156</p>
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
            {upcomingAppointments.map((apt, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {apt.patient.split(" ").map(n => n[0]).join("")}
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
            ))}
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
            {pendingTasks.map((task, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg border bg-card"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
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
            {recentPatients.map((patient, i) => (
              <div key={i} className="p-4 rounded-lg border bg-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {patient.name.split(" ").map(n => n[0]).join("")}
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </DoctorLayout>
);

export default DoctorDashboard;

import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  FileText, 
  Receipt, 
  HeartPulse,
  ArrowRight,
  Clock,
  Video,
  Bell
} from "lucide-react";

const upcomingAppointments = [
  { doctor: "Dr. Otieno", specialty: "General Practitioner", date: "Jan 5, 2026", time: "10:00 AM", type: "In-person" },
  { doctor: "Dr. Mwangi", specialty: "Cardiologist", date: "Jan 12, 2026", time: "02:30 PM", type: "Telemedicine" },
];

const recentResults = [
  { test: "Complete Blood Count", date: "Jan 2, 2026", status: "Ready" },
  { test: "Lipid Profile", date: "Dec 28, 2025", status: "Ready" },
];

const notifications = [
  { message: "Lab results are ready for review", time: "2 hours ago", type: "result" },
  { message: "Appointment reminder: Dr. Otieno tomorrow", time: "5 hours ago", type: "appointment" },
];

const PatientDashboard = () => (
  <PatientLayout title="My Health Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Card */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-info/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold font-display">Welcome back, Mary!</h2>
              <p className="text-muted-foreground mt-1">Here's an overview of your health information.</p>
            </div>
            <div className="flex gap-3">
              <Button className="btn-gradient">
                <Calendar className="w-4 h-4 mr-2" />
                Book Appointment
              </Button>
              <Button variant="outline">
                <Video className="w-4 h-4 mr-2" />
                Start Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Next Appointment", value: "Jan 5", icon: Calendar, color: "text-primary" },
          { label: "Pending Results", value: "0", icon: FileText, color: "text-success" },
          { label: "Active Prescriptions", value: "3", icon: Receipt, color: "text-info" },
          { label: "Unpaid Bills", value: "KES 2,500", icon: Receipt, color: "text-warning" },
        ].map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    {apt.type === "Telemedicine" ? <Video className="w-6 h-6 text-primary" /> : <HeartPulse className="w-6 h-6 text-primary" />}
                  </div>
                  <div>
                    <div className="font-medium">{apt.doctor}</div>
                    <div className="text-sm text-muted-foreground">{apt.specialty}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{apt.date}</div>
                  <div className="text-sm text-muted-foreground">{apt.time}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Results & Notifications */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-primary" />
                Recent Lab Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentResults.map((result, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div>
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm text-muted-foreground">{result.date}</div>
                  </div>
                  <Badge className="bg-success">{result.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notif, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <div className="text-sm">{notif.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">{notif.time}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </PatientLayout>
);

export default PatientDashboard;

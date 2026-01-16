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
import { useEffect, useState } from "react";
import { getAppointments, getBilling } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const currentUser = JSON.parse(localStorage.getItem('sc360_user') || '{}');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [appointmentsData, billingData] = await Promise.all([
        getAppointments().catch(() => []),
        getBilling().catch(() => [])
      ]);
      setAppointments(appointmentsData || []);
      setBilling(billingData || []);
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const futureAppointments = appointments.filter(a => new Date(a.time || a.createdAt) > new Date());
  const unpaidBills = billing.filter(b => b.status !== 'paid').reduce((sum, b) => sum + (b.amount || 0), 0);
  const nextAppointment = futureAppointments.length > 0 
    ? new Date(futureAppointments[0].time || futureAppointments[0].createdAt).toLocaleDateString()
    : 'None scheduled';

  const upcomingAppointments = futureAppointments.slice(0, 2).map((apt: any) => ({
    doctor: apt.doctorName || `Dr. ${apt.doctorId}`,
    specialty: apt.type || "General Practitioner",
    date: new Date(apt.time || apt.createdAt).toLocaleDateString(),
    time: new Date(apt.time || apt.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    type: "In-person"
  }));

  const recentResults = appointments.slice(0, 2).map((apt: any) => ({
    test: apt.type || "Medical Test",
    date: new Date(apt.time || apt.createdAt).toLocaleDateString(),
    status: apt.status === 'completed' ? "Ready" : "Pending"
  }));

  const notifications = [
    ...futureAppointments.slice(0, 1).map((apt: any) => ({
      message: `Upcoming appointment on ${new Date(apt.time || apt.createdAt).toLocaleDateString()}`,
      time: "Today",
      type: "appointment"
    })),
    ...billing.filter((b: any) => b.status !== 'paid').slice(0, 1).map((bill: any) => ({
      message: `Outstanding balance: KES ${bill.amount || 0}`,
      time: "Pending",
      type: "billing"
    }))
  ];

  return (
    <PatientLayout title="My Health Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Card */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-info/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold font-display">Welcome back, {currentUser.name || 'Patient'}!</h2>
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
            { label: "Next Appointment", value: nextAppointment, icon: Calendar, color: "text-primary" },
            { label: "Pending Results", value: recentResults.filter(r => r.status === 'Pending').length.toString(), icon: FileText, color: "text-success" },
            { label: "Active Prescriptions", value: appointments.filter(a => a.status === 'completed').length.toString(), icon: Receipt, color: "text-info" },
            { label: "Unpaid Bills", value: `KES ${unpaidBills.toLocaleString()}`, icon: Receipt, color: "text-warning" },
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
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">Loading appointments...</div>
              ) : upcomingAppointments.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No upcoming appointments</div>
              ) : (
                upcomingAppointments.map((apt, i) => (
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
                ))
              )}
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
                {loading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading results...</div>
                ) : recentResults.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">No results available</div>
                ) : (
                  recentResults.map((result, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div>
                        <div className="font-medium">{result.test}</div>
                        <div className="text-sm text-muted-foreground">{result.date}</div>
                      </div>
                      <Badge className="bg-success">{result.status}</Badge>
                    </div>
                  ))
                )}
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
                {loading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">No notifications</div>
                ) : (
                  notifications.map((notif, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div className="flex-1">
                        <div className="text-sm">{notif.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{notif.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default PatientDashboard;

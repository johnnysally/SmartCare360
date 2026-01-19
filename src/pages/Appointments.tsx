import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Calendar as CalIcon, Search, CheckCircle, AlertCircle, XCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments, confirmAppointment, cancelAppointment, updateAppointment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];
const APPOINTMENT_TYPES = ['In-person', 'Telemedicine', 'Follow-up', 'Check-up', 'Consultation'];

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    loadAppointments();
    const interval = setInterval(loadAppointments, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await getAppointments();
      setAppointments(data || []);
    } catch (err: any) {
      toast({ title: 'Failed to load appointments', description: err?.message || '', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch = apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apt.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || apt.status === filterStatus;
    const matchesDept = filterDept === "all" || apt.department === filterDept;
    return matchesSearch && matchesStatus && matchesDept;
  });

  const todayAppointments = filteredAppointments.filter((apt) => {
    const today = new Date().toLocaleDateString();
    const aptDate = new Date(apt.time).toLocaleDateString();
    return today === aptDate;
  });

  const upcomingAppointments = filteredAppointments.filter((apt) => {
    return new Date(apt.time) > new Date() && apt.status !== "cancelled";
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-muted";
    }
  };

  return (
    <DashboardLayout title="Appointments Management">
      <div className="space-y-6 animate-fade-in">
        {/* Header & Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{appointments.length}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{appointments.filter((a) => a.status === "confirmed").length}</div>
                <div className="text-sm text-muted-foreground">Confirmed</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">{appointments.filter((a) => a.status === "pending").length}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{todayAppointments.length}</div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <div className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search patient name, doctor, or appointment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-background"
            >
              <option value="all">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Today's Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalIcon className="w-5 h-5" />
              Today's Schedule ({todayAppointments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : todayAppointments.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No appointments scheduled for today</div>
            ) : (
              todayAppointments.map((apt: any) => (
                <AppointmentCard
                  key={apt.id}
                  appointment={apt}
                  onUpdated={loadAppointments}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                />
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.filter((a) => {
              const today = new Date().toLocaleDateString();
              const aptDate = new Date(a.time).toLocaleDateString();
              return today !== aptDate;
            }).length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No upcoming appointments</div>
            ) : (
              upcomingAppointments
                .filter((a) => {
                  const today = new Date().toLocaleDateString();
                  const aptDate = new Date(a.time).toLocaleDateString();
                  return today !== aptDate;
                })
                .slice(0, 20)
                .map((apt: any) => (
                  <AppointmentCard
                    key={apt.id}
                    appointment={apt}
                    onUpdated={loadAppointments}
                    getStatusIcon={getStatusIcon}
                    getStatusColor={getStatusColor}
                  />
                ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

interface AppointmentCardProps {
  appointment: any;
  onUpdated: () => void;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusColor: (status: string) => string;
}

function AppointmentCard({ appointment, onUpdated, getStatusIcon, getStatusColor }: AppointmentCardProps) {
  const { toast } = useToast();
  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleConfirm = async () => {
    try {
      setConfirming(true);
      await confirmAppointment(appointment.id);
      toast({ title: 'Appointment confirmed' });
      onUpdated();
    } catch (err: any) {
      toast({ title: 'Failed to confirm', description: err?.message || '', variant: 'destructive' });
    } finally {
      setConfirming(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      setCancelling(true);
      await cancelAppointment(appointment.id);
      toast({ title: 'Appointment cancelled' });
      onUpdated();
    } catch (err: any) {
      toast({ title: 'Failed to cancel', description: err?.message || '', variant: 'destructive' });
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border-2 transition-all ${
      appointment.status === "confirmed"
        ? "bg-green-50 border-green-200"
        : appointment.status === "pending"
          ? "bg-amber-50 border-amber-200"
          : "bg-red-50 border-red-200"
    }`}>
      <div className="flex items-start gap-4 flex-1">
        {getStatusIcon(appointment.status)}
        <div className="flex-1">
          <div className="font-medium text-lg">{appointment.patientName || appointment.patientId}</div>
          <div className="text-sm text-muted-foreground">{appointment.doctorName || appointment.department}</div>
          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
            <span>📅 {new Date(appointment.time).toLocaleDateString()}</span>
            <span>🕐 {new Date(appointment.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {appointment.type && <span>📋 {appointment.type}</span>}
            {appointment.department && <span>🏥 {appointment.department}</span>}
            {appointment.queue_number && <span>🎟️ {appointment.queue_number}</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 md:mt-0 ml-auto flex-wrap">
        <Badge className={getStatusColor(appointment.status)}>
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </Badge>
        
        {appointment.status === "pending" && (
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={confirming}
            className="bg-green-600 hover:bg-green-700"
          >
            {confirming ? 'Confirming...' : 'Confirm'}
          </Button>
        )}

        {appointment.status !== "cancelled" && appointment.status !== "completed" && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleCancel}
            disabled={cancelling}
          >
            {cancelling ? 'Cancelling...' : 'Cancel'}
          </Button>
        )}
      </div>
    </div>
  );
}

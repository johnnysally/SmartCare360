import PatientLayout from "@/components/PatientLayout";
import BookAppointmentDialog from "@/components/BookAppointmentDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, MapPin, Clock, Plus, Trash2, Calendar as CalendarIcon, CheckCircle, AlertCircle, XCircle, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  getPatientAppointments,
  rescheduleAppointment,
  cancelAppointment,
  deleteAppointment,
  checkInPatient,
} from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

const MyAppointments = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [openBookDialog, setOpenBookDialog] = useState(false);
  const [openRescheduleDialog, setOpenRescheduleDialog] = useState(false);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      if (user?.id) {
        const data = await getPatientAppointments(user.id);
        setAppointments(data || []);
      }
    } catch (err: any) {
      toast({ title: "Failed to load appointments", description: err?.message || "", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!newDate || !newTime) {
      toast({ title: "Please select date and time", variant: "destructive" });
      return;
    }

    try {
      setRescheduling(true);
      const newDateTime = new Date(`${newDate}T${newTime}`).toISOString();
      await rescheduleAppointment(selectedAppointment.id, newDateTime);
      toast({ title: "Appointment rescheduled successfully" });
      setOpenRescheduleDialog(false);
      setNewDate("");
      setNewTime("");
      loadAppointments();
    } catch (err: any) {
      toast({ title: "Failed to reschedule", description: err?.message || "", variant: "destructive" });
    } finally {
      setRescheduling(false);
    }
  };

  const handleCancel = async (appointmentId: string) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await cancelAppointment(appointmentId);
      toast({ title: "Appointment cancelled" });
      loadAppointments();
    } catch (err: any) {
      toast({ title: "Failed to cancel", description: err?.message || "", variant: "destructive" });
    }
  };

  const handleDelete = async (appointmentId: string) => {
    if (!window.confirm("This will permanently delete the appointment. Continue?")) return;

    try {
      await deleteAppointment(appointmentId);
      toast({ title: "Appointment deleted" });
      loadAppointments();
    } catch (err: any) {
      toast({ title: "Failed to delete", description: err?.message || "", variant: "destructive" });
    }
  };

  const handleCheckIn = async (appointment: any) => {
    try {
      const queueEntry = await checkInPatient({
        patientId: user?.id,
        patientName: appointment.patientName || user?.name,
        phone: appointment.phone || user?.phone,
        department: appointment.department,
        priority: appointment.priority || 3,
      });
      toast({
        title: "Checked in successfully!",
        description: `Your queue number: ${queueEntry.queue_number}`,
      });
      loadAppointments();
    } catch (err: any) {
      toast({ title: "Failed to check in", description: err?.message || "", variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 border-green-200";
      case "pending":
        return "bg-amber-50 border-amber-200";
      case "cancelled":
        return "bg-red-50 border-red-200";
      case "completed":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-muted/50";
    }
  };

  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.time);
    return (
      new Date(apt.time) > new Date() &&
      apt.status !== "cancelled"
    );
  });

  const pastAppointments = appointments.filter((apt) => {
    return (
      new Date(apt.time) <= new Date() ||
      apt.status === "cancelled"
    );
  });

  return (
    <PatientLayout title="My Appointments">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium">Manage your healthcare appointments</h2>
            <p className="text-sm text-muted-foreground">Book new appointments or view your schedule</p>
          </div>
          <Button onClick={() => setOpenBookDialog(true)} className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Book Appointment
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{upcomingAppointments.length}</div>
                <div className="text-sm text-muted-foreground">Upcoming</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{appointments.filter((a) => a.status === "completed").length}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
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
        </div>

        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Upcoming Appointments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading appointments...</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="py-12 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button onClick={() => setOpenBookDialog(true)} className="btn-gradient">
                  <Plus className="w-4 h-4 mr-2" />
                  Book Your First Appointment
                </Button>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border-2 transition-all ${getStatusColor(apt.status)}`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="mt-1">{getStatusIcon(apt.status)}</div>
                    <div className="flex-1">
                      <div className="font-medium text-lg">{apt.doctorName || "Appointment with " + apt.department}</div>
                      <div className="text-sm text-muted-foreground">{apt.department}</div>
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(apt.time).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(apt.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {apt.type === "Telemedicine" && (
                          <span className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            {apt.type}
                          </span>
                        )}
                        {apt.type === "In-person" && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            SmartCare Clinic
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 md:mt-0 ml-auto">
                    <Badge
                      variant={
                        apt.status === "confirmed"
                          ? "default"
                          : apt.status === "pending"
                            ? "secondary"
                            : "destructive"
                      }
                      className={apt.status === "confirmed" ? "bg-green-600" : ""}
                    >
                      {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                    </Badge>

                    {apt.status === "confirmed" && (
                      <>
                        {apt.type === "Telemedicine" && (
                          <Button size="sm" className="btn-gradient">
                            <Video className="w-4 h-4 mr-1" />
                            Join Call
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setOpenRescheduleDialog(true);
                          }}
                        >
                          <RefreshCw className="w-4 h-4 mr-1" />
                          Reschedule
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancel(apt.id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </>
                    )}

                    {apt.status === "pending" && (
                      <>
                        <Button
                          size="sm"
                          className="btn-gradient"
                          onClick={() => handleCheckIn(apt)}
                        >
                          Check In to Queue
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setOpenRescheduleDialog(true);
                          }}
                        >
                          Reschedule
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Past Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pastAppointments.map((apt) => (
                  <div key={apt.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${getStatusColor(apt.status)}`}>
                    <div className="flex items-center gap-3 flex-1">
                      {getStatusIcon(apt.status)}
                      <div>
                        <div className="font-medium">{apt.doctorName || apt.department}</div>
                        <div className="text-sm text-muted-foreground">
                          {apt.type} • {new Date(apt.time).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{apt.status}</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(apt.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Book Appointment Dialog */}
      <BookAppointmentDialog
        open={openBookDialog}
        onOpenChange={setOpenBookDialog}
        patientId={user?.id || ""}
        patientName={user?.name || ""}
        patientPhone={user?.phone || ""}
        onAppointmentCreated={(apt) => {
          loadAppointments();
        }}
      />

      {/* Reschedule Dialog */}
      <Dialog open={openRescheduleDialog} onOpenChange={setOpenRescheduleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">New Date</label>
              <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} min={new Date().toISOString().split("T")[0]} />
            </div>
            <div>
              <label className="text-sm font-medium">New Time</label>
              <Input type="time" value={newTime} onChange={(e) => setNewTime(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenRescheduleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={rescheduling} className="btn-gradient">
              {rescheduling ? "Rescheduling..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
};

export default MyAppointments;

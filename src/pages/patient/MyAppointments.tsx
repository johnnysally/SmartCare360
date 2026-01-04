import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Video, MapPin, Clock, Plus } from "lucide-react";

const appointments = [
  { doctor: "Dr. Otieno", specialty: "General Practitioner", date: "Jan 5, 2026", time: "10:00 AM", type: "In-person", location: "SmartCare Clinic, Nairobi", status: "Confirmed" },
  { doctor: "Dr. Mwangi", specialty: "Cardiologist", date: "Jan 12, 2026", time: "02:30 PM", type: "Telemedicine", location: "Video Call", status: "Confirmed" },
  { doctor: "Dr. Wanjiru", specialty: "Dermatologist", date: "Jan 20, 2026", time: "11:00 AM", type: "In-person", location: "SmartCare Clinic, Nairobi", status: "Pending" },
];

const pastAppointments = [
  { doctor: "Dr. Otieno", specialty: "General Practitioner", date: "Dec 20, 2025", type: "Check-up", status: "Completed" },
  { doctor: "Dr. Mwangi", specialty: "Cardiologist", date: "Dec 5, 2025", type: "Follow-up", status: "Completed" },
];

const MyAppointments = () => (
  <PatientLayout title="My Appointments">
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Manage your healthcare appointments</h2>
          <p className="text-sm text-muted-foreground">Book new appointments or view your schedule</p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Button>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.map((apt, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  {apt.type === "Telemedicine" ? <Video className="w-7 h-7 text-primary" /> : <MapPin className="w-7 h-7 text-primary" />}
                </div>
                <div>
                  <div className="font-medium text-lg">{apt.doctor}</div>
                  <div className="text-sm text-muted-foreground">{apt.specialty}</div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {apt.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {apt.time}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Badge variant={apt.status === "Confirmed" ? "default" : "secondary"} className={apt.status === "Confirmed" ? "bg-success" : ""}>
                  {apt.status}
                </Badge>
                {apt.type === "Telemedicine" && apt.status === "Confirmed" && (
                  <Button size="sm" className="btn-gradient">
                    <Video className="w-4 h-4 mr-1" />
                    Join Call
                  </Button>
                )}
                <Button size="sm" variant="outline">Reschedule</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Past Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastAppointments.map((apt, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border opacity-75">
                <div>
                  <div className="font-medium">{apt.doctor}</div>
                  <div className="text-sm text-muted-foreground">{apt.specialty} • {apt.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{apt.date}</div>
                  <Badge variant="outline">{apt.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </PatientLayout>
);

export default MyAppointments;

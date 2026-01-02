import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarDays,
  Clock,
  Plus,
  ChevronLeft,
  ChevronRight,
  User,
  Video,
  MapPin,
} from "lucide-react";
import { useState } from "react";

const timeSlots = [
  { time: "08:00 AM", appointment: null },
  { time: "09:00 AM", appointment: { patient: "Grace Njeri", type: "Follow-up", mode: "in-person" } },
  { time: "10:00 AM", appointment: { patient: "James Mwangi", type: "Consultation", mode: "video" } },
  { time: "11:00 AM", appointment: { patient: "Mary Wambui", type: "Check-up", mode: "in-person" } },
  { time: "12:00 PM", appointment: null },
  { time: "01:00 PM", appointment: null },
  { time: "02:00 PM", appointment: { patient: "Peter Ochieng", type: "Lab Review", mode: "video" } },
  { time: "03:00 PM", appointment: { patient: "Alice Kimani", type: "Prescription Refill", mode: "in-person" } },
  { time: "04:00 PM", appointment: null },
  { time: "05:00 PM", appointment: { patient: "John Otieno", type: "Follow-up", mode: "in-person" } },
];

const upcomingDays = [
  { day: "Mon", date: 6, appointments: 4 },
  { day: "Tue", date: 7, appointments: 6 },
  { day: "Wed", date: 8, appointments: 3 },
  { day: "Thu", date: 9, appointments: 5 },
  { day: "Fri", date: 10, appointments: 2 },
];

const Schedule = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <DoctorLayout title="Schedule">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-lg font-semibold">January 2026</h2>
            <Button variant="outline" size="icon">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Block Time
          </Button>
        </div>

        {/* Quick Week View */}
        <div className="grid grid-cols-5 gap-3">
          {upcomingDays.map((day, i) => (
            <Card
              key={i}
              className={`cursor-pointer transition-all hover:border-primary ${
                i === 1 ? "border-primary bg-primary/5" : ""
              }`}
            >
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{day.day}</p>
                <p className="text-2xl font-bold font-display">{day.date}</p>
                <Badge variant="secondary" className="mt-2">
                  {day.appointments} appts
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
              />
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Appointments</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-muted" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full bg-destructive/50" />
                  <span>Blocked</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Day Schedule */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Today's Schedule - January 7, 2026
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {timeSlots.map((slot, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 p-3 rounded-lg border ${
                    slot.appointment
                      ? "bg-card hover:bg-muted/50"
                      : "bg-muted/30 border-dashed"
                  } transition-colors`}
                >
                  <div className="w-20 text-sm font-medium text-muted-foreground">
                    {slot.time}
                  </div>

                  {slot.appointment ? (
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{slot.appointment.patient}</p>
                          <p className="text-sm text-muted-foreground">
                            {slot.appointment.type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            slot.appointment.mode === "video" ? "default" : "secondary"
                          }
                          className="flex items-center gap-1"
                        >
                          {slot.appointment.mode === "video" ? (
                            <Video className="w-3 h-3" />
                          ) : (
                            <MapPin className="w-3 h-3" />
                          )}
                          {slot.appointment.mode === "video" ? "Video" : "In-person"}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                      <span className="text-sm">Available</span>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Schedule;

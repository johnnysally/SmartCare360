import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Calendar, Clock, CheckCircle2, Phone } from "lucide-react";

const upcomingSessions = [
  { doctor: "Dr. Mwangi", specialty: "Cardiologist", date: "Jan 12, 2026", time: "02:30 PM", status: "Scheduled" },
];

const pastSessions = [
  { doctor: "Dr. Otieno", specialty: "General Practitioner", date: "Dec 20, 2025", duration: "25 min", status: "Completed" },
  { doctor: "Dr. Wanjiru", specialty: "Dermatologist", date: "Nov 15, 2025", duration: "20 min", status: "Completed" },
];

const PatientTelemedicine = () => (
  <PatientLayout title="Telemedicine">
    <div className="space-y-6 animate-fade-in">
      {/* Quick Actions */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-info/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-display">Virtual Consultations</h2>
              <p className="text-muted-foreground mt-1">Connect with your doctors from anywhere</p>
            </div>
            <div className="flex gap-3">
              <Button className="btn-gradient">
                <Video className="w-4 h-4 mr-2" />
                Start Consultation
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              {upcomingSessions.map((session, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{session.doctor}</div>
                      <div className="text-sm text-muted-foreground">{session.specialty}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="font-medium">{session.date}</div>
                      <div className="text-sm text-muted-foreground">{session.time}</div>
                    </div>
                    <Button className="btn-gradient">
                      <Video className="w-4 h-4 mr-2" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming sessions scheduled
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-muted-foreground" />
            Past Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastSessions.map((session, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border opacity-75">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success" />
                  <div>
                    <div className="font-medium">{session.doctor}</div>
                    <div className="text-sm text-muted-foreground">{session.specialty}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{session.date}</div>
                  <div className="text-xs text-muted-foreground">{session.duration}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </PatientLayout>
);

export default PatientTelemedicine;

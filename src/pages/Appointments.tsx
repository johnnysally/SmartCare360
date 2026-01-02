import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalIcon } from "lucide-react";

const appointments = [
  { time: "09:00 AM", patient: "Mary Wanjiku", type: "Check-up", doctor: "Dr. Otieno", status: "Confirmed" },
  { time: "10:30 AM", patient: "John Omondi", type: "Follow-up", doctor: "Dr. Mwangi", status: "Confirmed" },
  { time: "11:00 AM", patient: "Fatima Hassan", type: "Consultation", doctor: "Dr. Otieno", status: "Pending" },
  { time: "02:00 PM", patient: "Peter Kamau", type: "Lab Results", doctor: "Dr. Wanjiru", status: "Confirmed" },
];

const Appointments = () => (
  <DashboardLayout title="Appointments">
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalIcon className="w-5 h-5" />
          <span>Today, January 2, 2026</span>
        </div>
        <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />New Appointment</Button>
      </div>
      
      <Card>
        <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {appointments.map((apt, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{apt.time.split(" ")[0]}</div>
                  <div className="text-xs text-muted-foreground">{apt.time.split(" ")[1]}</div>
                </div>
                <div>
                  <div className="font-medium">{apt.patient}</div>
                  <div className="text-sm text-muted-foreground">{apt.type} • {apt.doctor}</div>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${apt.status === "Confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{apt.status}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Appointments;

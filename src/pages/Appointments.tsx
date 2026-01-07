import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAppointments();
        if (mounted) setAppointments(data || []);
      } catch (err: any) {
        toast({ title: 'Failed to load appointments', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <DashboardLayout title="Appointments">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalIcon className="w-5 h-5" />
            <span>Today</span>
          </div>
          <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />New Appointment</Button>
        </div>
        
        <Card>
          <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : (
              appointments.map((apt: any) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{new Date(apt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div>
                      <div className="font-medium">{apt.patientId || apt.patient || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{apt.type || 'Appointment'}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${apt.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{apt.status}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

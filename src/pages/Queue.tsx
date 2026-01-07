import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Queue = () => {
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
        toast({ title: 'Failed to load queue', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const inQueue = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending');
  const servedToday = appointments.length; // simple proxy
  const avgWait = Math.round((inQueue.length ? 15 : 0));

  return (
    <DashboardLayout title="Queue Management">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display">{inQueue.length}</div>
              <div className="text-primary-foreground/80">In Queue</div>
            </CardContent>
          </Card>
          <Card><CardContent className="p-6 text-center">
            <div className="text-4xl font-bold font-display text-info">~{avgWait}</div>
            <div className="text-muted-foreground">Avg Wait (min)</div>
          </CardContent></Card>
          <Card><CardContent className="p-6 text-center">
            <div className="text-4xl font-bold font-display text-success">{servedToday}</div>
            <div className="text-muted-foreground">Served Today</div>
          </CardContent></Card>
        </div>

        <Card>
          <CardHeader><CardTitle>Current Queue</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : (
              inQueue.map((p, idx) => (
                <div key={p.id || idx} className={`flex items-center justify-between p-4 rounded-lg border ${idx === 0 ? "border-primary bg-primary/5" : ""}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{idx + 1}</div>
                    <div>
                      <div className="font-medium">{p.patientId || p.patient || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" />{p.time ? new Date(p.time).toLocaleTimeString() : ''} • {p.type || ''}</div>
                    </div>
                  </div>
                  <Button size="sm" variant={idx === 0 ? "default" : "outline"} className={idx === 0 ? "btn-gradient" : ""}>
                    <UserCheck className="w-4 h-4 mr-1" />Call
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Queue;

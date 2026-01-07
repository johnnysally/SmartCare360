import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, Phone, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Telemedicine = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const appts = await getAppointments();
        // Treat appointments with type containing 'tele' or 'video' as telemedicine
        const tele = (appts || []).filter((a: any) => (a.type || '').toLowerCase().includes('tele') || (a.type || '').toLowerCase().includes('video'));
        if (mounted) setSessions(tele);
      } catch (err: any) {
        toast({ title: 'Failed to load telemedicine sessions', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <DashboardLayout title="Telemedicine">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-6 text-center">
            <div className="text-4xl font-bold font-display text-primary">{sessions.length}</div>
            <div className="text-muted-foreground">Upcoming Sessions</div>
          </CardContent></Card>
          <Card><CardContent className="p-6 text-center">
            <div className="text-4xl font-bold font-display text-success">{sessions.length > 0 ? sessions.length : 0}</div>
            <div className="text-muted-foreground">Completed Today</div>
          </CardContent></Card>
          <Card><CardContent className="p-6 text-center">
            <div className="text-4xl font-bold font-display text-info">~15 min</div>
            <div className="text-muted-foreground">Avg Duration</div>
          </CardContent></Card>
        </div>

        <Button className="btn-gradient"><Video className="w-4 h-4 mr-2" />Start New Session</Button>

        <Card>
          <CardHeader><CardTitle>Today's Sessions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : (
              sessions.map((s: any, i: number) => (
                <div key={s.id || i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">{s.patientId || s.patient || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" />{s.time ? new Date(s.time).toLocaleTimeString() : ''} • {s.type || 'Telemedicine'}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"><Phone className="w-4 h-4" /></Button>
                    <Button size="sm" className="btn-gradient"><Video className="w-4 h-4 mr-1" />Join</Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Telemedicine;

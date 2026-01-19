import LabLayout from "@/components/LabLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  TestTubes, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Beaker,
  UserCheck,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { getAllQueues, callNextPatient, completeService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { label: "Pending Tests", value: "24", icon: Clock, change: "+3 today", color: "text-warning" },
  { label: "In Progress", value: "12", icon: Beaker, change: "Active now", color: "text-info" },
  { label: "Completed Today", value: "47", icon: CheckCircle2, change: "+8 from yesterday", color: "text-success" },
  { label: "Critical Results", value: "3", icon: AlertTriangle, change: "Needs attention", color: "text-destructive" },
];

const LabDashboard = () => {
  const [allQueues, setAllQueues] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadQueues = async () => {
    try {
      const queuesData = await getAllQueues();
      setAllQueues(queuesData || {});
    } catch (err: any) {
      toast({ title: 'Failed to load queues', description: err?.message || '', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await loadQueues();
    })();
    
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      if (mounted) loadQueues();
    }, 10000);

    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCallNext = async () => {
    try {
      await callNextPatient('Laboratory', 'lab-tech-001');
      toast({ title: 'Patient called', description: 'Next patient has been called' });
      await loadQueues();
    } catch (err: any) {
      toast({ title: 'Error calling patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleCompleteService = async (queueId: string) => {
    try {
      await completeService(queueId);
      toast({ title: 'Service completed', description: 'Patient marked as served' });
      await loadQueues();
    } catch (err: any) {
      toast({ title: 'Error completing service', description: err?.message || '', variant: 'destructive' });
    }
  };

  const currentQueue = allQueues['Laboratory'] || [];
  const waitingPatients = currentQueue.filter((p: any) => p.status === 'waiting');
  const servingPatients = currentQueue.filter((p: any) => p.status === 'serving');
  const completedPatients = currentQueue.filter((p: any) => p.status === 'completed');

  return (
    <LabLayout title="Laboratory Dashboard">
      <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Laboratory Queue */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-info" />
              Laboratory Queue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">Loading queue...</div>
            ) : currentQueue.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No patients in queue</div>
            ) : (
              <div className="space-y-4">
                {/* Call Next Button */}
                {waitingPatients.length > 0 && (
                  <Button 
                    onClick={handleCallNext} 
                    className="w-full btn-gradient mb-4"
                    size="lg"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Call Next Patient ({waitingPatients.length} waiting)
                  </Button>
                )}

                {/* Now Serving - Current Patient */}
                {servingPatients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple-700 text-sm">Now Serving</h4>
                    {servingPatients.map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">🔔</div>
                          <div className="flex-1">
                            <div className="font-semibold">{p.patient_name}</div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              Queue #{p.queue_number}
                            </div>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="btn-gradient"
                          onClick={() => handleCompleteService(p.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Waiting Patients Queue */}
                {waitingPatients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-700 text-sm">Waiting ({waitingPatients.length})</h4>
                    {waitingPatients.slice(0, 5).map((p: any, idx: number) => (
                      <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${idx === 0 ? "border-primary bg-primary/5" : "border-yellow-200 bg-yellow-50"}`}>
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-sm">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{p.patient_name}</div>
                            <div className="text-xs text-muted-foreground">Queue #{p.queue_number}</div>
                          </div>
                        </div>
                        {p.priority && <Badge variant="outline" className="text-xs">P{p.priority}</Badge>}
                      </div>
                    ))}
                    {waitingPatients.length > 5 && (
                      <div className="text-xs text-muted-foreground text-center p-2">
                        +{waitingPatients.length - 5} more waiting
                      </div>
                    )}
                  </div>
                )}

                {/* Completed Patients */}
                {completedPatients.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-green-700 text-sm">Completed Today ({completedPatients.length})</h4>
                    {completedPatients.slice(0, 2).map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border-2 border-green-200 bg-green-50">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm">✓</div>
                          <div className="flex-1">
                            <div className="font-semibold text-sm">{p.patient_name}</div>
                            <div className="text-xs text-muted-foreground">Queue #{p.queue_number}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start btn-gradient" size="lg">
              <TestTubes className="w-5 h-5 mr-3" />
              New Sample Entry
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <FlaskConical className="w-5 h-5 mr-3" />
              Enter Results
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <CheckCircle2 className="w-5 h-5 mr-3" />
              Verify Results
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <AlertTriangle className="w-5 h-5 mr-3" />
              View Critical Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </LabLayout>
  );
};

export default LabDashboard;

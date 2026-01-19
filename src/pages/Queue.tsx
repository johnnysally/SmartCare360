import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, Clock, CheckCircle, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllQueues, callNextPatient, completeService, removeFromQueue } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Queue = () => {
  const [allQueues, setAllQueues] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('OPD');
  const { toast } = useToast();

  const departments = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];

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
      await callNextPatient(activeTab, 'staff-001');
      toast({ title: 'Patient called', description: `Next patient from ${activeTab} has been called` });
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

  const handleRemoveFromQueue = async (queueId: string) => {
    try {
      await removeFromQueue(queueId);
      toast({ title: 'Patient removed', description: 'Patient has been removed from queue' });
      await loadQueues();
    } catch (err: any) {
      toast({ title: 'Error removing patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const currentQueue = allQueues[activeTab] || [];
  const waitingPatients = currentQueue.filter((p: any) => p.status === 'waiting');
  const servingPatients = currentQueue.filter((p: any) => p.status === 'serving');
  const completedPatients = currentQueue.filter((p: any) => p.status === 'completed');

  const totalWaiting = Object.values(allQueues).reduce((sum: number, dept: any) => sum + (dept.filter((p: any) => p.status === 'waiting').length || 0), 0);
  const totalServing = Object.values(allQueues).reduce((sum: number, dept: any) => sum + (dept.filter((p: any) => p.status === 'serving').length || 0), 0);
  const totalCompleted = Object.values(allQueues).reduce((sum: number, dept: any) => sum + (dept.filter((p: any) => p.status === 'completed').length || 0), 0);

  return (
    <DashboardLayout title="Queue Management">
      <div className="space-y-6 animate-fade-in">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-yellow-700">{totalWaiting}</div>
              <div className="text-sm text-yellow-700 font-medium">Waiting</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-purple-700">{totalServing}</div>
              <div className="text-sm text-purple-700 font-medium">Now Serving</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-green-700">{totalCompleted}</div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Department Tabs */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Department Queues</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadQueues()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Department selector */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
              {departments.map(dept => (
                <Button
                  key={dept}
                  variant={activeTab === dept ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setActiveTab(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>

            {/* Current Department Queue */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{activeTab} Queue</h3>

              {loading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading queue...</div>
              ) : currentQueue.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No patients in {activeTab} queue</div>
              ) : (
                <>
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

                  {/* Waiting Patients */}
                  {waitingPatients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-700 text-sm">Waiting ({waitingPatients.length})</h4>
                      {waitingPatients.map((p: any, idx: number) => (
                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${idx === 0 ? "border-primary bg-primary/5" : "border-yellow-200 bg-yellow-50"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-sm">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.patient_name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <Clock className="w-3 h-3" />
                                {p.queue_number} • {new Date(p.arrival_time).toLocaleTimeString()}
                              </div>
                            </div>
                            {p.priority && <Badge variant="outline" className="text-xs">P{p.priority}</Badge>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Serving Patients */}
                  {servingPatients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-purple-700 text-sm">Now Serving ({servingPatients.length})</h4>
                      {servingPatients.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border-2 border-purple-200 bg-purple-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white text-sm">🔔</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.patient_name}</div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                {p.queue_number} • {new Date(p.call_time).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            className="btn-gradient"
                            onClick={() => handleCompleteService(p.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Completed Patients */}
                  {completedPatients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-700 text-sm">Completed ({completedPatients.length})</h4>
                      {completedPatients.slice(0, 3).map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border-2 border-green-200 bg-green-50">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white text-sm">✓</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.patient_name}</div>
                              <div className="text-xs text-muted-foreground">{p.queue_number}</div>
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => handleRemoveFromQueue(p.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                      {completedPatients.length > 3 && (
                        <div className="text-xs text-muted-foreground text-center p-2">
                          +{completedPatients.length - 3} more completed
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Queue;

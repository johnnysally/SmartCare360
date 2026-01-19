import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserCheck, Clock, CheckCircle, SkipForward, Trash2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { getQueue, getQueueStats, callNextPatient, completeAppointment, skipPatient, removeFromQueue } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Queue = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ waiting: 0, serving: 0, completed: 0, skipped: 0, total: 0, avg_wait_minutes: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('waiting');
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [skipReason, setSkipReason] = useState('');
  const { toast } = useToast();

  const loadQueue = async () => {
    try {
      const [queueData, statsData] = await Promise.all([getQueue(), getQueueStats()]);
      setAppointments(queueData || []);
      setStats(statsData || { waiting: 0, serving: 0, completed: 0, skipped: 0, total: 0, avg_wait_minutes: 0 });
    } catch (err: any) {
      toast({ title: 'Failed to load queue', description: err?.message || '', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (mounted) await loadQueue();
    })();
    
    // Refresh every 10 seconds for real-time updates
    const interval = setInterval(() => {
      if (mounted) loadQueue();
    }, 10000);

    return () => { 
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleCallNext = async () => {
    try {
      const called = await callNextPatient();
      setAppointments(prev => prev.map(a => a.id === called.id ? called : a));
      toast({ title: 'Patient called', description: `${called.patientId} has been called` });
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error calling patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleCompleteAppointment = async (id: string) => {
    try {
      const completed = await completeAppointment(id);
      setAppointments(prev => prev.map(a => a.id === completed.id ? completed : a));
      toast({ title: 'Appointment completed', description: 'Patient marked as served' });
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error completing appointment', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleSkipPatient = async () => {
    if (!selectedAppointment) return;
    try {
      const skipped = await skipPatient(selectedAppointment.id, skipReason);
      setAppointments(prev => prev.map(a => a.id === skipped.id ? skipped : a));
      toast({ title: 'Patient skipped', description: skipReason || 'Patient has been skipped' });
      setShowSkipDialog(false);
      setSkipReason('');
      setSelectedAppointment(null);
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error skipping patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleRemoveFromQueue = async (id: string) => {
    try {
      await removeFromQueue(id);
      setAppointments(prev => prev.filter(a => a.id !== id));
      toast({ title: 'Patient removed', description: 'Appointment has been removed from queue' });
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error removing patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const getFilteredAppointments = () => {
    const statusMap: Record<string, string> = {
      waiting: 'pending',
      serving: 'in-progress',
      completed: 'completed',
      skipped: 'skipped'
    };
    
    const status = statusMap[activeTab] || 'pending';
    if (activeTab === 'waiting') {
      return appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
    }
    return appointments.filter(a => a.status === status);
  };

  const filteredAppointments = getFilteredAppointments();
  const currentServing = appointments.find(a => a.status === 'in-progress');

  const getStatusBadgeColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-purple-100 text-purple-800',
      'completed': 'bg-green-100 text-green-800',
      'skipped': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout title="Queue Management">
      <div className="space-y-6 animate-fade-in">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-yellow-700">{stats.waiting}</div>
              <div className="text-sm text-yellow-700 font-medium">Waiting</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-purple-700">{stats.serving}</div>
              <div className="text-sm text-purple-700 font-medium">Now Serving</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-green-700">{stats.completed}</div>
              <div className="text-sm text-green-700 font-medium">Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-red-700">{stats.skipped}</div>
              <div className="text-sm text-red-700 font-medium">Skipped</div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6 text-center">
              <div className="text-4xl font-bold font-display text-blue-700">~{stats.avg_wait_minutes}</div>
              <div className="text-sm text-blue-700 font-medium">Avg Wait (min)</div>
            </CardContent>
          </Card>
        </div>

        {/* Current Serving */}
        {currentServing && (
          <Card className="border-2 border-purple-300 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-purple-700 flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Now Serving
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg">
                    👥
                  </div>
                  <div>
                    <div className="font-bold text-lg">{currentServing.patientId}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {currentServing.time ? new Date(currentServing.time).toLocaleTimeString() : 'No time'} • {currentServing.type || 'General'}
                    </div>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="btn-gradient" 
                  onClick={() => handleCompleteAppointment(currentServing.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Complete
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for different queue states */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Queue Overview</CardTitle>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => loadQueue()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="waiting" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Waiting</span>
                  <Badge variant="secondary" className="ml-1">{stats.waiting}</Badge>
                </TabsTrigger>
                <TabsTrigger value="serving" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Serving</span>
                  <Badge variant="secondary" className="ml-1">{stats.serving}</Badge>
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Completed</span>
                  <Badge variant="secondary" className="ml-1">{stats.completed}</Badge>
                </TabsTrigger>
                <TabsTrigger value="skipped" className="flex items-center gap-2">
                  <span className="hidden sm:inline">Skipped</span>
                  <Badge variant="secondary" className="ml-1">{stats.skipped}</Badge>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="waiting" className="space-y-3 mt-4">
                {loading ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">Loading queue...</div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No patients waiting</div>
                ) : (
                  <>
                    {filteredAppointments.length > 0 && (
                      <Button 
                        onClick={handleCallNext} 
                        className="w-full btn-gradient mb-4"
                        size="lg"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Call Next Patient
                      </Button>
                    )}
                    {filteredAppointments.map((p, idx) => (
                      <div key={p.id || idx} className={`flex items-center justify-between p-4 rounded-lg border-2 ${idx === 0 ? "border-primary bg-primary/5" : "border-gray-200"}`}>
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700">{idx + 1}</div>
                          <div className="flex-1">
                            <div className="font-semibold">{p.patientId || 'Unknown'}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                              <Clock className="w-3 h-3" />
                              {p.time ? new Date(p.time).toLocaleTimeString() : 'No time'} • {p.type || 'General'}
                            </div>
                          </div>
                          <Badge className={getStatusBadgeColor(p.status)}>{p.status}</Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => {
                              setSelectedAppointment(p);
                              setShowSkipDialog(true);
                            }}
                          >
                            <SkipForward className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="serving" className="space-y-3 mt-4">
                {filteredAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No patients being served</div>
                ) : (
                  filteredAppointments.map((p, idx) => (
                    <div key={p.id || idx} className="flex items-center justify-between p-4 rounded-lg border-2 border-purple-200 bg-purple-50">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">{idx + 1}</div>
                        <div className="flex-1">
                          <div className="font-semibold">{p.patientId || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {p.called_at ? new Date(p.called_at).toLocaleTimeString() : 'Just called'}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="btn-gradient"
                        onClick={() => handleCompleteAppointment(p.id)}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3 mt-4">
                {filteredAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No completed appointments</div>
                ) : (
                  filteredAppointments.map((p, idx) => (
                    <div key={p.id || idx} className="flex items-center justify-between p-4 rounded-lg border-2 border-green-200 bg-green-50">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-white">✓</div>
                        <div className="flex-1">
                          <div className="font-semibold">{p.patientId || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="w-3 h-3" />
                            {p.completed_at ? new Date(p.completed_at).toLocaleTimeString() : 'Completed'}
                          </div>
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
                  ))
                )}
              </TabsContent>

              <TabsContent value="skipped" className="space-y-3 mt-4">
                {filteredAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">No skipped patients</div>
                ) : (
                  filteredAppointments.map((p, idx) => (
                    <div key={p.id || idx} className="flex items-center justify-between p-4 rounded-lg border-2 border-red-200 bg-red-50">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center font-bold text-white">✕</div>
                        <div className="flex-1">
                          <div className="font-semibold">{p.patientId || 'Unknown'}</div>
                          <div className="text-sm text-muted-foreground">
                            {p.skip_reason || 'Patient skipped'}
                          </div>
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
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Skip Dialog */}
      <AlertDialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Skip Patient?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to skip {selectedAppointment?.patientId}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3">
            <input
              type="text"
              placeholder="Reason for skipping (optional)"
              value={skipReason}
              onChange={(e) => setSkipReason(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleSkipPatient}
              className="bg-red-600 hover:bg-red-700"
            >
              Skip Patient
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default Queue;

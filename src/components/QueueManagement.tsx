import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { UserCheck, Clock, CheckCircle, SkipForward, Trash2, RefreshCw, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getQueue, getQueueStats, callNextPatient, completeAppointment, skipPatient, removeFromQueue } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface QueueManagementProps {
  compact?: boolean;
  showActions?: boolean;
  maxItems?: number;
}

export const QueueManagement = ({ compact = false, showActions = true, maxItems = 5 }: QueueManagementProps) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState({ waiting: 0, serving: 0, completed: 0, skipped: 0, total: 0, avg_wait_minutes: 0 });
  const [loading, setLoading] = useState(true);
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
      const called = await callNextPatient('OPD', 'staff-001');
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

  const waitingPatients = appointments.filter(a => ['pending', 'confirmed'].includes(a.status));
  const servingPatient = appointments.find(a => a.status === 'in-progress');
  const displayPatients = waitingPatients.slice(0, maxItems);

  if (compact) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Queue Status</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800 border-yellow-200">{stats.waiting} Waiting</Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-800 border-purple-200">{stats.serving} Serving</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <div className="text-sm text-muted-foreground text-center py-4">Loading...</div>
          ) : servingPatient ? (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="text-sm font-semibold text-purple-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Now: {servingPatient.patientId}
              </div>
              <div className="text-xs text-purple-700 mt-1">{servingPatient.type || 'General'}</div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground text-center py-4">No patient being served</div>
          )}
          
          {displayPatients.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground">Next in Queue:</div>
              {displayPatients.slice(0, 3).map((p, idx) => (
                <div key={p.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                  <span className="font-semibold text-gray-700">{idx + 1}. {p.patientId}</span>
                  <span className="text-gray-500">{p.type || 'General'}</span>
                </div>
              ))}
              {waitingPatients.length > 3 && (
                <div className="text-xs text-muted-foreground text-center py-1">+{waitingPatients.length - 3} more</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Queue Management</CardTitle>
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
      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
            <div className="text-2xl font-bold text-yellow-700">{stats.waiting}</div>
            <div className="text-xs text-yellow-700 font-medium">Waiting</div>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200 text-center">
            <div className="text-2xl font-bold text-purple-700">{stats.serving}</div>
            <div className="text-xs text-purple-700 font-medium">Serving</div>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-center">
            <div className="text-2xl font-bold text-green-700">{stats.completed}</div>
            <div className="text-xs text-green-700 font-medium">Completed</div>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center">
            <div className="text-2xl font-bold text-blue-700">~{stats.avg_wait_minutes}m</div>
            <div className="text-xs text-blue-700 font-medium">Avg Wait</div>
          </div>
        </div>

        {/* Current Serving */}
        {servingPatient && (
          <div className="p-3 bg-purple-50 border-2 border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-purple-900">Now Serving: {servingPatient.patientId}</div>
                <div className="text-sm text-purple-700">{servingPatient.type || 'General'}</div>
              </div>
              {showActions && (
                <Button 
                  size="sm" 
                  className="btn-gradient"
                  onClick={() => handleCompleteAppointment(servingPatient.id)}
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Call Next Button */}
        {showActions && waitingPatients.length > 0 && (
          <Button 
            onClick={handleCallNext} 
            className="w-full btn-gradient"
            size="sm"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Call Next Patient
          </Button>
        )}

        {/* Queue List */}
        {loading ? (
          <div className="text-center py-6 text-sm text-muted-foreground">Loading queue...</div>
        ) : displayPatients.length === 0 ? (
          <div className="text-center py-6 text-sm text-muted-foreground">
            {servingPatient ? "All patients in queue are being served" : "No patients waiting"}
          </div>
        ) : (
          <div className="space-y-2">
            {displayPatients.map((p, idx) => (
              <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${idx === 0 ? "border-yellow-300 bg-yellow-50" : "border-gray-200"}`}>
                <div className="flex items-center gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${idx === 0 ? "bg-yellow-500" : "bg-gray-400"}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{p.patientId}</div>
                    <div className="text-xs text-muted-foreground">{p.type || 'General'}</div>
                  </div>
                </div>
                {showActions && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => {
                      setSelectedAppointment(p);
                      setShowSkipDialog(true);
                    }}
                  >
                    <SkipForward className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

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
    </Card>
  );
};

export default QueueManagement;

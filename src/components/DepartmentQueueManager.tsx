import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { UserCheck, Clock, CheckCircle, AlertTriangle, RefreshCw, Send } from 'lucide-react';
import { getDepartmentQueue, callNextPatient, completeService, setPriorityLevel, DEPARTMENTS } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface DepartmentQueueManagerProps {
  department: string;
  staffId?: string;
}

const PRIORITY_LABELS = {
  1: { label: 'Emergency', color: 'bg-red-100 text-red-800 border-red-300' },
  2: { label: 'Urgent', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  3: { label: 'Normal', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  4: { label: 'Follow-up', color: 'bg-green-100 text-green-800 border-green-300' },
};

const DEPARTMENTS_LIST = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];

const DepartmentQueueManager = ({ department, staffId }: DepartmentQueueManagerProps) => {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [nextDepartment, setNextDepartment] = useState('');
  const [showPriorityDialog, setShowPriorityDialog] = useState(false);
  const [newPriority, setNewPriority] = useState(3);
  const { toast } = useToast();

  const loadQueue = async () => {
    try {
      const data = await getDepartmentQueue(department);
      setQueue(data || []);
    } catch (err: any) {
      toast({ title: 'Failed to load queue', description: err?.message || '', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueue();
    const interval = setInterval(loadQueue, 5000);
    return () => clearInterval(interval);
  }, [department]);

  const handleCallNext = async () => {
    try {
      if (queue.length === 0) {
        toast({ title: 'Queue empty', description: 'No patients waiting' });
        return;
      }

      const patient = await callNextPatient(department, staffId);
      toast({ title: 'Patient called', description: `${patient.patient_name} is now being served` });
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error calling patient', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleComplete = async () => {
    if (!selectedPatient) return;

    try {
      await completeService(selectedPatient.id, nextDepartment || null);
      toast({ 
        title: 'Service completed', 
        description: nextDepartment 
          ? `Patient routed to ${nextDepartment}` 
          : 'Patient service marked complete' 
      });
      setShowCompleteDialog(false);
      setSelectedPatient(null);
      setNextDepartment('');
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error completing service', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handlePriorityChange = async () => {
    if (!selectedPatient) return;

    try {
      await setPriorityLevel(selectedPatient.id, newPriority);
      toast({ title: 'Priority updated', description: `Priority changed to ${PRIORITY_LABELS[newPriority].label}` });
      setShowPriorityDialog(false);
      setSelectedPatient(null);
      setNewPriority(3);
      await loadQueue();
    } catch (err: any) {
      toast({ title: 'Error updating priority', description: err?.message || '', variant: 'destructive' });
    }
  };

  const waitingQueue = queue.filter(p => p.status === 'waiting');
  const servingQueue = queue.filter(p => p.status === 'serving');
  const currentPatient = servingQueue[0];

  const formatWaitTime = (arrivalTime: string) => {
    const waitSeconds = (new Date().getTime() - new Date(arrivalTime).getTime()) / 1000;
    const minutes = Math.floor(waitSeconds / 60);
    return minutes > 0 ? `${minutes}m` : '<1m';
  };

  return (
    <div className="space-y-6">
      {/* Department Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">{department} Queue</h2>
          <p className="text-muted-foreground">Manage patient flow for this department</p>
        </div>
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

      {/* Current Serving */}
      {currentPatient && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-700 flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Now Serving
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-lg font-bold">{currentPatient.patient_name}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Badge className="bg-green-600">{currentPatient.queue_number}</Badge>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    {PRIORITY_LABELS[currentPatient.priority].label}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                className="btn-gradient"
                onClick={() => {
                  setSelectedPatient(currentPatient);
                  setShowCompleteDialog(true);
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete Service
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-blue-600">{waitingQueue.length}</div>
            <div className="text-sm text-muted-foreground">Waiting</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">{servingQueue.length}</div>
            <div className="text-sm text-muted-foreground">Being Served</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-orange-600">
              {waitingQueue.length > 0 ? formatWaitTime(waitingQueue[0].arrival_time) : '—'}
            </div>
            <div className="text-sm text-muted-foreground">Avg Wait</div>
          </CardContent>
        </Card>
      </div>

      {/* Queue List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Queue List</CardTitle>
            {waitingQueue.length > 0 && (
              <Button
                size="sm"
                className="btn-gradient"
                onClick={handleCallNext}
              >
                <Send className="w-4 h-4 mr-1" />
                Call Next Patient
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-6 text-muted-foreground">Loading queue...</div>
          ) : waitingQueue.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-lg">Queue is empty</p>
              <p className="text-sm mt-2">All patients have been served</p>
            </div>
          ) : (
            <div className="space-y-2">
              {waitingQueue.map((patient, idx) => (
                <div
                  key={patient.id}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                    idx === 0 ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      idx === 0 ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{patient.patient_name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{patient.queue_number}</Badge>
                        <span>{formatWaitTime(patient.arrival_time)} wait</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`border ${PRIORITY_LABELS[patient.priority].color}`}>
                      {PRIORITY_LABELS[patient.priority].label}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setNewPriority(patient.priority);
                        setShowPriorityDialog(true);
                      }}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Complete Service Dialog */}
      <AlertDialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Mark {selectedPatient?.patient_name}'s service as complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Route to Next Department (Optional)</label>
              <select
                value={nextDepartment}
                onChange={(e) => setNextDepartment(e.target.value)}
                className="w-full mt-2 px-3 py-2 border rounded-md"
              >
                <option value="">No Further Department</option>
                {DEPARTMENTS_LIST.filter(d => d !== department).map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleComplete}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Service
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Priority Change Dialog */}
      <AlertDialog open={showPriorityDialog} onOpenChange={setShowPriorityDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change Priority</AlertDialogTitle>
            <AlertDialogDescription>
              Update priority level for {selectedPatient?.patient_name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            {[1, 2, 3, 4].map(level => (
              <label key={level} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="priority"
                  value={level}
                  checked={newPriority === level}
                  onChange={() => setNewPriority(level)}
                />
                <div>
                  <div className="font-medium">{PRIORITY_LABELS[level].label}</div>
                  <div className="text-sm text-muted-foreground">
                    {level === 1 && 'Seen immediately'}
                    {level === 2 && 'Short waiting time'}
                    {level === 3 && 'Standard queue'}
                    {level === 4 && 'Scheduled visit'}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePriorityChange}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Update Priority
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepartmentQueueManager;

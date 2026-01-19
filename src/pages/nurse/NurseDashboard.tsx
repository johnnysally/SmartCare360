import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  HeartPulse, 
  Pill, 
  Users, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2,
  UserCheck,
  CheckCircle,
  Trash2,
  Edit2,
  Plus,
  Save,
  X,
  Thermometer,
  Wind
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPatients, getAppointments, getAllQueues, callNextPatient, completeService } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  task: string;
  time: string;
  priority: 'Urgent' | 'High' | 'Normal';
  completed: boolean;
}

interface Vitals {
  patientId: string;
  patientName: string;
  bed: string;
  bp: string;
  pulse: string;
  temp: string;
  resp: string;
  spo2: string;
  pain: string;
  timestamp: string;
}

const NurseDashboard = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allQueues, setAllQueues] = useState<any>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ task: '', time: '', priority: 'Normal' as const });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [vitals, setVitals] = useState({
    bp_sys: '',
    bp_dia: '',
    pulse: '',
    temp: '',
    resp: '',
    spo2: '',
    pain: ''
  });
  const [recentVitals, setRecentVitals] = useState<Vitals[]>([]);
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    const storedTasks = localStorage.getItem('nurse_tasks');
    if (storedTasks) setTasks(JSON.parse(storedTasks));
    const storedVitals = localStorage.getItem('nurse_vitals');
    if (storedVitals) setRecentVitals(JSON.parse(storedVitals));
    
    const interval = setInterval(() => {
      loadQueues();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsData, appointmentsData, queuesData] = await Promise.all([
        getPatients().catch(() => []),
        getAppointments().catch(() => []),
        getAllQueues().catch(() => ({}))
      ]);
      setPatients(patientsData || []);
      setAppointments(appointmentsData || []);
      setAllQueues(queuesData || {});
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  const loadQueues = async () => {
    try {
      const queuesData = await getAllQueues();
      setAllQueues(queuesData || {});
    } catch (err: any) {
      toast({ title: 'Failed to load queues', description: err?.message || '', variant: 'destructive' });
    }
  };

  const handleCallNext = async () => {
    try {
      await callNextPatient('Emergency', 'nurse-001');
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

  // Task Management Functions
  const addTask = () => {
    if (!newTask.task.trim()) {
      toast({ title: 'Error', description: 'Please enter a task', variant: 'destructive' });
      return;
    }
    const task: Task = {
      id: Date.now().toString(),
      task: newTask.task,
      time: newTask.time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      priority: newTask.priority,
      completed: false
    };
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem('nurse_tasks', JSON.stringify(updatedTasks));
    setNewTask({ task: '', time: '', priority: 'Normal' });
    toast({ title: 'Task added', description: 'New task created successfully' });
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('nurse_tasks', JSON.stringify(updatedTasks));
    toast({ title: 'Task deleted', description: 'Task removed successfully' });
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTask({ ...task });
  };

  const saveEditTask = () => {
    if (!editingTask) return;
    const updatedTasks = tasks.map(t => t.id === editingTask.id ? editingTask : t);
    setTasks(updatedTasks);
    localStorage.setItem('nurse_tasks', JSON.stringify(updatedTasks));
    setEditingTaskId(null);
    setEditingTask(null);
    toast({ title: 'Task updated', description: 'Task saved successfully' });
  };

  const toggleTaskComplete = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    setTasks(updatedTasks);
    localStorage.setItem('nurse_tasks', JSON.stringify(updatedTasks));
  };

  // Vitals Management Functions
  const saveVitals = () => {
    if (!selectedPatient) {
      toast({ title: 'Error', description: 'Please select a patient', variant: 'destructive' });
      return;
    }
    if (!vitals.bp_sys || !vitals.pulse || !vitals.temp) {
      toast({ title: 'Error', description: 'Please fill in required vitals', variant: 'destructive' });
      return;
    }
    const newVital: Vitals = {
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      bed: selectedPatient.bed || `Bed-${selectedPatient.id}`,
      bp: `${vitals.bp_sys}/${vitals.bp_dia}`,
      pulse: vitals.pulse,
      temp: vitals.temp,
      resp: vitals.resp,
      spo2: vitals.spo2,
      pain: vitals.pain,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedVitals = [newVital, ...recentVitals].slice(0, 10);
    setRecentVitals(updatedVitals);
    localStorage.setItem('nurse_vitals', JSON.stringify(updatedVitals));
    setVitals({ bp_sys: '', bp_dia: '', pulse: '', temp: '', resp: '', spo2: '', pain: '' });
    setShowVitalsForm(false);
    setSelectedPatient(null);
    toast({ title: 'Vitals saved', description: `Vitals recorded for ${selectedPatient.name}` });
  };

  // Calculate stats from real data
  const assignedPatients = patients.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending' || a.status === 'confirmed').length;
  const criticalAlerts = patients.filter((p: any) => p.status === 'Critical').length;

  const currentQueue = allQueues['Emergency'] || [];
  const waitingPatients = currentQueue.filter((p: any) => p.status === 'waiting');
  const servingPatients = currentQueue.filter((p: any) => p.status === 'serving');
  const completedPatients = currentQueue.filter((p: any) => p.status === 'completed');

  const patientList = patients.slice(0, 4).map((patient: any) => ({
    id: patient.id,
    name: patient.name,
    bed: patient.bed || `Bed-${patient.id}`,
    status: patient.status || "Stable",
    nextVitals: "TBD",
    alert: patient.status === 'Critical'
  }));

  const appointmentTasks = appointments.slice(0, 4).map((apt: any, idx: number) => ({
    task: `Attend to ${apt.patientName || `Patient ${apt.patientId}`}`,
    time: new Date(apt.time || apt.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    completed: idx % 3 === 0,
    priority: idx === 0 ? "Urgent" : idx === 1 ? "High" : "Normal"
  }));

  const stats = [
    { label: "Patients Assigned", value: assignedPatients.toString(), icon: Users, change: "All wards", color: "text-success" },
    { label: "Vitals Due", value: pendingAppointments.toString(), icon: HeartPulse, change: "Today", color: "text-warning" },
    { label: "Medications Due", value: (pendingAppointments / 2).toFixed(0), icon: Pill, change: "Pending", color: "text-info" },
    { label: "Critical Alerts", value: criticalAlerts.toString(), icon: AlertTriangle, change: "Urgent", color: "text-destructive" },
  ];

  return (
    <NurseLayout title="Nurse Dashboard">
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

        {/* Main Grid - Queue and Vitals */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Emergency Queue */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-destructive" />
                Emergency Queue
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="py-8 text-center text-sm text-muted-foreground">Loading queue...</div>
              ) : currentQueue.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No patients in queue</div>
              ) : (
                <div className="space-y-4">
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

                  {servingPatients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-destructive text-sm">Now Attending</h4>
                      {servingPatients.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border-2 border-destructive/30 bg-destructive/5">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-full bg-destructive flex items-center justify-center font-bold text-white">!</div>
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

                  {waitingPatients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-yellow-700 text-sm">Waiting ({waitingPatients.length})</h4>
                      {waitingPatients.slice(0, 3).map((p: any, idx: number) => (
                        <div key={p.id} className={`flex items-center justify-between p-3 rounded-lg border-2 ${idx === 0 ? "border-primary bg-primary/5" : "border-yellow-200 bg-yellow-50"}`}>
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center font-bold text-yellow-700 text-sm">{idx + 1}</div>
                            <div className="flex-1">
                              <div className="font-semibold text-sm">{p.patient_name}</div>
                              <div className="text-xs text-muted-foreground">Queue #{p.queue_number}</div>
                            </div>
                          </div>
                          {p.priority && <Badge variant={p.priority === 1 ? 'destructive' : 'outline'} className="text-xs">P{p.priority}</Badge>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Record Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-success" />
                Record Patient Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showVitalsForm ? (
                <Button onClick={() => setShowVitalsForm(true)} className="w-full btn-gradient" size="lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Record Vitals
                </Button>
              ) : (
                <div className="space-y-4">
                  {/* Patient Selection */}
                  <div className="space-y-2">
                    <Label className="font-semibold">Select Patient</Label>
                    <select 
                      value={selectedPatient?.id || ''}
                      onChange={(e) => {
                        const patient = patientList.find(p => p.id === e.target.value);
                        setSelectedPatient(patient);
                      }}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a patient...</option>
                      {patientList.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} - {p.bed}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedPatient && (
                    <>
                      <div className="p-3 rounded-lg bg-success/10 border border-success/20 text-sm">
                        <div className="font-semibold">{selectedPatient.name}</div>
                        <div className="text-muted-foreground">{selectedPatient.bed}</div>
                      </div>

                      {/* Vitals Grid */}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">BP Systolic*</Label>
                          <Input 
                            placeholder="120" 
                            type="number"
                            value={vitals.bp_sys}
                            onChange={(e) => setVitals({ ...vitals, bp_sys: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">BP Diastolic</Label>
                          <Input 
                            placeholder="80" 
                            type="number"
                            value={vitals.bp_dia}
                            onChange={(e) => setVitals({ ...vitals, bp_dia: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Pulse (BPM)*</Label>
                          <Input 
                            placeholder="72" 
                            type="number"
                            value={vitals.pulse}
                            onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Temp (°C)*</Label>
                          <Input 
                            placeholder="36.8" 
                            type="number"
                            step="0.1"
                            value={vitals.temp}
                            onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Resp Rate</Label>
                          <Input 
                            placeholder="16" 
                            type="number"
                            value={vitals.resp}
                            onChange={(e) => setVitals({ ...vitals, resp: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">SpO₂ (%)</Label>
                          <Input 
                            placeholder="98" 
                            type="number"
                            value={vitals.spo2}
                            onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs">Pain Level (0-10)</Label>
                        <Input 
                          placeholder="0" 
                          type="number"
                          min="0"
                          max="10"
                          value={vitals.pain}
                          onChange={(e) => setVitals({ ...vitals, pain: e.target.value })}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={saveVitals} className="flex-1 btn-gradient" size="sm">
                          <Save className="w-4 h-4 mr-1" />
                          Save Vitals
                        </Button>
                        <Button 
                          onClick={() => {
                            setShowVitalsForm(false);
                            setSelectedPatient(null);
                            setVitals({ bp_sys: '', bp_dia: '', pulse: '', temp: '', resp: '', spo2: '', pain: '' });
                          }} 
                          variant="outline" 
                          size="sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tasks Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-info" />
              Task Management
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {tasks.filter(t => !t.completed).length} pending • {tasks.filter(t => t.completed).length} done
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add New Task Form */}
            <div className="p-4 rounded-lg border bg-muted/30 space-y-3">
              <Label className="font-semibold text-sm">Add New Task</Label>
              <div className="flex gap-2 flex-col sm:flex-row">
                <Input 
                  placeholder="Task description..." 
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  className="flex-1"
                />
                <Input 
                  type="time"
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="w-full sm:w-40"
                />
                <select 
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                </select>
                <Button onClick={addTask} className="btn-gradient" size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-2">
              {tasks.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No tasks. Add one to get started!</div>
              ) : (
                <div className="grid gap-2 max-h-96 overflow-y-auto">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${task.completed ? 'opacity-60 bg-muted/30' : 'hover:bg-muted/50'}`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskComplete(task.id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                      {editingTaskId === task.id ? (
                        <>
                          <Input 
                            value={editingTask?.task || ''}
                            onChange={(e) => setEditingTask({ ...editingTask!, task: e.target.value })}
                            className="flex-1 h-8"
                          />
                          <Input 
                            type="time"
                            value={editingTask?.time || ''}
                            onChange={(e) => setEditingTask({ ...editingTask!, time: e.target.value })}
                            className="w-32 h-8"
                          />
                          <Button size="sm" onClick={saveEditTask} className="bg-green-600 hover:bg-green-700 h-8">
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingTaskId(null)} className="h-8">
                            <X className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <div className={`font-medium text-sm truncate ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                              {task.task}
                            </div>
                            <div className="text-xs text-muted-foreground flex items-center gap-2">
                              <Clock className="w-3 h-3 flex-shrink-0" />
                              <span>{task.time}</span>
                            </div>
                          </div>
                          <Badge variant={task.priority === 'Urgent' ? 'destructive' : task.priority === 'High' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                            {task.priority}
                          </Badge>
                          <Button size="sm" variant="ghost" onClick={() => startEditTask(task)} className="h-8 w-8 p-0">
                            <Edit2 className="w-4 h-4 text-blue-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)} className="h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Vitals */}
        {recentVitals.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-success" />
                Recent Vitals Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {recentVitals.map((vital, i) => (
                  <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{vital.patientName}</span>
                      <span className="text-xs text-muted-foreground">{vital.timestamp}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">{vital.bed}</div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-muted-foreground">BP:</span> <span className="font-medium">{vital.bp}</span></div>
                      <div><span className="text-muted-foreground">Pulse:</span> <span className="font-medium">{vital.pulse}</span></div>
                      <div><span className="text-muted-foreground">Temp:</span> <span className="font-medium">{vital.temp}°C</span></div>
                      <div><span className="text-muted-foreground">Resp:</span> <span className="font-medium">{vital.resp}</span></div>
                      {vital.spo2 && <div><span className="text-muted-foreground">SpO₂:</span> <span className="font-medium">{vital.spo2}%</span></div>}
                      {vital.pain && <div><span className="text-muted-foreground">Pain:</span> <span className="font-medium">{vital.pain}/10</span></div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </NurseLayout>
  );
};

export default NurseDashboard;

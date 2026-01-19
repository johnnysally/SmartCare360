import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus, Users, Activity, AlertTriangle } from 'lucide-react';
import { checkInPatient, getAllQueues, getQueueAnalytics } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];
const PRIORITY_OPTIONS = [
  { value: 1, label: 'Emergency', color: 'bg-red-600' },
  { value: 2, label: 'Urgent', color: 'bg-orange-600' },
  { value: 3, label: 'Normal', color: 'bg-blue-600' },
  { value: 4, label: 'Follow-up', color: 'bg-green-600' },
];

const FrontDeskCheckIn = () => {
  const [activeTab, setActiveTab] = useState('check-in');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedDept, setSelectedDept] = useState('OPD');
  const [selectedPriority, setSelectedPriority] = useState(3);
  const [loading, setLoading] = useState(false);
  const [allQueues, setAllQueues] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadQueues();
    loadAnalytics();
    const interval = setInterval(() => {
      loadQueues();
      loadAnalytics();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadQueues = async () => {
    try {
      const data = await getAllQueues();
      setAllQueues(data || {});
    } catch (err) {
      console.error('Failed to load queues:', err);
    }
  };

  const loadAnalytics = async () => {
    try {
      const data = await getQueueAnalytics();
      setAnalytics(data || []);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const handleCheckIn = async (e: any) => {
    e.preventDefault();
    
    if (!patientName.trim()) {
      toast({ title: 'Error', description: 'Patient name is required', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      const result = await checkInPatient({
        patientId: `P${Date.now()}`,
        patientName,
        phone: patientPhone,
        department: selectedDept,
        priority: selectedPriority
      });

      toast({
        title: 'Patient Checked In',
        description: `${patientName} added to ${selectedDept} queue. Queue #: ${result.queue_number}`,
      });

      // Reset form
      setPatientName('');
      setPatientPhone('');
      setSelectedPriority(3);

      // Reload queues
      await loadQueues();
    } catch (err: any) {
      toast({
        title: 'Check-in Failed',
        description: err?.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const getQueueStats = (department: string) => {
    const queue = allQueues[department] || [];
    const waiting = queue.filter((p: any) => p.status === 'waiting').length;
    const serving = queue.filter((p: any) => p.status === 'serving').length;
    return { waiting, serving, total: queue.length };
  };

  const getCongestionColor = (waiting: number) => {
    if (waiting <= 3) return 'text-green-600';
    if (waiting <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout title="Front Desk - Queue Management">
      <div className="space-y-6 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="check-in" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Check-In</span>
            </TabsTrigger>
            <TabsTrigger value="queues" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Queues</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Check-In Tab */}
          <TabsContent value="check-in" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Patient Check-In</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCheckIn} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Patient Name *</label>
                    <Input
                      type="text"
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Phone Number (Optional)</label>
                    <Input
                      type="tel"
                      placeholder="Enter phone number for SMS notifications"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Department *</label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      >
                        {DEPARTMENTS.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium">Priority Level</label>
                      <select
                        value={selectedPriority}
                        onChange={(e) => setSelectedPriority(parseInt(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      >
                        {PRIORITY_OPTIONS.map(opt => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-gradient"
                    disabled={loading}
                    size="lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {loading ? 'Checking In...' : 'Check In Patient'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Queues Tab */}
          <TabsContent value="queues" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEPARTMENTS.map(dept => {
                const { waiting, serving, total } = getQueueStats(dept);
                const congestionColor = getCongestionColor(waiting);

                return (
                  <Card key={dept} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center justify-between">
                        {dept}
                        <Badge variant="outline">
                          <span className={`font-bold ${congestionColor}`}>
                            {total}
                          </span>
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Waiting</span>
                        <span className="text-2xl font-bold text-blue-600">{waiting}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Being Served</span>
                        <span className="text-2xl font-bold text-green-600">{serving}</span>
                      </div>
                      {waiting > 10 && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-xs text-red-700 font-medium">High congestion</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Queue Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {DEPARTMENTS.map(dept => {
                    const deptData = analytics.find((a: any) => a.department === dept);
                    const { waiting } = getQueueStats(dept);

                    return (
                      <div key={dept} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold">{dept}</h4>
                          <Badge variant="outline">{waiting} currently waiting</Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Avg Wait</span>
                            <p className="font-semibold">
                              {deptData?.avg_wait_time_seconds 
                                ? Math.round(deptData.avg_wait_time_seconds / 60) 
                                : 0} min
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Wait</span>
                            <p className="font-semibold">
                              {deptData?.max_wait_time_seconds 
                                ? Math.round(deptData.max_wait_time_seconds / 60) 
                                : 0} min
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Today</span>
                            <p className="font-semibold">{deptData?.total_patients || 0} patients</p>
                          </div>
                        </div>
                        {deptData?.congestion_level && (
                          <div className="mt-2">
                            <Badge className={`${
                              deptData.congestion_level === 'LOW' ? 'bg-green-600' :
                              deptData.congestion_level === 'MODERATE' ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}>
                              {deptData.congestion_level}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FrontDeskCheckIn;

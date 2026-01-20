import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  CreditCard,
  Activity,
  TrendingUp,
  Clock,
  UserPlus,
  AlertTriangle,
  AlertCircle,
  Bed,
  LogOut,
  FileText,
  BarChart3,
  Settings,
  CheckCircle,
  Phone,
  Search,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient, createAppointment, createBilling, getPatients, getAppointments, getUsers, getBilling, getPatientStats, checkInPatient, getAllQueues, getQueueAnalytics, updateAppointment } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title);
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadReport } from '@/lib/api';
import { PatientRegistrationForm } from '@/components/forms/PatientRegistrationForm';
import { VisitCreationForm } from '@/components/forms/VisitCreationForm';
import { AdmissionForm } from '@/components/forms/AdmissionForm';
import { DischargeForm } from '@/components/forms/DischargeForm';

const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];
const VISIT_TYPES = ['OPD', 'IPD', 'Emergency', 'Follow-up', 'Referral'];
const PRIORITY_OPTIONS = [
  { value: 1, label: 'Emergency', color: 'bg-red-600' },
  { value: 2, label: 'Urgent', color: 'bg-orange-600' },
  { value: 3, label: 'Normal', color: 'bg-blue-600' },
  { value: 4, label: 'Follow-up', color: 'bg-green-600' },
];

const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('frontdesk');
  const [patients, setPatients] = useState<any[]>([]);
  const [backendStats, setBackendStats] = useState<any | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [selectedDept, setSelectedDept] = useState('OPD');
  const [selectedPriority, setSelectedPriority] = useState(3);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [allQueues, setAllQueues] = useState<any>({});
  const [analytics, setAnalytics] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Calculate Front Desk Stats from real data
  const calculateFrontDeskStats = (): {
    patientsWaiting: number;
    patientsAdmitted: number;
    opdVisitsToday: number;
    ipdAdmissionsToday: number;
    dischargesToday: number;
    totalCollectionsToday: number;
    outstandingBalances: number;
    emergencyAlerts: number;
  } => {
    const today = new Date().toDateString();
    
    // Count patients waiting in queues
    const patientsWaiting: number = (Object.values(allQueues || {}) as any[]).reduce((sum: number, queue: any) => {
      return sum + (Array.isArray(queue) ? queue.filter((p: any) => p.status === 'waiting').length : 0);
    }, 0);

    // Count admitted patients
    const patientsAdmitted = (appointments || []).filter((a: any) => 
      a.status === 'admitted' || a.visitType === 'IPD'
    ).length;

    // OPD visits today
    const opdVisitsToday = (appointments || []).filter((a: any) => {
      const appointmentDate = new Date(a.time || a.createdAt).toDateString();
      return a.visitType === 'OPD' && appointmentDate === today;
    }).length;

    // IPD admissions today
    const ipdAdmissionsToday = (appointments || []).filter((a: any) => {
      const appointmentDate = new Date(a.time || a.createdAt).toDateString();
      return a.visitType === 'IPD' && appointmentDate === today;
    }).length;

    // Discharges today
    const dischargesToday = (appointments || []).filter((a: any) => {
      const appointmentDate = new Date(a.updatedAt || a.createdAt).toDateString();
      return a.status === 'discharged' && appointmentDate === today;
    }).length;

    // Total collections today
    const totalCollectionsToday = (billing || []).filter((b: any) => {
      const billingDate = new Date(b.createdAt).toDateString();
      return b.status === 'paid' && billingDate === today;
    }).reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

    // Outstanding balances (pending payments)
    const outstandingBalances = (billing || []).filter((b: any) => 
      b.status === 'pending' || b.status === 'unpaid'
    ).reduce((sum: number, b: any) => sum + (b.amount || 0), 0);

    // Emergency alerts - split into two parts to avoid type issues
    const appointmentEmergencies = (appointments || []).filter((a: any) => 
      a.priority === 'Critical' || a.priority === 'Emergency' || a.priority === 1
    ).length;
    
    const queueEmergencies: number = (Object.values(allQueues || {}) as any[]).reduce((sum: number, queue: any) => {
      return sum + (Array.isArray(queue) ? queue.filter((p: any) => p.priority === 'Critical' || p.priority === 1).length : 0);
    }, 0);

    const emergencyAlerts = appointmentEmergencies + queueEmergencies;

    return {
      patientsWaiting,
      patientsAdmitted,
      opdVisitsToday,
      ipdAdmissionsToday,
      dischargesToday,
      totalCollectionsToday,
      outstandingBalances,
      emergencyAlerts
    };
  };

  const frontDeskStats = calculateFrontDeskStats();

  const navigate = useNavigate();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm();

  useEffect(() => {
    fetchDashboardData();
    loadQueues();
    loadAnalytics();
    const interval = setInterval(() => {
      loadQueues();
      loadAnalytics();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [patientsData, appointmentsData, usersData, billingData] = await Promise.all([
        getPatients(),
        getAppointments(),
        getUsers(),
        getBilling()
      ]);
      setPatients(patientsData || []);
      setAppointments(appointmentsData || []);
      setUsers(usersData || []);
      setBilling(billingData || []);
      try {
        const stats = await getPatientStats();
        setBackendStats(stats || null);
      } catch (e) {
        setBackendStats(null);
      }
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

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

    setCheckInLoading(true);
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

      setPatientName('');
      setPatientPhone('');
      setSelectedPriority(3);
      await loadQueues();
    } catch (err: any) {
      toast({
        title: 'Check-in Failed',
        description: err?.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setCheckInLoading(false);
    }
  };

  // Front Desk Handlers
  const handlePatientRegistration = async (formData: any) => {
    try {
      const result = await createPatient({
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        age: parseInt(formData.age),
        gender: formData.gender,
        address: formData.address,
        insuranceType: formData.insuranceType
      });

      toast({
        title: 'Success',
        description: `Patient ${formData.fullName} registered successfully. ID: ${result.id}`
      });
      setDialogOpen(null);
      fetchDashboardData();
    } catch (err: any) {
      toast({
        title: 'Registration Failed',
        description: err?.message || 'Failed to register patient',
        variant: 'destructive'
      });
    }
  };

  const handleVisitCreation = async (formData: any) => {
    try {
      const result = await createAppointment({
        patientId: formData.patientId,
        visitType: formData.visitType,
        department: formData.department,
        priority: formData.priority,
        reason: formData.reason
      });

      toast({
        title: 'Success',
        description: `Visit created successfully. Visit ID: ${result.id}`
      });
      setDialogOpen(null);
      fetchDashboardData();
    } catch (err: any) {
      toast({
        title: 'Visit Creation Failed',
        description: err?.message || 'Failed to create visit',
        variant: 'destructive'
      });
    }
  };

  const handleAdmission = async (formData: any) => {
    try {
      const result = await createAppointment({
        patientId: formData.patientId,
        visitType: 'IPD',
        department: formData.wardType,
        priority: 'normal',
        reason: `Admission: ${formData.admissionReason}`,
        admissionDeposit: parseFloat(formData.admissionDeposit)
      });

      toast({
        title: 'Success',
        description: `Patient admitted successfully. Admission ID: ${result.id}`
      });
      setDialogOpen(null);
      fetchDashboardData();
    } catch (err: any) {
      toast({
        title: 'Admission Failed',
        description: err?.message || 'Failed to admit patient',
        variant: 'destructive'
      });
    }
  };

  const handleDischarge = async (formData: any) => {
    try {
      const result = await updateAppointment(formData.admissionId, {
        status: 'discharged',
        dischargeNotes: formData.dischargeSummary,
        finalBill: parseFloat(formData.finalBalance)
      });

      toast({
        title: 'Success',
        description: `Patient discharged successfully`
      });
      setDialogOpen(null);
      fetchDashboardData();
    } catch (err: any) {
      toast({
        title: 'Discharge Failed',
        description: err?.message || 'Failed to discharge patient',
        variant: 'destructive'
      });
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

  // Calculate dynamic stats
  const totalPatients = patients.length;
  const todaysAppointments = appointments.filter(a => {
    const today = new Date().toDateString();
    return new Date(a.time || a.createdAt).toDateString() === today;
  }).length;
  const todaysRevenue = billing
    .filter(b => b.status === 'paid' && new Date(b.createdAt).toDateString() === new Date().toDateString())
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const queueLength = appointments.filter(a => a.status === 'confirmed' || a.status === 'pending').length;

  const stats = [
    { label: "Total Patients", value: totalPatients.toString(), change: "+12%", icon: Users, color: "text-primary" },
    { label: "Today's Appointments", value: todaysAppointments.toString(), change: "+5", icon: Calendar, color: "text-info" },
    { label: "Revenue (Today)", value: `KES ${todaysRevenue.toLocaleString()}`, change: "+8%", icon: CreditCard, color: "text-success" },
    { label: "Queue Length", value: queueLength.toString(), change: "-3", icon: Clock, color: "text-warning" },
  ];

  const recentPatients = patients.slice(-4).reverse().map((patient: any) => ({
    name: patient.name,
    time: patient.lastVisit ? new Date(patient.lastVisit).toLocaleString() : "Recently added",
    type: "New Patient",
    status: "Registered"
  }));

  let statusLabels: string[] = [];
  let statusData: number[] = [];
  let ageLabels: string[] = [];
  let ageData: number[] = [];
  let months: string[] = [];
  let visitsData: number[] = [];

  if (backendStats) {
    statusLabels = Object.keys(backendStats.statusCounts || {});
    statusData = Object.values(backendStats.statusCounts || {});
    ageLabels = Object.keys(backendStats.ageBuckets || {});
    ageData = Object.values(backendStats.ageBuckets || {});
    months = (backendStats.visits && backendStats.visits.months) || [];
    visitsData = (backendStats.visits && backendStats.visits.counts) || [];
  } else {
    const statusMap: Record<string, number> = patients.reduce((acc: Record<string, number>, p: any) => {
      const s = (p.status || 'Unknown');
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    statusLabels = Object.keys(statusMap);
    statusData = Object.values(statusMap);

    const _ageBuckets: Record<string, number> = { '0-18': 0, '19-35': 0, '36-60': 0, '61+': 0 };
    patients.forEach((p: any) => {
      const age = Number(p.age);
      if (Number.isFinite(age)) {
        if (age <= 18) _ageBuckets['0-18']++;
        else if (age <= 35) _ageBuckets['19-35']++;
        else if (age <= 60) _ageBuckets['36-60']++;
        else _ageBuckets['61+']++;
      }
    });
    ageLabels = Object.keys(_ageBuckets);
    ageData = Object.values(_ageBuckets);

    months = [];
    const monthCounts: Record<string, number> = {};
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
      months.push(key);
      monthCounts[key] = 0;
    }
    patients.forEach((p: any) => {
      if (!p.lastVisit) return;
      const d = new Date(p.lastVisit);
      if (isNaN(d.getTime())) return;
      const key = d.toLocaleString(undefined, { month: 'short', year: 'numeric' });
      if (monthCounts[key] !== undefined) monthCounts[key]++;
    });
    visitsData = months.map(m => monthCounts[m] || 0);
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 lg:grid-cols-7">
            <TabsTrigger value="frontdesk" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Front Desk</span>
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Insurance</span>
            </TabsTrigger>
            <TabsTrigger value="referrals" className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Referrals</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="emergency" className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Emergency</span>
            </TabsTrigger>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline text-xs">Overview</span>
            </TabsTrigger>
          </TabsList>

          {/* Front Desk Tab */}
          <TabsContent value="frontdesk" className="space-y-6 mt-4">
            {/* Emergency Alerts */}
            {frontDeskStats.emergencyAlerts > 0 && (
              <Card className="border-red-500 bg-red-50">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-900">{frontDeskStats.emergencyAlerts} Active Emergency Alert(s)</div>
                      <div className="text-sm text-red-700">Immediate attention required</div>
                    </div>
                  </div>
                  <Button className="bg-red-600 hover:bg-red-700">View Details</Button>
                </CardContent>
              </Card>
            )}

            {/* Front Desk Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="card-hover cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                      <Users className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">Today</Badge>
                  </div>
                  <div className="text-2xl font-bold">{frontDeskStats.patientsWaiting}</div>
                  <div className="text-sm text-muted-foreground">Patients Waiting</div>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="text-2xl font-bold">{frontDeskStats.patientsAdmitted}</div>
                  <div className="text-sm text-muted-foreground">Patients Admitted</div>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">OPD</Badge>
                  </div>
                  <div className="text-2xl font-bold">{frontDeskStats.opdVisitsToday}</div>
                  <div className="text-sm text-muted-foreground">OPD Visits Today</div>
                </CardContent>
              </Card>

              <Card className="card-hover cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  <div className="text-2xl font-bold">KES {frontDeskStats.totalCollectionsToday.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Collections Today</div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">IPD Admissions Today</span>
                    <Bed className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">{frontDeskStats.ipdAdmissionsToday}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Discharges Today</span>
                    <LogOut className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">{frontDeskStats.dischargesToday}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-muted-foreground">Outstanding Balance</span>
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="text-2xl font-bold">KES {frontDeskStats.outstandingBalances.toLocaleString()}</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Dialog open={dialogOpen === 'register'} onOpenChange={(open) => setDialogOpen(open ? 'register' : null)}>
                  <DialogTrigger asChild>
                    <Button className="flex flex-col items-center justify-center h-24 gap-2 hover:shadow-md transition-shadow">
                      <UserPlus className="w-5 h-5" />
                      <span className="text-xs">Register Patient</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register New Patient</DialogTitle>
                    </DialogHeader>
                    <PatientRegistrationForm onSubmit={handlePatientRegistration} />
                  </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen === 'visit'} onOpenChange={(open) => setDialogOpen(open ? 'visit' : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 hover:shadow-md transition-shadow">
                      <Calendar className="w-5 h-5" />
                      <span className="text-xs">Create Visit</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Visit</DialogTitle>
                    </DialogHeader>
                    <VisitCreationForm onSubmit={handleVisitCreation} />
                  </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen === 'admit'} onOpenChange={(open) => setDialogOpen(open ? 'admit' : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 hover:shadow-md transition-shadow">
                      <Bed className="w-5 h-5" />
                      <span className="text-xs">Admit Patient</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Admit Patient to IPD</DialogTitle>
                    </DialogHeader>
                    <AdmissionForm onSubmit={handleAdmission} />
                  </DialogContent>
                </Dialog>

                <Dialog open={dialogOpen === 'discharge'} onOpenChange={(open) => setDialogOpen(open ? 'discharge' : null)}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex flex-col items-center justify-center h-24 gap-2 hover:shadow-md transition-shadow">
                      <LogOut className="w-5 h-5" />
                      <span className="text-xs">Discharge Patient</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Discharge Patient</DialogTitle>
                    </DialogHeader>
                    <DischargeForm onSubmit={handleDischarge} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            {/* Patient Search Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Patient Lookup & Insurance Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input 
                  placeholder="Search by phone number, patient ID, or name..." 
                  value={searchQuery} 
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
                {searchQuery && (
                  <div className="space-y-2">
                    {patients
                      .filter(p => 
                        p.phone?.includes(searchQuery) || 
                        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        p.id?.includes(searchQuery)
                      )
                      .slice(0, 5)
                      .map((patient: any) => (
                        <div key={patient.id} className="p-3 border rounded-lg flex items-center justify-between hover:bg-accent cursor-pointer">
                          <div>
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {patient.phone} • {patient.insuranceType || 'No Insurance'} • ID: {patient.id}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pb-4">
              <Button variant="outline" className="h-12 flex items-center gap-2" onClick={() => navigate('/dashboard/queue')}>
                <Users className="w-4 h-4" />
                Queue Management
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Insurance Verification
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <Bed className="w-4 h-4" />
                IPD Management
              </Button>
              <Button variant="outline" className="h-12 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Daily Reports
              </Button>
            </div>
          </TabsContent>

          {/* Insurance & Pre-Authorization Tab */}
          <TabsContent value="insurance" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Pre-Authorization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Patient ID or Phone..." className="w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Insurance Details</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Provider:</span> <span className="font-medium">NHIF</span></div>
                      <div><span className="text-muted-foreground">Policy #:</span> <span className="font-medium">-</span></div>
                      <div><span className="text-muted-foreground">Status:</span> <Badge variant="outline">Not Verified</Badge></div>
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Coverage Limits</h3>
                    <div className="space-y-2 text-sm">
                      <div><span className="text-muted-foreground">Annual Limit:</span> <span className="font-medium">KES 500,000</span></div>
                      <div><span className="text-muted-foreground">Remaining:</span> <span className="font-medium text-green-600">KES 450,000</span></div>
                      <div><span className="text-muted-foreground">Co-pay:</span> <span className="font-medium">10%</span></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Policy Verification History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Patient: -</span>
                      <Badge>Pending</Badge>
                    </div>
                    <div className="text-muted-foreground">Verified by: Front Desk | Date: -</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Referrals Tab */}
          <TabsContent value="referrals" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Create Outgoing Referral</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="Patient Name" />
                  <Input placeholder="Referring Doctor" />
                  <select className="w-full p-2 border rounded-md text-sm">
                    <option>Select Specialist/Facility</option>
                    <option>Cardiology Center</option>
                    <option>Orthopedic Hospital</option>
                    <option>Eye Care Institute</option>
                  </select>
                  <textarea placeholder="Reason for Referral" className="w-full p-2 border rounded-md text-sm" rows={3} />
                  <Button className="w-full">Create Referral</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Incoming Referrals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="p-3 border rounded-lg text-sm bg-blue-50">
                    <div className="font-medium">No incoming referrals</div>
                    <div className="text-xs text-muted-foreground mt-1">Referrals from external facilities will appear here</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Referral History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-center text-muted-foreground py-8">
                  No referrals yet
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Process Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input placeholder="Patient ID / Phone" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Amount</label>
                    <Input type="number" placeholder="0.00" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Payment Method</label>
                    <select className="w-full p-2 border rounded-md text-sm">
                      <option>Select Method</option>
                      <option>Cash</option>
                      <option>Card</option>
                      <option>M-Pesa</option>
                      <option>Bank Transfer</option>
                      <option>Cheque</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Notes</label>
                  <textarea placeholder="Payment notes..." className="w-full p-2 border rounded-md text-sm" rows={2} />
                </div>
                <Button className="w-full">Process Payment</Button>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Cash on Hand</div>
                  <div className="text-2xl font-bold">KES 25,000</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Today's Cash Collected</div>
                  <div className="text-2xl font-bold text-green-600">KES 185,000</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Pending Refunds</div>
                  <div className="text-2xl font-bold text-orange-600">KES 5,000</div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground">Total Patients Today</div>
                  <div className="text-2xl font-bold mt-2">127</div>
                  <div className="text-xs text-muted-foreground mt-2">OPD: 89 | IPD: 12 | Emergency: 26</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground">Revenue Today</div>
                  <div className="text-2xl font-bold mt-2 text-green-600">KES 285,500</div>
                  <div className="text-xs text-muted-foreground mt-2">Collected: KES 185,000</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground">Outstanding Balance</div>
                  <div className="text-2xl font-bold mt-2 text-orange-600">KES 45,000</div>
                  <div className="text-xs text-muted-foreground mt-2">45 pending invoices</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground">Insurance Claims</div>
                  <div className="text-2xl font-bold mt-2">32</div>
                  <div className="text-xs text-muted-foreground mt-2">Pending: 8 | Approved: 24</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Daily Summary Report</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-muted-foreground">New Patients</div>
                      <div className="font-bold text-lg">34</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-muted-foreground">Follow-ups</div>
                      <div className="font-bold text-lg">89</div>
                    </div>
                    <div className="p-3 bg-orange-50 rounded-lg">
                      <div className="text-muted-foreground">Discharges</div>
                      <div className="font-bold text-lg">12</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <div className="text-muted-foreground">Emergency</div>
                      <div className="font-bold text-lg">26</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF Report
              </Button>
              <Button variant="outline" className="flex-1">
                <BarChart3 className="w-4 h-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </TabsContent>

          {/* Emergency Mode Tab */}
          <TabsContent value="emergency" className="space-y-6 mt-4">
            <Card className="border-red-500 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-900">Emergency Mass Registration Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-red-100 p-3 rounded-lg text-sm text-red-900">
                  <strong>Note:</strong> Use only during mass casualty or disaster events. Temporary IDs will be issued.
                </div>
                <Button className="w-full bg-red-600 hover:bg-red-700 h-12">
                  Activate Emergency Mode
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Emergency Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Patient Name (required)" />
                <Input placeholder="Age / DOB" />
                <select className="w-full p-2 border rounded-md text-sm">
                  <option>Select Priority</option>
                  <option>Critical</option>
                  <option>Urgent</option>
                  <option>Moderate</option>
                  <option>Minor</option>
                </select>
                <textarea placeholder="Emergency Details / Reason" className="w-full p-2 border rounded-md text-sm" rows={3} />
                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="font-medium mb-1">Temporary ID will be: TMP-2026-001</div>
                  <div className="text-xs text-muted-foreground">Assign MRN after initial stabilization</div>
                </div>
                <Button className="w-full">Register Patient</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disaster Event Tagging</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium block mb-2">Event/Disaster Tag</label>
                  <Input placeholder="e.g., Traffic Accident on Jan 20, 2026" />
                </div>
                <div className="p-3 border rounded-lg text-sm">
                  <div className="font-medium mb-2">Patients Registered Under This Event:</div>
                  <div className="text-muted-foreground">None yet</div>
                </div>
                <Button variant="outline" className="w-full">Save Event Tag</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overview Tab (Original Dashboard) */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-sm text-success flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold font-display">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Patients */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="font-display">Recent Patients</CardTitle>
                  <UserPlus className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {loading ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">Loading patients...</div>
                    ) : recentPatients.length === 0 ? (
                      <div className="py-6 text-center text-sm text-muted-foreground">No patients yet. Add your first patient!</div>
                    ) : (
                      recentPatients.map((patient, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                              {patient.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-muted-foreground">{patient.type} • {patient.time}</div>
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            patient.status === "In Queue" ? "bg-warning/10 text-warning" :
                            patient.status === "With Doctor" ? "bg-info/10 text-info" :
                            "bg-success/10 text-success"
                          }`}>
                            {patient.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <UserPlus className="w-5 h-5" />
                        <span className="font-medium">Create</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      <Dialog open={dialogOpen === 'patient'} onOpenChange={(open) => setDialogOpen(open ? 'patient' : null)}>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <UserPlus className="w-4 h-4 mr-2" />
                            New Patient
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add New Patient</DialogTitle>
                          </DialogHeader>
                          <PatientForm onCreated={() => { setDialogOpen(null); fetchDashboardData(); }} />
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      <Dialog open={dialogOpen === 'appointment'} onOpenChange={(open) => setDialogOpen(open ? 'appointment' : null)}>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Calendar className="w-4 h-4 mr-2" />
                            Book Appointment
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Book Appointment</DialogTitle>
                          </DialogHeader>
                          <AppointmentForm onCreated={() => { setDialogOpen(null); fetchDashboardData(); }} />
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>

                      <Dialog open={dialogOpen === 'payment'} onOpenChange={(open) => setDialogOpen(open ? 'payment' : null)}>
                        <DialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Process Payment
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Process Payment</DialogTitle>
                          </DialogHeader>
                          <PaymentForm onCreated={() => { setDialogOpen(null); fetchDashboardData(); }} />
                          <DialogFooter />
                        </DialogContent>
                      </Dialog>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <button 
                    onClick={() => setActiveTab('check-in')}
                    className="bg-warning text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity"
                  >
                    <Clock className="w-5 h-5" />
                    <span className="font-medium">Check-In</span>
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="flex items-center justify-end gap-3">
              <Button onClick={async () => {
                try {
                  const blob = await downloadReport('patients');
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'patients_report.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                } catch (e: any) { toast({ title: 'Failed to download patients report', description: e?.message || '' }); }
              }}>Download Patients</Button>
              <Button onClick={async () => {
                try {
                  const blob = await downloadReport('billing');
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'billing_report.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                } catch (e: any) { toast({ title: 'Failed to download billing report', description: e?.message || '' }); }
              }}>Download Billing</Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="font-display">Patient Status Distribution</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Overview of patient statuses in the system</p>
                  </div>
                </CardHeader>
                <CardContent>
                  {patients.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">No patient data to display.</div>
                  ) : (
                    <div>
                      <Pie 
                        data={{ 
                          labels: statusLabels, 
                          datasets: [{ 
                            data: statusData, 
                            backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
                            borderColor: '#ffffff',
                            borderWidth: 2,
                            hoverOffset: 10
                          }] 
                        }} 
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom' as const,
                              labels: {
                                usePointStyle: true,
                                padding: 15,
                                font: { size: 12, weight: 'bold' }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                                  const percentage = ((context.parsed / total) * 100).toFixed(1);
                                  return `${context.label}: ${context.parsed} (${percentage}%)`;
                                }
                              }
                            }
                          }
                        }}
                      />
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Total Patients:</strong> {patients.length} patients across all statuses
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="font-display">Age Group Distribution</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Patient demographics by age brackets</p>
                  </div>
                </CardHeader>
                <CardContent>
                  {patients.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">No patient data to display.</div>
                  ) : (
                    <div>
                      <Bar 
                        data={{ 
                          labels: ageLabels, 
                          datasets: [{ 
                            label: 'Number of Patients', 
                            data: ageData, 
                            backgroundColor: ['#3B82F6', '#06B6D4', '#10B981', '#F59E0B'],
                            borderColor: ['#1D4ED8', '#0891B2', '#059669', '#D97706'],
                            borderWidth: 1,
                            borderRadius: 8,
                            hoverBackgroundColor: ['#1E40AF', '#0E7490', '#047857', '#D97706']
                          }] 
                        }} 
                        options={{ 
                          indexAxis: 'x',
                          responsive: true, 
                          plugins: { 
                            legend: { 
                              display: true,
                              labels: {
                                font: { weight: 'bold' }
                              }
                            },
                            tooltip: {
                              callbacks: {
                                label: function(context: any) {
                                  return `${context.parsed.y} patients`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                              },
                              ticks: {
                                font: { weight: 'bold' }
                              }
                            },
                            x: {
                              grid: { display: false },
                              ticks: { font: { weight: 'bold' } }
                            }
                          }
                        }} 
                      />
                      <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Dominant Age Group:</strong> {ageLabels[ageData.indexOf(Math.max(...ageData))] || 'N/A'} with {Math.max(...ageData)} patients
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div>
                    <CardTitle className="font-display">Patient Visits Trend</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">Monthly patient visit patterns over the last 6 months</p>
                  </div>
                </CardHeader>
                <CardContent>
                  {patients.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">No patient data to display.</div>
                  ) : (
                    <div>
                      <Line 
                        data={{ 
                          labels: months, 
                          datasets: [{ 
                            label: 'Monthly Visits', 
                            data: visitsData, 
                            borderColor: '#10B981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            tension: 0.4,
                            fill: true,
                            pointRadius: 6,
                            pointBackgroundColor: '#10B981',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointHoverRadius: 8,
                            borderWidth: 3
                          }] 
                        }} 
                        options={{ 
                          responsive: true,
                          plugins: {
                            legend: {
                              display: true,
                              labels: {
                                font: { weight: 'bold' }
                              }
                            },
                            tooltip: {
                              backgroundColor: 'rgba(0, 0, 0, 0.8)',
                              padding: 12,
                              cornerRadius: 8,
                              callbacks: {
                                label: function(context: any) {
                                  return `${context.parsed.y} visits`;
                                }
                              }
                            }
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                              },
                              ticks: {
                                font: { weight: 'bold' }
                              }
                            },
                            x: {
                              grid: { display: false },
                              ticks: { font: { weight: 'bold' } }
                            }
                          }
                        }} 
                      />
                      <div className="mt-4 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          <strong>Total Visits:</strong> {visitsData.reduce((a, b) => a + b, 0)} visits in the last 6 months
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Alerts */}
            <Card className="border-warning/50 bg-warning/5">
              <CardContent className="p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-warning" />
                <span className="text-sm"><strong>Low Stock Alert:</strong> Paracetamol and Amoxicillin are running low. Consider restocking soon.</span>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Check-In Tab (From FrontDeskCheckIn) */}
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
                    disabled={checkInLoading}
                    size="lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {checkInLoading ? 'Checking In...' : 'Check In Patient'}
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

          {/* Queue Analytics Tab */}
          <TabsContent value="queue-analytics" className="space-y-4 mt-4">
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

function PatientForm({ onCreated }: { onCreated?: () => void }){
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data: any) => {
    try{
      await createPatient(data);
      toast({ title: 'Patient created successfully' });
      reset();
      onCreated && onCreated();
    }catch(err:any){
      toast({ title: 'Failed to create patient', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div>
        <Input 
          placeholder="Full Name" 
          {...register('name', { required: 'Full name is required' })} 
        />
        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <Input 
          placeholder="Age" 
          type="number" 
          {...register('age', { 
            required: 'Age is required',
            min: { value: 0, message: 'Age must be positive' },
            max: { value: 150, message: 'Age must be realistic' }
          })} 
        />
        {errors.age && <p className="text-sm text-destructive mt-1">{errors.age.message}</p>}
      </div>
      <div>
        <Input 
          placeholder="Phone Number" 
          {...register('phone', { 
            required: 'Phone number is required',
            pattern: { value: /^\+?[\d\s\-\(\)]+$/, message: 'Invalid phone number format' }
          })} 
        />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
      </div>
      <Input placeholder="Last Visit Date (optional)" {...register('lastVisit')} />
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Patient'}
        </Button>
      </div>
    </form>
  );
}

function AppointmentForm({ onCreated }: { onCreated?: () => void }){
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data: any) => {
    try{
      await createAppointment(data);
      toast({ title: 'Appointment booked successfully' });
      reset();
      onCreated && onCreated();
    }catch(err:any){
      toast({ title: 'Failed to book appointment', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div>
        <Input 
          placeholder="Patient ID" 
          type="number"
          {...register('patientId', { 
            required: 'Patient ID is required',
            min: { value: 1, message: 'Patient ID must be positive' }
          })} 
        />
        {errors.patientId && <p className="text-sm text-destructive mt-1">{errors.patientId.message}</p>}
      </div>
      <div>
        <Input 
          placeholder="Appointment Time (ISO format)" 
          type="datetime-local"
          {...register('time', { required: 'Appointment time is required' })} 
        />
        {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
      </div>
      <div>
        <Input 
          placeholder="Appointment Type" 
          {...register('type', { required: 'Appointment type is required' })} 
        />
        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
      </div>
      <div>
        <select 
          {...register('status', { required: 'Status is required' })} 
          className="input"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
        </select>
        {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </Button>
      </div>
    </form>
  );
}

function PaymentForm({ onCreated }: { onCreated?: () => void }){
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data: any) => {
    try{
      await createBilling({ patientId: data.patientId, amount: Number(data.amount), status: data.status });
      toast({ title: 'Payment processed successfully' });
      reset();
      onCreated && onCreated();
    }catch(err:any){
      toast({ title: 'Failed to process payment', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div>
        <Input 
          placeholder="Patient ID" 
          type="number"
          {...register('patientId', { 
            required: 'Patient ID is required',
            min: { value: 1, message: 'Patient ID must be positive' }
          })} 
        />
        {errors.patientId && <p className="text-sm text-destructive mt-1">{errors.patientId.message}</p>}
      </div>
      <div>
        <Input 
          placeholder="Amount (KES)" 
          type="number" 
          step="0.01"
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be positive' }
          })} 
        />
        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <select 
          {...register('status', { required: 'Status is required' })} 
          className="input"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
        {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Process Payment'}
        </Button>
      </div>
    </form>
  );
}

export default Dashboard;


import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, CreditCard, Activity, TrendingUp, Clock, UserPlus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient, createAppointment, createBilling, getPatients, getAppointments, getUsers, getBilling } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [billing, setBilling] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
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
    } catch (err: any) {
      toast({ title: 'Failed to load dashboard data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
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

  // Get recent patients (last 4 patients)
  const recentPatients = patients.slice(-4).reverse().map((patient: any) => ({
    name: patient.name,
    time: patient.lastVisit ? new Date(patient.lastVisit).toLocaleString() : "Recently added",
    type: "New Patient",
    status: "Registered"
  }));
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
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
                onClick={() => navigate('/queue')}
                className="bg-warning text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity"
              >
                <Clock className="w-5 h-5" />
                <span className="font-medium">View Queue</span>
              </button>
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

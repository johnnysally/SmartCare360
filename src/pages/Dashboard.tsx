import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Calendar, CreditCard, Activity, TrendingUp, Clock, UserPlus, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPatient, createAppointment, createBilling } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { label: "Total Patients", value: "2,847", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Today's Appointments", value: "48", change: "+5", icon: Calendar, color: "text-info" },
  { label: "Revenue (Today)", value: "KES 156,400", change: "+8%", icon: CreditCard, color: "text-success" },
  { label: "Queue Length", value: "12", change: "-3", icon: Clock, color: "text-warning" },
];

const recentPatients = [
  { name: "Mary Wanjiku", time: "10 mins ago", type: "Check-up", status: "In Queue" },
  { name: "John Omondi", time: "25 mins ago", type: "Follow-up", status: "With Doctor" },
  { name: "Fatima Hassan", time: "45 mins ago", type: "Emergency", status: "Completed" },
  { name: "Peter Kamau", time: "1 hour ago", type: "Consultation", status: "Completed" },
];

const Dashboard = () => {
  const [dialogOpen, setDialogOpen] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
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
                {recentPatients.map((patient, index) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Dialog open={dialogOpen === 'patient'} onOpenChange={(open) => setDialogOpen(open ? 'patient' : null)}>
                <DialogTrigger asChild>
                  <button className="bg-primary text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <UserPlus className="w-5 h-5" />
                    <span className="font-medium">New Patient</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                  </DialogHeader>
                  <PatientForm onCreated={() => setDialogOpen(null)} />
                  <DialogFooter />
                </DialogContent>
              </Dialog>

              <Dialog open={dialogOpen === 'appointment'} onOpenChange={(open) => setDialogOpen(open ? 'appointment' : null)}>
                <DialogTrigger asChild>
                  <button className="bg-info text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <Calendar className="w-5 h-5" />
                    <span className="font-medium">Book Appointment</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Book Appointment</DialogTitle>
                  </DialogHeader>
                  <AppointmentForm onCreated={() => setDialogOpen(null)} />
                  <DialogFooter />
                </DialogContent>
              </Dialog>

              <Dialog open={dialogOpen === 'payment'} onOpenChange={(open) => setDialogOpen(open ? 'payment' : null)}>
                <DialogTrigger asChild>
                  <button className="bg-success text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity">
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Process Payment</span>
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Payment</DialogTitle>
                  </DialogHeader>
                  <PaymentForm onCreated={() => setDialogOpen(null)} />
                  <DialogFooter />
                </DialogContent>
              </Dialog>

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
  const { register, handleSubmit, reset } = useForm();
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
      <Input placeholder="Full Name" {...register('name')} />
      <Input placeholder="Age" type="number" {...register('age')} />
      <Input placeholder="Phone Number" {...register('phone')} />
      <Input placeholder="Last Visit Date" {...register('lastVisit')} />
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Create Patient</Button>
      </div>
    </form>
  );
}

function AppointmentForm({ onCreated }: { onCreated?: () => void }){
  const { register, handleSubmit, reset } = useForm();
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
      <Input placeholder="Patient ID" {...register('patientId')} />
      <Input placeholder="Appointment Time (ISO format)" {...register('time')} />
      <Input placeholder="Appointment Type" {...register('type')} />
      <select {...register('status')} className="input">
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Book Appointment</Button>
      </div>
    </form>
  );
}

function PaymentForm({ onCreated }: { onCreated?: () => void }){
  const { register, handleSubmit, reset } = useForm();
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
      <Input placeholder="Patient ID" {...register('patientId')} />
      <Input placeholder="Amount (KES)" type="number" {...register('amount')} />
      <select {...register('status')} className="input">
        <option value="pending">Pending</option>
        <option value="paid">Paid</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Process Payment</Button>
      </div>
    </form>
  );
}

export default Dashboard;

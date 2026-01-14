import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Appointments = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getAppointments();
        if (mounted) setAppointments(data || []);
      } catch (err: any) {
        toast({ title: 'Failed to load appointments', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <DashboardLayout title="Appointments">
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalIcon className="w-5 h-5" />
            <span>Today</span>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />New Appointment</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Appointment</DialogTitle>
              </DialogHeader>
              <AppointmentForm onCreated={async (a)=> setAppointments((s:any)=>[a,...s])} />
              <DialogFooter />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardHeader><CardTitle>Today's Schedule</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : (
              appointments.map((apt: any) => (
                <div key={apt.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{new Date(apt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div>
                      <div className="font-medium">{apt.patientId || apt.patient || 'Unknown'}</div>
                      <div className="text-sm text-muted-foreground">{apt.type || 'Appointment'}</div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${apt.status === "confirmed" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{apt.status}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Appointments;

function AppointmentForm({ onCreated }: { onCreated?: (a:any)=>void }){
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data: any) => {
    try{
      const created = await createAppointment(data);
      toast({ title: 'Appointment created' });
      onCreated && onCreated(created);
      reset();
    }catch(err:any){
      toast({ title: 'Failed to create appointment', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 p-2">
      <div>
        <Input 
          {...register('patientId', { 
            required: 'Patient ID is required',
            min: { value: 1, message: 'Patient ID must be positive' }
          })} 
          placeholder="Patient ID" 
          type="number"
        />
        {errors.patientId && <p className="text-sm text-destructive mt-1">{errors.patientId.message}</p>}
      </div>
      <div>
        <Input 
          {...register('time', { required: 'Time is required' })} 
          placeholder="Time (ISO)" 
          type="datetime-local"
        />
        {errors.time && <p className="text-sm text-destructive mt-1">{errors.time.message}</p>}
      </div>
      <div>
        <Input 
          {...register('type', { required: 'Type is required' })} 
          placeholder="Type" 
        />
        {errors.type && <p className="text-sm text-destructive mt-1">{errors.type.message}</p>}
      </div>
      <div>
        <select 
          {...register('status', { required: 'Status is required' })} 
          className="input"
        >
          <option value="">Select Status</option>
          <option value="pending">pending</option>
          <option value="confirmed">confirmed</option>
        </select>
        {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

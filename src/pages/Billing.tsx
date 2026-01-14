import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { getAppointments, getPatients, createBilling } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const Billing = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [appts, pats] = await Promise.all([getAppointments().catch(() => []), getPatients().catch(() => [])]);
        if (mounted) {
          setAppointments(appts || []);
          setPatients(pats || []);
        }
      } catch (err: any) {
        toast({ title: 'Failed to load billing data', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Simple revenue estimate: KES 3000 per appointment
  const revenue = appointments.length * 3000;
  const pending = 0; // no invoicing in backend yet

  return (
    <DashboardLayout title="Billing & Payments">
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card><CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Today's Revenue</div>
            <div className="text-3xl font-bold font-display text-success">KES {revenue.toLocaleString()}</div>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Pending Payments</div>
            <div className="text-3xl font-bold font-display text-warning">KES {pending.toLocaleString()}</div>
          </CardContent></Card>
          <Card><CardContent className="p-6">
            <div className="text-sm text-muted-foreground mb-1">Registered Patients</div>
            <div className="text-3xl font-bold font-display text-info">{patients.length}</div>
          </CardContent></Card>
        </div>

        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Invoice</DialogTitle>
              </DialogHeader>
              <BillingForm />
              <DialogFooter />
            </DialogContent>
          </Dialog>
          <Button variant="outline"><Smartphone className="w-4 h-4 mr-2" />M-Pesa</Button>
          <Button variant="outline"><CreditCard className="w-4 h-4 mr-2" />NHIF</Button>
        </div>

        <Card>
          <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full">
              <thead><tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3">Invoice</th><th className="pb-3">Patient</th><th className="pb-3">Amount</th><th className="pb-3">Method</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="py-6 text-center text-sm text-muted-foreground">Loading...</td></tr>
                ) : (
                  appointments.slice(0, 10).map((a: any, i) => (
                    <tr key={a.id || i} className="border-b last:border-0">
                      <td className="py-3 font-medium">INV-{i + 1}</td>
                      <td className="py-3">{a.patientId || a.patient || 'Unknown'}</td>
                      <td className="py-3 font-medium">KES 3,000</td>
                      <td className="py-3 text-sm">M-Pesa</td>
                      <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full bg-success/10 text-success`}>Paid</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;

function BillingForm(){
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      await createBilling({ patientId: data.patientId, amount: Number(data.amount), status: data.status });
      toast({ title: 'Invoice created' });
      reset();
    }catch(err:any){
      toast({ title: 'Failed to create invoice', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
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
          {...register('amount', { 
            required: 'Amount is required',
            min: { value: 0.01, message: 'Amount must be positive' }
          })} 
          placeholder="Amount" 
          type="number" 
          step="0.01"
        />
        {errors.amount && <p className="text-sm text-destructive mt-1">{errors.amount.message}</p>}
      </div>
      <div>
        <select 
          {...register('status', { required: 'Status is required' })} 
          className="input"
        >
          <option value="">Select Status</option>
          <option value="pending">pending</option>
          <option value="paid">paid</option>
        </select>
        {errors.status && <p className="text-sm text-destructive mt-1">{errors.status.message}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  );
}

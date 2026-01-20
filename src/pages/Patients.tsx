import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPatient } from "@/lib/api";
import { Search, Plus, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { getPatients } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getPatients();
        if (mounted) setPatients(data || []);
      } catch (err: any) {
        toast({ title: 'Failed to load patients', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <DashboardLayout title="Patients">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search patients..." className="pl-9" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />Add Patient</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Patient</DialogTitle>
                </DialogHeader>
                <PatientForm onCreated={async (p) => { setPatients((s:any)=>[p,...s]); }} />
                <DialogFooter />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card>
          <CardHeader><CardTitle>All Patients</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="border-b text-left text-sm text-muted-foreground">
                  <th className="pb-3">ID</th><th className="pb-3">Name</th><th className="pb-3">Age</th><th className="pb-3">Phone</th><th className="pb-3">Last Visit</th><th className="pb-3">Status</th>
                </tr></thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="py-6 text-center text-sm text-muted-foreground">Loading...</td></tr>
                  ) : (
                    patients.map((p: any) => (
                      <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 text-sm">{p.id}</td>
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3 text-sm">{p.age}</td>
                        <td className="py-3 text-sm">{p.phone}</td>
                        <td className="py-3 text-sm">{p.lastVisit}</td>
                        <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{p.status}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

function PatientForm({ onCreated }: { onCreated?: (p:any)=>void }){
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting } } = useForm({ defaultValues: { patientType: 'OPD', paymentMethod: 'cash' } });
  const patientType = watch('patientType');
  const paymentMethod = watch('paymentMethod');
  const { toast } = useToast();
  const onSubmit = async (data: any) => {
    try{
      const created = await createPatient(data);
      toast({ title: 'Patient created' });
      onCreated && onCreated(created);
      reset();
    }catch(err:any){
      toast({ title: 'Failed to create patient', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div>
        <Input 
          placeholder="Name" 
          {...register('name', { required: 'Name is required' })} 
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
          placeholder="Phone" 
          {...register('phone', { 
            required: 'Phone number is required',
            pattern: { value: /^\+?[\d\s\-\(\)]+$/, message: 'Invalid phone number format' }
          })} 
        />
        {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>}
      </div>
      <Input placeholder="Last Visit (optional)" {...register('lastVisit')} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Patient Type</label>
          <Select value={patientType} onValueChange={(v)=>setValue('patientType', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPD">Outpatient (OPD)</SelectItem>
              <SelectItem value="IPD">Inpatient (IPD)</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="FollowUp">Follow-Up</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Insurance">Insurance/Sponsored</SelectItem>
              <SelectItem value="Cash">Self-Pay / Cash</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="SpecialCare">Special Care</SelectItem>
              <SelectItem value="Chronic">Chronic Care</SelectItem>
              <SelectItem value="DayCare">Day-Care / Short-Stay</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Payment Method</label>
          <Select value={paymentMethod} onValueChange={(v)=>setValue('paymentMethod', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="mobile">Mobile Money</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Input placeholder="Patient Subtype (optional) e.g. Trauma, Maternity" {...register('patientSubType')} />
      <div className="flex justify-end gap-2">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create'}
        </Button>
      </div>
    </form>
  );
}

export default Patients;

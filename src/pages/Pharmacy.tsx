import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { createPharmacyOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const inventory = [
  { name: "Paracetamol 500mg", stock: 45, unit: "boxes", status: "Low" },
  { name: "Amoxicillin 250mg", stock: 23, unit: "boxes", status: "Low" },
  { name: "Ibuprofen 400mg", stock: 120, unit: "boxes", status: "OK" },
  { name: "Metformin 500mg", stock: 89, unit: "boxes", status: "OK" },
  { name: "Omeprazole 20mg", stock: 156, unit: "boxes", status: "OK" },
];

const Pharmacy = () => (
  <DashboardLayout title="Pharmacy & Inventory">
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search medications..." className="pl-9" />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />New Order</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Pharmacy Order</DialogTitle>
            </DialogHeader>
            <PharmacyForm />
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <span className="text-sm"><strong>2 items</strong> are running low on stock and need restocking.</span>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Inventory</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b text-left text-sm text-muted-foreground">
              <th className="pb-3">Medication</th><th className="pb-3">Stock</th><th className="pb-3">Unit</th><th className="pb-3">Status</th>
            </tr></thead>
            <tbody>
              {inventory.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-3 font-medium">{item.name}</td>
                  <td className="py-3">{item.stock}</td>
                  <td className="py-3 text-sm text-muted-foreground">{item.unit}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${item.status === "OK" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{item.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Pharmacy;

function PharmacyForm(){
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      await createPharmacyOrder({ patientId: data.patientId, items: [{ name: data.item, qty: Number(data.qty) }], total: Number(data.total), status: data.status });
      toast({ title: 'Order created' });
      reset();
    }catch(err:any){
      toast({ title: 'Failed to create order', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <input {...register('patientId')} placeholder="Patient ID" className="input" />
      <input {...register('item')} placeholder="Medication" className="input" />
      <input {...register('qty')} placeholder="Quantity" className="input" />
      <input {...register('total')} placeholder="Total" className="input" />
      <select {...register('status')} className="input">
        <option value="pending">pending</option>
        <option value="fulfilled">fulfilled</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Create Order</Button>
      </div>
    </form>
  );
}

import ReferralLayout from "@/components/ReferralLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRightLeft, Plus, Clock, CheckCircle2, ArrowRight, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { createReferral } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const referrals = [
  { id: "REF-001", patient: "John Omondi", from: "SmartCare Clinic", to: "Kenyatta Hospital", type: "Cardiology", status: "Pending", date: "Jan 5, 2026" },
  { id: "REF-002", patient: "Mary Wanjiku", from: "SmartCare Clinic", to: "Nairobi Hospital", type: "Oncology", status: "Accepted", date: "Jan 4, 2026" },
  { id: "REF-003", patient: "Peter Kamau", from: "SmartCare Clinic", to: "Aga Khan", type: "Neurology", status: "Completed", date: "Jan 3, 2026" },
  { id: "REF-004", patient: "Grace Akinyi", from: "Kiambu Clinic", to: "SmartCare Clinic", type: "General", status: "Pending", date: "Jan 5, 2026" },
];

const ReferralList = () => (
  <ReferralLayout title="Referrals">
    <div className="space-y-6 animate-fade-in">
      {/* Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Manage Referrals</h2>
          <p className="text-sm text-muted-foreground">Track incoming and outgoing patient referrals</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Referral
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Referral</DialogTitle>
            </DialogHeader>
            <ReferralForm />
            <DialogFooter />
          </DialogContent>
        </Dialog>
      </div>

      {/* Referrals Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-primary" />
            All Referrals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">From</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">To</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((ref) => (
                  <tr key={ref.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{ref.id}</td>
                    <td className="py-3 px-4 font-medium">{ref.patient}</td>
                    <td className="py-3 px-4">{ref.from}</td>
                    <td className="py-3 px-4">{ref.to}</td>
                    <td className="py-3 px-4">{ref.type}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{ref.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={ref.status === "Completed" ? "default" : ref.status === "Accepted" ? "secondary" : "outline"} className={ref.status === "Completed" ? "bg-success" : ""}>
                        {ref.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </ReferralLayout>
);

export default ReferralList;

function ReferralForm(){
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      const created = await createReferral({ patientId: data.patientId, fromFacility: data.from, toFacility: data.to, reason: data.reason });
      toast({ title: 'Referral created' });
      reset();
    }catch(err:any){
      toast({ title: 'Failed to create referral', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <input {...register('patientId')} placeholder="Patient ID" className="input" />
      <input {...register('from')} placeholder="From Facility" className="input" />
      <input {...register('to')} placeholder="To Facility" className="input" />
      <input {...register('reason')} placeholder="Reason" className="input" />
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Create Referral</Button>
      </div>
    </form>
  );
}

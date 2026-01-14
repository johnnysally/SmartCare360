import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Filter, Stethoscope, Pill, FlaskConical, UserCog } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { getUsers, createUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const departments = [
  { name: "Doctors", count: 24, icon: Stethoscope, color: "bg-primary" },
  { name: "Nurses", count: 38, icon: UserCog, color: "bg-secondary" },
  { name: "Pharmacy", count: 8, icon: Pill, color: "bg-accent" },
  { name: "Laboratory", count: 12, icon: FlaskConical, color: "bg-primary" },
];

const StaffManagement = () => {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUsers();
        if (mounted)
          setStaffMembers(
            (res || []).map((u: any) => ({
              id: u.id,
              name: u.name,
              role: u.role,
              department: '',
              shift: '',
              status: 'Active',
              patients: 0,
              initials: (u.name || '').split(' ').map((s: any) => s[0]).join('').slice(0, 2).toUpperCase(),
            }))
          );
      } catch (err: any) {
        toast({ title: 'Failed to load staff', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refresh = async () => {
    try {
      const res = await getUsers();
      setStaffMembers(
        (res || []).map((u: any) => ({
          id: u.id,
          name: u.name,
          role: u.role,
          department: '',
          shift: '',
          status: 'Active',
          patients: 0,
          initials: (u.name || '').split(' ').map((s: any) => s[0]).join('').slice(0, 2).toUpperCase(),
        }))
      );
    } catch (err: any) {
      toast({ title: 'Failed to refresh staff', description: err?.message || '' });
    }
  };

  return (
    <AdminLayout title="Staff Management">
      {/* Department Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {departments.map((dept) => (
          <Card key={dept.name} className="border-border/50">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg ${dept.color}/20 flex items-center justify-center`}>
                <dept.icon className={`w-5 h-5 ${dept.color === 'bg-primary' ? 'text-primary' : dept.color === 'bg-secondary' ? 'text-secondary' : 'text-accent'}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{dept.count}</p>
                <p className="text-sm text-muted-foreground">{dept.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="font-display">Staff Directory</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search staff..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Staff
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Staff</DialogTitle>
                  </DialogHeader>
                  <AddStaffForm onDone={() => refresh()} />
                  <DialogFooter />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
            ) : (
              staffMembers.map((staff) => (
                <Card key={staff.id} className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                          {staff.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{staff.name}</h3>
                        <p className="text-sm text-muted-foreground">{staff.role}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {staff.department}
                          </Badge>
                          <Badge 
                            variant="secondary"
                            className={`text-xs ${
                              staff.status === 'On Duty' ? 'bg-accent/20 text-accent' :
                              staff.status === 'On Break' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-muted text-muted-foreground'
                            }`}
                          >
                            {staff.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground">Shift: {staff.shift}</span>
                          {staff.patients > 0 && (
                            <span className="text-xs text-primary font-medium">{staff.patients} patients</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default StaffManagement;

function AddStaffForm({ onDone }: { onDone?: () => void }){
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      await createUser({ email: data.email, password: data.password, name: data.name, role: data.role });
      toast({ title: 'Staff created' });
      reset();
      onDone && onDone();
    }catch(err:any){
      toast({ title: 'Failed to create staff', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <input {...register('name')} placeholder="Full name" className="input" />
      <input {...register('email')} placeholder="Email" className="input" />
      <input {...register('password')} placeholder="Password" type="password" className="input" />
      <select {...register('role')} className="input">
        <option value="doctor">doctor</option>
        <option value="nurse">nurse</option>
        <option value="pharmacist">pharmacist</option>
        <option value="staff">staff</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Create Staff</Button>
      </div>
    </form>
  );
}

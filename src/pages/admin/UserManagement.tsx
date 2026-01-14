import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Plus, MoreHorizontal, Filter, Download, UserCheck, UserX, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { getUsers, createUser, updateUser, changeUserPassword, deleteUser } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUsers();
        if (mounted) setUsers(res || []);
      } catch (err: any) {
        toast({ title: 'Failed to load users', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const refresh = async () => {
    try {
      const res = await getUsers();
      setUsers(res || []);
    } catch (err:any){
      toast({ title: 'Failed to refresh users', description: err?.message || '' });
    }
  };

  return (
    <AdminLayout title="User Management">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">1,156</p>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <UserX className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">98</p>
              <p className="text-sm text-muted-foreground">Inactive Users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
              <UserX className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">30</p>
              <p className="text-sm text-muted-foreground">Suspended</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">45</p>
              <p className="text-sm text-muted-foreground">Pending Invites</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="font-display">All Users</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search users..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="w-4 h-4" />
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Invite / Create User</DialogTitle>
                  </DialogHeader>
                  <AddUserForm onDone={() => { refresh(); }} />
                  <DialogFooter />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'Active' ? 'default' : 'secondary'}
                      className={
                        user.status === 'Active' ? 'bg-accent/20 text-accent' :
                        user.status === 'Suspended' ? 'bg-destructive/20 text-destructive' :
                        'bg-muted text-muted-foreground'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            <EditUserForm user={user} onDone={() => refresh()} />
                            <DialogFooter />
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Change Password</DialogTitle>
                            </DialogHeader>
                            <ChangePasswordForm user={user} onDone={() => toast({ title: 'Password changed' })} />
                            <DialogFooter />
                          </DialogContent>
                        </Dialog>

                        <DropdownMenuItem className="text-destructive" onSelect={async () => { try { await deleteUser(user.id); toast({ title: 'Deleted user' }); refresh(); } catch(err:any){ toast({ title: 'Delete failed', description: err?.message || '' }); } }}>Delete User</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default UserManagement;

function AddUserForm({ onDone }: { onDone?: () => void }){
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      await createUser({ email: data.email, password: data.password, name: data.name, role: data.role });
      toast({ title: 'User created' });
      reset();
      onDone && onDone();
    }catch(err:any){
      toast({ title: 'Failed to create user', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <input {...register('name')} placeholder="Full name" className="input" />
      <input {...register('email')} placeholder="Email" className="input" />
      <input {...register('password')} placeholder="Password" type="password" className="input" />
      <select {...register('role')} className="input">
        <option value="admin">admin</option>
        <option value="doctor">doctor</option>
        <option value="nurse">nurse</option>
        <option value="pharmacist">pharmacist</option>
        <option value="staff">staff</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Create User</Button>
      </div>
    </form>
  );
}

function EditUserForm({ user, onDone }: any){
  const { register, handleSubmit } = useForm({ defaultValues: { name: user.name, role: user.role } });
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      await updateUser(user.id, { name: data.name, role: data.role });
      toast({ title: 'User updated' });
      onDone && onDone();
    }catch(err:any){
      toast({ title: 'Failed to update user', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <input {...register('name')} placeholder="Full name" className="input" />
      <select {...register('role')} className="input">
        <option value="admin">admin</option>
        <option value="doctor">doctor</option>
        <option value="nurse">nurse</option>
        <option value="pharmacist">pharmacist</option>
        <option value="staff">staff</option>
      </select>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Save</Button>
      </div>
    </form>
  );
}

function ChangePasswordForm({ user, onDone }: any){
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data:any) => {
    try{
      await changeUserPassword(user.id, { password: data.password });
      toast({ title: 'Password updated' });
      reset();
      onDone && onDone();
    }catch(err:any){
      toast({ title: 'Failed to update password', description: err?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <input {...register('password')} placeholder="New password" type="password" className="input" />
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient">Change Password</Button>
      </div>
    </form>
  );
}

import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Shield, Users, Edit, Trash2 } from "lucide-react";

const roles = [
  { id: 1, name: "Super Admin", description: "Full system access", users: 2, color: "bg-destructive" },
  { id: 2, name: "Admin", description: "Administrative access", users: 5, color: "bg-primary" },
  { id: 3, name: "Doctor", description: "Medical staff access", users: 24, color: "bg-secondary" },
  { id: 4, name: "Nurse", description: "Nursing staff access", users: 38, color: "bg-accent" },
  { id: 5, name: "Receptionist", description: "Front desk access", users: 12, color: "bg-primary" },
  { id: 6, name: "Pharmacist", description: "Pharmacy access", users: 8, color: "bg-secondary" },
  { id: 7, name: "Lab Technician", description: "Laboratory access", users: 10, color: "bg-accent" },
];

const permissions = [
  { module: "Dashboard", admin: true, doctor: true, nurse: true, receptionist: true, pharmacist: true, labTech: true },
  { module: "Patients - View", admin: true, doctor: true, nurse: true, receptionist: true, pharmacist: false, labTech: true },
  { module: "Patients - Edit", admin: true, doctor: true, nurse: true, receptionist: true, pharmacist: false, labTech: false },
  { module: "Appointments", admin: true, doctor: true, nurse: true, receptionist: true, pharmacist: false, labTech: false },
  { module: "Prescriptions", admin: true, doctor: true, nurse: false, receptionist: false, pharmacist: true, labTech: false },
  { module: "Lab Results", admin: true, doctor: true, nurse: true, receptionist: false, pharmacist: false, labTech: true },
  { module: "Billing", admin: true, doctor: false, nurse: false, receptionist: true, pharmacist: true, labTech: false },
  { module: "Pharmacy", admin: true, doctor: false, nurse: false, receptionist: false, pharmacist: true, labTech: false },
  { module: "Reports", admin: true, doctor: true, nurse: false, receptionist: false, pharmacist: false, labTech: false },
  { module: "User Management", admin: true, doctor: false, nurse: false, receptionist: false, pharmacist: false, labTech: false },
  { module: "System Settings", admin: true, doctor: false, nurse: false, receptionist: false, pharmacist: false, labTech: false },
];

const RolesPermissions = () => {
  return (
    <AdminLayout title="Roles & Permissions">
      {/* Roles Overview */}
      <Card className="border-border/50 mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-display">User Roles</CardTitle>
              <CardDescription>Manage roles and their permissions</CardDescription>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="border-border/50 hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg ${role.color}/20 flex items-center justify-center`}>
                      <Shield className={`w-5 h-5 ${role.color === 'bg-destructive' ? 'text-destructive' : role.color === 'bg-primary' ? 'text-primary' : role.color === 'bg-secondary' ? 'text-secondary' : 'text-accent'}`} />
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{role.description}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{role.users} users</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Permissions Matrix */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-display">Permissions Matrix</CardTitle>
          <CardDescription>Configure access permissions for each role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-48">Module</TableHead>
                  <TableHead className="text-center">Admin</TableHead>
                  <TableHead className="text-center">Doctor</TableHead>
                  <TableHead className="text-center">Nurse</TableHead>
                  <TableHead className="text-center">Receptionist</TableHead>
                  <TableHead className="text-center">Pharmacist</TableHead>
                  <TableHead className="text-center">Lab Tech</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {permissions.map((perm) => (
                  <TableRow key={perm.module}>
                    <TableCell className="font-medium">{perm.module}</TableCell>
                    <TableCell className="text-center">
                      <Switch checked={perm.admin} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={perm.doctor} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={perm.nurse} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={perm.receptionist} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={perm.pharmacist} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch checked={perm.labTech} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-end mt-4">
            <Button>Save Permissions</Button>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default RolesPermissions;

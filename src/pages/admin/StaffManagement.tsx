import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Plus, Filter, Stethoscope, Pill, FlaskConical, UserCog } from "lucide-react";

const staffMembers = [
  { 
    id: 1, 
    name: "Dr. Sarah Kimani", 
    role: "General Practitioner", 
    department: "General Medicine",
    shift: "Morning",
    status: "On Duty",
    patients: 12,
    initials: "SK"
  },
  { 
    id: 2, 
    name: "Dr. James Omondi", 
    role: "Pediatrician", 
    department: "Pediatrics",
    shift: "Morning",
    status: "On Duty",
    patients: 8,
    initials: "JO"
  },
  { 
    id: 3, 
    name: "Grace Wanjiku", 
    role: "Senior Nurse", 
    department: "Emergency",
    shift: "Night",
    status: "Off Duty",
    patients: 0,
    initials: "GW"
  },
  { 
    id: 4, 
    name: "Peter Ochieng", 
    role: "Pharmacist", 
    department: "Pharmacy",
    shift: "Morning",
    status: "On Duty",
    patients: 0,
    initials: "PO"
  },
  { 
    id: 5, 
    name: "Mary Akinyi", 
    role: "Lab Technician", 
    department: "Laboratory",
    shift: "Morning",
    status: "On Break",
    patients: 0,
    initials: "MA"
  },
  { 
    id: 6, 
    name: "John Mwangi", 
    role: "Receptionist", 
    department: "Front Desk",
    shift: "Morning",
    status: "On Duty",
    patients: 0,
    initials: "JM"
  },
];

const departments = [
  { name: "Doctors", count: 24, icon: Stethoscope, color: "bg-primary" },
  { name: "Nurses", count: 38, icon: UserCog, color: "bg-secondary" },
  { name: "Pharmacy", count: 8, icon: Pill, color: "bg-accent" },
  { name: "Laboratory", count: 12, icon: FlaskConical, color: "bg-primary" },
];

const StaffManagement = () => {
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
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Staff
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffMembers.map((staff) => (
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
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default StaffManagement;

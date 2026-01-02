import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Filter } from "lucide-react";

const patients = [
  { id: "P001", name: "Mary Wanjiku", age: 34, phone: "+254 712 345 678", lastVisit: "Jan 2, 2026", status: "Active" },
  { id: "P002", name: "John Omondi", age: 45, phone: "+254 723 456 789", lastVisit: "Dec 28, 2025", status: "Active" },
  { id: "P003", name: "Fatima Hassan", age: 28, phone: "+254 734 567 890", lastVisit: "Dec 20, 2025", status: "Active" },
  { id: "P004", name: "Peter Kamau", age: 52, phone: "+254 745 678 901", lastVisit: "Dec 15, 2025", status: "Inactive" },
];

const Patients = () => (
  <DashboardLayout title="Patients">
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search patients..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button>
          <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />Add Patient</Button>
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
                {patients.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="py-3 text-sm">{p.id}</td>
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-sm">{p.age}</td>
                    <td className="py-3 text-sm">{p.phone}</td>
                    <td className="py-3 text-sm">{p.lastVisit}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${p.status === "Active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Patients;

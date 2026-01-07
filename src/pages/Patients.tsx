import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default Patients;

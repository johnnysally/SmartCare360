import LabLayout from "@/components/LabLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, QrCode, Barcode, TestTubes, ArrowRight, CheckCircle2 } from "lucide-react";

const samples = [
  { barcode: "SMP-20240102-001", patient: "Mary Wanjiku", type: "Blood", status: "Collected", location: "Processing Lab", time: "09:45 AM" },
  { barcode: "SMP-20240102-002", patient: "John Omondi", type: "Urine", status: "In Transit", location: "Collection Point", time: "10:20 AM" },
  { barcode: "SMP-20240102-003", patient: "Fatima Hassan", type: "Blood", status: "Processing", location: "Hematology", time: "10:35 AM" },
  { barcode: "SMP-20240102-004", patient: "Peter Kamau", type: "Serum", status: "Completed", location: "Archive", time: "08:15 AM" },
  { barcode: "SMP-20240102-005", patient: "Grace Akinyi", type: "Blood", status: "Pending", location: "Reception", time: "11:00 AM" },
];

const workflow = [
  { step: "Collection", icon: TestTubes, count: 5 },
  { step: "Transit", icon: ArrowRight, count: 2 },
  { step: "Processing", icon: QrCode, count: 8 },
  { step: "Complete", icon: CheckCircle2, count: 32 },
];

const SampleTracking = () => (
  <LabLayout title="Sample Tracking">
    <div className="space-y-6 animate-fade-in">
      {/* Barcode Scanner Section */}
      <Card className="border-info/30 bg-info/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-info/20 flex items-center justify-center">
              <Barcode className="w-8 h-8 text-info" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-bold font-display">Scan Sample Barcode</h3>
              <p className="text-sm text-muted-foreground">Scan or enter barcode to track sample status</p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Input placeholder="Enter barcode..." className="md:w-64" />
              <Button className="btn-gradient">
                <QrCode className="w-4 h-4 mr-2" />
                Scan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {workflow.map((item, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center mx-auto mb-3">
                <item.icon className="w-6 h-6 text-info" />
              </div>
              <div className="text-2xl font-bold font-display">{item.count}</div>
              <div className="text-sm text-muted-foreground">{item.step}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sample List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TestTubes className="w-5 h-5 text-info" />
            Active Samples
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search samples..." className="pl-10 w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Barcode</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Location</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {samples.map((sample) => (
                  <tr key={sample.barcode} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{sample.barcode}</td>
                    <td className="py-3 px-4">{sample.patient}</td>
                    <td className="py-3 px-4">{sample.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{sample.location}</td>
                    <td className="py-3 px-4">
                      <Badge variant={sample.status === "Completed" ? "default" : "outline"} className={sample.status === "Completed" ? "bg-success" : ""}>
                        {sample.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{sample.time}</td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost">Update</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </LabLayout>
);

export default SampleTracking;

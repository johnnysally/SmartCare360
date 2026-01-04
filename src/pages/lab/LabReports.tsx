import LabLayout from "@/components/LabLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Printer, 
  Search, 
  Calendar,
  BarChart3,
  TrendingUp,
  Clock
} from "lucide-react";

const reports = [
  { id: "RPT-001", patient: "Mary Wanjiku", test: "Complete Blood Count", date: "Jan 2, 2026", status: "Verified", doctor: "Dr. Otieno" },
  { id: "RPT-002", patient: "John Omondi", test: "Lipid Profile", date: "Jan 2, 2026", status: "Verified", doctor: "Dr. Mwangi" },
  { id: "RPT-003", patient: "Fatima Hassan", test: "Liver Function Test", date: "Jan 1, 2026", status: "Verified", doctor: "Dr. Wanjiru" },
  { id: "RPT-004", patient: "Peter Kamau", test: "Thyroid Panel", date: "Jan 1, 2026", status: "Pending Review", doctor: "Dr. Otieno" },
  { id: "RPT-005", patient: "Grace Akinyi", test: "Renal Function", date: "Dec 31, 2025", status: "Verified", doctor: "Dr. Mwangi" },
];

const LabReports = () => (
  <LabLayout title="Lab Reports">
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Reports Today", value: "23", icon: FileText, color: "text-info" },
          { label: "Verified", value: "18", icon: TrendingUp, color: "text-success" },
          { label: "Pending Review", value: "5", icon: Clock, color: "text-warning" },
          { label: "This Week", value: "142", icon: BarChart3, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-info" />
            Generated Reports
          </CardTitle>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search reports..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="icon">
              <Calendar className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Report ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Test</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Doctor</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{report.id}</td>
                    <td className="py-3 px-4 font-medium">{report.patient}</td>
                    <td className="py-3 px-4">{report.test}</td>
                    <td className="py-3 px-4 text-muted-foreground">{report.doctor}</td>
                    <td className="py-3 px-4 text-muted-foreground">{report.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={report.status === "Verified" ? "default" : "secondary"} className={report.status === "Verified" ? "bg-success" : ""}>
                        {report.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
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

export default LabReports;

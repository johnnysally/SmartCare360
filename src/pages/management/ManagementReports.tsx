import ManagementLayout from "@/components/ManagementLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, BarChart3 } from "lucide-react";

const reports = [
  { name: "Monthly Revenue Report", type: "Financial", generated: "Jan 1, 2026", status: "Ready", size: "2.4 MB" },
  { name: "Patient Volume Analysis", type: "Operations", generated: "Jan 1, 2026", status: "Ready", size: "1.8 MB" },
  { name: "Staff Performance Review", type: "HR", generated: "Dec 31, 2025", status: "Ready", size: "3.2 MB" },
  { name: "Department KPIs Q4", type: "Performance", generated: "Dec 30, 2025", status: "Ready", size: "2.1 MB" },
  { name: "Annual Summary 2025", type: "Executive", generated: "Dec 28, 2025", status: "Ready", size: "5.4 MB" },
];

const ManagementReports = () => (
  <ManagementLayout title="Reports">
    <div className="space-y-6 animate-fade-in">
      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3 flex-wrap">
            <Button className="btn-gradient">
              <FileText className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Report
            </Button>
            <Button variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Custom Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Generated Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map((report, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{report.name}</div>
                    <div className="text-sm text-muted-foreground">{report.type} • {report.generated}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{report.size}</span>
                  <Badge className="bg-success">{report.status}</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ManagementLayout>
);

export default ManagementReports;

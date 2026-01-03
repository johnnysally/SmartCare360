import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Calendar,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Clock,
} from "lucide-react";

const reportTypes = [
  {
    id: 1,
    title: "Patient Statistics",
    description: "Overview of patient demographics, visits, and trends",
    icon: Users,
    lastGenerated: "Today, 2:30 PM",
    type: "Daily",
  },
  {
    id: 2,
    title: "Revenue Report",
    description: "Financial summary including billing, payments, and outstanding",
    icon: DollarSign,
    lastGenerated: "Today, 12:00 PM",
    type: "Daily",
  },
  {
    id: 3,
    title: "Staff Performance",
    description: "Staff productivity, patient load, and efficiency metrics",
    icon: Activity,
    lastGenerated: "Yesterday",
    type: "Weekly",
  },
  {
    id: 4,
    title: "Appointment Analytics",
    description: "Appointment patterns, no-shows, and scheduling efficiency",
    icon: Calendar,
    lastGenerated: "Jan 1, 2026",
    type: "Monthly",
  },
  {
    id: 5,
    title: "Inventory Report",
    description: "Pharmacy stock levels, usage trends, and reorder alerts",
    icon: FileText,
    lastGenerated: "Dec 31, 2025",
    type: "Weekly",
  },
  {
    id: 6,
    title: "System Usage",
    description: "User activity, feature usage, and system performance",
    icon: TrendingUp,
    lastGenerated: "Dec 30, 2025",
    type: "Monthly",
  },
];

const recentReports = [
  { name: "Patient_Statistics_2026-01-03.pdf", date: "Today, 2:30 PM", size: "2.4 MB" },
  { name: "Revenue_Report_2026-01-03.pdf", date: "Today, 12:00 PM", size: "1.8 MB" },
  { name: "Staff_Performance_Week1.pdf", date: "Yesterday", size: "3.2 MB" },
  { name: "Monthly_Summary_Dec2025.pdf", date: "Dec 31, 2025", size: "5.6 MB" },
];

const Reports = () => {
  return (
    <AdminLayout title="Reports">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-muted-foreground">Total Reports</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
              <Download className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">48</p>
              <p className="text-sm text-muted-foreground">Downloaded</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <Calendar className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">Jan 3</p>
              <p className="text-sm text-muted-foreground">Last Generated</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Types */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Generate Reports</CardTitle>
              <CardDescription>Select a report type to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reportTypes.map((report) => (
                  <Card key={report.id} className="border-border/50 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                          <report.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-semibold truncate">{report.title}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {report.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Last: {report.lastGenerated}</span>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Download className="w-3 h-3" />
                              Generate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <div>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Recent Reports</CardTitle>
              <CardDescription>Previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentReports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-5 h-5 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.date} • {report.size}</p>
                      </div>
                    </div>
                    <Button size="icon" variant="ghost">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;

import CHWLayout from "@/components/CHWLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar, Users, Baby, Home } from "lucide-react";

const reports = [
  { name: "Weekly Home Visits Summary", period: "Jan 1-6, 2026", visits: 24, households: 18, status: "Synced" },
  { name: "Maternal Health Report", period: "December 2025", pregnant: 12, postnatal: 8, status: "Synced" },
  { name: "Follow-up Completion", period: "December 2025", completed: 45, pending: 5, status: "Synced" },
  { name: "Immunization Coverage", period: "Q4 2025", children: 32, coverage: "94%", status: "Synced" },
];

const CHWReports = () => (
  <CHWLayout title="Reports">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Visits", value: "156", icon: Home, color: "text-primary" },
          { label: "Households", value: "89", icon: Users, color: "text-info" },
          { label: "Pregnant Women", value: "12", icon: Baby, color: "text-success" },
          { label: "Reports Synced", value: "8", icon: FileText, color: "text-warning" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Button className="btn-gradient">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Data
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
                    <div className="text-sm text-muted-foreground">{report.period}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-success">{report.status}</Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </CHWLayout>
);

export default CHWReports;

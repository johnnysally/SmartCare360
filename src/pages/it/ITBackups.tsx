import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download, Clock, CheckCircle2, HardDrive, RefreshCw } from "lucide-react";

const backups = [
  { id: 1, type: "Full Backup", database: "Main Database", size: "2.4 GB", time: "Jan 6, 2026 02:00 AM", status: "Completed", duration: "45 min" },
  { id: 2, type: "Incremental", database: "Main Database", size: "120 MB", time: "Jan 6, 2026 06:00 AM", status: "Completed", duration: "5 min" },
  { id: 3, type: "Full Backup", database: "File Storage", size: "8.2 GB", time: "Jan 5, 2026 02:00 AM", status: "Completed", duration: "2 hrs" },
  { id: 4, type: "Incremental", database: "Main Database", size: "85 MB", time: "Jan 5, 2026 18:00 PM", status: "Completed", duration: "3 min" },
  { id: 5, type: "Full Backup", database: "Logs Archive", size: "1.8 GB", time: "Jan 4, 2026 02:00 AM", status: "Completed", duration: "25 min" },
];

const ITBackups = () => (
  <ITLayout title="Backups">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Last Backup", value: "2h ago", icon: Clock, color: "text-success", bg: "bg-success/10" },
          { label: "Total Size", value: "45.6 GB", icon: HardDrive, color: "text-info", bg: "bg-info/10" },
          { label: "Backups (7 days)", value: "21", icon: Database, color: "text-primary", bg: "bg-primary/10" },
          { label: "Success Rate", value: "100%", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
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
              <RefreshCw className="w-4 h-4 mr-2" />
              Run Backup Now
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Latest
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            Backup History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Database</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {backups.map((backup) => (
                  <tr key={backup.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">{backup.type}</td>
                    <td className="py-3 px-4">{backup.database}</td>
                    <td className="py-3 px-4">{backup.size}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{backup.time}</td>
                    <td className="py-3 px-4">{backup.duration}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-success">{backup.status}</Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="ghost">
                        <Download className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </ITLayout>
);

export default ITBackups;

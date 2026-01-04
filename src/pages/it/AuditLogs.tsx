import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Filter, Download, User, Clock } from "lucide-react";

const logs = [
  { timestamp: "2026-01-02 09:45:32", user: "Dr. Otieno", action: "Viewed patient record", resource: "Patient #1234", ip: "192.168.1.45", status: "Success" },
  { timestamp: "2026-01-02 09:42:18", user: "Nurse Jane", action: "Updated vitals", resource: "Patient #1234", ip: "192.168.1.52", status: "Success" },
  { timestamp: "2026-01-02 09:38:05", user: "admin@clinic.com", action: "Login attempt", resource: "Admin Portal", ip: "41.89.12.45", status: "Failed" },
  { timestamp: "2026-01-02 09:35:22", user: "Lab Tech Peter", action: "Submitted results", resource: "Lab Order #567", ip: "192.168.1.60", status: "Success" },
  { timestamp: "2026-01-02 09:30:11", user: "System", action: "Backup completed", resource: "Database", ip: "localhost", status: "Success" },
  { timestamp: "2026-01-02 09:15:44", user: "Dr. Mwangi", action: "Created prescription", resource: "Rx #890", ip: "192.168.1.48", status: "Success" },
];

const AuditLogs = () => (
  <ITLayout title="Audit Logs">
    <div className="space-y-6 animate-fade-in">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-10" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-destructive" />
            System Audit Trail
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Timestamp</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Resource</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">IP Address</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        {log.user}
                      </div>
                    </td>
                    <td className="py-3 px-4">{log.action}</td>
                    <td className="py-3 px-4 text-muted-foreground">{log.resource}</td>
                    <td className="py-3 px-4 font-mono text-sm">{log.ip}</td>
                    <td className="py-3 px-4">
                      <Badge variant={log.status === "Success" ? "default" : "destructive"} className={log.status === "Success" ? "bg-success" : ""}>
                        {log.status}
                      </Badge>
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

export default AuditLogs;

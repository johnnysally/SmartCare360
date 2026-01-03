import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Filter, Download, RefreshCw, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

const logs = [
  { id: 1, timestamp: "2026-01-03 14:32:15", level: "info", action: "User Login", user: "Dr. Sarah Kimani", details: "Successful login from 192.168.1.100", module: "Auth" },
  { id: 2, timestamp: "2026-01-03 14:28:45", level: "warning", action: "Failed Login", user: "Unknown", details: "Invalid credentials for john@clinic.com", module: "Auth" },
  { id: 3, timestamp: "2026-01-03 14:25:10", level: "success", action: "Patient Created", user: "John Mwangi", details: "New patient record: PAT-2026-0142", module: "Patients" },
  { id: 4, timestamp: "2026-01-03 14:20:33", level: "info", action: "Prescription Created", user: "Dr. Sarah Kimani", details: "Prescription RX-2026-0089 for patient PAT-2026-0140", module: "Prescriptions" },
  { id: 5, timestamp: "2026-01-03 14:15:22", level: "error", action: "Payment Failed", user: "System", details: "M-Pesa timeout for transaction TXN-2026-0234", module: "Billing" },
  { id: 6, timestamp: "2026-01-03 14:10:05", level: "success", action: "Backup Complete", user: "System", details: "Automated daily backup completed successfully", module: "System" },
  { id: 7, timestamp: "2026-01-03 14:05:18", level: "info", action: "Role Updated", user: "Admin", details: "User grace.wanjiku promoted to Senior Nurse", module: "Admin" },
  { id: 8, timestamp: "2026-01-03 14:00:00", level: "info", action: "System Start", user: "System", details: "Application started successfully", module: "System" },
];

const getLevelIcon = (level: string) => {
  switch (level) {
    case 'error': return <AlertCircle className="w-4 h-4 text-destructive" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case 'success': return <CheckCircle className="w-4 h-4 text-accent" />;
    default: return <Info className="w-4 h-4 text-primary" />;
  }
};

const getLevelBadge = (level: string) => {
  const styles = {
    error: 'bg-destructive/20 text-destructive',
    warning: 'bg-yellow-500/20 text-yellow-600',
    success: 'bg-accent/20 text-accent',
    info: 'bg-primary/20 text-primary',
  };
  return styles[level as keyof typeof styles] || styles.info;
};

const SystemLogs = () => {
  return (
    <AdminLayout title="System Logs">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <Info className="w-8 h-8 text-primary" />
            <div>
              <p className="text-2xl font-bold">1,248</p>
              <p className="text-sm text-muted-foreground">Info Logs</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="w-8 h-8 text-accent" />
            <div>
              <p className="text-2xl font-bold">856</p>
              <p className="text-sm text-muted-foreground">Success</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
            <div>
              <p className="text-2xl font-bold">124</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-2xl font-bold">18</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="font-display">Activity Logs</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search logs..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{getLevelIcon(log.level)}</TableCell>
                  <TableCell className="font-mono text-sm text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={getLevelBadge(log.level)}>
                      {log.level}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell className="text-muted-foreground">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{log.module}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default SystemLogs;

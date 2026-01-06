import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, AlertTriangle, CheckCircle2, XCircle, Eye } from "lucide-react";

const securityEvents = [
  { id: 1, type: "Failed Login", user: "unknown@test.com", ip: "41.89.12.45", time: "10 min ago", severity: "High", status: "Investigating" },
  { id: 2, type: "Password Change", user: "dr.otieno@clinic.com", ip: "192.168.1.45", time: "1 hour ago", severity: "Info", status: "Normal" },
  { id: 3, type: "New Device Login", user: "nurse.jane@clinic.com", ip: "192.168.1.52", time: "2 hours ago", severity: "Medium", status: "Verified" },
  { id: 4, type: "Permission Change", user: "admin@clinic.com", ip: "192.168.1.10", time: "3 hours ago", severity: "Medium", status: "Normal" },
  { id: 5, type: "Bulk Data Export", user: "lab.tech@clinic.com", ip: "192.168.1.60", time: "5 hours ago", severity: "High", status: "Approved" },
];

const ITSecurity = () => (
  <ITLayout title="Security">
    <div className="space-y-6 animate-fade-in">
      {/* Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Security Score", value: "94%", icon: Shield, color: "text-success", bg: "bg-success/10" },
          { label: "Active Threats", value: "0", icon: AlertTriangle, color: "text-success", bg: "bg-success/10" },
          { label: "Failed Logins (24h)", value: "3", icon: XCircle, color: "text-warning", bg: "bg-warning/10" },
          { label: "Sessions Active", value: "24", icon: Lock, color: "text-primary", bg: "bg-primary/10" },
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

      {/* Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {securityEvents.map((event) => (
              <div key={event.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                event.severity === "High" && event.status === "Investigating" ? "border-destructive/50 bg-destructive/5" : "hover:bg-muted/50"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    event.severity === "High" ? "bg-destructive" :
                    event.severity === "Medium" ? "bg-warning" : "bg-info"
                  }`} />
                  <div>
                    <div className="font-medium">{event.type}</div>
                    <div className="text-sm text-muted-foreground">{event.user} • {event.ip}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{event.time}</span>
                  <Badge variant={event.status === "Investigating" ? "destructive" : "secondary"}>
                    {event.status}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ITLayout>
);

export default ITSecurity;

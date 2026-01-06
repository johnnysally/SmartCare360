import ITLayout from "@/components/ITLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Wifi, HardDrive, Activity, CheckCircle2, AlertTriangle } from "lucide-react";

const services = [
  { name: "Web Server", status: "Operational", uptime: "99.98%", cpu: 45, memory: 62, response: "120ms" },
  { name: "Database Server", status: "Operational", uptime: "99.95%", cpu: 38, memory: 75, response: "15ms" },
  { name: "API Gateway", status: "Operational", uptime: "99.99%", cpu: 22, memory: 45, response: "50ms" },
  { name: "File Storage", status: "Warning", uptime: "99.90%", cpu: 15, memory: 85, response: "200ms" },
  { name: "Email Service", status: "Operational", uptime: "99.97%", cpu: 8, memory: 30, response: "80ms" },
];

const ITSystemHealth = () => (
  <ITLayout title="System Health">
    <div className="space-y-6 animate-fade-in">
      {/* Overall Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Overall Status", value: "Healthy", icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
          { label: "Avg Response", value: "93ms", icon: Activity, color: "text-info", bg: "bg-info/10" },
          { label: "Uptime", value: "99.96%", icon: Server, color: "text-success", bg: "bg-success/10" },
          { label: "Active Services", value: "5/5", icon: Wifi, color: "text-success", bg: "bg-success/10" },
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

      {/* Services Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            Service Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, i) => (
              <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {service.status === "Operational" ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-warning" />
                    )}
                    <span className="font-medium">{service.name}</span>
                    <Badge variant={service.status === "Operational" ? "default" : "secondary"} className={service.status === "Operational" ? "bg-success" : ""}>
                      {service.status}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">Uptime: {service.uptime}</span>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">CPU</span>
                      <span>{service.cpu}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${service.cpu > 80 ? "bg-destructive" : service.cpu > 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${service.cpu}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Memory</span>
                      <span>{service.memory}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${service.memory > 80 ? "bg-destructive" : service.memory > 60 ? "bg-warning" : "bg-success"}`} style={{ width: `${service.memory}%` }} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Response</span>
                      <span>{service.response}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ITLayout>
);

export default ITSystemHealth;

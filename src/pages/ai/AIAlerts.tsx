import AILayout from "@/components/AILayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle2, XCircle, Eye } from "lucide-react";

const alerts = [
  { id: 1, patient: "John Omondi", type: "Sepsis Risk", score: 0.87, time: "5 min ago", severity: "Critical", status: "Active" },
  { id: 2, patient: "Mary Wanjiku", type: "Readmission Risk", score: 0.72, time: "15 min ago", severity: "High", status: "Active" },
  { id: 3, patient: "Peter Kamau", type: "Fall Risk", score: 0.65, time: "1 hour ago", severity: "Medium", status: "Reviewed" },
  { id: 4, patient: "Grace Akinyi", type: "Drug Interaction", score: 0.58, time: "2 hours ago", severity: "Medium", status: "Dismissed" },
  { id: 5, patient: "Fatima Hassan", type: "Deterioration", score: 0.45, time: "3 hours ago", severity: "Low", status: "Reviewed" },
];

const AIAlerts = () => (
  <AILayout title="AI Alerts">
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Critical Alerts", value: "3", color: "text-destructive", bg: "bg-destructive/10" },
          { label: "High Priority", value: "5", color: "text-warning", bg: "bg-warning/10" },
          { label: "Reviewed Today", value: "12", color: "text-success", bg: "bg-success/10" },
          { label: "Dismissed", value: "4", color: "text-muted-foreground", bg: "bg-muted" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <AlertTriangle className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Active Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                alert.severity === "Critical" ? "border-destructive/50 bg-destructive/5" : "hover:bg-muted/50"
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.severity === "Critical" ? "bg-destructive animate-pulse" :
                    alert.severity === "High" ? "bg-warning" :
                    alert.severity === "Medium" ? "bg-info" : "bg-muted-foreground"
                  }`} />
                  <div>
                    <div className="font-medium">{alert.patient}</div>
                    <div className="text-sm text-muted-foreground">{alert.type} • Score: {alert.score}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </div>
                  </div>
                  <Badge variant={alert.status === "Active" ? "destructive" : alert.status === "Reviewed" ? "default" : "secondary"}>
                    {alert.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </AILayout>
);

export default AIAlerts;

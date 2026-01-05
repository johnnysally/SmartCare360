import AILayout from "@/components/AILayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Activity,
  Users,
  Zap,
  Eye
} from "lucide-react";

const stats = [
  { label: "Active Predictions", value: "156", icon: Brain, change: "Real-time", color: "text-primary" },
  { label: "Risk Alerts", value: "12", icon: AlertTriangle, change: "3 critical", color: "text-destructive" },
  { label: "Trend Anomalies", value: "5", icon: TrendingUp, change: "This week", color: "text-warning" },
  { label: "Model Accuracy", value: "94.2%", icon: Target, change: "+2.1%", color: "text-success" },
];

const alerts = [
  { type: "Critical", message: "Patient P-1234: High sepsis risk score (0.87)", time: "5 min ago", action: "Review Now" },
  { type: "Warning", message: "Unusual spike in emergency admissions", time: "15 min ago", action: "Investigate" },
  { type: "Info", message: "Lab turnaround time trending above threshold", time: "1 hour ago", action: "View Details" },
];

const predictions = [
  { patient: "John Omondi", condition: "Diabetes Complication", risk: 0.78, trend: "Increasing" },
  { patient: "Mary Wanjiku", condition: "Readmission Risk", risk: 0.65, trend: "Stable" },
  { patient: "Peter Kamau", condition: "Fall Risk", risk: 0.82, trend: "Increasing" },
  { patient: "Grace Akinyi", condition: "Medication Interaction", risk: 0.45, trend: "Decreasing" },
];

const AIDashboard = () => (
  <AILayout title="AI Analytics Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* AI Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              AI-Generated Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-4 rounded-lg border transition-colors ${
                alert.type === "Critical" ? "border-destructive/30 bg-destructive/5" : 
                alert.type === "Warning" ? "border-warning/30 bg-warning/5" : "hover:bg-muted/50"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.type === "Critical" ? "bg-destructive animate-pulse" : 
                      alert.type === "Warning" ? "bg-warning" : "bg-info"
                    }`} />
                    <div>
                      <div className="text-sm">{alert.message}</div>
                      <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                    </div>
                  </div>
                  <Button size="sm" variant={alert.type === "Critical" ? "destructive" : "outline"}>
                    {alert.action}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Risk Predictions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Risk Predictions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {predictions.map((pred, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    pred.risk >= 0.7 ? "bg-destructive/10" : pred.risk >= 0.5 ? "bg-warning/10" : "bg-success/10"
                  }`}>
                    <Users className={`w-5 h-5 ${
                      pred.risk >= 0.7 ? "text-destructive" : pred.risk >= 0.5 ? "text-warning" : "text-success"
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{pred.patient}</div>
                    <div className="text-sm text-muted-foreground">{pred.condition}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold">{(pred.risk * 100).toFixed(0)}%</div>
                    <Badge variant="outline" className="text-xs">{pred.trend}</Badge>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Model Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: "Sepsis Prediction", accuracy: 94, precision: 91, recall: 88 },
              { label: "Readmission Risk", accuracy: 89, precision: 87, recall: 85 },
              { label: "Length of Stay", accuracy: 92, precision: 89, recall: 90 },
              { label: "Mortality Risk", accuracy: 96, precision: 94, recall: 93 },
            ].map((model, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="font-medium mb-3">{model.label}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{model.accuracy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Precision</span>
                    <span className="font-medium">{model.precision}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Recall</span>
                    <span className="font-medium">{model.recall}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </AILayout>
);

export default AIDashboard;

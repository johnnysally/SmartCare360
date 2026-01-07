import { useState, useEffect } from "react";
import AILayout from "@/components/AILayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, AreaChart, Area } from "recharts";
import { 
  Brain, 
  AlertTriangle, 
  TrendingUp, 
  Target,
  Activity,
  Users,
  Zap,
  Eye,
  Cpu,
  Sparkles,
  RefreshCw
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

const chartConfig = {
  predictions: { label: "Predictions", color: "hsl(174, 72%, 40%)" },
  accuracy: { label: "Accuracy", color: "hsl(142, 71%, 45%)" },
};

const AIDashboard = () => {
  const [realtimeData, setRealtimeData] = useState([
    { time: "00:00", predictions: 45, accuracy: 92 },
    { time: "04:00", predictions: 32, accuracy: 94 },
    { time: "08:00", predictions: 78, accuracy: 93 },
    { time: "12:00", predictions: 95, accuracy: 95 },
    { time: "16:00", predictions: 88, accuracy: 94 },
    { time: "20:00", predictions: 62, accuracy: 96 },
  ]);

  const [liveMetrics, setLiveMetrics] = useState({
    activeModels: 8,
    processingQueue: 24,
    avgLatency: 45,
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeModels: prev.activeModels,
        processingQueue: Math.max(0, prev.processingQueue + Math.floor(Math.random() * 5) - 2),
        avgLatency: Math.max(20, Math.min(80, prev.avgLatency + Math.floor(Math.random() * 10) - 5)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AILayout title="AI Analytics Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Live Status Bar */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-info/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                <span className="font-medium">AI System Online</span>
                <Badge variant="outline" className="border-success text-success">All Models Active</Badge>
              </div>
              <div className="flex items-center gap-4 sm:gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-primary" />
                  <span>{liveMetrics.activeModels} Models</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-info animate-spin" style={{ animationDuration: '3s' }} />
                  <span>{liveMetrics.processingQueue} Queued</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-success" />
                  <span>{liveMetrics.avgLatency}ms Latency</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="card-hover">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-xs text-muted-foreground">{stat.change}</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Real-time Trends */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Sparkles className="w-5 h-5 text-primary" />
              Real-time AI Performance
            </CardTitle>
            <Badge variant="outline" className="animate-pulse border-success text-success">
              <span className="w-2 h-2 rounded-full bg-success mr-2" />
              Live
            </Badge>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-56 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={realtimeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPredictions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="predictions" stroke="hsl(174, 72%, 40%)" fillOpacity={1} fill="url(#colorPredictions)" strokeWidth={2} />
                  <Area type="monotone" dataKey="accuracy" stroke="hsl(142, 71%, 45%)" fillOpacity={1} fill="url(#colorAccuracy)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* AI Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Zap className="w-5 h-5 text-primary" />
                AI-Generated Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-3 sm:p-4 rounded-lg border transition-colors ${
                  alert.type === "Critical" ? "border-destructive/30 bg-destructive/5" : 
                  alert.type === "Warning" ? "border-warning/30 bg-warning/5" : "hover:bg-muted/50"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        alert.type === "Critical" ? "bg-destructive animate-pulse" : 
                        alert.type === "Warning" ? "bg-warning" : "bg-info"
                      }`} />
                      <div>
                        <div className="text-sm">{alert.message}</div>
                        <div className="text-xs text-muted-foreground mt-1">{alert.time}</div>
                      </div>
                    </div>
                    <Button size="sm" variant={alert.type === "Critical" ? "destructive" : "outline"} className="w-full sm:w-auto">
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
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Target className="w-5 h-5 text-primary" />
                Risk Predictions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {predictions.map((pred, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center ${
                      pred.risk >= 0.7 ? "bg-destructive/10" : pred.risk >= 0.5 ? "bg-warning/10" : "bg-success/10"
                    }`}>
                      <Users className={`w-4 h-4 sm:w-5 sm:h-5 ${
                        pred.risk >= 0.7 ? "text-destructive" : pred.risk >= 0.5 ? "text-warning" : "text-success"
                      }`} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{pred.patient}</div>
                      <div className="text-xs sm:text-sm text-muted-foreground truncate">{pred.condition}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="font-bold text-sm sm:text-base">{(pred.risk * 100).toFixed(0)}%</div>
                      <Badge variant="outline" className="text-xs hidden sm:inline-flex">{pred.trend}</Badge>
                    </div>
                    <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
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
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Model Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: "Sepsis Prediction", accuracy: 94, precision: 91, recall: 88, status: "active" },
                { label: "Readmission Risk", accuracy: 89, precision: 87, recall: 85, status: "active" },
                { label: "Length of Stay", accuracy: 92, precision: 89, recall: 90, status: "training" },
                { label: "Mortality Risk", accuracy: 96, precision: 94, recall: 93, status: "active" },
              ].map((model, i) => (
                <div key={i} className="p-4 rounded-lg border relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-sm sm:text-base">{model.label}</div>
                    <Badge variant={model.status === "active" ? "default" : "secondary"} className={model.status === "active" ? "bg-success" : ""}>
                      {model.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">{model.accuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Precision</span>
                      <span className="font-semibold">{model.precision}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recall</span>
                      <span className="font-semibold">{model.recall}%</span>
                    </div>
                  </div>
                  {model.status === "training" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
                      <div className="h-full bg-primary animate-pulse" style={{ width: "60%" }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AILayout>
  );
};

export default AIDashboard;

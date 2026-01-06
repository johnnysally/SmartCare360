import AILayout from "@/components/AILayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Activity, BarChart3 } from "lucide-react";

const trends = [
  { metric: "Emergency Admissions", current: 45, previous: 38, change: "+18%", up: true, status: "Increasing" },
  { metric: "Average Wait Time", current: 25, previous: 32, change: "-22%", up: false, status: "Decreasing" },
  { metric: "Lab Turnaround", current: 48, previous: 42, change: "+14%", up: true, status: "Increasing" },
  { metric: "Patient Satisfaction", current: 4.2, previous: 4.0, change: "+5%", up: true, status: "Improving" },
  { metric: "Bed Occupancy", current: 85, previous: 78, change: "+9%", up: true, status: "High" },
  { metric: "Readmission Rate", current: 8, previous: 12, change: "-33%", up: false, status: "Improving" },
];

const AITrends = () => (
  <AILayout title="Trend Analysis">
    <div className="space-y-6 animate-fade-in">
      {/* Trend Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {trends.map((trend, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  trend.up ? "bg-warning/10" : "bg-success/10"
                }`}>
                  {trend.up ? (
                    <TrendingUp className="w-6 h-6 text-warning" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-success" />
                  )}
                </div>
                <span className={`text-sm font-medium ${trend.up ? "text-warning" : "text-success"}`}>
                  {trend.change}
                </span>
              </div>
              <div className="text-3xl font-bold font-display">{trend.current}</div>
              <div className="text-sm text-muted-foreground">{trend.metric}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Previous: {trend.previous} • {trend.status}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Trend Visualization
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <BarChart3 className="w-16 h-16 opacity-20" />
          <span className="ml-4">Interactive trend charts would appear here</span>
        </CardContent>
      </Card>
    </div>
  </AILayout>
);

export default AITrends;

import AILayout from "@/components/AILayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target, Eye, TrendingUp, TrendingDown } from "lucide-react";

const riskScores = [
  { patient: "John Omondi", age: 58, risk: "Diabetes Complication", score: 78, trend: "Increasing", admission: "2 days ago" },
  { patient: "Mary Wanjiku", age: 42, risk: "Readmission", score: 65, trend: "Stable", admission: "5 days ago" },
  { patient: "Peter Kamau", age: 71, risk: "Fall Risk", score: 82, trend: "Increasing", admission: "1 day ago" },
  { patient: "Grace Akinyi", age: 35, risk: "Medication Interaction", score: 45, trend: "Decreasing", admission: "3 days ago" },
  { patient: "Fatima Hassan", age: 63, risk: "Sepsis", score: 55, trend: "Stable", admission: "4 days ago" },
];

const AIRiskScores = () => (
  <AILayout title="Risk Scores">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "High Risk (>70)", value: "8", color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Medium Risk (40-70)", value: "15", color: "text-warning", bg: "bg-warning/10" },
          { label: "Low Risk (<40)", value: "42", color: "text-success", bg: "bg-success/10" },
          { label: "Total Monitored", value: "65", color: "text-primary", bg: "bg-primary/10" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Target className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Patient Risk Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Age</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk Type</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Trend</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riskScores.map((patient, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{patient.patient}</td>
                    <td className="py-3 px-4">{patient.age}</td>
                    <td className="py-3 px-4">{patient.risk}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              patient.score > 70 ? "bg-destructive" : patient.score > 40 ? "bg-warning" : "bg-success"
                            }`}
                            style={{ width: `${patient.score}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{patient.score}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={patient.trend === "Increasing" ? "destructive" : patient.trend === "Decreasing" ? "default" : "secondary"}>
                        {patient.trend === "Increasing" && <TrendingUp className="w-3 h-3 mr-1" />}
                        {patient.trend === "Decreasing" && <TrendingDown className="w-3 h-3 mr-1" />}
                        {patient.trend}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View
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
  </AILayout>
);

export default AIRiskScores;

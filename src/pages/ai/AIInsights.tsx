import AILayout from "@/components/AILayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, Users, Clock, CheckCircle2 } from "lucide-react";

const insights = [
  { 
    title: "Optimize Morning Staffing", 
    description: "Data shows 40% higher patient volume between 8-10 AM. Consider adding 2 nurses during this period.",
    impact: "High",
    category: "Operations",
    status: "New"
  },
  { 
    title: "Lab Workflow Improvement", 
    description: "CBC tests taking 30% longer than benchmark. Recommended workflow changes could save 15 min/test.",
    impact: "Medium",
    category: "Laboratory",
    status: "Under Review"
  },
  { 
    title: "Diabetic Patient Follow-ups", 
    description: "15 diabetic patients overdue for HbA1c testing. Automated reminders could improve compliance.",
    impact: "High",
    category: "Patient Care",
    status: "New"
  },
  { 
    title: "Pharmacy Stock Alert", 
    description: "Metformin 500mg usage trending 25% higher. Recommend increasing order quantity next month.",
    impact: "Medium",
    category: "Pharmacy",
    status: "Implemented"
  },
];

const AIInsights = () => (
  <AILayout title="AI Insights">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "New Insights", value: "5", icon: Lightbulb, color: "text-primary" },
          { label: "Under Review", value: "3", icon: Clock, color: "text-warning" },
          { label: "Implemented", value: "12", icon: CheckCircle2, color: "text-success" },
          { label: "Total Impact", value: "+18%", icon: TrendingUp, color: "text-info" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
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

      {/* Insights List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            Actionable Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, i) => (
            <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">{insight.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      insight.impact === "High" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                    }`}>
                      {insight.impact} Impact
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs bg-muted text-muted-foreground">
                      {insight.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    insight.status === "New" ? "bg-primary/10 text-primary" :
                    insight.status === "Under Review" ? "bg-warning/10 text-warning" :
                    "bg-success/10 text-success"
                  }`}>
                    {insight.status}
                  </span>
                  {insight.status !== "Implemented" && (
                    <Button size="sm" variant="outline">Take Action</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </AILayout>
);

export default AIInsights;

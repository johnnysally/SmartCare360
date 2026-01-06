import ManagementLayout from "@/components/ManagementLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart3, TrendingUp, Users, Activity } from "lucide-react";

const ManagementAnalytics = () => (
  <ManagementLayout title="Analytics">
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Monthly Visits", value: "3,245", icon: Users, change: "+12%" },
          { label: "Avg Revenue/Patient", value: "KES 4,500", icon: TrendingUp, change: "+8%" },
          { label: "Capacity Utilization", value: "78%", icon: Activity, change: "+5%" },
          { label: "Patient Satisfaction", value: "4.6/5", icon: BarChart3, change: "+0.2" },
        ].map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-sm text-success">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Revenue by Department
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <BarChart3 className="w-16 h-16 opacity-20" />
            <span className="ml-4">Department revenue chart</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Patient Demographics
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
            <PieChart className="w-16 h-16 opacity-20" />
            <span className="ml-4">Demographics pie chart</span>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center text-muted-foreground">
          <Activity className="w-16 h-16 opacity-20" />
          <span className="ml-4">Interactive trend analysis chart</span>
        </CardContent>
      </Card>
    </div>
  </ManagementLayout>
);

export default ManagementAnalytics;

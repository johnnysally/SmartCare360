import LabLayout from "@/components/LabLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FlaskConical, 
  TestTubes, 
  Clock, 
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Beaker
} from "lucide-react";

const stats = [
  { label: "Pending Tests", value: "24", icon: Clock, change: "+3 today", color: "text-warning" },
  { label: "In Progress", value: "12", icon: Beaker, change: "Active now", color: "text-info" },
  { label: "Completed Today", value: "47", icon: CheckCircle2, change: "+8 from yesterday", color: "text-success" },
  { label: "Critical Results", value: "3", icon: AlertTriangle, change: "Needs attention", color: "text-destructive" },
];

const recentSamples = [
  { id: "LAB-2024-001", patient: "Mary Wanjiku", test: "Complete Blood Count", status: "Processing", priority: "Normal" },
  { id: "LAB-2024-002", patient: "John Omondi", test: "Lipid Profile", status: "Pending", priority: "Urgent" },
  { id: "LAB-2024-003", patient: "Fatima Hassan", test: "Liver Function Test", status: "Completed", priority: "Normal" },
  { id: "LAB-2024-004", patient: "Peter Kamau", test: "Urinalysis", status: "Processing", priority: "Normal" },
  { id: "LAB-2024-005", patient: "Grace Akinyi", test: "Blood Glucose", status: "Pending", priority: "Critical" },
];

const LabDashboard = () => (
  <LabLayout title="Laboratory Dashboard">
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Samples */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <TestTubes className="w-5 h-5 text-info" />
              Recent Samples
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSamples.map((sample) => (
                <div key={sample.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                      <FlaskConical className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <div className="font-medium">{sample.patient}</div>
                      <div className="text-sm text-muted-foreground">{sample.id} • {sample.test}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={sample.priority === "Critical" ? "destructive" : sample.priority === "Urgent" ? "default" : "secondary"}>
                      {sample.priority}
                    </Badge>
                    <Badge variant={sample.status === "Completed" ? "default" : "outline"} className={sample.status === "Completed" ? "bg-success" : ""}>
                      {sample.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start btn-gradient" size="lg">
              <TestTubes className="w-5 h-5 mr-3" />
              New Sample Entry
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <FlaskConical className="w-5 h-5 mr-3" />
              Enter Results
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <CheckCircle2 className="w-5 h-5 mr-3" />
              Verify Results
            </Button>
            <Button variant="outline" className="w-full justify-start" size="lg">
              <AlertTriangle className="w-5 h-5 mr-3" />
              View Critical Alerts
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </LabLayout>
);

export default LabDashboard;

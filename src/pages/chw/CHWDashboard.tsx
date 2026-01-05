import CHWLayout from "@/components/CHWLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Baby, 
  MapPin, 
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

const stats = [
  { label: "Households", value: "156", icon: Users, change: "Assigned", color: "text-warning" },
  { label: "Follow-ups Due", value: "12", icon: Clock, change: "This week", color: "text-info" },
  { label: "Pregnant Women", value: "8", icon: Baby, change: "Monitoring", color: "text-success" },
  { label: "Pending Visits", value: "5", icon: MapPin, change: "Today", color: "text-primary" },
];

const todayVisits = [
  { name: "Mary Auma", address: "House 45, Zone 5", type: "Antenatal Checkup", time: "09:00 AM", status: "Pending" },
  { name: "Jane Otieno", address: "House 23, Zone 5", type: "Child Immunization", time: "10:30 AM", status: "Pending" },
  { name: "Susan Wambui", address: "House 67, Zone 5", type: "Follow-up Visit", time: "11:30 AM", status: "Completed" },
  { name: "Grace Nyambura", address: "House 12, Zone 5", type: "Postnatal Care", time: "02:00 PM", status: "Pending" },
];

const alerts = [
  { message: "Mary Auma - 38 weeks pregnant, needs urgent check", priority: "High" },
  { message: "Child vaccination due - Jane Otieno's baby", priority: "Medium" },
  { message: "Missed appointment follow-up needed", priority: "Low" },
];

const CHWDashboard = () => (
  <CHWLayout title="Community Dashboard">
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
        {/* Today's Visits */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-warning" />
              Today's Home Visits
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayVisits.map((visit, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${visit.status === "Completed" ? "bg-success" : "bg-warning"}`} />
                  <div>
                    <div className="font-medium">{visit.name}</div>
                    <div className="text-sm text-muted-foreground">{visit.address}</div>
                    <div className="text-xs text-muted-foreground mt-1">{visit.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium">{visit.time}</div>
                  </div>
                  <Badge variant={visit.status === "Completed" ? "default" : "secondary"} className={visit.status === "Completed" ? "bg-success" : ""}>
                    {visit.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Priority Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {alerts.map((alert, i) => (
              <div key={i} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.priority === "High" ? "bg-destructive" : 
                    alert.priority === "Medium" ? "bg-warning" : "bg-info"
                  }`} />
                  <div className="flex-1">
                    <div className="text-sm">{alert.message}</div>
                    <Badge variant="outline" className="mt-2 text-xs">{alert.priority}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button className="btn-gradient">
              <MapPin className="w-4 h-4 mr-2" />
              Start Home Visit
            </Button>
            <Button variant="outline">
              <Baby className="w-4 h-4 mr-2" />
              Record ANC Visit
            </Button>
            <Button variant="outline">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Log Immunization
            </Button>
            <Button variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Register Household
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </CHWLayout>
);

export default CHWDashboard;

import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  HeartPulse, 
  Pill, 
  Users, 
  AlertTriangle,
  Clock,
  ArrowRight,
  Activity,
  CheckCircle2
} from "lucide-react";

const stats = [
  { label: "Patients Assigned", value: "12", icon: Users, change: "Ward A", color: "text-success" },
  { label: "Vitals Due", value: "5", icon: HeartPulse, change: "Next 30 min", color: "text-warning" },
  { label: "Medications Due", value: "8", icon: Pill, change: "Pending", color: "text-info" },
  { label: "Critical Alerts", value: "2", icon: AlertTriangle, change: "Needs attention", color: "text-destructive" },
];

const patients = [
  { name: "Mary Wanjiku", bed: "A-101", status: "Stable", nextVitals: "09:30 AM", alert: false },
  { name: "John Omondi", bed: "A-102", status: "Monitoring", nextVitals: "09:00 AM", alert: true },
  { name: "Fatima Hassan", bed: "A-103", status: "Stable", nextVitals: "10:00 AM", alert: false },
  { name: "Peter Kamau", bed: "A-104", status: "Critical", nextVitals: "ASAP", alert: true },
];

const tasks = [
  { task: "Blood pressure check - Room A-101", time: "09:00 AM", completed: false, priority: "Normal" },
  { task: "Medication round - Ward A", time: "09:30 AM", completed: false, priority: "High" },
  { task: "IV fluid change - Room A-104", time: "10:00 AM", completed: false, priority: "Urgent" },
  { task: "Wound dressing - Room A-102", time: "08:30 AM", completed: true, priority: "Normal" },
];

const NurseDashboard = () => (
  <NurseLayout title="Nurse Dashboard">
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
        {/* Patient List */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-success" />
              My Patients
            </CardTitle>
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {patients.map((patient, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${patient.status === "Critical" ? "bg-destructive animate-pulse" : patient.status === "Monitoring" ? "bg-warning" : "bg-success"}`} />
                  <div>
                    <div className="font-medium">{patient.name}</div>
                    <div className="text-sm text-muted-foreground">Bed {patient.bed}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Next Vitals</div>
                    <div className="text-sm font-medium">{patient.nextVitals}</div>
                  </div>
                  {patient.alert && (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-success" />
              Today's Tasks
            </CardTitle>
            <Badge variant="outline">{tasks.filter(t => !t.completed).length} pending</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            {tasks.map((task, i) => (
              <div key={i} className={cn("flex items-center gap-4 p-3 rounded-lg border transition-colors", task.completed ? "opacity-60" : "hover:bg-muted/50")}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("w-8 h-8 rounded-full", task.completed ? "text-success" : "text-muted-foreground")}
                >
                  {task.completed ? <CheckCircle2 className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </Button>
                <div className="flex-1">
                  <div className={cn("font-medium", task.completed && "line-through")}>{task.task}</div>
                  <div className="text-sm text-muted-foreground">{task.time}</div>
                </div>
                <Badge 
                  variant={task.priority === "Urgent" ? "destructive" : task.priority === "High" ? "default" : "secondary"}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </NurseLayout>
);

// Add cn import
import { cn } from "@/lib/utils";

export default NurseDashboard;

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, CreditCard, Activity, TrendingUp, Clock, UserPlus, AlertCircle } from "lucide-react";

const stats = [
  { label: "Total Patients", value: "2,847", change: "+12%", icon: Users, color: "text-primary" },
  { label: "Today's Appointments", value: "48", change: "+5", icon: Calendar, color: "text-info" },
  { label: "Revenue (Today)", value: "KES 156,400", change: "+8%", icon: CreditCard, color: "text-success" },
  { label: "Queue Length", value: "12", change: "-3", icon: Clock, color: "text-warning" },
];

const recentPatients = [
  { name: "Mary Wanjiku", time: "10 mins ago", type: "Check-up", status: "In Queue" },
  { name: "John Omondi", time: "25 mins ago", type: "Follow-up", status: "With Doctor" },
  { name: "Fatima Hassan", time: "45 mins ago", type: "Emergency", status: "Completed" },
  { name: "Peter Kamau", time: "1 hour ago", type: "Consultation", status: "Completed" },
];

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Patients */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display">Recent Patients</CardTitle>
              <UserPlus className="w-5 h-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                        {patient.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-medium">{patient.name}</div>
                        <div className="text-sm text-muted-foreground">{patient.type} • {patient.time}</div>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      patient.status === "In Queue" ? "bg-warning/10 text-warning" :
                      patient.status === "With Doctor" ? "bg-info/10 text-info" :
                      "bg-success/10 text-success"
                    }`}>
                      {patient.status}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                { label: "New Patient", icon: UserPlus, color: "bg-primary" },
                { label: "Book Appointment", icon: Calendar, color: "bg-info" },
                { label: "Process Payment", icon: CreditCard, color: "bg-success" },
                { label: "View Queue", icon: Clock, color: "bg-warning" },
              ].map((action, index) => (
                <button key={index} className={`${action.color} text-white p-4 rounded-xl flex items-center gap-3 hover:opacity-90 transition-opacity`}>
                  <action.icon className="w-5 h-5" />
                  <span className="font-medium">{action.label}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-warning" />
            <span className="text-sm"><strong>Low Stock Alert:</strong> Paracetamol and Amoxicillin are running low. Consider restocking soon.</span>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

import ManagementLayout from "@/components/ManagementLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Star,
  Clock,
  TrendingUp,
  Award
} from "lucide-react";

const staffPerformance = [
  { name: "Dr. Otieno", role: "General Practitioner", patients: 145, rating: 4.8, efficiency: 92 },
  { name: "Dr. Mwangi", role: "Cardiologist", patients: 98, rating: 4.9, efficiency: 95 },
  { name: "Dr. Wanjiru", role: "Pediatrician", patients: 120, rating: 4.7, efficiency: 88 },
  { name: "Nurse Jane", role: "Head Nurse", patients: 210, rating: 4.6, efficiency: 90 },
  { name: "Lab Tech. Peter", role: "Senior Lab Tech", patients: 180, rating: 4.5, efficiency: 94 },
];

const departmentMetrics = [
  { dept: "Outpatient", avgWait: "15 min", satisfaction: 92, efficiency: 88 },
  { dept: "Emergency", avgWait: "8 min", satisfaction: 85, efficiency: 95 },
  { dept: "Laboratory", avgWait: "25 min", satisfaction: 88, efficiency: 90 },
  { dept: "Pharmacy", avgWait: "12 min", satisfaction: 90, efficiency: 85 },
];

const Performance = () => (
  <ManagementLayout title="Staff Performance">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: "48", icon: Users, color: "text-primary" },
          { label: "Avg Rating", value: "4.7", icon: Star, color: "text-warning" },
          { label: "Avg Efficiency", value: "91%", icon: TrendingUp, color: "text-success" },
          { label: "Top Performers", value: "12", icon: Award, color: "text-accent" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Staff Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            Individual Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Staff Member</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patients Seen</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Rating</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Efficiency</th>
                </tr>
              </thead>
              <tbody>
                {staffPerformance.map((staff, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{staff.name}</td>
                    <td className="py-3 px-4 text-muted-foreground">{staff.role}</td>
                    <td className="py-3 px-4">{staff.patients}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        {staff.rating}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant={staff.efficiency >= 90 ? "default" : "secondary"} className={staff.efficiency >= 90 ? "bg-success" : ""}>
                        {staff.efficiency}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Department Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-accent" />
            Department Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {departmentMetrics.map((dept, i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="font-medium mb-3">{dept.dept}</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg Wait</span>
                    <span className="font-medium">{dept.avgWait}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Satisfaction</span>
                    <span className="font-medium">{dept.satisfaction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Efficiency</span>
                    <span className="font-medium">{dept.efficiency}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ManagementLayout>
);

export default Performance;

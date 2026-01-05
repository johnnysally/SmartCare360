import CHWLayout from "@/components/CHWLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Baby, Heart, Calendar, AlertTriangle, Plus } from "lucide-react";

const pregnantWomen = [
  { name: "Mary Auma", weeks: 38, edd: "Jan 15, 2026", anc: 6, risk: "High", lastVisit: "Dec 28, 2025" },
  { name: "Grace Nyambura", weeks: 32, edd: "Feb 28, 2026", anc: 5, risk: "Low", lastVisit: "Jan 1, 2026" },
  { name: "Faith Wanjiru", weeks: 24, edd: "Apr 10, 2026", anc: 3, risk: "Medium", lastVisit: "Dec 20, 2025" },
  { name: "Hope Achieng", weeks: 16, edd: "Jun 5, 2026", anc: 2, risk: "Low", lastVisit: "Dec 15, 2025" },
];

const postnatalMothers = [
  { name: "Susan Wambui", babyAge: "2 weeks", delivery: "Dec 20, 2025", visits: 2, status: "On Track" },
  { name: "Ruth Atieno", babyAge: "6 weeks", delivery: "Nov 25, 2025", visits: 4, status: "On Track" },
];

const MaternalHealth = () => (
  <CHWLayout title="Maternal Health">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Pregnant Women", value: "4", icon: Baby, color: "text-info" },
          { label: "High Risk", value: "1", icon: AlertTriangle, color: "text-destructive" },
          { label: "Postnatal", value: "2", icon: Heart, color: "text-success" },
          { label: "Due This Month", value: "1", icon: Calendar, color: "text-warning" },
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

      {/* Pregnant Women */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Baby className="w-5 h-5 text-info" />
            Pregnant Women
          </CardTitle>
          <Button size="sm" className="btn-gradient">
            <Plus className="w-4 h-4 mr-2" />
            Register
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Weeks</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">EDD</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ANC Visits</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {pregnantWomen.map((woman, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{woman.name}</td>
                    <td className="py-3 px-4">{woman.weeks} weeks</td>
                    <td className="py-3 px-4">{woman.edd}</td>
                    <td className="py-3 px-4">{woman.anc}/8</td>
                    <td className="py-3 px-4">
                      <Badge variant={woman.risk === "High" ? "destructive" : woman.risk === "Medium" ? "default" : "secondary"}>
                        {woman.risk}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">Record Visit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Postnatal Mothers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-success" />
            Postnatal Mothers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {postnatalMothers.map((mother, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div>
                <div className="font-medium">{mother.name}</div>
                <div className="text-sm text-muted-foreground">Baby age: {mother.babyAge} • Delivered: {mother.delivery}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm">{mother.visits} visits</div>
                </div>
                <Badge className="bg-success">{mother.status}</Badge>
                <Button size="sm" variant="outline">Visit</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </CHWLayout>
);

export default MaternalHealth;

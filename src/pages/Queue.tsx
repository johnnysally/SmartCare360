import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Clock } from "lucide-react";

const queue = [
  { position: 1, name: "Mary Wanjiku", waitTime: "5 min", type: "Check-up", status: "Next" },
  { position: 2, name: "Ahmed Salim", waitTime: "15 min", type: "Consultation", status: "Waiting" },
  { position: 3, name: "Grace Njeri", waitTime: "25 min", type: "Follow-up", status: "Waiting" },
  { position: 4, name: "David Mwangi", waitTime: "35 min", type: "Lab Results", status: "Waiting" },
];

const Queue = () => (
  <DashboardLayout title="Queue Management">
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-6 text-center">
            <div className="text-4xl font-bold font-display">{queue.length}</div>
            <div className="text-primary-foreground/80">In Queue</div>
          </CardContent>
        </Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-4xl font-bold font-display text-info">~20</div>
          <div className="text-muted-foreground">Avg Wait (min)</div>
        </CardContent></Card>
        <Card><CardContent className="p-6 text-center">
          <div className="text-4xl font-bold font-display text-success">24</div>
          <div className="text-muted-foreground">Served Today</div>
        </CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Current Queue</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {queue.map((p) => (
            <div key={p.position} className={`flex items-center justify-between p-4 rounded-lg border ${p.status === "Next" ? "border-primary bg-primary/5" : ""}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">{p.position}</div>
                <div>
                  <div className="font-medium">{p.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" />{p.waitTime} • {p.type}</div>
                </div>
              </div>
              <Button size="sm" variant={p.status === "Next" ? "default" : "outline"} className={p.status === "Next" ? "btn-gradient" : ""}>
                <UserCheck className="w-4 h-4 mr-1" />Call
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Queue;

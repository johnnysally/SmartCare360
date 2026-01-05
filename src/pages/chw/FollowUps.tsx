import CHWLayout from "@/components/CHWLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";

const followUps = [
  { name: "Mary Auma", type: "Antenatal", lastVisit: "Dec 28, 2025", nextDue: "Jan 4, 2026", status: "Overdue", phone: "+254 712 345 678" },
  { name: "Jane Otieno", type: "Immunization", lastVisit: "Dec 20, 2025", nextDue: "Jan 5, 2026", status: "Due", phone: "+254 723 456 789" },
  { name: "Susan Wambui", type: "TB Treatment", lastVisit: "Jan 1, 2026", nextDue: "Jan 8, 2026", status: "Upcoming", phone: "+254 734 567 890" },
  { name: "Grace Nyambura", type: "Postnatal", lastVisit: "Dec 25, 2025", nextDue: "Jan 2, 2026", status: "Overdue", phone: "+254 745 678 901" },
  { name: "Ruth Wanjiku", type: "Child Growth", lastVisit: "Dec 30, 2025", nextDue: "Jan 6, 2026", status: "Due", phone: "+254 756 789 012" },
];

const FollowUps = () => (
  <CHWLayout title="Follow-ups">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-destructive">2</div>
            <div className="text-sm text-muted-foreground">Overdue</div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-warning">2</div>
            <div className="text-sm text-muted-foreground">Due This Week</div>
          </CardContent>
        </Card>
        <Card className="border-info/30 bg-info/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-info">1</div>
            <div className="text-sm text-muted-foreground">Upcoming</div>
          </CardContent>
        </Card>
      </div>

      {/* Follow-up List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-warning" />
            Scheduled Follow-ups
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {followUps.map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border transition-colors gap-4 ${
              item.status === "Overdue" ? "border-destructive/30 bg-destructive/5" : "hover:bg-muted/50"
            }`}>
              <div className="flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full ${
                  item.status === "Overdue" ? "bg-destructive animate-pulse" : 
                  item.status === "Due" ? "bg-warning" : "bg-info"
                }`} />
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">{item.type}</div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <span>Last: {item.lastVisit}</span>
                    <span>Due: {item.nextDue}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Badge variant={item.status === "Overdue" ? "destructive" : item.status === "Due" ? "default" : "secondary"}>
                  {item.status}
                </Badge>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
                <Button size="sm" className="btn-gradient">
                  <MapPin className="w-4 h-4 mr-1" />
                  Visit
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </CHWLayout>
);

export default FollowUps;

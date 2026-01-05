import CHWLayout from "@/components/CHWLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Search, Plus, Clock, CheckCircle2, Navigation } from "lucide-react";

const visits = [
  { id: "HV-001", household: "Auma Family", address: "House 45, Zone 5", time: "09:00 AM", purpose: "Antenatal Care", status: "Scheduled" },
  { id: "HV-002", household: "Otieno Family", address: "House 23, Zone 5", time: "10:30 AM", purpose: "Child Immunization", status: "In Progress" },
  { id: "HV-003", household: "Wambui Family", address: "House 67, Zone 5", time: "11:30 AM", purpose: "Follow-up", status: "Completed" },
  { id: "HV-004", household: "Nyambura Family", address: "House 12, Zone 5", time: "02:00 PM", purpose: "Postnatal Care", status: "Scheduled" },
];

const HomeVisits = () => (
  <CHWLayout title="Home Visits">
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search households..." className="pl-10" />
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Visit
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Scheduled", value: "2", color: "text-info" },
          { label: "In Progress", value: "1", color: "text-warning" },
          { label: "Completed", value: "1", color: "text-success" },
          { label: "Total Today", value: "4", color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold font-display ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visits List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-warning" />
            Today's Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="text-center min-w-[60px]">
                  <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                  <div className="text-sm font-medium">{visit.time}</div>
                </div>
                <div className="h-12 w-px bg-border hidden md:block" />
                <div>
                  <div className="font-medium">{visit.household}</div>
                  <div className="text-sm text-muted-foreground">{visit.address}</div>
                  <div className="text-xs text-muted-foreground mt-1">{visit.purpose}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <Badge 
                  variant={visit.status === "Completed" ? "default" : visit.status === "In Progress" ? "default" : "secondary"}
                  className={visit.status === "Completed" ? "bg-success" : visit.status === "In Progress" ? "bg-warning" : ""}
                >
                  {visit.status}
                </Badge>
                {visit.status !== "Completed" && (
                  <Button size="sm" variant="outline">
                    <Navigation className="w-4 h-4 mr-1" />
                    Navigate
                  </Button>
                )}
                {visit.status === "In Progress" && (
                  <Button size="sm" className="btn-gradient">
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Complete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </CHWLayout>
);

export default HomeVisits;

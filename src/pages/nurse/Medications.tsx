import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, User, CheckCircle2, AlertTriangle } from "lucide-react";

const medications = [
  { patient: "Mary Wanjiku", bed: "A-101", medication: "Paracetamol 500mg", time: "09:00 AM", status: "Due", route: "Oral" },
  { patient: "John Omondi", bed: "A-102", medication: "Metformin 500mg", time: "09:00 AM", status: "Due", route: "Oral" },
  { patient: "Peter Kamau", bed: "A-104", medication: "IV Fluids NS 1L", time: "09:30 AM", status: "Overdue", route: "IV" },
  { patient: "Fatima Hassan", bed: "A-103", medication: "Omeprazole 20mg", time: "08:00 AM", status: "Administered", route: "Oral" },
  { patient: "Grace Akinyi", bed: "A-105", medication: "Insulin 10 units", time: "08:30 AM", status: "Administered", route: "SC" },
];

const Medications = () => (
  <NurseLayout title="Medication Administration">
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Due Now", value: "3", color: "text-warning", bg: "bg-warning/10" },
          { label: "Overdue", value: "1", color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Administered", value: "12", color: "text-success", bg: "bg-success/10" },
          { label: "Upcoming", value: "8", color: "text-info", bg: "bg-info/10" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <Pill className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Medication List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-success" />
            Medication Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medications.map((med, i) => (
              <div 
                key={i} 
                className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                  med.status === "Overdue" ? "border-destructive/50 bg-destructive/5" : 
                  med.status === "Administered" ? "opacity-60" : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <Clock className={`w-4 h-4 mx-auto mb-1 ${med.status === "Overdue" ? "text-destructive" : "text-muted-foreground"}`} />
                    <div className={`text-sm font-medium ${med.status === "Overdue" ? "text-destructive" : ""}`}>{med.time}</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{med.patient}</span>
                      <span className="text-sm text-muted-foreground">({med.bed})</span>
                    </div>
                    <div className="text-sm mt-1">
                      <span className="font-medium">{med.medication}</span>
                      <span className="text-muted-foreground"> • {med.route}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {med.status === "Overdue" && <AlertTriangle className="w-5 h-5 text-destructive" />}
                  <Badge 
                    variant={med.status === "Administered" ? "default" : med.status === "Overdue" ? "destructive" : "secondary"}
                    className={med.status === "Administered" ? "bg-success" : ""}
                  >
                    {med.status}
                  </Badge>
                  {med.status !== "Administered" && (
                    <Button size="sm" className="btn-gradient">
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Administer
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </NurseLayout>
);

export default Medications;

import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download, RefreshCw, Pill } from "lucide-react";

const prescriptions = [
  { medication: "Metformin 500mg", dosage: "Twice daily with meals", prescribed: "Jan 2, 2026", doctor: "Dr. Mwangi", refills: 2, status: "Active" },
  { medication: "Lisinopril 10mg", dosage: "Once daily in morning", prescribed: "Dec 20, 2025", doctor: "Dr. Mwangi", refills: 3, status: "Active" },
  { medication: "Paracetamol 500mg", dosage: "As needed for pain", prescribed: "Dec 15, 2025", doctor: "Dr. Otieno", refills: 0, status: "Active" },
];

const pastPrescriptions = [
  { medication: "Amoxicillin 500mg", dosage: "Three times daily", prescribed: "Nov 10, 2025", doctor: "Dr. Otieno", status: "Completed" },
  { medication: "Ibuprofen 400mg", dosage: "As needed", prescribed: "Oct 25, 2025", doctor: "Dr. Wanjiru", status: "Completed" },
];

const MyPrescriptions = () => (
  <PatientLayout title="My Prescriptions">
    <div className="space-y-6 animate-fade-in">
      {/* Active Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            Active Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {prescriptions.map((rx, i) => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Pill className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium text-lg">{rx.medication}</div>
                  <div className="text-sm text-muted-foreground">{rx.dosage}</div>
                  <div className="text-xs text-muted-foreground mt-1">Prescribed: {rx.prescribed} by {rx.doctor}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className="text-right mr-2">
                  <div className="text-sm font-medium">{rx.refills} refills left</div>
                </div>
                <Badge className="bg-success">{rx.status}</Badge>
                <Button size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refill
                </Button>
                <Button size="sm" variant="ghost">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Past Prescriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="w-5 h-5 text-muted-foreground" />
            Past Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {pastPrescriptions.map((rx, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border opacity-75">
                <div>
                  <div className="font-medium">{rx.medication}</div>
                  <div className="text-sm text-muted-foreground">{rx.dosage}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">{rx.prescribed}</div>
                  <Badge variant="outline">{rx.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </PatientLayout>
);

export default MyPrescriptions;

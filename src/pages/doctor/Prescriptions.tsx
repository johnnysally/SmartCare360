import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pill,
  Plus,
  Search,
  FileText,
  Clock,
  Printer,
  Send,
  Trash2,
} from "lucide-react";

const recentPrescriptions = [
  {
    id: "RX001",
    patient: "Grace Njeri",
    date: "Jan 2, 2026",
    medications: 2,
    status: "dispensed",
  },
  {
    id: "RX002",
    patient: "James Mwangi",
    date: "Jan 2, 2026",
    medications: 1,
    status: "pending",
  },
  {
    id: "RX003",
    patient: "Mary Wambui",
    date: "Jan 1, 2026",
    medications: 3,
    status: "dispensed",
  },
  {
    id: "RX004",
    patient: "Peter Ochieng",
    date: "Dec 31, 2025",
    medications: 2,
    status: "cancelled",
  },
];

const prescriptionItems = [
  {
    medication: "Amoxicillin 500mg",
    dosage: "1 capsule",
    frequency: "3 times daily",
    duration: "7 days",
    quantity: 21,
  },
];

const Prescriptions = () => (
  <DoctorLayout title="Prescriptions">
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search prescriptions..." className="pl-9" />
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          New Prescription
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* New Prescription Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Write Prescription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grace">Grace Njeri</SelectItem>
                    <SelectItem value="james">James Mwangi</SelectItem>
                    <SelectItem value="mary">Mary Wambui</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Diagnosis</Label>
                <Input placeholder="Enter diagnosis" />
              </div>
            </div>

            {/* Medication List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold">Medications</Label>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Medication
                </Button>
              </div>

              {prescriptionItems.map((item, i) => (
                <Card key={i} className="p-4 bg-muted/30">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Medication</Label>
                      <Input defaultValue={item.medication} />
                    </div>
                    <div className="space-y-2">
                      <Label>Dosage</Label>
                      <Input defaultValue={item.dosage} />
                    </div>
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select defaultValue="tid">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="od">Once daily</SelectItem>
                          <SelectItem value="bid">Twice daily</SelectItem>
                          <SelectItem value="tid">3 times daily</SelectItem>
                          <SelectItem value="qid">4 times daily</SelectItem>
                          <SelectItem value="prn">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <div className="flex items-center gap-2">
                        <Input defaultValue="7" className="w-20" />
                        <span className="text-sm text-muted-foreground">days</span>
                        <Button variant="ghost" size="icon" className="ml-auto text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Additional Instructions */}
            <div className="space-y-2">
              <Label>Additional Instructions</Label>
              <Textarea
                placeholder="Any special instructions for the patient or pharmacist..."
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button className="btn-gradient ml-auto">
                <Send className="w-4 h-4 mr-2" />
                Send to Pharmacy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Prescriptions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Prescriptions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className="p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{rx.id}</span>
                  <Badge
                    variant={
                      rx.status === "dispensed"
                        ? "default"
                        : rx.status === "pending"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {rx.status}
                  </Badge>
                </div>
                <p className="text-sm font-medium">{rx.patient}</p>
                <p className="text-xs text-muted-foreground">
                  {rx.date} • {rx.medications} medication{rx.medications > 1 ? "s" : ""}
                </p>
              </div>
            ))}
            <Button variant="ghost" className="w-full">View All</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </DoctorLayout>
);

export default Prescriptions;

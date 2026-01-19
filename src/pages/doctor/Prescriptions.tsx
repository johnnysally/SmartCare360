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
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { prescribeMedication } from "@/lib/api";

const Prescriptions = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medications, setMedications] = useState([
    {
      id: "1",
      medication: "Amoxicillin 500mg",
      dosage: "1 capsule",
      frequency: "tid",
      duration: "7",
    },
  ]);
  const [instructions, setInstructions] = useState("");
  const [recentPrescriptions, setRecentPrescriptions] = useState([
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
  ]);

  const patients = [
    { id: "grace", name: "Grace Njeri" },
    { id: "james", name: "James Mwangi" },
    { id: "mary", name: "Mary Wambui" },
  ];

  const handleAddMedication = () => {
    const newMed = {
      id: Math.random().toString(),
      medication: "",
      dosage: "",
      frequency: "od",
      duration: "7",
    };
    setMedications([...medications, newMed]);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleUpdateMedication = (id: string, field: string, value: string) => {
    setMedications(medications.map(m =>
      m.id === id ? { ...m, [field]: value } : m
    ));
  };

  const handleSendToPharmacy = async () => {
    if (!selectedPatient) {
      toast({ title: "Error", description: "Please select a patient", variant: "destructive" });
      return;
    }
    if (medications.length === 0) {
      toast({ title: "Error", description: "Please add at least one medication", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      console.log("[DEBUG] Sending prescription to pharmacy");
      
      const patientData = patients.find(p => p.id === selectedPatient);
      
      for (const med of medications) {
        const payload = {
          patientId: selectedPatient,
          patientName: patientData?.name || "Unknown",
          drugName: med.medication,
          dose: med.dosage,
          route: "Oral",
          frequency: med.frequency,
          startTime: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          endTime: "",
          specialInstructions: instructions || "Follow diagnosis: " + diagnosis,
          doctorId: user?.id || "current-doctor",
          doctorName: user?.name || user?.firstName || "Dr. Current User",
        };

        console.log("[DEBUG] Prescription payload:", payload);
        await prescribeMedication(payload);
      }

      toast({ title: "Success", description: "Prescription sent to pharmacy successfully!" });
      
      // Reset form
      setSelectedPatient("");
      setDiagnosis("");
      setInstructions("");
      setMedications([
        {
          id: "1",
          medication: "",
          dosage: "",
          frequency: "od",
          duration: "7",
        },
      ]);

      // Add to recent prescriptions
      const newRx = {
        id: `RX${String(recentPrescriptions.length + 1).padStart(3, "0")}`,
        patient: patientData?.name || "Unknown",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        medications: medications.length,
        status: "pending",
      };
      setRecentPrescriptions([newRx, ...recentPrescriptions]);
    } catch (err: any) {
      console.error("[DEBUG] Send to pharmacy error:", err);
      toast({ title: "Error", description: err?.message || "Failed to send prescription", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    if (!selectedPatient) {
      toast({ title: "Error", description: "Please select a patient", variant: "destructive" });
      return;
    }
    toast({ title: "Success", description: "Prescription draft saved!" });
    console.log("[DEBUG] Draft saved:", { selectedPatient, diagnosis, medications, instructions });
  };

  const handlePrint = () => {
    if (!selectedPatient) {
      toast({ title: "Error", description: "Please select a patient", variant: "destructive" });
      return;
    }
    window.print();
    toast({ title: "Info", description: "Opening print dialog..." });
  };

  return (
    <DoctorLayout title="Prescriptions">
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search prescriptions..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="btn-gradient w-full sm:w-auto h-10" onClick={() => {
            setSelectedPatient("");
            setDiagnosis("");
            setInstructions("");
            setMedications([{ id: "1", medication: "", dosage: "", frequency: "od", duration: "7" }]);
            toast({ title: "Info", description: "Form cleared for new prescription" });
          }}>
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
                  <Label>Patient *</Label>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(p => (
                        <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Diagnosis *</Label>
                  <Input
                    placeholder="Enter diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                  />
                </div>
              </div>

              {/* Medication List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">Medications</Label>
                  <Button variant="outline" size="sm" onClick={handleAddMedication} type="button">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Medication
                  </Button>
                </div>

                {medications.map((item) => (
                  <Card key={item.id} className="p-4 bg-muted/30">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="md:col-span-2 space-y-2">
                        <Label>Medication</Label>
                        <Input
                          value={item.medication}
                          onChange={(e) => handleUpdateMedication(item.id, "medication", e.target.value)}
                          placeholder="Enter medication name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Dosage</Label>
                        <Input
                          value={item.dosage}
                          onChange={(e) => handleUpdateMedication(item.id, "dosage", e.target.value)}
                          placeholder="e.g., 500mg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Frequency</Label>
                        <Select value={item.frequency} onValueChange={(val) => handleUpdateMedication(item.id, "frequency", val)}>
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
                          <Input
                            value={item.duration}
                            onChange={(e) => handleUpdateMedication(item.id, "duration", e.target.value)}
                            className="w-20"
                            type="number"
                          />
                          <span className="text-sm text-muted-foreground">days</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto text-destructive hover:text-red-700"
                            onClick={() => handleRemoveMedication(item.id)}
                            type="button"
                          >
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
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 border-t">
                <Button variant="outline" onClick={handleSaveDraft} className="flex-1 sm:flex-none h-10" type="button">
                  <FileText className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button variant="outline" onClick={handlePrint} className="flex-1 sm:flex-none h-10" type="button">
                  <Printer className="w-4 h-4 mr-2" />
                  Print
                </Button>
                <Button
                  className="flex-1 sm:ml-auto btn-gradient h-10"
                  onClick={handleSendToPharmacy}
                  disabled={loading}
                  type="button"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {loading ? "Sending..." : "Send to Pharmacy"}
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
              {recentPrescriptions.filter(rx =>
                rx.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                rx.id.toLowerCase().includes(searchTerm.toLowerCase())
              ).map((rx) => (
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
              <Button variant="ghost" className="w-full" type="button">View All</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Prescriptions;

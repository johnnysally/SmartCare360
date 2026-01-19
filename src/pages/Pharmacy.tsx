import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, AlertTriangle, CheckCircle2, Clock, Send, Pill } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { getMedications, updateMedicationStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Medication {
  id: string;
  patient_id: string;
  patient_name: string;
  drug_name: string;
  dose: string;
  route: string;
  frequency: string;
  start_time: string;
  special_instructions: string;
  status: "pending" | "ready" | "given" | "missed" | "held" | "completed";
  doctor_name: string;
  pharmacy_notes?: string;
}

const nurses = [
  { id: "nurse-1", name: "Sarah Johnson" },
  { id: "nurse-2", name: "Emily Davis" },
  { id: "nurse-3", name: "Jessica Williams" },
];

const inventory = [
  { name: "Paracetamol 500mg", stock: 45, unit: "boxes", status: "Low" },
  { name: "Amoxicillin 250mg", stock: 23, unit: "boxes", status: "Low" },
  { name: "Ibuprofen 400mg", stock: 120, unit: "boxes", status: "OK" },
  { name: "Metformin 500mg", stock: 89, unit: "boxes", status: "OK" },
  { name: "Omeprazole 20mg", stock: 156, unit: "boxes", status: "OK" },
];

const Pharmacy = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [pharmacyNotes, setPharmacyNotes] = useState("");
  const [assignedNurse, setAssignedNurse] = useState("");

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      console.log("[DEBUG] Loading prescriptions for pharmacy");
      const data = await getMedications();
      // Filter to show only pending and ready medications (from doctors)
      const pharmacyMeds = data.filter((m: Medication) => 
        m.status === "pending" || m.status === "ready"
      );
      setMedications(pharmacyMeds);
      console.log("[DEBUG] Prescriptions loaded:", pharmacyMeds.length);
    } catch (err: any) {
      console.error("[DEBUG] Load prescriptions error:", err);
      toast({ title: "Error", description: "Failed to load prescriptions", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveMedication = async (med: Medication) => {
    if (!pharmacyNotes.trim()) {
      toast({ title: "Error", description: "Please add pharmacy notes", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      console.log("[DEBUG] Approving medication:", med.id);
      
      await updateMedicationStatus(med.id, {
        status: "ready",
        pharmacy_notes: pharmacyNotes,
      });

      toast({ title: "Success", description: `${med.drug_name} approved and ready for nurse` });
      setPharmacyNotes("");
      setSelectedMed(null);
      await loadPrescriptions();
    } catch (err: any) {
      console.error("[DEBUG] Approve error:", err);
      toast({ title: "Error", description: err?.message || "Failed to approve", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleIssueMedication = async (med: Medication) => {
    if (!assignedNurse) {
      toast({ title: "Error", description: "Please select a nurse", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      console.log("[DEBUG] Issuing medication to nurse:", assignedNurse);
      
      const selectedNurseData = nurses.find(n => n.id === assignedNurse);
      
      await updateMedicationStatus(med.id, {
        status: "ready",
        pharmacy_notes: `Issued to ${selectedNurseData?.name} by pharmacy`,
      });

      toast({ 
        title: "Success", 
        description: `${med.drug_name} issued to ${selectedNurseData?.name}` 
      });
      setAssignedNurse("");
      setSelectedMed(null);
      await loadPrescriptions();
    } catch (err: any) {
      console.error("[DEBUG] Issue error:", err);
      toast({ title: "Error", description: err?.message || "Failed to issue", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = 
      med.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    pending: medications.filter(m => m.status === "pending").length,
    ready: medications.filter(m => m.status === "ready").length,
  };

  return (
    <DashboardLayout title="Pharmacy & Prescriptions">
      <div className="space-y-6 animate-fade-in">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border-orange-200/50 bg-orange-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-200/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-200/50 bg-green-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-200/30 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.ready}</div>
                <div className="text-sm text-muted-foreground">Ready for Nurse</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200/50 bg-blue-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-200/30 flex items-center justify-center">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{medications.length}</div>
                <div className="text-sm text-muted-foreground">Total Prescriptions</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient, drug, or doctor..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="ready">Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prescriptions from Doctors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Doctor Prescriptions ({filteredMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading prescriptions...</div>
            ) : filteredMedications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No prescriptions to review. All caught up!
              </div>
            ) : (
              <div className="space-y-3">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-muted-foreground">
                        <th className="text-left p-2">Patient</th>
                        <th className="text-left p-2">Medication</th>
                        <th className="text-left p-2">Dose</th>
                        <th className="text-left p-2">Doctor</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedications.map((med) => (
                        <tr key={med.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{med.patient_name}</td>
                          <td className="p-2">{med.drug_name}</td>
                          <td className="p-2 text-xs">{med.dose}</td>
                          <td className="p-2 text-sm">{med.doctor_name}</td>
                          <td className="p-2">
                            <Badge variant={med.status === "pending" ? "secondary" : "default"}>
                              {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                  onClick={() => {
                                    setSelectedMed(med);
                                    setPharmacyNotes("");
                                    setAssignedNurse("");
                                  }}
                                >
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Review Prescription</DialogTitle>
                                </DialogHeader>
                                {selectedMed && selectedMed.id === med.id && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label className="text-sm text-muted-foreground">Patient</Label>
                                      <p className="font-medium">{selectedMed.patient_name}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm text-muted-foreground">Medication</Label>
                                      <p className="font-medium">{selectedMed.drug_name}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Dose</Label>
                                        <p className="font-medium">{selectedMed.dose}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Route</Label>
                                        <p className="font-medium">{selectedMed.route}</p>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Frequency</Label>
                                        <p className="font-medium">{selectedMed.frequency}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Doctor</Label>
                                        <p className="font-medium">{selectedMed.doctor_name}</p>
                                      </div>
                                    </div>
                                    {selectedMed.special_instructions && (
                                      <div>
                                        <Label className="text-sm text-muted-foreground">Instructions</Label>
                                        <p className="font-medium">{selectedMed.special_instructions}</p>
                                      </div>
                                    )}
                                    <div>
                                      <Label htmlFor="notes">Pharmacy Notes *</Label>
                                      <textarea
                                        id="notes"
                                        className="w-full p-2 border rounded text-sm"
                                        rows={3}
                                        placeholder="Add any pharmacy notes or observations..."
                                        value={pharmacyNotes}
                                        onChange={(e) => setPharmacyNotes(e.target.value)}
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="nurse">Assign to Nurse</Label>
                                      <Select value={assignedNurse} onValueChange={setAssignedNurse}>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select nurse" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {nurses.map(n => (
                                            <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => handleApproveMedication(selectedMed)}
                                        disabled={loading}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                      >
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleIssueMedication(selectedMed)}
                                        disabled={loading || !assignedNurse}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                      >
                                        <Send className="w-4 h-4 mr-2" />
                                        Issue to Nurse
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden space-y-3">
                  {filteredMedications.map((med) => (
                    <Card key={med.id} className="overflow-hidden">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="font-semibold">{med.patient_name}</div>
                            <div className="text-sm text-muted-foreground">{med.drug_name} - {med.dose}</div>
                          </div>
                          <Badge variant={med.status === "pending" ? "secondary" : "default"}>
                            {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div>Doctor: {med.doctor_name}</div>
                          <div>Route: {med.route} • Frequency: {med.frequency}</div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                setSelectedMed(med);
                                setPharmacyNotes("");
                                setAssignedNurse("");
                              }}
                            >
                              Review Prescription
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Review Prescription</DialogTitle>
                            </DialogHeader>
                            {selectedMed && selectedMed.id === med.id && (
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm text-muted-foreground">Patient</Label>
                                  <p className="font-medium">{selectedMed.patient_name}</p>
                                </div>
                                <div>
                                  <Label className="text-sm text-muted-foreground">Medication</Label>
                                  <p className="font-medium">{selectedMed.drug_name}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Dose</Label>
                                    <p className="font-medium">{selectedMed.dose}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Route</Label>
                                    <p className="font-medium">{selectedMed.route}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Frequency</Label>
                                    <p className="font-medium">{selectedMed.frequency}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Doctor</Label>
                                    <p className="font-medium">{selectedMed.doctor_name}</p>
                                  </div>
                                </div>
                                {selectedMed.special_instructions && (
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Instructions</Label>
                                    <p className="font-medium">{selectedMed.special_instructions}</p>
                                  </div>
                                )}
                                <div>
                                  <Label htmlFor="notes">Pharmacy Notes *</Label>
                                  <textarea
                                    id="notes"
                                    className="w-full p-2 border rounded text-sm"
                                    rows={3}
                                    placeholder="Add any pharmacy notes or observations..."
                                    value={pharmacyNotes}
                                    onChange={(e) => setPharmacyNotes(e.target.value)}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="nurse">Assign to Nurse</Label>
                                  <Select value={assignedNurse} onValueChange={setAssignedNurse}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select nurse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {nurses.map(n => (
                                        <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <Button
                                    onClick={() => handleApproveMedication(selectedMed)}
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    onClick={() => handleIssueMedication(selectedMed)}
                                    disabled={loading || !assignedNurse}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Issue to Nurse
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory */}
        <Card>
          <CardHeader><CardTitle>Medication Inventory</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full">
              <thead><tr className="border-b text-left text-sm text-muted-foreground">
                <th className="pb-3">Medication</th><th className="pb-3">Stock</th><th className="pb-3">Unit</th><th className="pb-3">Status</th>
              </tr></thead>
              <tbody>
                {inventory.map((item, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 font-medium">{item.name}</td>
                    <td className="py-3">{item.stock}</td>
                    <td className="py-3 text-sm text-muted-foreground">{item.unit}</td>
                    <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${item.status === "OK" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Pharmacy;

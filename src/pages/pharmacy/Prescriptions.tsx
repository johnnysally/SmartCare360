import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Clock, Send, Pill, AlertCircle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import DashboardLayout from "@/components/DashboardLayout";

interface Medication {
  id: string;
  patient_id: string;
  patient_name: string;
  drug_name: string;
  dose: string;
  route: string;
  frequency: string;
  start_time: string;
  end_time: string;
  special_instructions: string;
  status: "pending" | "ready" | "given" | "missed" | "held" | "completed";
  doctor_name: string;
  pharmacy_notes?: string;
  created_at: string;
}

const nurses = [
  { id: "nurse-1", name: "Sarah Johnson" },
  { id: "nurse-2", name: "Emily Davis" },
  { id: "nurse-3", name: "Jessica Williams" },
];

const PharmacyPrescriptions = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [pharmacyNotes, setPharmacyNotes] = useState("");
  const [assignedNurse, setAssignedNurse] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadPrescriptions();
    const interval = setInterval(loadPrescriptions, 30000); // Reload every 30 seconds
    return () => clearInterval(interval);
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

  const handleApprovePrescription = async () => {
    if (!selectedMed) return;
    if (!pharmacyNotes.trim()) {
      toast({ title: "Error", description: "Please add pharmacy notes", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      console.log("[DEBUG] Approving prescription:", selectedMed.id);
      
      await updateMedicationStatus(selectedMed.id, {
        status: "ready",
        pharmacy_notes: pharmacyNotes,
      });

      toast({ 
        title: "Success", 
        description: `${selectedMed.drug_name} for ${selectedMed.patient_name} approved!` 
      });
      
      setPharmacyNotes("");
      setShowModal(false);
      setSelectedMed(null);
      await loadPrescriptions();
    } catch (err: any) {
      console.error("[DEBUG] Approve error:", err);
      toast({ title: "Error", description: err?.message || "Failed to approve", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPrescription = async () => {
    if (!selectedMed) return;
    if (!pharmacyNotes.trim()) {
      toast({ title: "Error", description: "Please add rejection reason", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      console.log("[DEBUG] Rejecting prescription:", selectedMed.id);
      
      await updateMedicationStatus(selectedMed.id, {
        status: "held",
        pharmacy_notes: `REJECTED: ${pharmacyNotes}`,
      });

      toast({ 
        title: "Success", 
        description: `Prescription rejected and marked for doctor review` 
      });
      
      setPharmacyNotes("");
      setShowModal(false);
      setSelectedMed(null);
      await loadPrescriptions();
    } catch (err: any) {
      console.error("[DEBUG] Reject error:", err);
      toast({ title: "Error", description: err?.message || "Failed to reject", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleIssueMedication = async () => {
    if (!selectedMed) return;
    if (!assignedNurse) {
      toast({ title: "Error", description: "Please select a nurse", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      console.log("[DEBUG] Issuing medication to nurse:", assignedNurse);
      
      const selectedNurseData = nurses.find(n => n.id === assignedNurse);
      
      await updateMedicationStatus(selectedMed.id, {
        status: "ready",
        pharmacy_notes: `${pharmacyNotes || 'No additional notes'} | Issued to ${selectedNurseData?.name}`,
      });

      toast({ 
        title: "Success", 
        description: `${selectedMed.drug_name} issued to ${selectedNurseData?.name}` 
      });
      
      setPharmacyNotes("");
      setAssignedNurse("");
      setShowModal(false);
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
    <DashboardLayout title="Pharmacy - Prescriptions">
      <div className="space-y-6 animate-fade-in">
        {/* Warning Alert */}
        {stats.pending > 0 && (
          <Card className="border-orange-200/50 bg-orange-50/30">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <strong>{stats.pending}</strong> prescription{stats.pending !== 1 ? 's' : ''} pending review from doctors
              </div>
            </CardContent>
          </Card>
        )}

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
              placeholder="Search by patient, medication, or doctor..."
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

        {/* Prescriptions List */}
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
                {searchTerm || filterStatus !== "all" 
                  ? "No prescriptions match your search" 
                  : "All prescriptions reviewed!"}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-muted/50">
                      <tr className="text-muted-foreground">
                        <th className="text-left p-3">Patient</th>
                        <th className="text-left p-3">Medication</th>
                        <th className="text-left p-3">Dose</th>
                        <th className="text-left p-3">Doctor</th>
                        <th className="text-left p-3">Frequency</th>
                        <th className="text-left p-3">Status</th>
                        <th className="text-left p-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedications.map((med) => (
                        <tr key={med.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-3 font-medium">{med.patient_name}</td>
                          <td className="p-3">{med.drug_name}</td>
                          <td className="p-3 text-xs">{med.dose}</td>
                          <td className="p-3 text-sm">{med.doctor_name}</td>
                          <td className="p-3 text-xs">{med.frequency}</td>
                          <td className="p-3">
                            <Badge variant={med.status === "pending" ? "secondary" : "default"}>
                              {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                              onClick={() => {
                                setSelectedMed(med);
                                setPharmacyNotes("");
                                setAssignedNurse("");
                                setShowModal(true);
                              }}
                            >
                              Review
                            </Button>
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
                            <div className="font-semibold text-base">{med.patient_name}</div>
                            <div className="text-sm text-muted-foreground">{med.drug_name} - {med.dose}</div>
                          </div>
                          <Badge variant={med.status === "pending" ? "secondary" : "default"}>
                            {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <div><strong>Doctor:</strong> {med.doctor_name}</div>
                          <div><strong>Route:</strong> {med.route}</div>
                          <div><strong>Frequency:</strong> {med.frequency}</div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            setSelectedMed(med);
                            setPharmacyNotes("");
                            setAssignedNurse("");
                            setShowModal(true);
                          }}
                        >
                          Review Prescription
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Review Modal */}
      {showModal && selectedMed && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Review Prescription</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Patient</Label>
                  <p className="font-semibold">{selectedMed.patient_name}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Doctor</Label>
                  <p className="font-semibold">{selectedMed.doctor_name}</p>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <Label className="text-xs text-muted-foreground">Medication</Label>
                  <p className="font-bold text-lg">{selectedMed.drug_name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Dose</Label>
                  <p className="font-medium">{selectedMed.dose}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Route</Label>
                  <p className="font-medium">{selectedMed.route}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Frequency</Label>
                  <p className="font-medium">{selectedMed.frequency}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Start Time</Label>
                  <p className="font-medium">{selectedMed.start_time}</p>
                </div>
              </div>

              {selectedMed.special_instructions && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <Label className="text-xs text-muted-foreground font-semibold">Special Instructions</Label>
                  <p className="text-sm mt-1">{selectedMed.special_instructions}</p>
                </div>
              )}

              <div>
                <Label htmlFor="notes" className="font-semibold">Pharmacy Notes *</Label>
                <textarea
                  id="notes"
                  className="w-full p-2 border rounded-lg text-sm mt-2"
                  rows={3}
                  placeholder="Add pharmacy observations, availability, interactions, etc..."
                  value={pharmacyNotes}
                  onChange={(e) => setPharmacyNotes(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="nurse" className="font-semibold">Assign to Nurse</Label>
                <Select value={assignedNurse} onValueChange={setAssignedNurse}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select nurse to receive medication" />
                  </SelectTrigger>
                  <SelectContent>
                    {nurses.map(n => (
                      <SelectItem key={n.id} value={n.id}>{n.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4 border-t flex-col sm:flex-row">
                <Button
                  onClick={handleApprovePrescription}
                  disabled={loading || !pharmacyNotes.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  onClick={handleIssueMedication}
                  disabled={loading || !assignedNurse || !pharmacyNotes.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Issue to Nurse
                </Button>
                <Button
                  onClick={handleRejectPrescription}
                  disabled={loading || !pharmacyNotes.trim()}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white h-10"
                >
                  Reject
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default PharmacyPrescriptions;

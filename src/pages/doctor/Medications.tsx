import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pill, Plus, Clock, CheckCircle2, AlertCircle, Search, Eye, Trash2, X, Save, History } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getMedications, prescribeMedication, updateMedicationStatus, deleteMedication, getAppointments } from "@/lib/api";

interface Medication {
  id: string;
  patient_id: string;
  patient_name: string;
  ward_id: string;
  drug_name: string;
  dose: string;
  route: string;
  frequency: string;
  start_time: string;
  end_time: string;
  special_instructions: string;
  status: "pending" | "ready" | "given" | "missed" | "held" | "completed";
  doctor_id: string;
  doctor_name: string;
  created_at: string;
  administered_at?: string;
  administered_by_nurse?: string;
}

interface CheckInPatient {
  id: string;
  patientId?: string;
  patient_id?: string;
  name?: string;
  patient_name?: string;
  status?: string;
}

const DoctorMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [checkInPatients, setCheckInPatients] = useState<CheckInPatient[]>([]);
  const [form, setForm] = useState({
    patientId: "",
    wardId: "",
    drugName: "",
    dose: "",
    route: "Oral",
    frequency: "Once daily",
    startTime: "",
    endTime: "",
    specialInstructions: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "ready" | "given" | "missed" | "completed">("all");
  const [loading, setLoading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const routes = ["Oral", "IV", "IM", "SC", "Topical", "Rectal", "Inhalation"];
  const frequencies = ["Once daily", "Twice daily", "Three times daily", "Four times daily", "Every 4 hours", "Every 6 hours", "Every 8 hours", "Every 12 hours", "As needed"];

  useEffect(() => {
    loadMedications();
    loadCheckInPatients();
    checkExpiredMedications();
    const interval = setInterval(checkExpiredMedications, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMedications = async () => {
    try {
      setLoading(true);
      const data = await getMedications();
      setMedications(data || []);
    } catch (err) {
      toast({ title: "Error", description: "Failed to load medications", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const loadCheckInPatients = async () => {
    try {
      const appointments = await getAppointments();
      const uniquePatients = Array.from(new Map(
        (appointments || []).map((apt: any) => [
          apt.patientId || apt.patient_id,
          {
            id: apt.patientId || apt.patient_id,
            name: apt.patientName || apt.patient_name || "Unknown",
          }
        ])
      ).values());
      setCheckInPatients(uniquePatients as any);
    } catch (err) {
      console.error("Failed to load check-in patients", err);
    }
  };

  const checkExpiredMedications = async () => {
    try {
      const now = new Date();
      const medicationsToUpdate = medications.filter(m => {
        if (m.status === "completed" || m.status === "missed" || m.status === "held") return false;
        if (!m.end_time) return false;
        
        const endTime = new Date(`2024-01-19T${m.end_time}`);
        return endTime < now;
      });

      for (const med of medicationsToUpdate) {
        if (med.status === "given") {
          await updateMedicationStatus(med.id, { status: "completed" });
        }
      }

      if (medicationsToUpdate.length > 0) {
        loadMedications();
      }
    } catch (err) {
      console.error("Error checking expired medications", err);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!form.patientId) {
      toast({ title: "Error", description: "Please select a patient", variant: "destructive" });
      return;
    }
    if (!form.drugName.trim()) {
      toast({ title: "Error", description: "Please enter drug name", variant: "destructive" });
      return;
    }
    if (!form.dose.trim()) {
      toast({ title: "Error", description: "Please enter dose", variant: "destructive" });
      return;
    }
    if (!form.startTime) {
      toast({ title: "Error", description: "Please select start time", variant: "destructive" });
      return;
    }
    if (!form.route) {
      toast({ title: "Error", description: "Please select route", variant: "destructive" });
      return;
    }
    if (!form.frequency) {
      toast({ title: "Error", description: "Please select frequency", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const selectedPatient = checkInPatients.find(p => p.id === form.patientId);
      
      if (!selectedPatient) {
        toast({ title: "Error", description: "Selected patient not found", variant: "destructive" });
        return;
      }

      const payload = {
        patientId: form.patientId,
        patientName: selectedPatient.name || "Unknown",
        wardId: form.wardId || "General",
        drugName: form.drugName.trim(),
        dose: form.dose.trim(),
        route: form.route,
        frequency: form.frequency,
        startTime: form.startTime,
        endTime: form.endTime,
        specialInstructions: form.specialInstructions.trim(),
        doctorId: user?.id || "current-doctor",
        doctorName: user?.name || user?.firstName || "Dr. Current User",
      };

      console.log("Submitting medication prescription:", payload);
      
      const result = await prescribeMedication(payload);
      
      if (result && result.id) {
        toast({ 
          title: "Success", 
          description: `Medication prescribed for ${selectedPatient.name} successfully!` 
        });
        resetForm();
        // Reload medications after a brief delay to ensure DB sync
        setTimeout(() => {
          loadMedications();
        }, 500);
      } else {
        throw new Error("Failed to create medication");
      }
    } catch (err: any) {
      console.error("Prescription error:", err);
      toast({ 
        title: "Error", 
        description: err?.message || "Failed to prescribe medication. Please try again.", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendToPharmacy = async (id: string) => {
    try {
      setLoading(true);
      await updateMedicationStatus(id, { status: "ready" });
      toast({ title: "Sent to Pharmacy", description: "Medication sent for approval" });
      loadMedications();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to send medication", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this medication?")) return;

    try {
      await deleteMedication(id);
      toast({ title: "Deleted", description: "Medication removed successfully" });
      loadMedications();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to delete medication", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setForm({
      patientId: "",
      wardId: "",
      drugName: "",
      dose: "",
      route: "Oral",
      frequency: "Once daily",
      startTime: "",
      endTime: "",
      specialInstructions: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch = 
      med.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.drug_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    const isActive = !showCompleted || med.status === "completed";
    return matchesSearch && matchesStatus && isActive;
  });

  const stats = {
    pending: medications.filter(m => m.status === "pending").length,
    ready: medications.filter(m => m.status === "ready").length,
    given: medications.filter(m => m.status === "given").length,
    missed: medications.filter(m => m.status === "missed").length,
    completed: medications.filter(m => m.status === "completed").length,
  };

  return (
    <DoctorLayout title="Medication Management">
      <div className="space-y-6 animate-fade-in">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-blue-200/50 bg-blue-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-200/30 flex items-center justify-center">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.ready}</div>
                <div className="text-sm text-muted-foreground">Ready for Admin</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.given}</div>
                <div className="text-sm text-muted-foreground">Given</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.missed}</div>
                <div className="text-sm text-muted-foreground">Missed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200/50 bg-purple-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-200/30 flex items-center justify-center">
                <History className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prescription Form */}
        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                {editingId ? "Edit Prescription" : "New Prescription"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Patient <span className="text-red-500">*</span></Label>
                  <select
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className={`flex h-10 rounded-md border ${!form.patientId ? 'border-red-300' : 'border-input'} bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full`}
                  >
                    <option value="">Select patient from check-ins...</option>
                    {checkInPatients.length === 0 ? (
                      <option disabled>No patients available</option>
                    ) : (
                      checkInPatients.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))
                    )}
                  </select>
                  <p className="text-xs text-muted-foreground">Only patients with appointments are shown</p>
                  {checkInPatients.length === 0 && (
                    <p className="text-xs text-orange-600">No check-in patients available. Please ensure patients have appointments.</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Ward/Bed</Label>
                  <Input
                    placeholder="e.g. A-104"
                    value={form.wardId}
                    onChange={(e) => setForm({ ...form, wardId: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Optional - defaults to General</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Drug Name <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. Paracetamol"
                    value={form.drugName}
                    onChange={(e) => setForm({ ...form, drugName: e.target.value })}
                    className={!form.drugName ? 'border-red-300' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Dose <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="e.g. 500mg"
                    value={form.dose}
                    onChange={(e) => setForm({ ...form, dose: e.target.value })}
                    className={!form.dose ? 'border-red-300' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Route <span className="text-red-500">*</span></Label>
                  <select
                    value={form.route}
                    onChange={(e) => setForm({ ...form, route: e.target.value })}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  >
                    {routes.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-base">Frequency <span className="text-red-500">*</span></Label>
                  <select
                    value={form.frequency}
                    onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  >
                    {frequencies.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-base">Start Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className={!form.startTime ? 'border-red-300' : ''}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-base">End Time</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">Optional</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-base">Special Instructions</Label>
                <Textarea
                  placeholder="e.g. Take with food, avoid dairy products, report any side effects..."
                  rows={3}
                  value={form.specialInstructions}
                  onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Optional - Add any special notes or warnings</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <Button 
                  onClick={handleSubmit} 
                  className="w-full sm:flex-1 btn-gradient h-10" 
                  disabled={loading || !form.patientId || !form.drugName || !form.dose || !form.startTime}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Prescribe"}
                </Button>
                <Button onClick={resetForm} variant="outline" className="w-full sm:flex-1 h-10">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Prescription Button */}
        {!showForm && (
          <Button className="btn-gradient w-full sm:w-auto h-10" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Prescription
          </Button>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient or drug name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={!showCompleted ? "default" : "outline"}
              onClick={() => setShowCompleted(false)}
              size="sm"
            >
              Active
            </Button>
            <Button
              variant={showCompleted ? "default" : "outline"}
              onClick={() => setShowCompleted(true)}
              size="sm"
            >
              <History className="w-4 h-4 mr-1" />
              Completed
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {!showCompleted && (
            <>
              {(["all", "pending", "ready", "given", "missed"] as const).map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  size="sm"
                  className="text-xs sm:text-sm"
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </>
          )}
          {showCompleted && (
            <Button
              variant="default"
              size="sm"
              className="text-xs sm:text-sm"
            >
              Completed ({stats.completed})
            </Button>
          )}
        </div>

        {/* Medications List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-blue-600" />
              {showCompleted ? "Completed Prescriptions" : "Active Prescriptions"} ({filteredMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredMedications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No medications found. Create a prescription to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b">
                      <tr className="text-muted-foreground">
                        <th className="text-left p-2">Patient</th>
                        <th className="text-left p-2">Drug</th>
                        <th className="text-left p-2">Dose</th>
                        <th className="text-left p-2">Route</th>
                        <th className="text-left p-2">Frequency</th>
                        <th className="text-left p-2">Status</th>
                        <th className="text-left p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredMedications.map((med) => (
                        <tr key={med.id} className="border-b hover:bg-muted/50">
                          <td className="p-2 font-medium">{med.patient_name}</td>
                          <td className="p-2">{med.drug_name}</td>
                          <td className="p-2">{med.dose}</td>
                          <td className="p-2">{med.route}</td>
                          <td className="p-2 text-xs">{med.frequency}</td>
                          <td className="p-2">
                            <Badge
                              variant={
                                med.status === "pending" ? "secondary" :
                                med.status === "ready" ? "default" :
                                med.status === "given" ? "outline" :
                                med.status === "completed" ? "default" :
                                "destructive"
                              }
                              className={med.status === "completed" ? "bg-purple-600 hover:bg-purple-700" : ""}
                            >
                              {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                            </Badge>
                          </td>
                          <td className="p-2 flex gap-1 flex-wrap items-center">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedMedication(med)}
                              className="h-8 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            {med.status === "pending" && (
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white h-8 px-2 text-xs"
                                onClick={() => handleSendToPharmacy(med.id)}
                                disabled={loading}
                                title="Send to Pharmacy"
                              >
                                <span>Send</span>
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(med.id)}
                              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
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
                          <Badge
                            variant={
                              med.status === "pending" ? "secondary" :
                              med.status === "ready" ? "default" :
                              med.status === "given" ? "outline" :
                              med.status === "completed" ? "default" :
                              "destructive"
                            }
                            className={med.status === "completed" ? "bg-purple-600 hover:bg-purple-700" : ""}
                          >
                            {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Route:</span>
                            <div className="font-medium">{med.route}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Frequency:</span>
                            <div className="font-medium">{med.frequency}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Start:</span>
                            <div className="font-medium">{med.start_time}</div>
                          </div>
                          {med.end_time && (
                            <div>
                              <span className="text-muted-foreground">End:</span>
                              <div className="font-medium">{med.end_time}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex gap-2 flex-wrap pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMedication(med)}
                            className="flex-1 text-xs sm:text-sm h-9"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            View
                          </Button>
                          {med.status === "pending" && (
                            <Button
                              size="sm"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-9"
                              onClick={() => handleSendToPharmacy(med.id)}
                              disabled={loading}
                            >
                              Send
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(med.id)}
                            className="text-red-600 hover:text-red-700 text-xs sm:text-sm h-9"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medication Detail Modal */}
        {selectedMedication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto my-auto">
              <CardHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-10">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Pill className="w-5 h-5 text-blue-600" />
                  Details
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedMedication(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Patient</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.patient_name}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Status</div>
                    <Badge 
                      variant={selectedMedication.status === "pending" ? "secondary" : "default"}
                      className={selectedMedication.status === "completed" ? "bg-purple-600 hover:bg-purple-700" : ""}
                    >
                      {selectedMedication.status.charAt(0).toUpperCase() + selectedMedication.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Drug Name</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.drug_name}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Dose</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.dose}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Route</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.route}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Frequency</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.frequency}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Start Time</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.start_time}</div>
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">End Time</div>
                    <div className="font-semibold text-sm sm:text-base">{selectedMedication.end_time || "N/A"}</div>
                  </div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Ward/Bed</div>
                  <div className="font-semibold text-sm sm:text-base">{selectedMedication.ward_id || "General"}</div>
                </div>

                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground">Doctor</div>
                  <div className="font-semibold text-sm sm:text-base">{selectedMedication.doctor_name}</div>
                </div>

                {selectedMedication.special_instructions && (
                  <div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Special Instructions</div>
                    <div className="font-semibold text-xs sm:text-sm bg-blue-50 p-2 rounded">{selectedMedication.special_instructions}</div>
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-4 border-t">
                  {selectedMedication.status === "pending" && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        handleSendToPharmacy(selectedMedication.id);
                        setSelectedMedication(null);
                      }}
                      disabled={loading}
                      size="sm"
                    >
                      Send to Pharmacy
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSelectedMedication(null)}
                    size="sm"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DoctorLayout>
  );
};

export default DoctorMedications;

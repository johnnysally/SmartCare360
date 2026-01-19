import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pill, Plus, Clock, CheckCircle2, AlertCircle, Search, Edit2, Trash2, X, Save, History } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "ready" | "given" | "missed" | "completed">("all");
  const [loading, setLoading] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const { toast } = useToast();

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
    if (!form.patientId || !form.drugName || !form.dose || !form.startTime) {
      toast({ title: "Error", description: "Please fill all required fields", variant: "destructive" });
      return;
    }

    try {
      setLoading(true);
      const selectedPatient = checkInPatients.find(p => p.id === form.patientId);
      const payload = {
        patientId: form.patientId,
        patientName: selectedPatient?.name || "Unknown",
        wardId: form.wardId,
        drugName: form.drugName,
        dose: form.dose,
        route: form.route,
        frequency: form.frequency,
        startTime: form.startTime,
        endTime: form.endTime,
        specialInstructions: form.specialInstructions,
        doctorId: "current-doctor",
        doctorName: "Dr. Current User",
      };

      await prescribeMedication(payload);
      toast({ title: "Success", description: "Medication prescribed successfully" });
      resetForm();
      loadMedications();
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "Failed to prescribe medication", variant: "destructive" });
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
                  <Label>Patient *</Label>
                  <select
                    value={form.patientId}
                    onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  >
                    <option value="">Select patient from check-ins...</option>
                    {checkInPatients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <p className="text-xs text-muted-foreground">Only patients with appointments are shown</p>
                </div>
                <div className="space-y-2">
                  <Label>Ward/Bed</Label>
                  <Input
                    placeholder="e.g. A-104"
                    value={form.wardId}
                    onChange={(e) => setForm({ ...form, wardId: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Drug Name *</Label>
                  <Input
                    placeholder="e.g. Paracetamol"
                    value={form.drugName}
                    onChange={(e) => setForm({ ...form, drugName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Dose *</Label>
                  <Input
                    placeholder="e.g. 500mg"
                    value={form.dose}
                    onChange={(e) => setForm({ ...form, dose: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Route</Label>
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
                  <Label>Frequency</Label>
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
                  <Label>Start Time *</Label>
                  <Input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Time</Label>
                  <Input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Instructions</Label>
                <Textarea
                  placeholder="e.g. Take with food, avoid dairy products..."
                  rows={3}
                  value={form.specialInstructions}
                  onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={handleSubmit} className="flex-1 btn-gradient" disabled={loading}>
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Prescribe Medication"}
                </Button>
                <Button onClick={resetForm} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Prescription Button */}
        {!showForm && (
          <Button className="btn-gradient" onClick={() => setShowForm(true)}>
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
              <div className="space-y-3 overflow-x-auto">
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
                        <td className="p-2 flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(med.id)}
                            className="h-8 text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DoctorLayout>
  );
};

export default DoctorMedications;

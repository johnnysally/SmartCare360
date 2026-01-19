import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pill, Clock, CheckCircle2, AlertCircle, Search, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getMedicationHistory } from "@/lib/api";

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
  status: "pending" | "ready" | "given" | "missed" | "held" | "completed";
  doctor_name: string;
  created_at: string;
  administered_at?: string;
  administered_by_nurse?: string;
  administration_notes?: string;
}

const PatientMedicationHistory = () => {
  const { patientId } = useParams();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "given" | "missed" | "completed">("given");

  useEffect(() => {
    loadMedicationHistory();
  }, [patientId]);

  const loadMedicationHistory = async () => {
    if (!patientId) return;
    try {
      setLoading(true);
      const data = await getMedicationHistory(patientId);
      setMedications(data || []);
    } catch (err) {
      console.error("Failed to load medication history", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredMedications = medications.filter(med => {
    const matchesSearch =
      med.drug_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      med.doctor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const isAdministered = ["given", "missed", "completed"].includes(med.status);
    const matchesStatus = filterStatus === "all" || med.status === filterStatus;
    return matchesSearch && isAdministered && matchesStatus;
  });

  const stats = {
    given: medications.filter(m => m.status === "given").length,
    missed: medications.filter(m => m.status === "missed").length,
    completed: medications.filter(m => m.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
            <Pill className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">Medication History</h1>
            <p className="text-sm text-muted-foreground">Administered Doses & Records</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.given}</div>
                <div className="text-sm text-muted-foreground">Administered</div>
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
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by drug name or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(["all", "given", "missed", "completed"] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Medication Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Medication Records ({filteredMedications.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">Loading...</div>
            ) : filteredMedications.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No medication records found.
              </div>
            ) : (
              <div className="space-y-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/50">
                    <tr className="text-muted-foreground">
                      <th className="text-left p-3">Date</th>
                      <th className="text-left p-3">Drug</th>
                      <th className="text-left p-3">Dose</th>
                      <th className="text-left p-3">Route</th>
                      <th className="text-left p-3">Doctor</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Administered By</th>
                      <th className="text-left p-3">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMedications.map((med) => (
                      <tr key={med.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3 text-xs">
                          {new Date(med.created_at).toLocaleDateString()}
                        </td>
                        <td className="p-3 font-medium">{med.drug_name}</td>
                        <td className="p-3">{med.dose}</td>
                        <td className="p-3">{med.route}</td>
                        <td className="p-3 text-xs">{med.doctor_name}</td>
                        <td className="p-3">
                          <Badge
                            variant={
                              med.status === "given" ? "outline" :
                              med.status === "completed" ? "default" :
                              "destructive"
                            }
                            className={
                              med.status === "completed" ? "bg-purple-600 hover:bg-purple-700" : ""
                            }
                          >
                            {med.status.charAt(0).toUpperCase() + med.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-3 text-xs">{med.administered_by_nurse || "—"}</td>
                        <td className="p-3 text-xs">{med.administered_at || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Detailed Records */}
        {filteredMedications.filter(m => m.administration_notes).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredMedications
                .filter(m => m.administration_notes)
                .map((med) => (
                  <div key={med.id} className="p-3 rounded-lg bg-muted/50 border">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{med.drug_name} - {med.dose}</h4>
                        <p className="text-xs text-muted-foreground">
                          {new Date(med.created_at).toLocaleDateString()} at {med.administered_at}
                        </p>
                      </div>
                      <Badge
                        variant={
                          med.status === "given" ? "outline" :
                          med.status === "completed" ? "default" :
                          "destructive"
                        }
                      >
                        {med.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground italic">
                      "{med.administration_notes}"
                    </p>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatientMedicationHistory;

import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pill, Clock, CheckCircle2, AlertCircle, AlertTriangle, Check, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getMedications, updateMedicationStatus } from "@/lib/api";

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
  status: "pending" | "ready" | "given" | "missed" | "held";
  created_at: string;
  doctor_name: string;
}

const NurseMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [administeringId, setAdministeringId] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fiveRightsConfirmed, setFiveRightsConfirmed] = useState({
    patient: false,
    drug: false,
    dose: false,
    route: false,
    time: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    loadMedications();
    const interval = setInterval(loadMedications, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMedications = async () => {
    try {
      const data = await getMedications("ready");
      setMedications(data || []);
    } catch (err) {
      console.error("Failed to load medications", err);
    }
  };

  const handleAdminister = (med: Medication) => {
    setAdministeringId(med.id);
    setConfirmationData(med);
    setFiveRightsConfirmed({
      patient: false,
      drug: false,
      dose: false,
      route: false,
      time: false,
    });
    setAdminNotes("");
  };

  const handleSubmitAdministration = async () => {
    if (!Object.values(fiveRightsConfirmed).every(Boolean)) {
      toast({
        title: "Error",
        description: "Please verify all 5 rights before administering",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      await updateMedicationStatus(administeringId || "", {
        status: "given",
        administeredAt: timeStr,
        administeredByNurse: "Current Nurse",
        notes: adminNotes,
      });

      toast({
        title: "Success",
        description: "Medication administered successfully",
      });

      setAdministeringId(null);
      setConfirmationData(null);
      setAdminNotes("");
      loadMedications();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to record administration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMissedMedication = async (medId: string) => {
    try {
      setLoading(true);
      await updateMedicationStatus(medId, {
        status: "missed",
        administeredAt: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      });
      toast({
        title: "Recorded",
        description: "Missed medication documented",
      });
      loadMedications();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to record missed medication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    due: medications.filter(m => m.status === "ready").length,
    given: medications.filter(m => m.status === "given").length,
    missed: medications.filter(m => m.status === "missed").length,
    held: medications.filter(m => m.status === "held").length,
  };

  return (
    <NurseLayout title="Medication Administration">
      <div className="space-y-6 animate-fade-in">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.due}</div>
                <div className="text-sm text-muted-foreground">Due Now</div>
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
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.missed}</div>
                <div className="text-sm text-muted-foreground">Missed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200/50 bg-blue-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-200/30 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{stats.held}</div>
                <div className="text-sm text-muted-foreground">On Hold</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Administer Dialog */}
        {administeringId && confirmationData && (
          <Card className="border-2 border-warning bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="w-5 h-5" />
                Pre-Administration Safety Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 5 Rights Verification */}
              <div className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
                <h4 className="font-semibold text-sm text-blue-900">Verify 5 Rights of Medication Administration:</h4>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-white rounded border">
                    <input
                      type="checkbox"
                      id="right-patient"
                      checked={fiveRightsConfirmed.patient}
                      onChange={(e) =>
                        setFiveRightsConfirmed({ ...fiveRightsConfirmed, patient: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="right-patient" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">✓ RIGHT PATIENT</span>
                      <p className="text-xs text-muted-foreground">
                        Patient Name: <strong>{confirmationData.patient_name}</strong> | Bed:{" "}
                        <strong>{confirmationData.ward_id}</strong>
                      </p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded border">
                    <input
                      type="checkbox"
                      id="right-drug"
                      checked={fiveRightsConfirmed.drug}
                      onChange={(e) =>
                        setFiveRightsConfirmed({ ...fiveRightsConfirmed, drug: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="right-drug" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">✓ RIGHT DRUG</span>
                      <p className="text-xs text-muted-foreground">
                        Drug: <strong>{confirmationData.drug_name}</strong> | Prescribed by:{" "}
                        <strong>{confirmationData.doctor_name}</strong>
                      </p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded border">
                    <input
                      type="checkbox"
                      id="right-dose"
                      checked={fiveRightsConfirmed.dose}
                      onChange={(e) =>
                        setFiveRightsConfirmed({ ...fiveRightsConfirmed, dose: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="right-dose" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">✓ RIGHT DOSE</span>
                      <p className="text-xs text-muted-foreground">
                        Dose: <strong>{confirmationData.dose}</strong>
                      </p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded border">
                    <input
                      type="checkbox"
                      id="right-route"
                      checked={fiveRightsConfirmed.route}
                      onChange={(e) =>
                        setFiveRightsConfirmed({ ...fiveRightsConfirmed, route: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="right-route" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">✓ RIGHT ROUTE</span>
                      <p className="text-xs text-muted-foreground">
                        Route: <strong>{confirmationData.route}</strong>
                      </p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-white rounded border">
                    <input
                      type="checkbox"
                      id="right-time"
                      checked={fiveRightsConfirmed.time}
                      onChange={(e) =>
                        setFiveRightsConfirmed({ ...fiveRightsConfirmed, time: e.target.checked })
                      }
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="right-time" className="flex-1 cursor-pointer">
                      <span className="font-medium text-sm">✓ RIGHT TIME</span>
                      <p className="text-xs text-muted-foreground">
                        Frequency: <strong>{confirmationData.frequency}</strong> | Scheduled:{" "}
                        <strong>{confirmationData.start_time}</strong>
                      </p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {confirmationData.special_instructions && (
                <div className="bg-blue-50 p-3 rounded border border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-1">Special Instructions:</p>
                  <p className="text-sm text-blue-800">{confirmationData.special_instructions}</p>
                </div>
              )}

              {/* Administration Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold">Administration Notes (Optional)</label>
                <Textarea
                  placeholder="Record any observations, patient response, or special notes..."
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleSubmitAdministration}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={loading || !Object.values(fiveRightsConfirmed).every(Boolean)}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {loading ? "Recording..." : "Confirm & Administer"}
                </Button>
                <Button
                  onClick={() => {
                    setAdministeringId(null);
                    setConfirmationData(null);
                  }}
                  variant="outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medications Due */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-warning" />
              Due Medications ({medications.filter(m => m.status === "ready").length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {medications.filter(m => m.status === "ready").length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No medications due at this time.
              </div>
            ) : (
              <div className="space-y-3">
                {medications
                  .filter(m => m.status === "ready")
                  .map((med) => (
                    <div
                      key={med.id}
                      className="p-4 rounded-lg border-l-4 border-l-warning bg-warning/5 hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{med.patient_name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {med.ward_id}
                            </Badge>
                            <Badge className="text-xs">{med.frequency}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">Drug:</span>
                              <p className="font-medium">{med.drug_name}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Dose:</span>
                              <p className="font-medium">{med.dose}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Route:</span>
                              <p className="font-medium">{med.route}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Due:</span>
                              <p className="font-medium">{med.start_time}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleAdminister(med)}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={administeringId !== null}
                          >
                            <Check className="w-4 h-4 mr-2" />
                            Administer
                          </Button>
                          <Button
                            onClick={() => handleMissedMedication(med.id)}
                            variant="destructive"
                            disabled={loading}
                          >
                            <X className="w-4 h-4 mr-2" />
                            Missed
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </NurseLayout>
  );
};

export default NurseMedications;

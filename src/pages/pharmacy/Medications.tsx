import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Pill, CheckCircle2, AlertCircle, Clock, Search, Eye, Check, X } from "lucide-react";
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
  pharmacy_notes?: string;
}

const PharmacyMedications = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMedications();
    const interval = setInterval(loadMedications, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMedications = async () => {
    try {
      const data = await getMedications("pending");
      setMedications(data || []);
    } catch (err) {
      console.error("Failed to load medications", err);
    }
  };

  const handleDispense = async (medicationId: string, action: "approve" | "hold") => {
    try {
      setLoading(true);
      const status = action === "approve" ? "ready" : "held";
      await updateMedicationStatus(medicationId, {
        status,
        pharmacyNotes: notes,
      });
      toast({
        title: "Success",
        description: `Medication ${action === "approve" ? "approved" : "held"} successfully`,
      });
      setReviewingId(null);
      setNotes("");
      loadMedications();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err?.message || "Failed to update medication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredMedications = medications.filter((med) =>
    med.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.drug_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Pill className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold font-display">Pharmacy</h1>
            <p className="text-sm text-muted-foreground">Review and Dispense Medications</p>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-blue-200/50 bg-blue-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-200/30 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{filteredMedications.length}</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">High Priority</div>
                <div className="text-sm text-muted-foreground">Requires attention</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">Ready</div>
                <div className="text-sm text-muted-foreground">Dispensed & waiting</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by patient or drug name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Medications Queue */}
        <div className="space-y-3">
          {filteredMedications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                No pending medications for review.
              </CardContent>
            </Card>
          ) : (
            filteredMedications.map((med) => (
              <Card key={med.id} className="border-l-4 border-l-warning hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Pill className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <h3 className="font-semibold truncate">{med.patient_name}</h3>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          {med.ward_id}
                        </Badge>
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
                          <span className="text-muted-foreground">Frequency:</span>
                          <p className="font-medium text-xs">{med.frequency}</p>
                        </div>
                      </div>
                      {med.special_instructions && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Instructions:</strong> {med.special_instructions}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setReviewingId(reviewingId === med.id ? null : med.id)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {reviewingId === med.id ? "Hide" : "Review"}
                      </Button>
                    </div>
                  </div>

                  {/* Detailed Review Form */}
                  {reviewingId === med.id && (
                    <div className="mt-4 pt-4 border-t space-y-4">
                      <div>
                        <Label className="text-sm font-semibold">Pharmacy Notes</Label>
                        <Textarea
                          placeholder="Add any notes (stock status, substitutions, warnings, etc.)"
                          rows={3}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="mt-2"
                        />
                      </div>

                      {/* 5 Rights Verification Checklist */}
                      <div className="bg-blue-50/50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-blue-900 mb-2">Pharmacy Verification Checklist:</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="right1" className="w-4 h-4" />
                            <label htmlFor="right1" className="cursor-pointer">
                              ✓ Right Drug: {med.drug_name}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="right2" className="w-4 h-4" />
                            <label htmlFor="right2" className="cursor-pointer">
                              ✓ Right Dose: {med.dose}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="right3" className="w-4 h-4" />
                            <label htmlFor="right3" className="cursor-pointer">
                              ✓ Right Route: {med.route}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="right4" className="w-4 h-4" />
                            <label htmlFor="right4" className="cursor-pointer">
                              ✓ Right Frequency: {med.frequency}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <input type="checkbox" id="right5" className="w-4 h-4" />
                            <label htmlFor="right5" className="cursor-pointer">
                              ✓ Stock Available
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleDispense(med.id, "approve")}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={loading}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          {loading ? "Processing..." : "Approve & Dispense"}
                        </Button>
                        <Button
                          onClick={() => handleDispense(med.id, "hold")}
                          variant="destructive"
                          disabled={loading}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Hold
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PharmacyMedications;

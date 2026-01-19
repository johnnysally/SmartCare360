import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  HeartPulse, 
  Thermometer, 
  Wind, 
  Activity,
  Save,
  Clock,
  User,
  Users,
  AlertTriangle
} from "lucide-react";
import { useState, useEffect } from "react";
import { getPatients } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  name: string;
  bed?: string;
  status?: string;
}

interface VitalsRecord {
  patientName: string;
  bed: string;
  time: string;
  bp: string;
  pulse: string;
  temp: string;
  resp: string;
  spo2: string;
  pain: string;
}

const VitalsCapture = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [vitals, setVitals] = useState({
    bp_sys: '',
    bp_dia: '',
    pulse: '',
    temp: '',
    resp: '',
    spo2: '',
    pain: ''
  });
  const [recentVitals, setRecentVitals] = useState<VitalsRecord[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
    const storedVitals = localStorage.getItem('vitals_records');
    if (storedVitals) {
      setRecentVitals(JSON.parse(storedVitals));
    }
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients().catch(() => []);
      setPatients(data || []);
    } catch (err: any) {
      toast({ title: 'Failed to load patients', description: err?.message || '', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVitals = () => {
    if (!selectedPatient) {
      toast({ title: 'Error', description: 'Please select a patient', variant: 'destructive' });
      return;
    }

    if (!vitals.bp_sys || !vitals.pulse || !vitals.temp) {
      toast({ title: 'Error', description: 'Please fill in required fields (BP, Pulse, Temperature)', variant: 'destructive' });
      return;
    }

    const record: VitalsRecord = {
      patientName: selectedPatient.name,
      bed: selectedPatient.bed || 'N/A',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      bp: `${vitals.bp_sys}/${vitals.bp_dia}`,
      pulse: vitals.pulse,
      temp: vitals.temp,
      resp: vitals.resp,
      spo2: vitals.spo2,
      pain: vitals.pain
    };

    const updated = [record, ...recentVitals].slice(0, 10);
    setRecentVitals(updated);
    localStorage.setItem('vitals_records', JSON.stringify(updated));

    toast({ title: 'Success', description: `Vitals saved for ${selectedPatient.name}` });
    
    // Reset form
    setVitals({ bp_sys: '', bp_dia: '', pulse: '', temp: '', resp: '', spo2: '', pain: '' });
    setSelectedPatient(null);
  };

  return (
    <NurseLayout title="Vitals Capture">
      <div className="space-y-6 animate-fade-in">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Vitals Entry Form */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-success" />
                Record Patient Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Selection Dropdown */}
              <div className="space-y-2">
                <Label className="font-semibold">Select Patient</Label>
                <select 
                  value={selectedPatient?.id || ''}
                  onChange={(e) => {
                    const patient = patients.find(p => p.id === e.target.value);
                    setSelectedPatient(patient || null);
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">-- Choose a patient --</option>
                  {loading ? (
                    <option disabled>Loading patients...</option>
                  ) : patients.length === 0 ? (
                    <option disabled>No patients available</option>
                  ) : (
                    patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.bed || 'Bed N/A'} {patient.status === 'Critical' ? '⚠️' : ''}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Selected Patient Display */}
              {selectedPatient ? (
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{selectedPatient.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Bed {selectedPatient.bed || 'N/A'} • {selectedPatient.status || 'Stable'}
                      </div>
                    </div>
                    {selectedPatient.status === 'Critical' && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        Critical
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-muted/50 border border-dashed text-center">
                  <div className="text-sm text-muted-foreground">Select a patient to begin recording vitals</div>
                </div>
              )}

              {selectedPatient && (
                <>
                  {/* Vitals Grid */}
                  <div className="grid sm:grid-cols-2 gap-6 pt-4 border-t">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-success">
                        <HeartPulse className="w-5 h-5" />
                        <span className="font-medium">Blood Pressure</span>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1 space-y-2">
                          <Label>Systolic (mmHg)*</Label>
                          <Input 
                            placeholder="120" 
                            type="number"
                            value={vitals.bp_sys}
                            onChange={(e) => setVitals({ ...vitals, bp_sys: e.target.value })}
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label>Diastolic (mmHg)</Label>
                          <Input 
                            placeholder="80" 
                            type="number"
                            value={vitals.bp_dia}
                            onChange={(e) => setVitals({ ...vitals, bp_dia: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-info">
                        <Activity className="w-5 h-5" />
                        <span className="font-medium">Pulse Rate</span>
                      </div>
                      <div className="space-y-2">
                        <Label>BPM*</Label>
                        <Input 
                          placeholder="72" 
                          type="number"
                          value={vitals.pulse}
                          onChange={(e) => setVitals({ ...vitals, pulse: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-warning">
                        <Thermometer className="w-5 h-5" />
                        <span className="font-medium">Temperature</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Celsius (°C)*</Label>
                        <Input 
                          placeholder="36.8" 
                          type="number" 
                          step="0.1"
                          value={vitals.temp}
                          onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-primary">
                        <Wind className="w-5 h-5" />
                        <span className="font-medium">Respiratory Rate</span>
                      </div>
                      <div className="space-y-2">
                        <Label>Breaths/min</Label>
                        <Input 
                          placeholder="16" 
                          type="number"
                          value={vitals.resp}
                          onChange={(e) => setVitals({ ...vitals, resp: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional fields */}
                  <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label>Oxygen Saturation (%)</Label>
                      <Input 
                        placeholder="98" 
                        type="number"
                        value={vitals.spo2}
                        onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pain Level (0-10)</Label>
                      <Input 
                        placeholder="0" 
                        type="number" 
                        min="0" 
                        max="10"
                        value={vitals.pain}
                        onChange={(e) => setVitals({ ...vitals, pain: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSaveVitals} className="w-full btn-gradient" size="lg">
                    <Save className="w-5 h-5 mr-2" />
                    Save Vitals
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-success" />
                Recent Entries
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 max-h-96 overflow-y-auto">
              {recentVitals.length === 0 ? (
                <div className="py-6 text-center text-sm text-muted-foreground">No vitals records yet</div>
              ) : (
                recentVitals.map((vital, i) => (
                  <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{vital.patientName}</span>
                      <span className="text-xs text-muted-foreground">{vital.time}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">Bed {vital.bed}</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>BP: <span className="font-medium">{vital.bp}</span></div>
                      <div>Pulse: <span className="font-medium">{vital.pulse}</span></div>
                      <div>Temp: <span className="font-medium">{vital.temp}°C</span></div>
                      <div>Resp: <span className="font-medium">{vital.resp}</span></div>
                      {vital.spo2 && <div>SpO₂: <span className="font-medium">{vital.spo2}%</span></div>}
                      {vital.pain && <div>Pain: <span className="font-medium">{vital.pain}/10</span></div>}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </NurseLayout>
  );
};

export default VitalsCapture;

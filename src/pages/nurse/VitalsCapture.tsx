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
  User
} from "lucide-react";

const recentVitals = [
  { patient: "Mary Wanjiku", bed: "A-101", time: "08:30 AM", bp: "120/80", pulse: "72", temp: "36.8", resp: "16" },
  { patient: "John Omondi", bed: "A-102", time: "08:00 AM", bp: "145/95", pulse: "88", temp: "37.2", resp: "18" },
  { patient: "Fatima Hassan", bed: "A-103", time: "07:30 AM", bp: "118/78", pulse: "68", temp: "36.6", resp: "14" },
];

const VitalsCapture = () => (
  <NurseLayout title="Vitals Capture">
    <div className="space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Vitals Entry Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-success" />
              Record Vitals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Patient Selection */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-success" />
                </div>
                <div>
                  <div className="font-medium">Peter Kamau</div>
                  <div className="text-sm text-muted-foreground">Bed A-104 • Ward A</div>
                </div>
                <Badge variant="destructive" className="ml-auto">Critical</Badge>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-success">
                  <HeartPulse className="w-5 h-5" />
                  <span className="font-medium">Blood Pressure</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 space-y-2">
                    <Label>Systolic (mmHg)</Label>
                    <Input placeholder="120" type="number" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label>Diastolic (mmHg)</Label>
                    <Input placeholder="80" type="number" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-info">
                  <Activity className="w-5 h-5" />
                  <span className="font-medium">Pulse Rate</span>
                </div>
                <div className="space-y-2">
                  <Label>BPM</Label>
                  <Input placeholder="72" type="number" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-warning">
                  <Thermometer className="w-5 h-5" />
                  <span className="font-medium">Temperature</span>
                </div>
                <div className="space-y-2">
                  <Label>Celsius (°C)</Label>
                  <Input placeholder="36.8" type="number" step="0.1" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 text-primary">
                  <Wind className="w-5 h-5" />
                  <span className="font-medium">Respiratory Rate</span>
                </div>
                <div className="space-y-2">
                  <Label>Breaths/min</Label>
                  <Input placeholder="16" type="number" />
                </div>
              </div>
            </div>

            {/* Additional fields */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Oxygen Saturation (%)</Label>
                <Input placeholder="98" type="number" />
              </div>
              <div className="space-y-2">
                <Label>Pain Level (0-10)</Label>
                <Input placeholder="0" type="number" min="0" max="10" />
              </div>
            </div>

            <Button className="w-full btn-gradient" size="lg">
              <Save className="w-5 h-5 mr-2" />
              Save Vitals
            </Button>
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
          <CardContent className="space-y-4">
            {recentVitals.map((vital, i) => (
              <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{vital.patient}</span>
                  <span className="text-xs text-muted-foreground">{vital.time}</span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Bed {vital.bed}</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>BP: <span className="font-medium">{vital.bp}</span></div>
                  <div>Pulse: <span className="font-medium">{vital.pulse}</span></div>
                  <div>Temp: <span className="font-medium">{vital.temp}°C</span></div>
                  <div>Resp: <span className="font-medium">{vital.resp}</span></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </NurseLayout>
);

export default VitalsCapture;

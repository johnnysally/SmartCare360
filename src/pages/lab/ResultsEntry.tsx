import LabLayout from "@/components/LabLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, AlertTriangle, CheckCircle2, Send, Save } from "lucide-react";

const pendingResults = [
  { id: "LAB-001", patient: "Mary Wanjiku", test: "Complete Blood Count", priority: "Normal" },
  { id: "LAB-002", patient: "John Omondi", test: "Lipid Profile", priority: "Urgent" },
  { id: "LAB-003", patient: "Fatima Hassan", test: "Liver Function Test", priority: "Normal" },
];

const ResultsEntry = () => (
  <LabLayout title="Results Entry">
    <div className="space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Results Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-info" />
              Pending Entry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingResults.map((result) => (
              <div 
                key={result.id} 
                className="p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{result.patient}</span>
                  <Badge variant={result.priority === "Urgent" ? "destructive" : "secondary"} className="text-xs">
                    {result.priority}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">{result.id} • {result.test}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Result Entry Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Enter Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selected Test Info */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Mary Wanjiku</div>
                  <div className="text-sm text-muted-foreground">LAB-001 • Complete Blood Count</div>
                </div>
                <Badge>Normal Priority</Badge>
              </div>
            </div>

            {/* CBC Results Form */}
            <div className="space-y-4">
              <h4 className="font-medium">Complete Blood Count Parameters</h4>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Hemoglobin (g/dL)", range: "12.0-16.0", placeholder: "14.5" },
                  { label: "WBC (x10³/µL)", range: "4.5-11.0", placeholder: "7.2" },
                  { label: "RBC (x10⁶/µL)", range: "4.0-5.5", placeholder: "4.8" },
                  { label: "Platelets (x10³/µL)", range: "150-400", placeholder: "250" },
                  { label: "Hematocrit (%)", range: "36-48", placeholder: "42" },
                  { label: "MCV (fL)", range: "80-100", placeholder: "88" },
                ].map((param) => (
                  <div key={param.label} className="space-y-2">
                    <Label className="text-sm">{param.label}</Label>
                    <Input placeholder={param.placeholder} />
                    <span className="text-xs text-muted-foreground">Range: {param.range}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <Label>Clinical Comments</Label>
              <Textarea placeholder="Enter any clinical observations or comments..." rows={3} />
            </div>

            {/* Abnormal Flag */}
            <div className="flex items-center gap-3 p-4 rounded-lg border border-warning/30 bg-warning/5">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <div className="flex-1">
                <div className="font-medium text-warning">Flag Abnormal Results</div>
                <div className="text-sm text-muted-foreground">Mark if any values are outside normal range</div>
              </div>
              <Button variant="outline" size="sm" className="border-warning text-warning hover:bg-warning/10">
                Flag Abnormal
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button variant="outline" className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button className="flex-1 btn-gradient">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Submit for Verification
              </Button>
              <Button variant="outline">
                <Send className="w-4 h-4 mr-2" />
                Send to Doctor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </LabLayout>
);

export default ResultsEntry;

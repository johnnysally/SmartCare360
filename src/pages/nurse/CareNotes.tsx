import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, User, Clock, Save, Plus } from "lucide-react";

const recentNotes = [
  { patient: "Peter Kamau", bed: "A-104", time: "08:45 AM", note: "Patient complained of mild headache. Vitals stable. Administered Paracetamol as prescribed.", nurse: "Nurse Jane" },
  { patient: "Mary Wanjiku", bed: "A-101", time: "08:00 AM", note: "Post-operative wound dressing changed. No signs of infection. Patient comfortable.", nurse: "Nurse Jane" },
  { patient: "John Omondi", bed: "A-102", time: "07:30 AM", note: "Blood sugar levels slightly elevated. Informed duty doctor. Monitoring closely.", nurse: "Nurse Jane" },
];

const CareNotes = () => (
  <NurseLayout title="Care Notes">
    <div className="space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* New Note Form */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-success" />
              New Care Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Patient</Label>
                <Input placeholder="Search patient..." />
              </div>
              <div className="space-y-2">
                <Label>Note Type</Label>
                <Input placeholder="General observation" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Care Note</Label>
              <Textarea 
                placeholder="Enter detailed care observations, patient status, interventions performed, and any concerns..." 
                rows={6}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">Save as Draft</Button>
              <Button className="flex-1 btn-gradient">
                <Save className="w-4 h-4 mr-2" />
                Submit Note
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Templates */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Routine Check", "Vital Signs", "Medication Given", "Patient Complaint", "Wound Care", "IV Monitoring"].map((template, i) => (
              <Button key={i} variant="outline" className="w-full justify-start" size="sm">
                <ClipboardList className="w-4 h-4 mr-2" />
                {template}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Notes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-success" />
            Recent Care Notes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentNotes.map((note, i) => (
            <div key={i} className="p-4 rounded-lg border hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{note.patient}</span>
                  <Badge variant="outline">Bed {note.bed}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{note.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{note.note}</p>
              <div className="text-xs text-muted-foreground mt-2">— {note.nurse}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </NurseLayout>
);

export default CareNotes;

import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  FileText,
  Activity,
  Pill,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  Calendar,
  Heart,
  Thermometer,
  Droplets,
  Weight,
} from "lucide-react";

const currentPatient = {
  name: "Grace Njeri",
  age: 34,
  gender: "Female",
  phone: "+254 712 345 678",
  email: "grace.njeri@email.com",
  bloodType: "O+",
  allergies: ["Penicillin", "Sulfa drugs"],
  conditions: ["Asthma", "Seasonal allergies"],
  lastVisit: "2 weeks ago",
};

const vitals = {
  bloodPressure: "120/80",
  heartRate: "72",
  temperature: "36.8",
  weight: "65",
  oxygenSat: "98",
};

const medicalHistory = [
  { date: "Dec 15, 2024", diagnosis: "Upper Respiratory Infection", doctor: "Dr. Kimani" },
  { date: "Oct 3, 2024", diagnosis: "Asthma Follow-up", doctor: "Dr. Kimani" },
  { date: "Jul 22, 2024", diagnosis: "Annual Physical", doctor: "Dr. Otieno" },
];

const currentMedications = [
  { name: "Salbutamol Inhaler", dosage: "2 puffs PRN", frequency: "As needed" },
  { name: "Cetirizine 10mg", dosage: "1 tablet", frequency: "Once daily" },
];

const Consultations = () => (
  <DoctorLayout title="Consultations">
    <div className="space-y-6 animate-fade-in">
      {/* Patient Header */}
      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">{currentPatient.name}</h2>
                <p className="text-muted-foreground">
                  {currentPatient.age} years • {currentPatient.gender} • Blood Type: {currentPatient.bloodType}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Phone className="w-3 h-3" /> {currentPatient.phone}
                  </span>
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail className="w-3 h-3" /> {currentPatient.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentPatient.allergies.map((allergy, i) => (
                <Badge key={i} variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vitals Quick View */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
              <p className="font-semibold">{vitals.bloodPressure} mmHg</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">Heart Rate</p>
              <p className="font-semibold">{vitals.heartRate} bpm</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Temperature</p>
              <p className="font-semibold">{vitals.temperature}°C</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Weight className="w-5 h-5 text-info" />
            <div>
              <p className="text-xs text-muted-foreground">Weight</p>
              <p className="font-semibold">{vitals.weight} kg</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">SpO2</p>
              <p className="font-semibold">{vitals.oxygenSat}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="consultation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="consultation">Consultation</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
          <TabsTrigger value="medications">Medications</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="consultation" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Chief Complaint</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the patient's main complaint..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="List observed symptoms..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Examination Findings</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Document examination findings..."
                  className="min-h-[100px]"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Diagnosis</CardTitle>
              </CardHeader>
              <CardContent>
                <Input placeholder="Search ICD-10 codes..." className="mb-3" />
                <Textarea
                  placeholder="Enter diagnosis details..."
                  className="min-h-[60px]"
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Treatment Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the treatment plan..."
                className="min-h-[120px]"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline">Save Draft</Button>
            <Button variant="outline">Order Lab Tests</Button>
            <Button className="btn-gradient">
              <Pill className="w-4 h-4 mr-2" />
              Write Prescription
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Previous Visits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicalHistory.map((visit, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{visit.diagnosis}</p>
                      <p className="text-sm text-muted-foreground">{visit.doctor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{visit.date}</p>
                    <Button variant="ghost" size="sm">View Details</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {currentMedications.map((med, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {med.dosage} • {med.frequency}
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Patient Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No documents uploaded yet</p>
                <Button variant="outline" className="mt-4">Upload Document</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  </DoctorLayout>
);

export default Consultations;

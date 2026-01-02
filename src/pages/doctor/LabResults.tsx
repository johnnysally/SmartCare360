import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FlaskConical,
  Search,
  Download,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const pendingResults = [
  {
    id: "LAB001",
    patient: "Grace Njeri",
    test: "Complete Blood Count",
    orderedDate: "Jan 2, 2026",
    status: "processing",
  },
  {
    id: "LAB002",
    patient: "James Mwangi",
    test: "Lipid Panel",
    orderedDate: "Jan 2, 2026",
    status: "pending",
  },
];

const completedResults = [
  {
    id: "LAB003",
    patient: "Mary Wambui",
    test: "Hemoglobin A1C",
    orderedDate: "Jan 1, 2026",
    completedDate: "Jan 2, 2026",
    result: "6.2%",
    status: "normal",
  },
  {
    id: "LAB004",
    patient: "Peter Ochieng",
    test: "Fasting Blood Glucose",
    orderedDate: "Dec 31, 2025",
    completedDate: "Jan 1, 2026",
    result: "142 mg/dL",
    status: "abnormal",
  },
  {
    id: "LAB005",
    patient: "Alice Kimani",
    test: "Thyroid Panel",
    orderedDate: "Dec 30, 2025",
    completedDate: "Dec 31, 2025",
    result: "Normal",
    status: "normal",
  },
];

const labTestDetails = {
  test: "Complete Blood Count (CBC)",
  patient: "Mary Wambui",
  date: "Jan 2, 2026",
  components: [
    { name: "Hemoglobin", value: "13.5", unit: "g/dL", range: "12.0-16.0", status: "normal" },
    { name: "Hematocrit", value: "40.5", unit: "%", range: "36-46", status: "normal" },
    { name: "WBC", value: "7.2", unit: "K/uL", range: "4.5-11.0", status: "normal" },
    { name: "Platelets", value: "165", unit: "K/uL", range: "150-400", status: "low" },
    { name: "RBC", value: "4.8", unit: "M/uL", range: "4.0-5.5", status: "normal" },
    { name: "MCV", value: "88", unit: "fL", range: "80-100", status: "normal" },
  ],
};

const LabResults = () => (
  <DoctorLayout title="Lab Results">
    <div className="space-y-6 animate-fade-in">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">5</p>
              <p className="text-sm text-muted-foreground">Pending Results</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">12</p>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold font-display">3</p>
              <p className="text-sm text-muted-foreground">Abnormal Results</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search lab results..." className="pl-9" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Results List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Lab Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-3">
                {pendingResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-4 rounded-lg border"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="font-medium">{result.test}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.patient} • Ordered: {result.orderedDate}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">{result.status}</Badge>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-3">
                {completedResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          result.status === "normal"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        {result.status === "normal" ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{result.test}</p>
                        <p className="text-sm text-muted-foreground">
                          {result.patient} • {result.completedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{result.result}</span>
                      <Button variant="ghost" size="icon">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Result Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Result Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="font-medium">{labTestDetails.test}</p>
              <p className="text-sm text-muted-foreground">
                {labTestDetails.patient} • {labTestDetails.date}
              </p>
            </div>

            <div className="space-y-2">
              {labTestDetails.components.map((component, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded border">
                  <div>
                    <p className="text-sm font-medium">{component.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Range: {component.range} {component.unit}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {component.value} {component.unit}
                    </span>
                    {component.status === "low" && (
                      <TrendingDown className="w-4 h-4 text-warning" />
                    )}
                    {component.status === "high" && (
                      <TrendingUp className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button className="btn-gradient flex-1">Add Note</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DoctorLayout>
);

export default LabResults;

import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Calendar } from "lucide-react";

const results = [
  { test: "Complete Blood Count", date: "Jan 2, 2026", doctor: "Dr. Otieno", status: "Normal", category: "Hematology" },
  { test: "Lipid Profile", date: "Dec 28, 2025", doctor: "Dr. Mwangi", status: "Abnormal", category: "Biochemistry" },
  { test: "Liver Function Test", date: "Dec 15, 2025", doctor: "Dr. Wanjiru", status: "Normal", category: "Biochemistry" },
  { test: "Urinalysis", date: "Dec 10, 2025", doctor: "Dr. Otieno", status: "Normal", category: "Urinalysis" },
  { test: "Blood Glucose (Fasting)", date: "Nov 28, 2025", doctor: "Dr. Mwangi", status: "Normal", category: "Biochemistry" },
];

const MyResults = () => (
  <PatientLayout title="Lab Results">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-success">4</div>
            <div className="text-sm text-muted-foreground">Normal Results</div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-warning">1</div>
            <div className="text-sm text-muted-foreground">Needs Attention</div>
          </CardContent>
        </Card>
        <Card className="border-info/30 bg-info/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-info">5</div>
            <div className="text-sm text-muted-foreground">Total Tests</div>
          </CardContent>
        </Card>
      </div>

      {/* Results List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            All Lab Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${result.status === "Normal" ? "bg-success/10" : "bg-warning/10"}`}>
                    <FileText className={`w-6 h-6 ${result.status === "Normal" ? "text-success" : "text-warning"}`} />
                  </div>
                  <div>
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm text-muted-foreground">{result.category} • {result.doctor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="text-right mr-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {result.date}
                    </div>
                  </div>
                  <Badge variant={result.status === "Normal" ? "default" : "destructive"} className={result.status === "Normal" ? "bg-success" : ""}>
                    {result.status}
                  </Badge>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </PatientLayout>
);

export default MyResults;

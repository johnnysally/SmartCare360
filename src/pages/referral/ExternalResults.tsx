import ReferralLayout from "@/components/ReferralLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Eye, Building } from "lucide-react";

const results = [
  { id: "EXT-001", patient: "John Omondi", test: "Cardiac MRI", facility: "Kenyatta Hospital", date: "Jan 4, 2026", status: "Ready" },
  { id: "EXT-002", patient: "Mary Wanjiku", test: "CT Scan", facility: "Nairobi Hospital", date: "Jan 3, 2026", status: "Ready" },
  { id: "EXT-003", patient: "Peter Kamau", test: "Biopsy Report", facility: "Aga Khan", date: "Jan 2, 2026", status: "Pending" },
  { id: "EXT-004", patient: "Grace Akinyi", test: "PET Scan", facility: "Karen Hospital", date: "Jan 1, 2026", status: "Ready" },
];

const ExternalResults = () => (
  <ReferralLayout title="External Results">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">12</div>
              <div className="text-sm text-muted-foreground">Results Ready</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">3</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">5</div>
              <div className="text-sm text-muted-foreground">Partner Facilities</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            External Test Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Test</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Facility</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-sm">{result.id}</td>
                    <td className="py-3 px-4 font-medium">{result.patient}</td>
                    <td className="py-3 px-4">{result.test}</td>
                    <td className="py-3 px-4">{result.facility}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{result.date}</td>
                    <td className="py-3 px-4">
                      <Badge variant={result.status === "Ready" ? "default" : "secondary"} className={result.status === "Ready" ? "bg-success" : ""}>
                        {result.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  </ReferralLayout>
);

export default ExternalResults;

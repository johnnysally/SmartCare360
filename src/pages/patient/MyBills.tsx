import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, CreditCard, Download, Phone } from "lucide-react";

const bills = [
  { id: "INV-2024-001", description: "Consultation - Dr. Otieno", amount: 2500, date: "Jan 2, 2026", status: "Unpaid" },
  { id: "INV-2024-002", description: "Lab Tests - CBC, Lipid Profile", amount: 4500, date: "Dec 28, 2025", status: "Paid" },
  { id: "INV-2024-003", description: "Medication - Pharmacy", amount: 1800, date: "Dec 20, 2025", status: "Paid" },
  { id: "INV-2024-004", description: "Consultation - Dr. Mwangi", amount: 3500, date: "Dec 5, 2025", status: "Paid" },
];

const MyBills = () => (
  <PatientLayout title="My Bills">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-warning">KES 2,500</div>
            <div className="text-sm text-muted-foreground">Outstanding Balance</div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-success">KES 9,800</div>
            <div className="text-sm text-muted-foreground">Paid This Month</div>
          </CardContent>
        </Card>
        <Card className="border-info/30 bg-info/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold font-display text-info">4</div>
            <div className="text-sm text-muted-foreground">Total Invoices</div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button className="flex-1 btn-gradient">
              <Phone className="w-4 h-4 mr-2" />
              Pay with M-Pesa
            </Button>
            <Button className="flex-1" variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              Card Payment
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bills List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            All Invoices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bills.map((bill, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bill.status === "Paid" ? "bg-success/10" : "bg-warning/10"}`}>
                    <Receipt className={`w-6 h-6 ${bill.status === "Paid" ? "text-success" : "text-warning"}`} />
                  </div>
                  <div>
                    <div className="font-medium">{bill.description}</div>
                    <div className="text-sm text-muted-foreground">{bill.id} • {bill.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-auto">
                  <div className="text-right mr-2">
                    <div className="text-lg font-bold">KES {bill.amount.toLocaleString()}</div>
                  </div>
                  <Badge variant={bill.status === "Paid" ? "default" : "destructive"} className={bill.status === "Paid" ? "bg-success" : ""}>
                    {bill.status}
                  </Badge>
                  {bill.status === "Unpaid" && (
                    <Button size="sm" className="btn-gradient">Pay Now</Button>
                  )}
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

export default MyBills;

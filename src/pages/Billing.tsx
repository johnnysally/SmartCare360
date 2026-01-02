import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, CreditCard, Smartphone } from "lucide-react";

const invoices = [
  { id: "INV-001", patient: "Mary Wanjiku", amount: "KES 3,500", method: "M-Pesa", status: "Paid", date: "Jan 2, 2026" },
  { id: "INV-002", patient: "John Omondi", amount: "KES 12,000", method: "NHIF", status: "Pending", date: "Jan 2, 2026" },
  { id: "INV-003", patient: "Fatima Hassan", amount: "KES 5,200", method: "Cash", status: "Paid", date: "Jan 1, 2026" },
];

const Billing = () => (
  <DashboardLayout title="Billing & Payments">
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Today's Revenue</div>
          <div className="text-3xl font-bold font-display text-success">KES 156,400</div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">Pending Payments</div>
          <div className="text-3xl font-bold font-display text-warning">KES 45,000</div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="text-sm text-muted-foreground mb-1">NHIF Claims</div>
          <div className="text-3xl font-bold font-display text-info">12 pending</div>
        </CardContent></Card>
      </div>

      <div className="flex gap-3">
        <Button className="btn-gradient"><Plus className="w-4 h-4 mr-2" />New Invoice</Button>
        <Button variant="outline"><Smartphone className="w-4 h-4 mr-2" />M-Pesa</Button>
        <Button variant="outline"><CreditCard className="w-4 h-4 mr-2" />NHIF</Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
        <CardContent>
          <table className="w-full">
            <thead><tr className="border-b text-left text-sm text-muted-foreground">
              <th className="pb-3">Invoice</th><th className="pb-3">Patient</th><th className="pb-3">Amount</th><th className="pb-3">Method</th><th className="pb-3">Status</th>
            </tr></thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{inv.id}</td>
                  <td className="py-3">{inv.patient}</td>
                  <td className="py-3 font-medium">{inv.amount}</td>
                  <td className="py-3 text-sm">{inv.method}</td>
                  <td className="py-3"><span className={`text-xs px-2 py-1 rounded-full ${inv.status === "Paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{inv.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Billing;

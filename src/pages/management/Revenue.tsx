import ManagementLayout from "@/components/ManagementLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  CreditCard,
  FileText,
  ArrowUpRight,
  Phone
} from "lucide-react";

const revenueData = [
  { source: "Consultations", amount: "KES 1,850,000", change: "+18%", up: true },
  { source: "Laboratory", amount: "KES 980,000", change: "+12%", up: true },
  { source: "Pharmacy", amount: "KES 1,200,000", change: "+8%", up: true },
  { source: "Radiology", amount: "KES 450,000", change: "-5%", up: false },
  { source: "NHIF Claims", amount: "KES 320,000", change: "+25%", up: true },
];

const paymentMethods = [
  { method: "M-Pesa", amount: "KES 2.1M", percentage: 45 },
  { method: "Cash", amount: "KES 1.2M", percentage: 26 },
  { method: "NHIF", amount: "KES 850K", percentage: 18 },
  { method: "Card", amount: "KES 520K", percentage: 11 },
];

const Revenue = () => (
  <ManagementLayout title="Revenue Overview">
    <div className="space-y-6 animate-fade-in">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "KES 4.8M", sub: "This Month", icon: DollarSign, color: "text-success" },
          { label: "Outstanding", value: "KES 380K", sub: "Pending", icon: FileText, color: "text-warning" },
          { label: "NHIF Claims", value: "KES 520K", sub: "Processing", icon: CreditCard, color: "text-info" },
          { label: "Growth Rate", value: "+15%", sub: "vs Last Month", icon: TrendingUp, color: "text-primary" },
        ].map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Source */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-accent" />
              Revenue by Source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueData.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <div className="font-medium">{item.source}</div>
                  <div className="text-lg font-bold text-primary">{item.amount}</div>
                </div>
                <Badge variant={item.up ? "default" : "destructive"} className={item.up ? "bg-success" : ""}>
                  {item.up ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  {item.change}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-accent" />
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethods.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.method === "M-Pesa" && <Phone className="w-4 h-4 text-success" />}
                    <span className="font-medium">{item.method}</span>
                  </div>
                  <span className="font-bold">{item.amount}</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground text-right">{item.percentage}% of total</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            <Button className="btn-gradient">
              <FileText className="w-4 h-4 mr-2" />
              Generate Financial Report
            </Button>
            <Button variant="outline">
              <ArrowUpRight className="w-4 h-4 mr-2" />
              Export to Excel
            </Button>
            <Button variant="outline">
              <CreditCard className="w-4 h-4 mr-2" />
              NHIF Reconciliation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </ManagementLayout>
);

export default Revenue;

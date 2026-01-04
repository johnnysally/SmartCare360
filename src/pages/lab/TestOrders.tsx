import LabLayout from "@/components/LabLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Clock, User, FileText } from "lucide-react";

const orders = [
  { id: "ORD-001", patient: "Mary Wanjiku", doctor: "Dr. Otieno", tests: ["CBC", "Lipid Profile"], status: "Pending", time: "09:30 AM" },
  { id: "ORD-002", patient: "John Omondi", doctor: "Dr. Mwangi", tests: ["Urinalysis", "Blood Glucose"], status: "In Progress", time: "10:15 AM" },
  { id: "ORD-003", patient: "Fatima Hassan", doctor: "Dr. Wanjiru", tests: ["Liver Function"], status: "Sample Collected", time: "11:00 AM" },
  { id: "ORD-004", patient: "Peter Kamau", doctor: "Dr. Otieno", tests: ["Thyroid Panel", "CBC"], status: "Pending", time: "11:45 AM" },
  { id: "ORD-005", patient: "Grace Akinyi", doctor: "Dr. Mwangi", tests: ["Renal Function"], status: "Completed", time: "08:00 AM" },
];

const TestOrders = () => (
  <LabLayout title="Test Orders">
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search orders..." className="pl-10" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="px-4 py-2">All: {orders.length}</Badge>
          <Badge variant="outline" className="px-4 py-2 border-warning text-warning">Pending: 2</Badge>
          <Badge variant="outline" className="px-4 py-2 border-info text-info">In Progress: 1</Badge>
        </div>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-info" />
            Today's Test Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <Clock className="w-4 h-4 mx-auto text-muted-foreground mb-1" />
                    <div className="text-sm font-medium">{order.time}</div>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{order.patient}</span>
                      <span className="text-sm text-muted-foreground">({order.id})</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {order.doctor} • {order.tests.join(", ")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={order.status === "Completed" ? "default" : order.status === "Pending" ? "secondary" : "outline"}
                    className={order.status === "Completed" ? "bg-success" : order.status === "In Progress" ? "border-info text-info" : ""}
                  >
                    {order.status}
                  </Badge>
                  <Button size="sm" variant="outline">Process</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </LabLayout>
);

export default TestOrders;

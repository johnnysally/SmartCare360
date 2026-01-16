import PharmacyLayout from "@/components/PharmacyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Printer,
  Download,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPharmacyOrders, updatePharmacyOrder, deletePharmacyOrder } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((o: any) => o.status === statusFilter));
    }
  }, [statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const ordersData = await getPharmacyOrders().catch(() => []);
      setOrders(ordersData || []);
      setFilteredOrders(ordersData || []);
    } catch (err: any) {
      toast({ title: "Failed to load orders", description: err?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const order = orders.find((o: any) => o.id === orderId);
      if (!order) return;
      await updatePharmacyOrder(orderId, { ...order, status: newStatus });
      toast({ title: "Order updated successfully", description: `Status changed to ${newStatus}` });
      fetchOrders();
    } catch (err: any) {
      toast({ title: "Failed to update order", description: err?.message || "", variant: "destructive" });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deletePharmacyOrder(orderId);
      toast({ title: "Order deleted successfully" });
      fetchOrders();
    } catch (err: any) {
      toast({ title: "Failed to delete order", description: err?.message || "", variant: "destructive" });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "fulfilled":
        return <CheckCircle className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "fulfilled":
        return "bg-success/10 text-success border-success/20";
      case "shipped":
        return "bg-info/10 text-info border-info/20";
      case "cancelled":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PharmacyLayout title="Pharmacy Orders">
      <div className="space-y-6 animate-fade-in">
        {/* Header with Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display">All Orders</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Total: {orders.length} orders
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button size="sm" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              New Order
            </Button>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {["all", "pending", "fulfilled", "shipped", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className="capitalize"
            >
              {status}
              <span className="ml-2 text-xs bg-muted-foreground/20 px-2 py-0.5 rounded">
                {status === "all"
                  ? orders.length
                  : orders.filter((o) => o.status === status).length}
              </span>
            </Button>
          ))}
        </div>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              Order Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-12 text-center text-sm text-muted-foreground">
                Loading orders...
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 text-center">
                <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No orders found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((order, i) => {
                  const items = order.items || [];
                  return (
                    <div
                      key={i}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-semibold">Order #{order.id || i + 1}</span>
                              <Badge
                                variant="outline"
                                className={`capitalize ${getStatusColor(order.status)}`}
                              >
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(order.status)}
                                  {order.status}
                                </span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Patient ID: {order.patientId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDate(order.createdAt || Date.now())} at{" "}
                              {formatTime(order.createdAt || Date.now())}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-lg font-bold font-display">
                            KES {(order.total || 0).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {items.length} item{items.length !== 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>

                      {/* Items Preview */}
                      {items.length > 0 && (
                        <div className="mb-3 p-2 bg-muted/50 rounded text-xs space-y-1">
                          {items.slice(0, 2).map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between">
                              <span>{item.name}</span>
                              <span className="text-muted-foreground">x{item.qty}</span>
                            </div>
                          ))}
                          {items.length > 2 && (
                            <div className="text-muted-foreground">
                              +{items.length - 2} more item{items.length - 2 !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Eye className="w-4 h-4" />
                          View Details
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Printer className="w-4 h-4" />
                          Print
                        </Button>
                        {order.status !== 'fulfilled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleStatusUpdate(order.id, 'fulfilled')}
                          >
                            Mark Fulfilled
                          </Button>
                        )}
                        {order.status !== 'shipped' && order.status === 'fulfilled' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                          >
                            Ship Order
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-1 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Pending Orders</p>
                  <p className="text-2xl font-bold font-display">
                    {orders.filter((o) => o.status === "pending").length}
                  </p>
                </div>
                <Clock className="w-5 h-5 text-warning" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Fulfilled Today</p>
                  <p className="text-2xl font-bold font-display">
                    {orders.filter((o) => o.status === "fulfilled").length}
                  </p>
                </div>
                <CheckCircle className="w-5 h-5 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">In Transit</p>
                  <p className="text-2xl font-bold font-display">
                    {orders.filter((o) => o.status === "shipped").length}
                  </p>
                </div>
                <Truck className="w-5 h-5 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold font-display">
                    KES{" "}
                    {orders
                      .filter((o) => o.status === "fulfilled")
                      .reduce((sum, o) => sum + (o.total || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
                <ShoppingCart className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacyLayout>
  );
};

export default Orders;

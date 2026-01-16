import PharmacyLayout from "@/components/PharmacyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Activity,
  Calendar,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPharmacyOrders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Analytics = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const ordersData = await getPharmacyOrders().catch(() => []);
      setOrders(ordersData || []);
    } catch (err: any) {
      toast({ title: "Failed to load analytics", description: err?.message || "" });
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics
  const totalRevenue = orders
    .filter((o) => o.status === "fulfilled")
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalPatients = new Set(orders.map((o) => o.patientId)).size;
  const averageOrderValue = totalOrders > 0 ? totalRevenue / orders.filter((o) => o.status === "fulfilled").length : 0;
  const fulfillmentRate = totalOrders > 0
    ? Math.round((orders.filter((o) => o.status === "fulfilled").length / totalOrders) * 100)
    : 0;

  // Daily breakdown
  const dailyData = orders.reduce((acc: any, order: any) => {
    const date = new Date(order.createdAt || Date.now()).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = { orders: 0, revenue: 0, fulfilled: 0 };
    }
    acc[date].orders += 1;
    if (order.status === "fulfilled") {
      acc[date].revenue += order.total || 0;
      acc[date].fulfilled += 1;
    }
    return acc;
  }, {});

  const topDays = Object.entries(dailyData)
    .map(([date, data]: any) => ({ date, ...data }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  // Status breakdown
  const statusBreakdown = {
    pending: orders.filter((o) => o.status === "pending").length,
    fulfilled: orders.filter((o) => o.status === "fulfilled").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
  };

  const revenueByStatus = {
    fulfilled: orders
      .filter((o) => o.status === "fulfilled")
      .reduce((sum, o) => sum + (o.total || 0), 0),
    shipped: orders
      .filter((o) => o.status === "shipped")
      .reduce((sum, o) => sum + (o.total || 0), 0),
  };

  return (
    <PharmacyLayout title="Pharmacy Analytics">
      <div className="space-y-6 animate-fade-in">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Total Revenue</p>
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold font-display">
                KES {totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-success mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Total Orders</p>
                <ShoppingCart className="w-4 h-4 text-info" />
              </div>
              <p className="text-2xl font-bold font-display">{totalOrders}</p>
              <p className="text-xs text-muted-foreground mt-1">Across all statuses</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Avg Order Value</p>
                <TrendingUp className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold font-display">
                KES {Math.round(averageOrderValue).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Per fulfilled order</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Unique Patients</p>
                <Users className="w-4 h-4 text-warning" />
              </div>
              <p className="text-2xl font-bold font-display">{totalPatients}</p>
              <p className="text-xs text-muted-foreground mt-1">Customer base</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-muted-foreground">Fulfillment Rate</p>
                <Activity className="w-4 h-4 text-success" />
              </div>
              <p className="text-2xl font-bold font-display">{fulfillmentRate}%</p>
              <p className="text-xs text-success mt-1">Excellent</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Order Status Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Order Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Pending", value: statusBreakdown.pending, color: "bg-warning", icon: "⏳" },
                { label: "Fulfilled", value: statusBreakdown.fulfilled, color: "bg-success", icon: "✓" },
                { label: "Shipped", value: statusBreakdown.shipped, color: "bg-info", icon: "📦" },
                { label: "Cancelled", value: statusBreakdown.cancelled, color: "bg-destructive", icon: "✕" },
              ].map((status) => {
                const percentage = totalOrders > 0 ? (status.value / totalOrders) * 100 : 0;
                return (
                  <div key={status.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{status.label}</span>
                      <span className="text-sm font-bold">{status.value}</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${status.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(percentage)}% of total
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Revenue Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-primary" />
                Revenue Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Fulfilled Orders", value: revenueByStatus.fulfilled, color: "bg-success" },
                { label: "Shipped Orders", value: revenueByStatus.shipped, color: "bg-info" },
                { label: "Pending Revenue", value: orders.filter((o) => o.status === "pending").reduce((sum, o) => sum + (o.total || 0), 0), color: "bg-warning" },
              ].map((item) => {
                const percentage = totalRevenue > 0 ? (item.value / totalRevenue) * 100 : 0;
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{item.label}</span>
                      <span className="text-sm font-bold">
                        KES {item.value.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${item.color}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(percentage)}% of revenue
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Top Days Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Top Performing Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                Loading analytics...
              </div>
            ) : topDays.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No data available yet
              </div>
            ) : (
              <div className="space-y-3">
                {topDays.map((day: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm">{day.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {day.orders} order{day.orders !== 1 ? "s" : ""} • {day.fulfilled} fulfilled
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          KES {day.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {((day.fulfilled / day.orders) * 100).toFixed(0)}% fulfilled
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Average Daily Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">
                {Math.round(totalOrders / Math.max(Object.keys(dailyData).length, 1))}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Orders per active day</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Conversion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">{fulfillmentRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Orders fulfilled</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Customer Lifetime Value</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold font-display">
                KES {Math.round(totalPatients > 0 ? totalRevenue / totalPatients : 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Per patient average</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacyLayout>
  );
};

export default Analytics;

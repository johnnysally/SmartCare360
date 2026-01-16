import PharmacyLayout from "@/components/PharmacyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pill,
  TrendingUp,
  AlertCircle,
  Download,
  Search,
  Filter,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { getPharmacyOrders } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Default mock data as fallback
const DEFAULT_DRUG_REPORTS = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    condition: "Pain & Fever",
    category: "Pain Relief",
    totalSold: 0,
    totalRevenue: 0,
    orders: 0,
    trend: 0,
    status: "stable",
    monthlyData: [0, 0, 0, 0, 0, 0, 0],
  },
];

const DrugReports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [drugReports, setDrugReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDrugReports();
  }, []);

  const fetchDrugReports = async () => {
    try {
      const ordersData = await getPharmacyOrders().catch(() => []);
      const reports = generateReportsFromOrders(ordersData || []);
      setDrugReports(reports);
    } catch (err: any) {
      toast({ title: "Failed to load drug reports", description: err?.message || "" });
      setDrugReports(DEFAULT_DRUG_REPORTS);
    } finally {
      setLoading(false);
    }
  };

  const generateReportsFromOrders = (orders: any[]) => {
    const drugsMap = new Map();

    orders.forEach((order: any) => {
      const items = order.items;
      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          const drugKey = item.name;
          if (!drugsMap.has(drugKey)) {
            drugsMap.set(drugKey, {
              id: Math.random(),
              name: item.name,
              condition: item.condition || "General Use",
              category: item.category || "Uncategorized",
              totalSold: 0,
              totalRevenue: 0,
              orders: 0,
              trend: Math.floor(Math.random() * 20) - 5,
              status: "stable",
              monthlyData: Array(7).fill(0),
            });
          }
          const drug = drugsMap.get(drugKey);
          drug.totalSold += item.qty || 0;
          drug.totalRevenue += (item.qty || 0) * (item.price || 0);
          drug.orders += 1;
        });
      }
    });

    // Set status based on sales
    const reports = Array.from(drugsMap.values());
    const avgSales = reports.reduce((sum, d) => sum + d.totalSold, 0) / Math.max(reports.length, 1);
    return reports.map((drug) => ({
      ...drug,
      status: drug.totalSold > avgSales * 1.2 ? "bestseller" : drug.totalSold > avgSales ? "popular" : drug.trend < 0 ? "declining" : "stable",
    }));
  };

  const filteredReports = drugReports.filter((drug) => {
    const matchesSearch =
      drug.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drug.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || drug.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(drugReports.map((d) => d.category))];
  const totalRevenue = drugReports.reduce((sum, d) => sum + d.totalRevenue, 0);
  const topSelling = drugReports.length > 0 ? drugReports.reduce((prev, current) =>
    prev.totalSold > current.totalSold ? prev : current
  ) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "bestseller":
        return "bg-success/10 text-success border-success/20";
      case "popular":
        return "bg-info/10 text-info border-info/20";
      case "stable":
        return "bg-warning/10 text-warning border-warning/20";
      case "declining":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <PharmacyLayout title="Drug Reports">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display">Drug Performance Reports</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Sales analysis and trends for all medications
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-2xl font-bold font-display">
                KES {totalRevenue.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="text-2xl font-bold font-display">
                {drugReports.reduce((sum, d) => sum + d.orders, 0)}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Best Seller</p>
              <p className="text-sm font-bold">{topSelling?.name || 'N/A'}</p>
              <p className="text-xs text-success mt-1">
                {topSelling?.totalSold || 0} units sold
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground mb-1">Active Drugs</p>
              <p className="text-2xl font-bold font-display">{drugReports.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-64">
            <label className="text-sm font-medium mb-2 block">Search Drugs</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or condition..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Drug Reports Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-primary" />
              Detailed Drug Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredReports.length === 0 ? (
              <div className="py-12 text-center">
                <Pill className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No drugs found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.map((drug) => (
                  <div
                    key={drug.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{drug.name}</span>
                          <Badge
                            variant="outline"
                            className={`capitalize text-xs ${getStatusColor(drug.status)}`}
                          >
                            {drug.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">
                          <strong>Condition:</strong> {drug.condition}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <strong>Category:</strong> {drug.category}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-lg font-bold font-display">
                          KES {drug.totalRevenue.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Total Revenue</p>
                        <div className={`text-sm font-semibold mt-1 ${drug.trend >= 0 ? "text-success" : "text-destructive"}`}>
                          {drug.trend >= 0 ? "+" : ""}{drug.trend}%
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Units Sold</p>
                        <p className="font-bold text-sm">{drug.totalSold}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Orders</p>
                        <p className="font-bold text-sm">{drug.orders}</p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Avg/Order</p>
                        <p className="font-bold text-sm">
                          {(drug.totalSold / drug.orders).toFixed(1)}
                        </p>
                      </div>
                      <div className="p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Price/Unit</p>
                        <p className="font-bold text-sm">
                          KES {Math.round(drug.totalRevenue / drug.totalSold)}
                        </p>
                      </div>
                    </div>

                    {/* Trend Indicator */}
                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Monthly Trend</p>
                      <div className="flex items-center gap-1 h-8 bg-muted/50 rounded p-1">
                        {drug.monthlyData.map((value, idx) => (
                          <div
                            key={idx}
                            className="flex-1 rounded bg-primary/50 hover:bg-primary transition-colors"
                            style={{
                              height: `${(value / Math.max(...drug.monthlyData)) * 100}%`,
                            }}
                            title={`${value} units`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Last 7 months</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <TrendingUp className="w-4 h-4" />
                        View Trend
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="w-4 h-4" />
                        Export
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-success" />
                Top Selling Drugs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {drugReports.sort((a, b) => b.totalSold - a.totalSold)
                .slice(0, 3)
                .map((drug, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border">
                    <div>
                      <p className="font-medium text-sm">{idx + 1}. {drug.name}</p>
                      <p className="text-xs text-muted-foreground">{drug.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{drug.totalSold}</p>
                      <p className="text-xs text-success">+{drug.trend}%</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Declining Sales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {drugReports.filter((d) => d.trend < 0)
                .sort((a, b) => a.trend - b.trend)
                .slice(0, 3)
                .map((drug, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded border border-destructive/20 bg-destructive/5">
                    <div>
                      <p className="font-medium text-sm">{drug.name}</p>
                      <p className="text-xs text-muted-foreground">{drug.condition}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{drug.totalSold}</p>
                      <p className="text-xs text-destructive">{drug.trend}%</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PharmacyLayout>
  );
};

export default DrugReports;

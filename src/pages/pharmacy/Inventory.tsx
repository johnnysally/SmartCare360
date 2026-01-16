import PharmacyLayout from "@/components/PharmacyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";

// Mock inventory data - in production, this would come from an API
const MOCK_INVENTORY = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    category: "Pain Relief",
    condition: "Pain & Fever",
    stock: 450,
    minStock: 100,
    maxStock: 500,
    unitPrice: 50,
    supplier: "Cipla Pharmaceuticals",
    expiryDate: "2026-06-15",
  },
  {
    id: 2,
    name: "Ibuprofen 200mg",
    category: "Pain Relief",
    condition: "Inflammation & Pain",
    stock: 85,
    minStock: 100,
    maxStock: 500,
    unitPrice: 75,
    supplier: "GSK Kenya",
    expiryDate: "2026-08-20",
  },
  {
    id: 3,
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    condition: "Bacterial Infection",
    stock: 320,
    minStock: 200,
    maxStock: 600,
    unitPrice: 120,
    supplier: "Pfizer Kenya",
    expiryDate: "2026-03-10",
  },
  {
    id: 4,
    name: "Metformin 500mg",
    category: "Diabetes",
    condition: "Type 2 Diabetes",
    stock: 280,
    minStock: 200,
    maxStock: 500,
    unitPrice: 85,
    supplier: "Novartis Kenya",
    expiryDate: "2026-10-05",
  },
  {
    id: 5,
    name: "Lisinopril 10mg",
    category: "Blood Pressure",
    condition: "Hypertension",
    stock: 150,
    minStock: 150,
    maxStock: 400,
    unitPrice: 95,
    supplier: "AstraZeneca Kenya",
    expiryDate: "2025-12-20",
  },
  {
    id: 6,
    name: "Omeprazole 20mg",
    category: "Gastric",
    condition: "Acid Reflux & GERD",
    stock: 45,
    minStock: 100,
    maxStock: 350,
    unitPrice: 60,
    supplier: "Cipla Pharmaceuticals",
    expiryDate: "2026-09-15",
  },
];

const Inventory = () => {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [filteredInventory, setFilteredInventory] = useState(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    filterInventory();
  }, [searchTerm, categoryFilter, inventory]);

  const filterInventory = () => {
    let filtered = inventory;

    if (searchTerm) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((item) => item.category === categoryFilter);
    }

    setFilteredInventory(filtered);
  };

  const getStockStatus = (stock: number, minStock: number, maxStock: number) => {
    if (stock <= minStock) return { status: "low", color: "text-destructive", bg: "bg-destructive/10" };
    if (stock >= maxStock) return { status: "high", color: "text-info", bg: "bg-info/10" };
    return { status: "optimal", color: "text-success", bg: "bg-success/10" };
  };

  const totalValue = inventory.reduce((sum, item) => sum + item.stock * item.unitPrice, 0);
  const lowStockCount = inventory.filter((item) => item.stock <= item.minStock).length;
  const categories = ["all", ...new Set(inventory.map((item) => item.category))];

  return (
    <PharmacyLayout title="Pharmacy Inventory">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold font-display">Inventory Management</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {inventory.length} medicines in stock
            </p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Medicine
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Inventory Value</p>
                  <p className="text-2xl font-bold font-display">
                    KES {totalValue.toLocaleString()}
                  </p>
                </div>
                <Package className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold font-display">{inventory.length}</p>
                </div>
                <Package className="w-5 h-5 text-info" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">Low Stock Items</p>
                  <p className="text-2xl font-bold font-display text-destructive">
                    {lowStockCount}
                  </p>
                </div>
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-64">
            <label className="text-sm font-medium mb-2 block">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or supplier..."
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

        {/* Inventory Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Medicine Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredInventory.length === 0 ? (
              <div className="py-12 text-center">
                <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No medicines found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInventory.map((item) => {
                  const stockStatus = getStockStatus(item.stock, item.minStock, item.maxStock);
                  const percentageUsed = (item.stock / item.maxStock) * 100;

                  return (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {item.category}
                            </Badge>
                            {item.stock <= item.minStock && (
                              <Badge variant="destructive" className="text-xs gap-1">
                                <AlertTriangle className="w-3 h-3" />
                                Low Stock
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            <strong>Condition:</strong> {item.condition}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supplier: {item.supplier}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold">
                            Stock: <span className={stockStatus.color}>{item.stock}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Unit: KES {item.unitPrice}
                          </div>
                        </div>
                      </div>

                      {/* Stock Bar */}
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">Stock Level</span>
                          <span className="text-xs font-medium">
                            {Math.round(percentageUsed)}% of max
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              item.stock <= item.minStock
                                ? "bg-destructive"
                                : item.stock >= item.maxStock
                                ? "bg-info"
                                : "bg-success"
                            }`}
                            style={{ width: `${percentageUsed}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>Min: {item.minStock}</span>
                          <span>Max: {item.maxStock}</span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Total Value:</span>
                          <p className="font-medium">
                            KES {(item.stock * item.unitPrice).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Expiry Date:</span>
                          <p className="font-medium">{item.expiryDate}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="gap-1">
                          <Edit className="w-4 h-4" />
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Reorder
                        </Button>
                        <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
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
      </div>
    </PharmacyLayout>
  );
};

export default Inventory;

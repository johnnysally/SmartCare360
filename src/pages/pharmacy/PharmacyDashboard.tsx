import PharmacyLayout from "@/components/PharmacyLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
  ShoppingCart,
  DollarSign,
  Activity,
  CheckCircle,
  Search,
  AlertCircle,
  Pill,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getPharmacyOrders, createBilling, downloadReport, getMedications, updateMedicationStatus } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

const PharmacyDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "ready">("all");
  const [selectedMed, setSelectedMed] = useState<any>(null);
  const [pharmacyNotes, setPharmacyNotes] = useState("");
  const [assignedNurse, setAssignedNurse] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();

  // Sample nurses
  const nurses = [
    { id: "nurse1", name: "Grace Mwangi" },
    { id: "nurse2", name: "Elizabeth Kipchoge" },
    { id: "nurse3", name: "Patricia Okonkwo" },
  ];

  useEffect(() => {
    fetchPharmacyData();
    const interval = setInterval(loadMedications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPharmacyData = async () => {
    try {
      const ordersData = await getPharmacyOrders().catch(() => []);
      setOrders(ordersData || []);
      await loadMedications();
    } catch (err: any) {
      toast({ title: 'Failed to load pharmacy data', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  const loadMedications = async () => {
    try {
      console.log('[DEBUG] Loading prescriptions...');
      const medsData = await getMedications();
      const filtered = medsData.filter((m: any) => 
        m.status === 'pending' || m.status === 'ready'
      );
      console.log('[DEBUG] Filtered medications:', filtered);
      setMedications(filtered);
    } catch (error) {
      console.error('[DEBUG] Failed to load medications:', error);
    }
  };

  const handleApprovePrescription = async () => {
    if (!selectedMed || !pharmacyNotes.trim()) {
      toast({ title: "Please add pharmacy notes" });
      return;
    }
    try {
      await updateMedicationStatus(selectedMed.id, { status: "ready", notes: pharmacyNotes });
      toast({ title: "Prescription approved successfully" });
      setShowModal(false);
      setPharmacyNotes("");
      setAssignedNurse("");
      await loadMedications();
    } catch (error: any) {
      toast({ title: "Failed to approve prescription", description: error?.message || "" });
    }
  };

  const handleRejectPrescription = async () => {
    if (!selectedMed) return;
    try {
      await updateMedicationStatus(selectedMed.id, { status: "held", reason: "Rejected by pharmacy" });
      toast({ title: "Prescription rejected" });
      setShowModal(false);
      setPharmacyNotes("");
      await loadMedications();
    } catch (error: any) {
      toast({ title: "Failed to reject prescription", description: error?.message || "" });
    }
  };

  const handleIssueMedication = async () => {
    if (!selectedMed || !assignedNurse) {
      toast({ title: "Please select a nurse" });
      return;
    }
    try {
      await updateMedicationStatus(selectedMed.id, { 
        status: "issued",
        assignedTo: assignedNurse,
        notes: pharmacyNotes 
      });
      toast({ title: "Medication issued to nurse successfully" });
      setShowModal(false);
      setPharmacyNotes("");
      setAssignedNurse("");
      await loadMedications();
    } catch (error: any) {
      toast({ title: "Failed to issue medication", description: error?.message || "" });
    }
  };

  // Calculate stats from real data
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const fulfilledOrders = orders.filter((o: any) => o.status === 'fulfilled').length;
  const totalRevenue = orders.filter((o: any) => o.status === 'fulfilled').reduce((sum, o: any) => sum + (o.total || 0), 0);
  const lowStockItems = Math.floor(totalOrders * 0.2); // Estimate based on orders
  
  // Extract available drugs from orders
  const availableDrugsSet = new Map();
  orders.forEach((order: any) => {
    const items = order.items;
    if (Array.isArray(items)) {
      items.forEach((item: any) => {
        if (!availableDrugsSet.has(item.name)) {
          availableDrugsSet.set(item.name, {
            name: item.name,
            condition: item.condition || 'General Use',
            available: 0,
          });
        }
        const drug = availableDrugsSet.get(item.name);
        drug.available += item.qty || 0;
      });
    }
  });
  const availableDrugs = Array.from(availableDrugsSet.values()).slice(0, 6);
  const totalDrugsAvailable = availableDrugsSet.size;

  const recentOrders = orders.slice(-5).reverse().map((order: any) => ({
    id: order.id || Math.random(),
    patientId: order.patientId,
    items: order.items || [],
    total: order.total || 0,
    status: order.status || 'pending',
    date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
    time: new Date(order.createdAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  }));

  const stats = [
    { label: "Total Orders", value: totalOrders.toString(), icon: ShoppingCart, color: "text-primary" },
    { label: "Pending Orders", value: pendingOrders.toString(), icon: Clock, color: "text-warning" },
    { label: "Fulfilled Orders", value: fulfilledOrders.toString(), icon: CheckCircle, color: "text-success" },
    { label: "Total Revenue", value: `KES ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-info" },
  ];

  const inventoryStatus = [
    { name: "High Stock", count: Math.max(0, totalOrders - lowStockItems - 2), status: "good" },
    { name: "Medium Stock", count: Math.max(0, lowStockItems), status: "medium" },
    { name: "Low Stock", count: Math.max(0, 2), status: "warning" },
  ];

  return (
    <PharmacyLayout title="Pharmacy Dashboard">
      <div className="space-y-6 animate-fade-in">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="prescriptions" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Prescriptions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="flex items-center justify-end gap-2">
              <Button onClick={() => setShowInvoice(true)}>Create Invoice</Button>

              <Button onClick={async () => {
                try {
                  const blob = await downloadReport('pharmacy');
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url; a.download = 'pharmacy_orders_report.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
                } catch (e:any) { toast({ title: 'Failed to download report', description: e?.message || '' }); }
              }}>Download Orders</Button>
            </div>

            {showInvoice && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/60" onClick={() => setShowInvoice(false)} />
                <div className="z-60 w-full max-w-lg bg-background p-6 rounded-lg shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Create Invoice</h3>
                    <Button variant="ghost" size="sm" onClick={() => setShowInvoice(false)}>Close</Button>
                  </div>
                  <InvoiceForm onCreated={() => { setShowInvoice(false); fetchPharmacyData(); }} />
                </div>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <Card key={i} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs text-muted-foreground">Today</span>
                    </div>
                    <div className="text-2xl font-bold font-display">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Drugs Available Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-success" />
                  Drugs Available ({totalDrugsAvailable})
                </CardTitle>
                <Button variant="ghost" size="sm">View All</Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableDrugs.slice(0, 6).map((drug: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 text-success" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{drug.name}</div>
                        <div className="text-xs text-muted-foreground">{drug.condition}</div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-sm text-success">{drug.available} units</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <Card className="lg:col-span-2">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    Recent Orders
                  </CardTitle>
                  <Button variant="ghost" size="sm">View All</Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">Loading orders...</div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">No orders yet</div>
                  ) : (
                    recentOrders.map((order, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Patient #{order.patientId}</div>
                            <div className="text-sm text-muted-foreground">{order.items.length} item(s) • {order.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-medium">KES {order.total.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">{order.time}</div>
                          </div>
                          <Badge variant={order.status === 'fulfilled' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Inventory Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-success" />
                    Inventory Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inventoryStatus.map((item, i) => (
                    <div key={i} className="p-3 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className={`text-2xl font-bold font-display ${
                          item.status === 'good' ? 'text-success' :
                          item.status === 'medium' ? 'text-warning' :
                          'text-destructive'
                        }`}>
                          {item.count}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            item.status === 'good' ? 'bg-success' :
                            item.status === 'medium' ? 'bg-warning' :
                            'bg-destructive'
                          }`}
                          style={{ width: `${Math.min((item.count / Math.max(...inventoryStatus.map(s => s.count), 1)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Status Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-accent" />
                  Order Status Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Pending</span>
                      <Clock className="w-4 h-4 text-warning" />
                    </div>
                    <div className="text-3xl font-bold font-display text-warning">{pendingOrders}</div>
                    <div className="text-xs text-muted-foreground mt-1">Orders awaiting fulfillment</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Fulfilled</span>
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="text-3xl font-bold font-display text-success">{fulfilledOrders}</div>
                    <div className="text-xs text-muted-foreground mt-1">Successfully completed orders</div>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Conversion</span>
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-3xl font-bold font-display text-primary">
                      {totalOrders > 0 ? Math.round((fulfilledOrders / totalOrders) * 100) : 0}%
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Fulfillment rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Low Stock Alert */}
            {lowStockItems > 0 && (
              <Card className="border-warning/50 bg-warning/5">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  <span className="text-sm"><strong>{lowStockItems} items</strong> are running low on stock and need restocking soon.</span>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Prescriptions Tab */}
          <TabsContent value="prescriptions" className="space-y-6 mt-6">
            {/* Warning for pending prescriptions */}
            {medications.filter((m: any) => m.status === 'pending').length > 0 && (
              <AlertDialog open={true}>
                <AlertDialogContent>
                  <AlertDialogTitle>Pending Prescriptions</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have {medications.filter((m: any) => m.status === 'pending').length} pending prescriptions from doctors waiting for review.
                  </AlertDialogDescription>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                  <div className="text-2xl font-bold font-display">{medications.filter((m: any) => m.status === 'pending').length}</div>
                  <div className="text-sm text-muted-foreground">Prescriptions awaiting review</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                    <span className="text-xs text-muted-foreground">Ready</span>
                  </div>
                  <div className="text-2xl font-bold font-display">{medications.filter((m: any) => m.status === 'ready').length}</div>
                  <div className="text-sm text-muted-foreground">Ready to issue to nurses</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-xs text-muted-foreground">Total</span>
                  </div>
                  <div className="text-2xl font-bold font-display">{medications.length}</div>
                  <div className="text-sm text-muted-foreground">All prescriptions</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient, medication, doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 rounded-lg border bg-background"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="ready">Ready</option>
              </select>
            </div>

            {/* Prescriptions Table */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Patient</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Medication</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Dose</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Doctor</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Frequency</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {medications
                          .filter((m: any) => {
                            const matchesSearch = !searchTerm || 
                              m.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              m.medication_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              m.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
                            const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
                            return matchesSearch && matchesStatus;
                          })
                          .map((med: any) => (
                            <tr key={med.id} className="border-b hover:bg-muted/50">
                              <td className="px-6 py-4 text-sm">{med.patient_name || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm font-medium">{med.medication_name || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm">{med.dosage || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm">{med.doctor_name || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm">{med.frequency || 'N/A'}</td>
                              <td className="px-6 py-4 text-sm">
                                <Badge variant={med.status === 'pending' ? 'secondary' : 'default'}>
                                  {med.status}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedMed(med);
                                    setShowModal(true);
                                  }}
                                >
                                  Review
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prescriptions Cards (Mobile) */}
            <div className="md:hidden space-y-3">
              {medications
                .filter((m: any) => {
                  const matchesSearch = !searchTerm || 
                    m.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.medication_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    m.doctor_name?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = filterStatus === 'all' || m.status === filterStatus;
                  return matchesSearch && matchesStatus;
                })
                .map((med: any) => (
                  <Card key={med.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => { setSelectedMed(med); setShowModal(true); }}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{med.patient_name || 'N/A'}</span>
                          <Badge variant={med.status === 'pending' ? 'secondary' : 'default'}>
                            {med.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div><strong>Medication:</strong> {med.medication_name || 'N/A'}</div>
                          <div><strong>Dose:</strong> {med.dosage || 'N/A'}</div>
                          <div><strong>Doctor:</strong> {med.doctor_name || 'N/A'}</div>
                          <div><strong>Frequency:</strong> {med.frequency || 'N/A'}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal Dialog for Prescription Details */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Prescription Details</DialogTitle>
            </DialogHeader>
            {selectedMed && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Patient</p>
                    <p className="font-medium">{selectedMed.patient_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Doctor</p>
                    <p className="font-medium">{selectedMed.doctor_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Medication</p>
                    <p className="font-medium">{selectedMed.medication_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Dosage</p>
                    <p className="font-medium">{selectedMed.dosage || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-medium">{selectedMed.route || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Frequency</p>
                    <p className="font-medium">{selectedMed.frequency || 'N/A'}</p>
                  </div>
                </div>
                {selectedMed.instructions && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Instructions</p>
                    <p className="text-sm">{selectedMed.instructions}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium">Pharmacy Notes (Required)</label>
                  <textarea
                    value={pharmacyNotes}
                    onChange={(e) => setPharmacyNotes(e.target.value)}
                    placeholder="Add observations, availability status, or concerns..."
                    className="w-full mt-2 p-2 rounded-lg border bg-background text-sm resize-none"
                    rows={3}
                  />
                </div>
                {selectedMed.status === 'ready' && (
                  <div>
                    <label className="text-sm font-medium">Assign to Nurse</label>
                    <select
                      value={assignedNurse}
                      onChange={(e) => setAssignedNurse(e.target.value)}
                      className="w-full mt-2 p-2 rounded-lg border bg-background text-sm"
                    >
                      <option value="">Select a nurse...</option>
                      {nurses.map((nurse) => (
                        <option key={nurse.id} value={nurse.id}>
                          {nurse.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}
            <DialogFooter className="flex gap-2 justify-end">
              {selectedMed?.status === 'pending' ? (
                <>
                  <Button variant="outline" onClick={handleRejectPrescription}>
                    Reject
                  </Button>
                  <Button onClick={handleApprovePrescription}>
                    Approve
                  </Button>
                </>
              ) : (
                <Button onClick={handleIssueMedication} disabled={!assignedNurse}>
                  Issue to Nurse
                </Button>
              )}
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </PharmacyLayout>
  );
};

export default PharmacyDashboard;

function InvoiceForm({ onCreated }: { onCreated?: () => void }){
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();
  const onSubmit = async (data: any) => {
    try {
      await createBilling({ patientId: data.patientId, amount: Number(data.amount), status: data.status || 'pending' });
      toast({ title: 'Invoice created' });
      reset();
      onCreated && onCreated();
    } catch (e:any) {
      toast({ title: 'Failed to create invoice', description: e?.message || '' });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3">
      <div>
        <Input placeholder="Patient ID" {...register('patientId', { required: 'Patient ID is required' })} />
        {errors.patientId && <p className="text-sm text-destructive mt-1">{String((errors.patientId as any)?.message) || 'Error'}</p>}
      </div>
      <div>
        <Input placeholder="Amount (KES)" type="number" step="0.01" {...register('amount', { required: 'Amount is required' })} />
        {errors.amount && <p className="text-sm text-destructive mt-1">{String((errors.amount as any)?.message) || 'Error'}</p>}
      </div>
      <div>
        <select {...register('status', { required: false })} className="input">
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
        </select>
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create Invoice'}</Button>
      </div>
    </form>
  );
}

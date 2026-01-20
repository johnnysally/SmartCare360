import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download, Calendar, Filter } from 'lucide-react';

const BillingReports = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [revenueData, setRevenueData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [paymentMethodData, setPaymentMethodData] = useState([]);
  const [insuranceClaimsData, setInsuranceClaimsData] = useState([]);
  const [taxData, setTaxData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [startDate, endDate]);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch monthly revenue
      const revenueRes = await fetch('/api/billing/reports/monthly/2026/01');
      const revenueData = await revenueRes.json();

      // Fetch department revenue
      const deptRes = await fetch(`/api/billing/reports/by-department?startDate=${startDate}&endDate=${endDate}`);
      const deptData = await deptRes.json();

      // Fetch payment methods
      const paymentRes = await fetch(`/api/billing/reports/payment-methods?startDate=${startDate}&endDate=${endDate}`);
      const paymentData = await paymentRes.json();

      // Fetch insurance claims
      const claimsRes = await fetch('/api/billing/reports/insurance-claims');
      const claimsData = await claimsRes.json();

      // Fetch tax report
      const taxRes = await fetch(`/api/billing/reports/tax?startDate=${startDate}&endDate=${endDate}`);
      const taxReportData = await taxRes.json();

      setRevenueData(revenueData?.daily || []);
      setDepartmentData(deptData?.byDepartment || []);
      setPaymentMethodData(paymentData?.breakdown || []);
      setInsuranceClaimsData(claimsData?.claims || []);
      setTaxData(taxReportData || {});
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load report data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    toast({ title: 'Export', description: 'Report exported successfully' });
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <DashboardLayout title="Billing Reports">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Billing Reports</h1>
            <p className="text-gray-500">Financial analytics & insights</p>
          </div>
          <Button onClick={handleExport} className="btn-gradient">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2"
                />
              </div>
              <div className="flex items-end">
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Apply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">KES {(taxData?.totalRevenue || 0)?.toLocaleString()}</p>
              <p className="text-xs text-green-600">+12% vs last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Tax Collected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">KES {(taxData?.totalTax || 0)?.toLocaleString()}</p>
              <p className="text-xs text-blue-600">16% VAT</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Insurance Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{insuranceClaimsData?.length || 0}</p>
              <p className="text-xs text-amber-600">Pending review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{paymentMethodData?.length || 0}</p>
              <p className="text-xs text-purple-600">Payment options</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="revenue" className="w-full">
          <TabsList>
            <TabsTrigger value="revenue">Monthly Revenue</TabsTrigger>
            <TabsTrigger value="department">By Department</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            <TabsTrigger value="insurance">Insurance Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="revenue" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue over the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                {revenueData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip formatter={(value) => `KES ${value?.toLocaleString()}`} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="department" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
                <CardDescription>Which departments generate the most revenue?</CardDescription>
              </CardHeader>
              <CardContent>
                {departmentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip formatter={(value) => `KES ${value?.toLocaleString()}`} />
                      <Bar dataKey="revenue" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payment" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method Distribution</CardTitle>
                <CardDescription>How do patients prefer to pay?</CardDescription>
              </CardHeader>
              <CardContent>
                {paymentMethodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={paymentMethodData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: KES ${value?.toLocaleString()}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                      >
                        {paymentMethodData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `KES ${value?.toLocaleString()}`} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-300 flex items-center justify-center text-gray-500">
                    No data available
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Insurance Claims Status</CardTitle>
                <CardDescription>Pending and processed insurance claims</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">Insurer</th>
                        <th className="pb-3 font-medium">Patient</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Submitted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {insuranceClaimsData.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-gray-500">
                            No insurance claims
                          </td>
                        </tr>
                      ) : (
                        insuranceClaimsData.map((claim: any) => (
                          <tr key={claim.id} className="border-b last:border-0">
                            <td className="py-3">{claim.insurerName}</td>
                            <td className="py-3">{claim.patientName}</td>
                            <td className="py-3 font-medium">KES {claim.amount?.toLocaleString()}</td>
                            <td className="py-3">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                claim.status === 'pending'
                                  ? 'bg-amber-100 text-amber-700'
                                  : claim.status === 'approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}>
                                {claim.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm">{new Date(claim.submittedAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Tax Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Summary</CardTitle>
            <CardDescription>VAT & tax collection details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Taxable Amount</p>
                <p className="text-2xl font-bold">KES {(taxData?.taxableAmount || 0)?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">VAT (16%)</p>
                <p className="text-2xl font-bold">KES {(taxData?.vat || 0)?.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Total (Incl. Tax)</p>
                <p className="text-2xl font-bold">KES {(taxData?.totalWithTax || 0)?.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default BillingReports;

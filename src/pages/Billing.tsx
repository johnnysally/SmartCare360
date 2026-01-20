import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from "@/components/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { CreditCard, TrendingUp, AlertCircle, CheckCircle2, Plus, Trash2, ArrowDown, ArrowUp, DollarSign, Wallet, FileText } from 'lucide-react';

const Billing = () => {
  const [stats, setStats] = useState({
    dailyRevenue: 0,
    outstandingBalance: 0,
    totalPatients: 0,
    pendingPayments: 0,
    cashOnHand: 25000,
    totalCollected: 185000,
    pendingRefunds: 5000,
  });
  const [bills, setBills] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewBill, setShowNewBill] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    fetchBillingData();
    loadTransactionHistory();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      const dailyRes = await fetch(`/api/billing/reports/daily-revenue?date=${today}`);
      const outstandingRes = await fetch('/api/billing/reports/outstanding');

      const dailyData = await dailyRes.json();
      const outstandingData = await outstandingRes.json();

      setStats(prev => ({
        ...prev,
        dailyRevenue: dailyData?.totalRevenue || 0,
        outstandingBalance: outstandingData?.totalOutstanding || 0,
        totalPatients: outstandingData?.totalPatients || 0,
        pendingPayments: outstandingData?.records?.length || 0,
      }));

      setBills(outstandingData?.records || []);
    } catch (error) {
      console.error('Error fetching billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactionHistory = () => {
    // Mock transaction history
    setTransactions([
      { id: 'TXN001', patientId: 'P001', patientName: 'John Doe', amount: 5000, method: 'Cash', type: 'Payment', date: new Date(), status: 'Completed' },
      { id: 'TXN002', patientId: 'P002', patientName: 'Jane Smith', amount: 10000, method: 'M-Pesa', type: 'Payment', date: new Date(Date.now() - 3600000), status: 'Completed' },
      { id: 'TXN003', patientId: 'P003', patientName: 'Mike Johnson', amount: 2000, method: 'Card', type: 'Refund', date: new Date(Date.now() - 7200000), status: 'Completed' },
      { id: 'TXN004', patientId: 'P004', patientName: 'Sarah Williams', amount: 15000, method: 'Bank Transfer', type: 'Payment', date: new Date(Date.now() - 86400000), status: 'Completed' },
    ]);
  };

  const handleProcessPayment = (data: any) => {
    toast({ 
      title: 'Payment Processed', 
      description: `KES ${parseFloat(data.amount).toLocaleString()} received via ${data.method}` 
    });
    // Add to transaction history
    const newTransaction = {
      id: `TXN${Date.now()}`,
      patientId: data.patientId,
      amount: parseFloat(data.amount),
      method: data.method,
      type: 'Payment',
      date: new Date(),
      status: 'Completed'
    };
    setTransactions([newTransaction, ...transactions]);
    setStats(prev => ({
      ...prev,
      cashOnHand: prev.cashOnHand + parseFloat(data.amount),
      totalCollected: prev.totalCollected + parseFloat(data.amount),
    }));
  };

  return (
    <DashboardLayout title="Billing & Payments">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Billing & Payments</h1>
            <p className="text-gray-500">Complete financial transaction management</p>
          </div>
          <Button className="btn-gradient" onClick={() => setShowNewBill(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Bill
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="cash-mgmt" className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Cash Mgmt</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-4">

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Daily Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">KES {stats.dailyRevenue?.toLocaleString()}</p>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">KES {stats.outstandingBalance?.toLocaleString()}</p>
                  <p className="text-xs text-red-600">{stats.pendingPayments} pending</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cash Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">KES {stats.totalCollected?.toLocaleString()}</p>
                <ArrowDown className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Cash Float</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">KES {stats.cashOnHand?.toLocaleString()}</p>
                <Wallet className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outstanding Bills */}
        <Card>
          <CardHeader>
            <CardTitle>Outstanding Bills</CardTitle>
            <CardDescription>Bills awaiting payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-600">
                    <th className="pb-3 font-medium">Patient</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Days Due</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        Loading...
                      </td>
                    </tr>
                  ) : bills.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-gray-500">
                        No outstanding bills
                      </td>
                    </tr>
                  ) : (
                    bills.map((bill: any) => (
                      <tr key={bill.id} className="border-b last:border-0">
                        <td className="py-3">{bill.patientName}</td>
                        <td className="py-3 font-medium">KES {bill.total?.toLocaleString()}</td>
                        <td className="py-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                            {bill.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-3 text-sm">{bill.daysDue || 0}</td>
                        <td className="py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveTab('payments');
                              toast({ title: 'Process payment for this patient', description: bill.patientName });
                            }}
                          >
                            Pay
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Process Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <PaymentForm onSubmit={handleProcessPayment} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transaction History Tab */}
          <TabsContent value="transactions" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All payments and financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No transactions yet</div>
                  ) : (
                    transactions.map((txn: any) => (
                      <div key={txn.id} className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txn.type === 'Payment' ? 'bg-green-100' : 'bg-red-100'}`}>
                            {txn.type === 'Payment' ? 
                              <ArrowDown className={`w-5 h-5 ${txn.type === 'Payment' ? 'text-green-600' : 'text-red-600'}`} /> :
                              <ArrowUp className="w-5 h-5 text-red-600" />
                            }
                          </div>
                          <div>
                            <div className="font-medium">{txn.patientName}</div>
                            <div className="text-xs text-muted-foreground">{txn.method} • {new Date(txn.date).toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold ${txn.type === 'Payment' ? 'text-green-600' : 'text-red-600'}`}>
                            {txn.type === 'Payment' ? '+' : '-'} KES {txn.amount?.toLocaleString()}
                          </div>
                          <Badge variant="outline" className="text-xs mt-1">{txn.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cash Management Tab */}
          <TabsContent value="cash-mgmt" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Cash on Hand</div>
                  <div className="text-3xl font-bold">KES {stats.cashOnHand?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-2">Current float balance</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Today's Collections</div>
                  <div className="text-3xl font-bold text-green-600">KES {stats.totalCollected?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-2">All payment methods</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm text-muted-foreground mb-2">Pending Refunds</div>
                  <div className="text-3xl font-bold text-orange-600">KES {stats.pendingRefunds?.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-2">Awaiting approval</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Shift Reconciliation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Opening Balance</label>
                    <Input type="number" placeholder="0.00" readOnly value="25000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Expected Total</label>
                    <Input type="number" placeholder="0.00" readOnly value="210000" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Actual Count</label>
                    <Input type="number" placeholder="Enter actual amount" />
                  </div>
                  <div>
                    <label className="text-sm font-medium block mb-2">Variance</label>
                    <Input type="number" placeholder="0.00" readOnly value="0" />
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-sm">
                  <div className="font-medium mb-2">Reconciliation Summary</div>
                  <ul className="space-y-1 text-xs">
                    <li>• Opening: KES 25,000</li>
                    <li>• Cash In: KES 185,000</li>
                    <li>• Refunds: KES -5,000</li>
                    <li>• Expected Closing: KES 205,000</li>
                  </ul>
                </div>
                <Button className="w-full">Complete Shift Reconciliation</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* New Bill Modal */}
        {showNewBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowNewBill(false)} />
            <Card className="z-50 w-full max-w-lg relative">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Create New Bill</CardTitle>
                <button
                  onClick={() => setShowNewBill(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent>
                <NewBillForm onCreated={() => setShowNewBill(false)} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

function PaymentForm({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();
  const { toast } = useToast();

  const onSubmitForm = async (data: any) => {
    try {
      onSubmit?.(data);
      reset();
      toast({ title: 'Payment processed successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
      <Input placeholder="Patient ID or Phone" {...register('patientId', { required: true })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input type="number" placeholder="Amount" {...register('amount', { required: true })} />
        <select {...register('method', { required: true })} className="p-2 border rounded-md text-sm">
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="M-Pesa">M-Pesa</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>
      <textarea placeholder="Payment notes..." {...register('notes')} className="w-full p-2 border rounded-md text-sm" rows={2} />
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Process Payment'}
      </Button>
    </form>
  );
}

function NewBillForm({ onCreated }: { onCreated?: () => void }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/billing/visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: data.patientId,
          patientName: data.patientName,
          visitType: data.visitType,
          department: data.department,
          doctorId: data.doctorId,
          notes: data.notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to create bill');

      toast({ title: 'Bill created successfully' });
      reset();
      onCreated?.();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Patient ID *</label>
        <Input
          {...register('patientId', { required: 'Patient ID is required' })}
          placeholder="PAT-001"
          type="text"
        />
        {errors.patientId && <p className="text-sm text-red-600 mt-1">{String(errors.patientId?.message)}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Patient Name *</label>
        <Input
          {...register('patientName', { required: 'Patient name is required' })}
          placeholder="John Doe"
          type="text"
        />
        {errors.patientName && <p className="text-sm text-red-600 mt-1">{String(errors.patientName?.message)}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Visit Type *</label>
        <select
          {...register('visitType', { required: 'Visit type is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="outpatient">Outpatient</option>
          <option value="inpatient">Inpatient</option>
          <option value="emergency">Emergency</option>
          <option value="referral">Referral</option>
          <option value="teleconsult">Telemedicine</option>
        </select>
        {errors.visitType && <p className="text-sm text-red-600 mt-1">{String(errors.visitType?.message)}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Department *</label>
        <Input
          {...register('department', { required: 'Department is required' })}
          placeholder="Cardiology"
          type="text"
        />
        {errors.department && <p className="text-sm text-red-600 mt-1">{String(errors.department?.message)}</p>}
      </div>

      <div className="flex gap-4 pt-2">
        <Button 
          type="button"
          variant="outline" 
          onClick={() => onCreated && onCreated()}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="btn-gradient flex-1" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Bill'}
        </Button>
      </div>
    </form>
  );
}

export default Billing;

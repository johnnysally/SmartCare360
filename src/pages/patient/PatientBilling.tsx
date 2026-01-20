import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PatientLayout from "@/components/PatientLayout";
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { Download, CreditCard, Eye, Clock } from 'lucide-react';

const PatientBilling = () => {
  const { toast } = useToast();
  const [bills, setBills] = useState<any[]>([]);
  const [selectedBill, setSelectedBill] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const patientId = 'pat-001'; // Get from auth context in real app

  useEffect(() => {
    fetchPatientBills();
  }, []);

  const fetchPatientBills = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/billing/patient/${patientId}/bills`);
      const data = await response.json();
      setBills(data || []);
    } catch (error) {
      console.error('Error fetching bills:', error);
      toast({
        title: 'Error',
        description: 'Failed to load bills',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (bill: any) => {
    try {
      const response = await fetch(`/api/billing/bills/${bill.id}/payments`);
      const paymentData = await response.json();
      setPayments(paymentData || []);
      setSelectedBill(bill);
    } catch (error) {
      console.error('Error fetching payment details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payment details',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadInvoice = (bill: any) => {
    toast({
      title: 'Invoice Downloaded',
      description: `Invoice for bill ${bill.id} has been downloaded`,
    });
  };

  const totalBills = bills.length;
  const totalPending = bills.filter((b: any) => b.status === 'pending' || b.status === 'partial').length;
  const totalOutstanding = bills.reduce((sum: number, b: any) => sum + (b.patientPayable || 0), 0);

  return (
    <PatientLayout title="My Bills">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">My Bills</h1>
          <p className="text-gray-500">View and manage your medical bills</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalBills}</p>
              <p className="text-xs text-gray-600">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{totalPending}</p>
              <p className="text-xs text-amber-600">Awaiting payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">KES {totalOutstanding?.toLocaleString()}</p>
              <p className="text-xs text-red-600">Amount due</p>
            </CardContent>
          </Card>
        </div>

        {/* Bills Table */}
        <Card>
          <CardHeader>
            <CardTitle>My Bills</CardTitle>
            <CardDescription>All medical bills and invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList>
                <TabsTrigger value="pending">Pending ({totalPending})</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="all">All ({totalBills})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills
                        .filter((b: any) => b.status === 'pending' || b.status === 'partial')
                        .map((bill: any) => (
                          <tr key={bill.id} className="border-b last:border-0">
                            <td className="py-3 font-medium">INV-{bill.id?.slice(0, 6)}</td>
                            <td className="py-3">KES {bill.total?.toLocaleString()}</td>
                            <td className="py-3">
                              <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                                {bill.status}
                              </span>
                            </td>
                            <td className="py-3 text-sm">
                              {new Date(bill.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3 space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(bill)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="btn-gradient"
                                onClick={() => setShowPaymentModal(true)}
                              >
                                <CreditCard className="w-4 h-4 mr-1" />
                                Pay
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="paid" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Paid Date</th>
                        <th className="pb-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills
                        .filter((b: any) => b.status === 'paid')
                        .map((bill: any) => (
                          <tr key={bill.id} className="border-b last:border-0">
                            <td className="py-3 font-medium">INV-{bill.id?.slice(0, 6)}</td>
                            <td className="py-3">KES {bill.total?.toLocaleString()}</td>
                            <td className="py-3">
                              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                                Paid
                              </span>
                            </td>
                            <td className="py-3 text-sm">
                              {new Date(bill.updated_at).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownloadInvoice(bill)}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left text-sm text-gray-600">
                        <th className="pb-3 font-medium">Invoice</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bills.map((bill: any) => (
                        <tr key={bill.id} className="border-b last:border-0">
                          <td className="py-3 font-medium">INV-{bill.id?.slice(0, 6)}</td>
                          <td className="py-3">KES {bill.total?.toLocaleString()}</td>
                          <td className="py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                bill.status === 'paid'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {bill.status}
                            </span>
                          </td>
                          <td className="py-3 text-sm">
                            {new Date(bill.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(bill)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Bill Details Modal */}
        {selectedBill && (
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice #</p>
                  <p className="font-bold">INV-{selectedBill.id?.slice(0, 6)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-bold">{new Date(selectedBill.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount</p>
                  <p className="font-bold">KES {selectedBill.total?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    selectedBill.status === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedBill.status}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-4">Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>KES {selectedBill.subtotal?.toLocaleString()}</span>
                  </div>
                  {selectedBill.insuranceCoverage > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Insurance Coverage</span>
                      <span>-KES {selectedBill.insuranceCoverage?.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax (16%)</span>
                    <span>KES {selectedBill.tax?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t pt-2">
                    <span>Total</span>
                    <span>KES {selectedBill.total?.toLocaleString()}</span>
                  </div>
                  {selectedBill.patientPayable > 0 && (
                    <div className="flex justify-between font-bold border-t pt-2 text-red-600">
                      <span>Patient Payable</span>
                      <span>KES {selectedBill.patientPayable?.toLocaleString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {payments.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Payment History</h3>
                  <div className="space-y-2">
                    {payments.map((payment: any) => (
                      <div key={payment.id} className="flex justify-between text-sm">
                        <span>
                          {new Date(payment.created_at).toLocaleDateString()} - {payment.paymentMethod}
                        </span>
                        <span className="text-green-600">+KES {payment.amount?.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedBill(null)}>
                  Close
                </Button>
                <Button
                  className="btn-gradient"
                  onClick={() => handleDownloadInvoice(selectedBill)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedBill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/60" onClick={() => setShowPaymentModal(false)} />
            <Card className="z-60 w-full max-w-lg">
              <CardHeader>
                <CardTitle>Make Payment</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentForm
                  billId={selectedBill.id}
                  amount={selectedBill.patientPayable}
                  onSuccess={() => {
                    setShowPaymentModal(false);
                    fetchPatientBills();
                  }}
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PatientLayout>
  );
};

function PaymentForm({ billId, amount, onSuccess }: any) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch('/api/billing/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billId,
          amount: Number(data.amount),
          paymentMethod: data.paymentMethod,
          reference: data.reference,
          notes: data.notes,
        }),
      });

      if (!response.ok) throw new Error('Payment failed');

      toast({ title: 'Payment Recorded', description: 'Your payment has been processed successfully' });
      reset();
      onSuccess?.();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Amount Due</label>
        <p className="text-3xl font-bold text-amber-600 mt-2">KES {amount?.toLocaleString()}</p>
      </div>

      <div>
        <label className="text-sm font-medium">Payment Amount *</label>
        <Input
          {...register('amount', { 
            required: 'Amount is required',
            validate: (value) => Number(value) <= amount || 'Cannot exceed bill amount'
          })}
          type="number"
          placeholder="0.00"
          step="0.01"
          defaultValue={amount}
        />
        {errors.amount && <p className="text-sm text-red-600 mt-1">{String(errors.amount?.message)}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Payment Method *</label>
        <select
          {...register('paymentMethod', { required: 'Payment method is required' })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          <option value="">Select Method</option>
          <option value="cash">Cash</option>
          <option value="mobile_money">M-Pesa/Mobile Money</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="card">Card</option>
          <option value="insurance">Insurance</option>
          <option value="government_scheme">Government Scheme</option>
        </select>
        {errors.paymentMethod && <p className="text-sm text-red-600 mt-1">{String(errors.paymentMethod?.message)}</p>}
      </div>

      <div>
        <label className="text-sm font-medium">Reference Number</label>
        <Input
          {...register('reference')}
          placeholder="e.g., MPESA transaction ID"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Input
          {...register('notes')}
          placeholder="Payment notes (optional)"
        />
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={() => onSuccess?.()}>Cancel</Button>
        <Button type="submit" className="btn-gradient flex-1" disabled={isSubmitting}>
          {isSubmitting ? 'Processing...' : 'Record Payment'}
        </Button>
      </div>
    </form>
  );
}

export default PatientBilling;

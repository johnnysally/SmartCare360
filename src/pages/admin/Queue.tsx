import AdminLayout from "@/components/AdminLayout";
import QueueManagement from "@/components/QueueManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { getQueueStats } from "@/lib/api";

const AdminQueuePage = () => {
  const [stats, setStats] = useState({ waiting: 0, serving: 0, completed: 0, skipped: 0, total: 0, avg_wait_minutes: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getQueueStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats', err);
      }
    };
    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <AdminLayout title="Queue Analytics">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Queue Analytics & Management</h1>
            <p className="text-muted-foreground mt-1">
              System-wide queue monitoring and analytics
            </p>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Patients Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All patients seen today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Served
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Appointments completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Skipped</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stats.skipped}</div>
              <p className="text-xs text-muted-foreground mt-1">Patients skipped</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Avg Wait Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">~{stats.avg_wait_minutes}m</div>
              <p className="text-xs text-muted-foreground mt-1">Average queue wait</p>
            </CardContent>
          </Card>
        </div>

        {/* Queue Management */}
        <Tabs defaultValue="management" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="management">Queue Management</TabsTrigger>
            <TabsTrigger value="overview">Queue Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-4">
            <QueueManagement showActions={true} maxItems={15} />
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Queue Performance Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-sm font-medium text-yellow-900">Waiting</div>
                    <div className="text-2xl font-bold text-yellow-700 mt-2">{stats.waiting}</div>
                    <div className="text-xs text-yellow-600 mt-1">{Math.round((stats.waiting / Math.max(stats.total, 1)) * 100)}% of total</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-purple-900">Currently Serving</div>
                    <div className="text-2xl font-bold text-purple-700 mt-2">{stats.serving}</div>
                    <div className="text-xs text-purple-600 mt-1">Active consultations</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-900">Completed</div>
                    <div className="text-2xl font-bold text-green-700 mt-2">{stats.completed}</div>
                    <div className="text-xs text-green-600 mt-1">{Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}% throughput</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-sm font-medium text-red-900">Skipped/No-Show</div>
                    <div className="text-2xl font-bold text-red-700 mt-2">{stats.skipped}</div>
                    <div className="text-xs text-red-600 mt-1">{Math.round((stats.skipped / Math.max(stats.total, 1)) * 100)}% no-show rate</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3">Queue Efficiency Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800">Average Wait Time</span>
                      <span className="font-semibold text-blue-900">~{stats.avg_wait_minutes} minutes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800">Patients Per Hour</span>
                      <span className="font-semibold text-blue-900">{stats.total > 0 ? Math.round((stats.completed / 8) * 60) : 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-800">Queue Status</span>
                      <span className={`font-semibold px-2 py-1 rounded text-xs ${stats.waiting <= 5 ? 'bg-green-100 text-green-800' : stats.waiting <= 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {stats.waiting <= 5 ? '✓ Good' : stats.waiting <= 10 ? '⚠ Moderate' : '✗ High'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminQueuePage;

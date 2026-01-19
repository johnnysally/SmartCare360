import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Users, AlertTriangle, Clock, Activity } from 'lucide-react';
import { getQueueAnalytics, getAllQueues, getQueueStats } from '@/lib/api';

const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];

const QueueAnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [allQueues, setAllQueues] = useState<any>({});
  const [overallStats, setOverallStats] = useState({ waiting: 0, serving: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [analyticsData, queuesData, statsData] = await Promise.all([
        getQueueAnalytics(),
        getAllQueues(),
        getQueueStats()
      ]);

      setAnalytics(analyticsData || []);
      setAllQueues(queuesData || {});
      setOverallStats(statsData || { waiting: 0, serving: 0, completed: 0 });
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalQueueStats = () => {
    let totalWaiting = 0;
    let totalServing = 0;

    DEPARTMENTS.forEach(dept => {
      const queue = allQueues[dept] || [];
      totalWaiting += queue.filter((p: any) => p.status === 'waiting').length;
      totalServing += queue.filter((p: any) => p.status === 'serving').length;
    });

    return { waiting: totalWaiting, serving: totalServing };
  };

  const getDepartmentMetrics = (dept: string) => {
    const deptData = analytics.find((a: any) => a.department === dept);
    const queue = allQueues[dept] || [];
    const waiting = queue.filter((p: any) => p.status === 'waiting').length;

    return {
      avgWait: deptData?.avg_wait_time_seconds ? Math.round(deptData.avg_wait_time_seconds / 60) : 0,
      maxWait: deptData?.max_wait_time_seconds ? Math.round(deptData.max_wait_time_seconds / 60) : 0,
      patientsToday: deptData?.total_patients || 0,
      waiting,
      congestion: deptData?.congestion_level || 'LOW'
    };
  };

  const getCongestionColor = (level: string) => {
    switch (level) {
      case 'LOW': return 'bg-green-100 text-green-800 border-green-300';
      case 'MODERATE': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'HIGH': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Queue Analytics">
        <div className="text-center py-12">Loading analytics...</div>
      </AdminLayout>
    );
  }

  const { waiting: totalWaiting, serving: totalServing } = getTotalQueueStats();

  return (
    <AdminLayout title="Queue Analytics & Performance">
      <div className="space-y-6 animate-fade-in">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Waiting</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{totalWaiting}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Being Served</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">{totalServing}</p>
                </div>
                <Activity className="w-8 h-8 text-green-600 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">{overallStats.completed}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600 opacity-20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Department Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEPARTMENTS.map(dept => {
                const metrics = getDepartmentMetrics(dept);
                
                return (
                  <Card key={dept} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center justify-between">
                        {dept}
                        <span className={`text-xs px-2 py-1 rounded border ${getCongestionColor(metrics.congestion)}`}>
                          {metrics.congestion}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Waiting</span>
                        <span className="font-semibold text-blue-600">{metrics.waiting}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Avg Wait Time</span>
                        <span className="font-semibold">{metrics.avgWait}m</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Wait Time</span>
                        <span className="font-semibold">{metrics.maxWait}m</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Served Today</span>
                        <span className="font-semibold text-green-600">{metrics.patientsToday}</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 px-2">Department</th>
                        <th className="text-center py-2 px-2">Waiting</th>
                        <th className="text-center py-2 px-2">Serving</th>
                        <th className="text-center py-2 px-2">Avg Wait</th>
                        <th className="text-center py-2 px-2">Max Wait</th>
                        <th className="text-center py-2 px-2">Total Today</th>
                        <th className="text-center py-2 px-2">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DEPARTMENTS.map(dept => {
                        const metrics = getDepartmentMetrics(dept);
                        const queue = allQueues[dept] || [];
                        const serving = queue.filter((p: any) => p.status === 'serving').length;

                        return (
                          <tr key={dept} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-2 font-semibold">{dept}</td>
                            <td className="text-center py-2 px-2 text-blue-600 font-semibold">{metrics.waiting}</td>
                            <td className="text-center py-2 px-2 text-green-600 font-semibold">{serving}</td>
                            <td className="text-center py-2 px-2">{metrics.avgWait}m</td>
                            <td className="text-center py-2 px-2">{metrics.maxWait}m</td>
                            <td className="text-center py-2 px-2">{metrics.patientsToday}</td>
                            <td className="text-center py-2 px-2">
                              <span className={`text-xs px-2 py-1 rounded-full border ${getCongestionColor(metrics.congestion)}`}>
                                {metrics.congestion}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Key Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Key Insights & Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {DEPARTMENTS.map(dept => {
                  const metrics = getDepartmentMetrics(dept);
                  const alerts = [];

                  if (metrics.waiting > 10) {
                    alerts.push(`High queue congestion - ${metrics.waiting} patients waiting`);
                  }
                  if (metrics.avgWait > 30) {
                    alerts.push(`High average wait time - ${metrics.avgWait} minutes`);
                  }
                  if (metrics.congestion === 'HIGH') {
                    alerts.push('Department needs immediate attention');
                  }

                  if (alerts.length === 0) return null;

                  return (
                    <div key={dept} className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <p className="font-semibold text-orange-900 text-sm">{dept}</p>
                      <ul className="list-disc list-inside text-xs text-orange-800 mt-1">
                        {alerts.map((alert, idx) => (
                          <li key={idx}>{alert}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }).filter(Boolean)}

                {DEPARTMENTS.map(dept => {
                  const metrics = getDepartmentMetrics(dept);
                  return metrics.congestion === 'HIGH' || metrics.waiting > 10;
                }).every(x => !x) && (
                  <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                    <p className="text-green-800 text-sm">✓ All departments operating normally</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default QueueAnalyticsDashboard;

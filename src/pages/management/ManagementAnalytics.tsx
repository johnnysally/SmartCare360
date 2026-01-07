import ManagementLayout from "@/components/ManagementLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon, TrendingUp, Users, Activity } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, Area, AreaChart } from "recharts";

const revenueData = [
  { department: "Outpatient", revenue: 1850000, color: "hsl(174, 72%, 40%)" },
  { department: "Laboratory", revenue: 980000, color: "hsl(199, 89%, 48%)" },
  { department: "Pharmacy", revenue: 1200000, color: "hsl(142, 71%, 45%)" },
  { department: "Radiology", revenue: 450000, color: "hsl(262, 52%, 55%)" },
  { department: "Emergency", revenue: 680000, color: "hsl(24, 95%, 53%)" },
];

const demographicsData = [
  { name: "0-17", value: 18, color: "hsl(174, 72%, 40%)" },
  { name: "18-35", value: 32, color: "hsl(199, 89%, 48%)" },
  { name: "36-50", value: 28, color: "hsl(142, 71%, 45%)" },
  { name: "51-65", value: 15, color: "hsl(262, 52%, 55%)" },
  { name: "65+", value: 7, color: "hsl(24, 95%, 53%)" },
];

const trendData = [
  { month: "Jul", patients: 2100, revenue: 3.2 },
  { month: "Aug", patients: 2350, revenue: 3.5 },
  { month: "Sep", patients: 2500, revenue: 3.8 },
  { month: "Oct", patients: 2800, revenue: 4.0 },
  { month: "Nov", patients: 3000, revenue: 4.2 },
  { month: "Dec", patients: 3245, revenue: 4.5 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(174, 72%, 40%)" },
  patients: { label: "Patients", color: "hsl(199, 89%, 48%)" },
};

const ManagementAnalytics = () => (
  <ManagementLayout title="Analytics">
    <div className="space-y-6 animate-fade-in">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Monthly Visits", value: "3,245", icon: Users, change: "+12%" },
          { label: "Avg Revenue/Patient", value: "KES 4,500", icon: TrendingUp, change: "+8%" },
          { label: "Capacity Utilization", value: "78%", icon: Activity, change: "+5%" },
          { label: "Patient Satisfaction", value: "4.6/5", icon: PieChartIcon, change: "+0.2" },
        ].map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-muted flex items-center justify-center">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <span className="text-sm font-medium text-success">{stat.change}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue by Department - Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Activity className="w-5 h-5 text-primary" />
              Revenue by Department
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="department" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                    {revenueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Patient Demographics - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <PieChartIcon className="w-5 h-5 text-primary" />
              Patient Demographics (Age Groups)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                    labelLine={false}
                  >
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Trend Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="w-5 h-5 text-primary" />
            Patient & Revenue Trends (6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-64 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(174, 72%, 40%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}M`} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="patients" stroke="hsl(199, 89%, 48%)" fillOpacity={1} fill="url(#colorPatients)" />
                <Area yAxisId="right" type="monotone" dataKey="revenue" stroke="hsl(174, 72%, 40%)" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  </ManagementLayout>
);

export default ManagementAnalytics;

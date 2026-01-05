import ReferralLayout from "@/components/ReferralLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Share2, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Clock,
  CheckCircle2,
  Users,
  Building,
  Plus
} from "lucide-react";

const stats = [
  { label: "Outgoing Referrals", value: "18", icon: ArrowUpRight, change: "This month", color: "text-info" },
  { label: "Incoming Referrals", value: "12", icon: ArrowDownLeft, change: "This month", color: "text-success" },
  { label: "Pending Response", value: "5", icon: Clock, change: "Awaiting", color: "text-warning" },
  { label: "Completed", value: "25", icon: CheckCircle2, change: "Last 30 days", color: "text-primary" },
];

const recentReferrals = [
  { id: "REF-001", patient: "John Omondi", from: "SmartCare Clinic", to: "Nairobi Hospital", specialty: "Cardiology", status: "Pending", date: "Jan 2, 2026" },
  { id: "REF-002", patient: "Mary Wanjiku", from: "SmartCare Clinic", to: "KNH", specialty: "Oncology", status: "Accepted", date: "Jan 1, 2026" },
  { id: "REF-003", patient: "Peter Kamau", from: "Aga Khan", to: "SmartCare Clinic", specialty: "Follow-up Care", status: "Completed", date: "Dec 30, 2025" },
  { id: "REF-004", patient: "Grace Akinyi", from: "SmartCare Clinic", to: "Kenyatta Hospital", specialty: "Neurology", status: "In Transit", date: "Dec 28, 2025" },
];

const partnerFacilities = [
  { name: "Nairobi Hospital", type: "Tertiary", referrals: 45, rating: 4.8 },
  { name: "Aga Khan University Hospital", type: "Tertiary", referrals: 32, rating: 4.9 },
  { name: "Kenyatta National Hospital", type: "Public Tertiary", referrals: 28, rating: 4.2 },
];

const ReferralDashboard = () => (
  <ReferralLayout title="Referral Dashboard">
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-muted-foreground">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold font-display">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Referrals */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-info" />
              Recent Referrals
            </CardTitle>
            <Button size="sm" className="btn-gradient">
              <Plus className="w-4 h-4 mr-2" />
              New Referral
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentReferrals.map((ref) => (
              <div key={ref.id} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <div className="font-medium">{ref.patient}</div>
                    <div className="text-sm text-muted-foreground">{ref.from} → {ref.to}</div>
                    <div className="text-xs text-muted-foreground mt-1">{ref.specialty} • {ref.date}</div>
                  </div>
                </div>
                <Badge 
                  variant={ref.status === "Completed" ? "default" : ref.status === "Accepted" ? "default" : "secondary"}
                  className={ref.status === "Completed" ? "bg-success" : ref.status === "Accepted" ? "bg-info" : ""}
                >
                  {ref.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Partner Facilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-info" />
              Top Partners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {partnerFacilities.map((facility, i) => (
              <div key={i} className="p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{facility.name}</div>
                  <Badge variant="outline">{facility.type}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{facility.referrals} referrals</span>
                  <span>★ {facility.rating}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </ReferralLayout>
);

export default ReferralDashboard;

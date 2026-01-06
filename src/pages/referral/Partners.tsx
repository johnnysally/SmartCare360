import ReferralLayout from "@/components/ReferralLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Plus, MapPin, Phone, CheckCircle2 } from "lucide-react";

const partners = [
  { name: "Kenyatta National Hospital", type: "Public Hospital", location: "Nairobi", referrals: 156, status: "Active" },
  { name: "Nairobi Hospital", type: "Private Hospital", location: "Nairobi", referrals: 89, status: "Active" },
  { name: "Aga Khan University Hospital", type: "Private Hospital", location: "Nairobi", referrals: 67, status: "Active" },
  { name: "Gertrude's Children's Hospital", type: "Specialty Hospital", location: "Nairobi", referrals: 45, status: "Active" },
  { name: "Karen Hospital", type: "Private Hospital", location: "Karen", referrals: 34, status: "Active" },
];

const Partners = () => (
  <ReferralLayout title="Partners">
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-medium">Partner Facilities</h2>
          <p className="text-sm text-muted-foreground">Manage referral partnerships with other healthcare facilities</p>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      {/* Partners List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5 text-primary" />
            All Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.map((partner, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Building className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">{partner.name}</div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{partner.type}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {partner.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{partner.referrals}</div>
                    <div className="text-xs text-muted-foreground">Total Referrals</div>
                  </div>
                  <Badge className="bg-success">{partner.status}</Badge>
                  <Button size="sm" variant="outline">
                    <Phone className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </ReferralLayout>
);

export default Partners;

import ReferralLayout from "@/components/ReferralLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Star, Phone, Mail, MapPin } from "lucide-react";

const specialists = [
  { name: "Dr. James Kariuki", specialty: "Cardiology", hospital: "Kenyatta Hospital", rating: 4.9, referrals: 45, available: true },
  { name: "Dr. Susan Odhiambo", specialty: "Oncology", hospital: "Nairobi Hospital", rating: 4.8, referrals: 32, available: true },
  { name: "Dr. Michael Wafula", specialty: "Neurology", hospital: "Aga Khan", rating: 4.7, referrals: 28, available: false },
  { name: "Dr. Alice Muthoni", specialty: "Orthopedics", hospital: "Karen Hospital", rating: 4.9, referrals: 52, available: true },
  { name: "Dr. Peter Njoroge", specialty: "Pediatrics", hospital: "Gertrude's", rating: 4.8, referrals: 38, available: true },
];

const Specialists = () => (
  <ReferralLayout title="Specialists">
    <div className="space-y-6 animate-fade-in">
      {/* Specialists Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialists.map((doc, i) => (
          <Card key={i} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <Badge variant={doc.available ? "default" : "secondary"} className={doc.available ? "bg-success" : ""}>
                  {doc.available ? "Available" : "Busy"}
                </Badge>
              </div>
              <div className="font-medium text-lg">{doc.name}</div>
              <div className="text-sm text-muted-foreground mb-2">{doc.specialty}</div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                <MapPin className="w-4 h-4" />
                {doc.hospital}
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-warning fill-warning" />
                  <span className="font-medium">{doc.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">{doc.referrals} referrals</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 btn-gradient">Refer Patient</Button>
                <Button size="sm" variant="outline">
                  <Phone className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </ReferralLayout>
);

export default Specialists;

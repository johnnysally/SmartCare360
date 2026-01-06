import PatientLayout from "@/components/PatientLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Calendar, Shield, Save } from "lucide-react";

const PatientProfile = () => (
  <PatientLayout title="My Profile">
    <div className="space-y-6 animate-fade-in max-w-3xl">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <User className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display">Mary Wanjiku</h2>
              <p className="text-muted-foreground">Patient ID: PAT-2024-001234</p>
              <p className="text-sm text-muted-foreground mt-1">Member since January 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input defaultValue="Mary" />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input defaultValue="Wanjiku" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" defaultValue="mary.wanjiku@email.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input defaultValue="+254 712 345 678" />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <Input type="date" defaultValue="1985-06-15" />
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Input defaultValue="Female" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label>Street Address</Label>
              <Input defaultValue="123 Kilimani Road" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input defaultValue="Nairobi" />
            </div>
            <div className="space-y-2">
              <Label>County</Label>
              <Input defaultValue="Nairobi" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Emergency Contact
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact Name</Label>
              <Input defaultValue="John Wanjiku" />
            </div>
            <div className="space-y-2">
              <Label>Relationship</Label>
              <Input defaultValue="Spouse" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input defaultValue="+254 722 987 654" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Button className="btn-gradient" size="lg">
        <Save className="w-4 h-4 mr-2" />
        Save Changes
      </Button>
    </div>
  </PatientLayout>
);

export default PatientProfile;

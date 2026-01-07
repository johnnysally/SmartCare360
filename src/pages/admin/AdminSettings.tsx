import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Building, 
  Shield, 
  Bell, 
  Database,
  Mail,
  Globe,
  Clock,
  Save,
  RefreshCw,
  Key,
  Users,
  FileText,
  Palette
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    clinicName: "SmartCare360 Medical Center",
    email: "admin@smartcare360.co.ke",
    phone: "+254 700 000 000",
    address: "Nairobi, Kenya",
    timezone: "Africa/Nairobi",
    currency: "KES",
    language: "en",
    twoFactorAuth: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    emailNotifications: true,
    smsNotifications: true,
    systemAlerts: true,
    autoBackup: true,
    backupFrequency: "daily",
    maintenanceMode: false,
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your system settings have been updated successfully.",
    });
  };

  return (
    <AdminLayout title="System Settings">
      <div className="space-y-6 animate-fade-in">
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 h-auto p-1">
            <TabsTrigger value="general" className="text-xs sm:text-sm">General</TabsTrigger>
            <TabsTrigger value="security" className="text-xs sm:text-sm">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifications</TabsTrigger>
            <TabsTrigger value="backup" className="text-xs sm:text-sm">Backup</TabsTrigger>
            <TabsTrigger value="integrations" className="text-xs sm:text-sm">Integrations</TabsTrigger>
            <TabsTrigger value="appearance" className="text-xs sm:text-sm">Appearance</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Building className="w-5 h-5" />
                  Clinic Information
                </CardTitle>
                <CardDescription>Configure your healthcare facility details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clinicName">Clinic Name</Label>
                    <Input id="clinicName" value={settings.clinicName} onChange={(e) => setSettings({...settings, clinicName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Contact Email</Label>
                    <Input id="email" type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} />
                  </div>
                </div>
                <Separator />
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Timezone
                    </Label>
                    <Input id="timezone" value={settings.timezone} onChange={(e) => setSettings({...settings, timezone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Input id="currency" value={settings.currency} onChange={(e) => setSettings({...settings, currency: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language" className="flex items-center gap-2">
                      <Globe className="w-4 h-4" /> Language
                    </Label>
                    <Input id="language" value={settings.language} onChange={(e) => setSettings({...settings, language: e.target.value})} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure authentication and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium flex items-center gap-2">
                      <Key className="w-4 h-4" /> Two-Factor Authentication
                    </div>
                    <p className="text-sm text-muted-foreground">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch checked={settings.twoFactorAuth} onCheckedChange={(v) => setSettings({...settings, twoFactorAuth: v})} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Session Timeout (minutes)</Label>
                    <Input type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Password Expiry (days)</Label>
                    <Input type="number" value={settings.passwordExpiry} onChange={(e) => setSettings({...settings, passwordExpiry: parseInt(e.target.value)})} />
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <h4 className="font-medium flex items-center gap-2">
                    <Users className="w-4 h-4" /> Access Control
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Button variant="outline" className="justify-start">
                      <FileText className="w-4 h-4 mr-2" />
                      View Audit Logs
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Roles & Permissions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Bell className="w-5 h-5" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Configure system notification settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "emailNotifications", icon: Mail, label: "Email Notifications", desc: "Receive important updates via email" },
                  { key: "smsNotifications", icon: Bell, label: "SMS Notifications", desc: "Get critical alerts via SMS" },
                  { key: "systemAlerts", icon: Shield, label: "System Alerts", desc: "Security and system health notifications" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="space-y-1">
                      <div className="font-medium flex items-center gap-2">
                        <item.icon className="w-4 h-4" /> {item.label}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch checked={settings[item.key as keyof typeof settings] as boolean} onCheckedChange={(v) => setSettings({...settings, [item.key]: v})} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Backup Settings */}
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Database className="w-5 h-5" />
                  Backup & Recovery
                </CardTitle>
                <CardDescription>Configure automated backup settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="space-y-1">
                    <div className="font-medium">Automatic Backups</div>
                    <p className="text-sm text-muted-foreground">Enable scheduled automatic backups</p>
                  </div>
                  <Switch checked={settings.autoBackup} onCheckedChange={(v) => setSettings({...settings, autoBackup: v})} />
                </div>
                <div className="space-y-2">
                  <Label>Backup Frequency</Label>
                  <div className="flex flex-wrap gap-2">
                    {["hourly", "daily", "weekly"].map((freq) => (
                      <Button key={freq} variant={settings.backupFrequency === freq ? "default" : "outline"} size="sm" onClick={() => setSettings({...settings, backupFrequency: freq})}>
                        {freq.charAt(0).toUpperCase() + freq.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex flex-wrap gap-3">
                  <Button className="btn-gradient">
                    <Database className="w-4 h-4 mr-2" />
                    Backup Now
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="text-sm font-medium mb-2">Last Backup</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="bg-success/10 text-success">Successful</Badge>
                    <span>Jan 7, 2026 at 02:00 AM • 2.4 GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="w-5 h-5" />
                  System Integrations
                </CardTitle>
                <CardDescription>Configure third-party service connections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "M-Pesa", status: "connected", desc: "Mobile payment processing" },
                  { name: "NHIF Portal", status: "connected", desc: "Insurance claims integration" },
                  { name: "SMS Gateway", status: "connected", desc: "Patient notifications" },
                  { name: "Email Service", status: "connected", desc: "SMTP email delivery" },
                ].map((integration, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">{integration.name}</div>
                      <p className="text-sm text-muted-foreground">{integration.desc}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-success/10 text-success capitalize">{integration.status}</Badge>
                      <Button variant="ghost" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Palette className="w-5 h-5" />
                  Appearance Settings
                </CardTitle>
                <CardDescription>Customize the look and feel of the system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1">Light</Button>
                    <Button variant="outline" className="flex-1">Dark</Button>
                    <Button variant="default" className="flex-1">System</Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border border-warning/30 bg-warning/5">
                  <div className="space-y-1">
                    <div className="font-medium text-warning">Maintenance Mode</div>
                    <p className="text-sm text-muted-foreground">Enable to show maintenance page to users</p>
                  </div>
                  <Switch checked={settings.maintenanceMode} onCheckedChange={(v) => setSettings({...settings, maintenanceMode: v})} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={handleSave} className="btn-gradient">
            <Save className="w-4 h-4 mr-2" />
            Save All Settings
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;

import TelemedicineLayout from "@/components/TelemedicineLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Phone, Calendar, Clock, Plus, User, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAppointments } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const TelemedicineDashboard = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const appts = await getAppointments();
        // Treat appointments with type containing 'tele' or 'video' as telemedicine
        const tele = (appts || []).filter((a: any) => 
          (a.type || '').toLowerCase().includes('tele') || 
          (a.type || '').toLowerCase().includes('video')
        );
        if (mounted) setSessions(tele);
      } catch (err: any) {
        toast({ title: 'Failed to load telemedicine sessions', description: err?.message || '' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const upcomingSessions = sessions.filter((s: any) => s.status !== 'completed');
  const completedSessions = sessions.filter((s: any) => s.status === 'completed');
  const totalRating = sessions.length > 0 ? (sessions.reduce((sum: number, s: any) => sum + (s.rating || 0), 0) / sessions.length).toFixed(1) : '0';

  return (
    <TelemedicineLayout title="Telemedicine Center">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Telemedicine Center</h1>
            <p className="text-gray-500">Manage virtual consultations & appointments</p>
          </div>
          <Button className="btn-gradient" onClick={() => navigate('/telemedicine/schedule')}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{upcomingSessions.length}</p>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{completedSessions.filter((s: any) => new Date(s.date).toDateString() === new Date().toDateString()).length}</p>
                <Video className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{sessions.length}</p>
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Avg Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold">{totalRating}★</p>
                <MessageSquare className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Sessions ({upcomingSessions.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedSessions.length})</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading sessions...</div>
                ) : upcomingSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No upcoming sessions
                    <Button className="mt-4 btn-gradient" onClick={() => navigate('/telemedicine/schedule')}>
                      Schedule One
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingSessions.map((session: any) => (
                      <div key={session.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{session.patientName || 'Patient'}</h3>
                            <p className="text-sm text-gray-600">Type: {session.type}</p>
                            <div className="flex gap-2 mt-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{session.time || 'TBD'}</span>
                            </div>
                          </div>
                          <Button size="sm" className="btn-gradient">
                            <Video className="w-4 h-4 mr-2" />
                            Join Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Completed Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">Loading sessions...</div>
                ) : completedSessions.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No completed sessions</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-sm text-gray-600">
                          <th className="pb-3 font-medium">Patient</th>
                          <th className="pb-3 font-medium">Date</th>
                          <th className="pb-3 font-medium">Duration</th>
                          <th className="pb-3 font-medium">Rating</th>
                          <th className="pb-3 font-medium">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {completedSessions.map((session: any) => (
                          <tr key={session.id} className="border-b last:border-0">
                            <td className="py-3">{session.patientName || 'Patient'}</td>
                            <td className="py-3 text-sm">{session.date || 'N/A'}</td>
                            <td className="py-3 text-sm">{session.duration || '-'}</td>
                            <td className="py-3 text-sm">{session.rating || '-'}★</td>
                            <td className="py-3">
                              <Button variant="outline" size="sm">View Notes</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultants" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Available Consultants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { name: 'Dr. Sarah Smith', specialty: 'General Medicine', available: true },
                    { name: 'Dr. James Brown', specialty: 'Cardiology', available: true },
                    { name: 'Dr. Emily Wilson', specialty: 'Pediatrics', available: false },
                  ].map((doc, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{doc.name}</h3>
                            <p className="text-sm text-gray-600">{doc.specialty}</p>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${doc.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {doc.available ? 'Available' : 'Busy'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Telemedicine Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Video Quality</label>
                    <select className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md">
                      <option>HD (1080p)</option>
                      <option>Standard (720p)</option>
                      <option>Low (480p)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Session Timeout (minutes)</label>
                    <input type="number" defaultValue="30" className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <Button className="btn-gradient">Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TelemedicineLayout>
  );
};

export default TelemedicineDashboard;

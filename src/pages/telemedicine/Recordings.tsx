import TelemedicineLayout from "@/components/TelemedicineLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Play, Download, Trash2, Archive, Share2, Calendar, Clock, User } from "lucide-react";
import { useState } from "react";

interface Recording {
  id: string;
  consultant: string;
  date: string;
  duration: string;
  size: string;
  status: 'available' | 'processing' | 'archived';
}

const TelemedicineRecordings = () => {
  const { toast } = useToast();
  const [recordings] = useState<Recording[]>([
    {
      id: '1',
      consultant: 'Dr. Sarah Johnson',
      date: '2024-01-15',
      duration: '25:30',
      size: '125 MB',
      status: 'available'
    },
    {
      id: '2',
      consultant: 'Dr. Mike Chen',
      date: '2024-01-10',
      duration: '35:45',
      size: '178 MB',
      status: 'available'
    },
    {
      id: '3',
      consultant: 'Dr. Emily Davis',
      date: '2024-01-05',
      duration: '15:20',
      size: '92 MB',
      status: 'archived'
    },
    {
      id: '4',
      consultant: 'Dr. James Wilson',
      date: '2024-01-01',
      duration: '42:15',
      size: '210 MB',
      status: 'available'
    }
  ]);

  const handlePlay = (id: string) => {
    toast({ title: 'Playing recording', description: 'Opening video player' });
  };

  const handleDownload = (id: string) => {
    toast({ title: 'Downloading', description: 'Recording download started' });
  };

  const handleDelete = (id: string) => {
    toast({ title: 'Deleted', description: 'Recording has been removed' });
  };

  const handleArchive = (id: string) => {
    toast({ title: 'Archived', description: 'Recording moved to archive' });
  };

  const handleShare = (id: string) => {
    toast({ title: 'Share link copied', description: 'Link ready to share' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <TelemedicineLayout title="Session Recordings">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Recording Library</h1>
          <p className="text-gray-500">Access your past consultation recordings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Total Recordings</p>
              <p className="text-3xl font-bold">24</p>
              <p className="text-xs text-gray-500 mt-1">4 this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Total Duration</p>
              <p className="text-3xl font-bold">18h</p>
              <p className="text-xs text-gray-500 mt-1">1,080 minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Storage Used</p>
              <p className="text-3xl font-bold">3.2GB</p>
              <p className="text-xs text-gray-500 mt-1">of 50GB available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600">Last Recording</p>
              <p className="text-3xl font-bold">Jan 15</p>
              <p className="text-xs text-gray-500 mt-1">Dr. Johnson</p>
            </CardContent>
          </Card>
        </div>

        {/* Recordings List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recordings.map((recording) => (
                <div key={recording.id} className="border rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white">
                          <span className="text-lg">📹</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{recording.consultant}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {recording.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {recording.duration}
                            </div>
                            <span>{recording.size}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusColor(recording.status)}`}>
                          {recording.status.charAt(0).toUpperCase() + recording.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlay(recording.id)}
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(recording.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(recording.id)}
                        className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleArchive(recording.id)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(recording.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Storage Information */}
        <Card>
          <CardHeader>
            <CardTitle>Storage Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Storage Used</span>
                  <span className="text-sm font-medium">3.2GB / 50GB (6.4%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '6.4%' }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Recordings are stored securely and accessible for 2 years. Archive older recordings to free up space.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </TelemedicineLayout>
  );
};

export default TelemedicineRecordings;

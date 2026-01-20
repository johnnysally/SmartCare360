import TelemedicineLayout from "@/components/TelemedicineLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Video, VideoOff, Phone, Share2, MessageSquare, Settings } from "lucide-react";
import { useState } from "react";

const ActiveSession = () => {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const handleEndCall = () => {
    toast({ title: 'Session ended', description: 'Thank you for using our service' });
  };

  const handleScreenShare = () => {
    toast({ title: 'Screen sharing enabled' });
  };

  const handleSettings = () => {
    toast({ title: 'Settings', description: 'Adjust audio/video quality' });
  };

  return (
    <TelemedicineLayout title="Active Consultation">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Live Consultation</h1>
          <p className="text-gray-500">Session with Dr. Sarah Johnson</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video Area */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {/* Main Video */}
                <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center relative">
                  {isVideoOff ? (
                    <div className="text-white text-center">
                      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">👨‍⚕️</span>
                      </div>
                      <p className="text-lg font-semibold">Dr. Sarah Johnson</p>
                      <p className="text-gray-400 text-sm">Camera off</p>
                    </div>
                  ) : (
                    <div className="text-white text-center">
                      <p>Video Stream</p>
                    </div>
                  )}

                  {/* Small Video (Self) */}
                  <div className="absolute bottom-4 right-4 bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden w-32 h-24 flex items-center justify-center">
                    {isVideoOff ? (
                      <div className="text-white text-center">
                        <span className="text-2xl">👤</span>
                        <p className="text-xs">You</p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-xs">Your Video</p>
                    )}
                  </div>

                  {/* Session Info Overlay */}
                  <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg text-sm">
                    <p className="font-semibold">Consultation</p>
                    <p className="text-xs text-gray-300">Started 5 minutes ago</p>
                  </div>
                </div>

                {/* Control Bar */}
                <div className="bg-gray-50 p-6 border-t">
                  <div className="flex justify-center gap-4">
                    <Button
                      variant={isMuted ? "destructive" : "outline"}
                      size="lg"
                      onClick={() => setIsMuted(!isMuted)}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </Button>

                    <Button
                      variant={isVideoOff ? "destructive" : "outline"}
                      size="lg"
                      onClick={() => setIsVideoOff(!isVideoOff)}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleScreenShare}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <Share2 className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowChat(!showChat)}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleSettings}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <Settings className="w-5 h-5" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={handleEndCall}
                      className="rounded-full w-12 h-12 p-0"
                    >
                      <Phone className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Consultant</p>
                  <p className="font-semibold">Dr. Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Cardiology Specialist</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Time Elapsed</p>
                  <p className="font-semibold">5:32</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Connection Quality</p>
                  <div className="mt-2 bg-green-100 text-green-800 px-3 py-1 rounded text-sm font-semibold">
                    Excellent
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Your Status</p>
                  <div className="mt-2 flex items-center gap-2">
                    {isMuted && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Muted</span>}
                    {isVideoOff && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Camera off</span>}
                    {!isMuted && !isVideoOff && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {showChat && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4 h-48 overflow-y-auto border rounded p-3 bg-gray-50">
                    <div className="text-sm">
                      <p className="font-semibold text-blue-600">Dr. Johnson</p>
                      <p className="text-gray-700">How are you feeling today?</p>
                      <p className="text-xs text-gray-400">5:20 PM</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-gray-600">You</p>
                      <p className="text-gray-700">Much better, thank you</p>
                      <p className="text-xs text-gray-400">5:25 PM</p>
                    </div>
                  </div>
                  <input type="text" placeholder="Type message..." className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TelemedicineLayout>
  );
};

export default ActiveSession;

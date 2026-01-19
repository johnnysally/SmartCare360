import DoctorLayout from "@/components/DoctorLayout";
import QueueManagement from "@/components/QueueManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const DoctorQueuePage = () => {
  return (
    <DoctorLayout title="Queue Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">My Queue</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your patient queue
            </p>
          </div>
        </div>
        
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="flex items-start gap-3 pt-6">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="font-medium">Queue Status:</p>
              <p className="mt-1">This queue shows all patients waiting for your consultation. Use "Call Next" to begin consultation.</p>
            </div>
          </CardContent>
        </Card>

        <QueueManagement showActions={true} maxItems={10} />
      </div>
    </DoctorLayout>
  );
};

export default DoctorQueuePage;

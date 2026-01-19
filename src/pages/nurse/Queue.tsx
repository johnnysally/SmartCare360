import NurseLayout from "@/components/NurseLayout";
import QueueManagement from "@/components/QueueManagement";

const NurseQueuePage = () => {
  return (
    <NurseLayout title="Queue Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-display">Queue Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage patient flow and queue operations
            </p>
          </div>
        </div>
        
        <QueueManagement showActions={true} />
      </div>
    </NurseLayout>
  );
};

export default NurseQueuePage;

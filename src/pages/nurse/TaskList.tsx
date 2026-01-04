import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ListTodo, Clock, Plus, CheckCircle2 } from "lucide-react";

const tasks = [
  { id: 1, task: "Morning medication round - Ward A", time: "09:00 AM", priority: "High", completed: false },
  { id: 2, task: "Blood pressure check - Room A-101", time: "09:30 AM", priority: "Normal", completed: false },
  { id: 3, task: "IV fluid change - Room A-104", time: "10:00 AM", priority: "Urgent", completed: false },
  { id: 4, task: "Wound dressing - Room A-102", time: "10:30 AM", priority: "Normal", completed: false },
  { id: 5, task: "Patient transfer to Radiology", time: "11:00 AM", priority: "Normal", completed: false },
  { id: 6, task: "Vital signs - All patients", time: "08:00 AM", priority: "High", completed: true },
  { id: 7, task: "Handover notes preparation", time: "07:30 AM", priority: "Normal", completed: true },
];

const TaskList = () => (
  <NurseLayout title="Task List">
    <div className="space-y-6 animate-fade-in">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">{tasks.filter(t => !t.completed).length}</div>
              <div className="text-sm text-muted-foreground">Pending Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">{tasks.filter(t => t.completed).length}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <ListTodo className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold font-display">{tasks.filter(t => t.priority === "Urgent" && !t.completed).length}</div>
              <div className="text-sm text-muted-foreground">Urgent</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="w-5 h-5 text-success" />
            Today's Tasks
          </CardTitle>
          <Button className="btn-gradient" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                  task.completed ? "opacity-60 bg-muted/30" : "hover:bg-muted/50"
                }`}
              >
                <Checkbox checked={task.completed} />
                <div className="flex-1">
                  <div className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.task}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3" />
                    {task.time}
                  </div>
                </div>
                <Badge 
                  variant={task.priority === "Urgent" ? "destructive" : task.priority === "High" ? "default" : "secondary"}
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </NurseLayout>
);

export default TaskList;

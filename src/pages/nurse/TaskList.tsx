import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListTodo, Clock, Plus, CheckCircle2, Trash2, Edit2, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  task: string;
  time: string;
  priority: "Urgent" | "High" | "Normal";
  completed: boolean;
}

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskForm, setNewTaskForm] = useState({ task: "", time: "", priority: "Normal" as const });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const storedTasks = localStorage.getItem('nurse_task_list');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks));
      } catch (err) {
        setTasks(getDefaultTasks());
      }
    } else {
      setTasks(getDefaultTasks());
    }
  }, []);

  const getDefaultTasks = (): Task[] => [
    { id: "1", task: "Morning medication round - Ward A", time: "09:00 AM", priority: "High", completed: false },
    { id: "2", task: "Blood pressure check - Room A-101", time: "09:30 AM", priority: "Normal", completed: false },
    { id: "3", task: "IV fluid change - Room A-104", time: "10:00 AM", priority: "Urgent", completed: false },
    { id: "4", task: "Wound dressing - Room A-102", time: "10:30 AM", priority: "Normal", completed: false },
    { id: "5", task: "Patient transfer to Radiology", time: "11:00 AM", priority: "Normal", completed: false },
    { id: "6", task: "Vital signs - All patients", time: "08:00 AM", priority: "High", completed: true },
    { id: "7", task: "Handover notes preparation", time: "07:30 AM", priority: "Normal", completed: true },
  ];

  const saveTasks = (updatedTasks: Task[]) => {
    localStorage.setItem('nurse_task_list', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (!newTaskForm.task.trim()) {
      toast({ title: "Error", description: "Please enter a task description", variant: "destructive" });
      return;
    }
    if (!newTaskForm.time.trim()) {
      toast({ title: "Error", description: "Please enter a time", variant: "destructive" });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      task: newTaskForm.task,
      time: newTaskForm.time,
      priority: newTaskForm.priority,
      completed: false,
    };

    const updatedTasks = [...tasks, task];
    saveTasks(updatedTasks);
    setNewTaskForm({ task: "", time: "", priority: "Normal" });
    setShowAddForm(false);
    toast({ title: "Success", description: "Task added successfully" });
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    saveTasks(updatedTasks);
    toast({ title: "Deleted", description: "Task removed successfully" });
  };

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTask({ ...task });
  };

  const saveEditTask = () => {
    if (!editingTask) return;
    if (!editingTask.task.trim()) {
      toast({ title: "Error", description: "Task description cannot be empty", variant: "destructive" });
      return;
    }
    if (!editingTask.time.trim()) {
      toast({ title: "Error", description: "Time cannot be empty", variant: "destructive" });
      return;
    }

    const updatedTasks = tasks.map(t => t.id === editingTask.id ? editingTask : t);
    saveTasks(updatedTasks);
    setEditingTaskId(null);
    setEditingTask(null);
    toast({ title: "Updated", description: "Task updated successfully" });
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditingTask(null);
  };

  const toggleComplete = (id: string) => {
    const updatedTasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updatedTasks);
  };

  const pendingCount = tasks.filter(t => !t.completed).length;
  const completedCount = tasks.filter(t => t.completed).length;
  const urgentCount = tasks.filter(t => t.priority === "Urgent" && !t.completed).length;

  return (
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
                <div className="text-2xl font-bold font-display">{pendingCount}</div>
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
                <div className="text-2xl font-bold font-display">{completedCount}</div>
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
                <div className="text-2xl font-bold font-display">{urgentCount}</div>
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
            {!showAddForm && (
              <Button className="btn-gradient" size="sm" onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Add Task Form */}
            {showAddForm && (
              <div className="p-4 rounded-lg border bg-muted/30 space-y-3 mb-4">
                <Label className="font-semibold text-sm">Create New Task</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="Task description..."
                    value={newTaskForm.task}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, task: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Input
                    type="time"
                    value={newTaskForm.time}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, time: e.target.value })}
                  />
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value as any })}
                    className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addTask} className="flex-1 btn-gradient" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Task
                  </Button>
                  <Button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTaskForm({ task: "", time: "", priority: "Normal" });
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Tasks */}
            {tasks.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">No tasks yet. Create one to get started!</div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                      task.completed ? "opacity-60 bg-muted/30" : "hover:bg-muted/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="w-4 h-4 cursor-pointer"
                    />

                    {editingTaskId === task.id ? (
                      <>
                        <div className="flex-1 space-y-2 min-w-0">
                          <Input
                            value={editingTask?.task || ""}
                            onChange={(e) => setEditingTask({ ...editingTask!, task: e.target.value })}
                            className="h-8"
                          />
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              type="time"
                              value={editingTask?.time || ""}
                              onChange={(e) => setEditingTask({ ...editingTask!, time: e.target.value })}
                              className="h-8"
                            />
                            <select
                              value={editingTask?.priority || "Normal"}
                              onChange={(e) => setEditingTask({ ...editingTask!, priority: e.target.value as any })}
                              className="flex h-8 rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <option value="Urgent">Urgent</option>
                              <option value="High">High</option>
                              <option value="Normal">Normal</option>
                            </select>
                          </div>
                        </div>
                        <Button size="sm" onClick={saveEditTask} className="bg-green-600 hover:bg-green-700">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                            {task.task}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{task.time}</span>
                          </div>
                        </div>
                        <Badge
                          variant={task.priority === "Urgent" ? "destructive" : task.priority === "High" ? "default" : "secondary"}
                          className="text-xs flex-shrink-0"
                        >
                          {task.priority}
                        </Badge>
                        <Button size="sm" variant="ghost" onClick={() => startEditTask(task)} className="h-8 w-8 p-0">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteTask(task.id)} className="h-8 w-8 p-0">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </NurseLayout>
  );
};

export default TaskList;

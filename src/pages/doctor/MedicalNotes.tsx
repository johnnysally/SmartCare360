import DoctorLayout from "@/components/DoctorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ClipboardList,
  Search,
  Plus,
  FileText,
  Clock,
  User,
  Tag,
  Edit,
  Trash2,
  Filter,
} from "lucide-react";

const recentNotes = [
  {
    id: "NOTE001",
    patient: "Grace Njeri",
    title: "Follow-up Consultation",
    date: "Jan 2, 2026",
    preview: "Patient reports improvement in symptoms. Reduced frequency of asthma attacks...",
    tags: ["Asthma", "Follow-up"],
  },
  {
    id: "NOTE002",
    patient: "James Mwangi",
    title: "Initial Consultation - Hypertension",
    date: "Jan 2, 2026",
    preview: "New patient presenting with elevated blood pressure readings over the past month...",
    tags: ["Hypertension", "New Patient"],
  },
  {
    id: "NOTE003",
    patient: "Mary Wambui",
    title: "Diabetes Management Review",
    date: "Jan 1, 2026",
    preview: "HbA1c levels have improved from 7.8% to 6.8%. Current medication regimen effective...",
    tags: ["Diabetes", "Lab Review"],
  },
  {
    id: "NOTE004",
    patient: "Peter Ochieng",
    title: "Post-Surgery Follow-up",
    date: "Dec 31, 2025",
    preview: "Surgical site healing well. No signs of infection. Patient advised to continue...",
    tags: ["Surgery", "Follow-up"],
  },
];

const noteTemplates = [
  { name: "SOAP Note", icon: FileText },
  { name: "Progress Note", icon: ClipboardList },
  { name: "Consultation Note", icon: User },
  { name: "Discharge Summary", icon: Tag },
];

const MedicalNotes = () => (
  <DoctorLayout title="Medical Notes">
    <div className="space-y-6 animate-fade-in">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search notes by patient or content..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
        <Button className="btn-gradient">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </div>

      {/* Quick Templates */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {noteTemplates.map((template, i) => (
          <Card
            key={i}
            className="cursor-pointer hover:border-primary transition-colors group"
          >
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <template.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-sm">{template.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notes List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary" />
              Recent Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{note.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {note.patient}
                      <span>•</span>
                      <Clock className="w-3 h-3" />
                      {note.date}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {note.preview}
                </p>
                <div className="flex gap-2">
                  {note.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Note */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient</label>
              <Input placeholder="Search patient..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Note title..." />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content</label>
              <Textarea
                placeholder="Start typing your note..."
                className="min-h-[200px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input placeholder="Add tags separated by comma..." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1">
                Save Draft
              </Button>
              <Button className="btn-gradient flex-1">Save Note</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </DoctorLayout>
);

export default MedicalNotes;

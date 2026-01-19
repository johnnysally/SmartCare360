import NurseLayout from "@/components/NurseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, User, Clock, Save, Plus, Trash2, Edit2, X, Eye, Download } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface CareNote {
  id: string;
  patient: string;
  bed: string;
  noteType: string;
  note: string;
  status: "draft" | "submitted";
  timestamp: string;
  nurse: string;
}

const CareNotes = () => {
  const [notes, setNotes] = useState<CareNote[]>([]);
  const [form, setForm] = useState({ patient: "", bed: "", noteType: "", note: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "submitted">("all");
  const { toast } = useToast();

  const templates = [
    { name: "Routine Check", text: "Patient observed during routine rounds. Vitals checked and found within normal limits. Patient comfortable and alert." },
    { name: "Vital Signs", text: "Vital signs recorded and monitored. BP: normal, HR: normal, Temp: normal, RR: normal. No abnormalities noted." },
    { name: "Medication Given", text: "Medications administered as per prescribed dosage. Patient tolerated well. No adverse reactions observed." },
    { name: "Patient Complaint", text: "Patient reported complaint of: ___. Assessed and appropriate action taken. Reported to duty doctor." },
    { name: "Wound Care", text: "Wound care performed. Site assessed for signs of infection. Dressing changed. Wound healing progress noted." },
    { name: "IV Monitoring", text: "IV line checked and monitored. IV site clean and free of infection signs. Fluids running well. No leakage observed." },
  ];

  useEffect(() => {
    const storedNotes = localStorage.getItem('care_notes');
    if (storedNotes) {
      try {
        setNotes(JSON.parse(storedNotes));
      } catch (err) {
        setNotes(getDefaultNotes());
      }
    } else {
      setNotes(getDefaultNotes());
    }
  }, []);

  const getDefaultNotes = (): CareNote[] => [
    { 
      id: "1", 
      patient: "Peter Kamau", 
      bed: "A-104", 
      noteType: "Routine Check",
      note: "Patient complained of mild headache. Vitals stable. Administered Paracetamol as prescribed.", 
      status: "submitted",
      timestamp: "08:45 AM",
      nurse: "Nurse Jane"
    },
    { 
      id: "2", 
      patient: "Mary Wanjiku", 
      bed: "A-101", 
      noteType: "Wound Care",
      note: "Post-operative wound dressing changed. No signs of infection. Patient comfortable.", 
      status: "submitted",
      timestamp: "08:00 AM",
      nurse: "Nurse Jane"
    },
    { 
      id: "3", 
      patient: "John Omondi", 
      bed: "A-102", 
      noteType: "Vital Signs",
      note: "Blood sugar levels slightly elevated. Informed duty doctor. Monitoring closely.", 
      status: "submitted",
      timestamp: "07:30 AM",
      nurse: "Nurse Jane"
    },
  ];

  const saveNotes = (updatedNotes: CareNote[]) => {
    localStorage.setItem('care_notes', JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const addOrUpdateNote = (status: "draft" | "submitted") => {
    if (!form.patient.trim()) {
      toast({ title: "Error", description: "Please enter patient name", variant: "destructive" });
      return;
    }
    if (!form.bed.trim()) {
      toast({ title: "Error", description: "Please enter bed number", variant: "destructive" });
      return;
    }
    if (!form.note.trim()) {
      toast({ title: "Error", description: "Please enter a care note", variant: "destructive" });
      return;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (editingId) {
      const updatedNotes = notes.map(n => 
        n.id === editingId 
          ? { ...n, ...form, status, timestamp: timeStr }
          : n
      );
      saveNotes(updatedNotes);
      toast({ title: "Updated", description: "Care note updated successfully" });
    } else {
      const newNote: CareNote = {
        id: Date.now().toString(),
        ...form,
        status,
        timestamp: timeStr,
        nurse: "Current Nurse",
      };
      saveNotes([newNote, ...notes]);
      toast({ title: "Success", description: `Care note ${status === 'draft' ? 'saved as draft' : 'submitted'} successfully` });
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({ patient: "", bed: "", noteType: "", note: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter(n => n.id !== id);
    saveNotes(updatedNotes);
    toast({ title: "Deleted", description: "Care note removed successfully" });
  };

  const startEditNote = (note: CareNote) => {
    setForm({ patient: note.patient, bed: note.bed, noteType: note.noteType, note: note.note });
    setEditingId(note.id);
    setShowForm(true);
  };

  const applyTemplate = (templateText: string) => {
    setForm({ ...form, note: form.note ? form.note + "\n\n" + templateText : templateText });
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.bed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || note.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const draftCount = notes.filter(n => n.status === "draft").length;
  const submittedCount = notes.filter(n => n.status === "submitted").length;

  return (
    <NurseLayout title="Care Notes">
      <div className="space-y-6 animate-fade-in">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-blue-200/50 bg-blue-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-200/30 flex items-center justify-center">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{notes.length}</div>
                <div className="text-sm text-muted-foreground">Total Notes</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-warning/30 bg-warning/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-warning/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{draftCount}</div>
                <div className="text-sm text-muted-foreground">Draft Notes</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-success/30 bg-success/5">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Save className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{submittedCount}</div>
                <div className="text-sm text-muted-foreground">Submitted</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-purple-200/50 bg-purple-50/30">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-200/30 flex items-center justify-center">
                <User className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold font-display">{new Set(notes.map(n => n.patient)).size}</div>
                <div className="text-sm text-muted-foreground">Unique Patients</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New/Edit Note Form */}
        {showForm && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                {editingId ? "Edit Care Note" : "New Care Note"}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Patient Name *</Label>
                  <Input
                    placeholder="Patient name..."
                    value={form.patient}
                    onChange={(e) => setForm({ ...form, patient: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bed Number *</Label>
                  <Input
                    placeholder="e.g. A-104"
                    value={form.bed}
                    onChange={(e) => setForm({ ...form, bed: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Note Type</Label>
                <select
                  value={form.noteType}
                  onChange={(e) => setForm({ ...form, noteType: e.target.value })}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                >
                  <option value="">Select a type...</option>
                  {templates.map((t) => (
                    <option key={t.name} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Care Note *</Label>
                <Textarea
                  placeholder="Enter detailed care observations, patient status, interventions performed, and any concerns..."
                  rows={6}
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">Quick Templates</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      size="sm"
                      onClick={() => applyTemplate(template.text)}
                      className="text-xs h-8"
                    >
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" onClick={() => addOrUpdateNote("draft")}>
                  <Save className="w-4 h-4 mr-2" />
                  Save as Draft
                </Button>
                <Button className="flex-1 btn-gradient" onClick={() => addOrUpdateNote("submitted")}>
                  <Save className="w-4 h-4 mr-2" />
                  Submit Note
                </Button>
                <Button variant="ghost" className="flex-1" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Note Button */}
        {!showForm && (
          <Button className="btn-gradient" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Note
          </Button>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by patient name or bed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <div className="flex gap-2">
            {(["all", "draft", "submitted"] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                onClick={() => setFilterStatus(status)}
                size="sm"
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Care Notes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-success" />
              Care Notes ({filteredNotes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredNotes.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No care notes found. Create one to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium">{note.patient}</span>
                        <Badge variant="outline" className="text-xs">Bed {note.bed}</Badge>
                        <Badge
                          variant={note.status === "draft" ? "secondary" : "default"}
                          className="text-xs"
                        >
                          {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                        </Badge>
                        {note.noteType && (
                          <Badge variant="outline" className="text-xs bg-blue-50">
                            {note.noteType}
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground flex-shrink-0">{note.timestamp}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{note.note}</p>
                    <div className="text-xs text-muted-foreground mt-2">— {note.nurse}</div>
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setViewingId(viewingId === note.id ? null : note.id)}
                        className="h-8"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => startEditNote(note)}
                        className="h-8"
                      >
                        <Edit2 className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteNote(note.id)}
                        className="h-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                    {viewingId === note.id && (
                      <div className="mt-3 p-3 bg-muted/30 rounded text-sm whitespace-pre-wrap">
                        {note.note}
                      </div>
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

export default CareNotes;

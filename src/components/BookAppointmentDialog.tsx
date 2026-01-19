import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Stethoscope, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  createAppointment,
  getDoctorAvailability,
  confirmAppointment,
} from '@/lib/api';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  department: string;
  available: boolean;
}

interface BookAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  onAppointmentCreated?: (appointment: any) => void;
}

const DEPARTMENTS = ['OPD', 'Emergency', 'Laboratory', 'Radiology', 'Pharmacy', 'Billing'];
const APPOINTMENT_TYPES = ['In-person', 'Telemedicine', 'Follow-up', 'Check-up', 'Consultation'];

// Mock doctors data - replace with API call
const MOCK_DOCTORS = [
  { id: 'D001', name: 'Dr. Otieno', specialty: 'General Practitioner', department: 'OPD', available: true },
  { id: 'D002', name: 'Dr. Mwangi', specialty: 'Cardiologist', department: 'OPD', available: true },
  { id: 'D003', name: 'Dr. Wanjiru', specialty: 'Dermatologist', department: 'OPD', available: true },
  { id: 'D004', name: 'Dr. Kipchoge', specialty: 'Surgeon', department: 'Emergency', available: true },
  { id: 'D005', name: 'Dr. Nyambura', specialty: 'Radiologist', department: 'Radiology', available: true },
];

export default function BookAppointmentDialog({
  open,
  onOpenChange,
  patientId,
  patientName,
  patientPhone,
  onAppointmentCreated,
}: BookAppointmentDialogProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<'department' | 'doctor' | 'datetime' | 'type' | 'confirm'>('department');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('In-person');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState('3');

  const filteredDoctors = selectedDepartment
    ? MOCK_DOCTORS.filter((d) => d.department === selectedDepartment)
    : [];

  // Generate time slots from available slots
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const loadAvailableSlots = async () => {
    try {
      setLoading(true);
      const response = await getDoctorAvailability(selectedDoctor!.id, selectedDate);
      setAvailableSlots(response.availableSlots || []);
      if (response.availableSlots.length === 0) {
        toast({ title: 'No available slots', description: 'Please select a different date' });
      }
    } catch (err: any) {
      toast({ title: 'Failed to load availability', description: err?.message || '' });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 'department') {
      if (!selectedDepartment) {
        toast({ title: 'Please select a department', variant: 'destructive' });
        return;
      }
      setStep('doctor');
    } else if (step === 'doctor') {
      if (!selectedDoctor) {
        toast({ title: 'Please select a doctor', variant: 'destructive' });
        return;
      }
      setStep('datetime');
    } else if (step === 'datetime') {
      if (!selectedDate || !selectedTime) {
        toast({ title: 'Please select date and time', variant: 'destructive' });
        return;
      }
      setStep('type');
    } else if (step === 'type') {
      if (!appointmentType) {
        toast({ title: 'Please select appointment type', variant: 'destructive' });
        return;
      }
      setStep('confirm');
    }
  };

  const handleBack = () => {
    if (step === 'doctor') setStep('department');
    else if (step === 'datetime') setStep('doctor');
    else if (step === 'type') setStep('datetime');
    else if (step === 'confirm') setStep('type');
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      const appointmentData = {
        patientId,
        patientName,
        phone: patientPhone || '',
        time: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
        type: appointmentType,
        department: selectedDepartment,
        doctorId: selectedDoctor?.id,
        doctorName: selectedDoctor?.name,
        priority: parseInt(priority),
        status: 'pending',
      };

      const created = await createAppointment(appointmentData);

      // Auto-confirm the appointment
      await confirmAppointment(created.id);

      toast({
        title: 'Appointment booked successfully!',
        description: `Your queue number: ${created.queue_number}`,
      });

      onAppointmentCreated?.(created);
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: 'Failed to book appointment', description: err?.message || '', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep('department');
    setSelectedDepartment('');
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setAppointmentType('In-person');
    setAvailableSlots([]);
    setPriority('3');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Book an Appointment</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">Step {step === 'department' ? 1 : step === 'doctor' ? 2 : step === 'datetime' ? 3 : step === 'type' ? 4 : 5} of 5</p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step Progress */}
          <div className="flex justify-between gap-2 mb-6">
            {(['department', 'doctor', 'datetime', 'type', 'confirm'] as const).map((s) => (
              <div
                key={s}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  s === step ? 'bg-primary' : ['department', 'doctor', 'datetime', 'type', 'confirm'].indexOf(s) < ['department', 'doctor', 'datetime', 'type', 'confirm'].indexOf(step) ? 'bg-green-500' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Department Selection */}
          {step === 'department' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Select Department
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {DEPARTMENTS.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDepartment === dept
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{dept}</div>
                    <div className="text-xs text-muted-foreground mt-1">{filteredDoctors.length} doctors available</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Doctor Selection */}
          {step === 'doctor' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                Select Doctor in {selectedDepartment}
              </h3>
              <div className="space-y-2">
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedDoctor?.id === doctor.id
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                      </div>
                      {doctor.available && <Badge className="bg-green-500">Available</Badge>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time Selection */}
          {step === 'datetime' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Select Date & Time
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Date</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      setSelectedTime('');
                    }}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium">Available Times</label>
                    {loading ? (
                      <div className="py-4 text-center text-sm text-muted-foreground">Loading available slots...</div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {availableSlots.map((slot) => {
                          const slotTime = new Date(slot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTime(slotTime)}
                              className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                                selectedTime === slotTime
                                  ? 'border-primary bg-primary/5'
                                  : 'border-muted hover:border-primary/50'
                              }`}
                            >
                              {slotTime}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-sm text-amber-600 flex items-center justify-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        No available slots for this date
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Appointment Type Selection */}
          {step === 'type' && (
            <div className="space-y-4">
              <h3 className="font-semibold">Select Appointment Type</h3>
              <div className="grid grid-cols-2 gap-3">
                {APPOINTMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setAppointmentType(type)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      appointmentType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium text-sm">{type}</div>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="1">🚨 Emergency</option>
                  <option value="2">⚠️ Urgent</option>
                  <option value="3">✓ Normal</option>
                  <option value="4">📋 Follow-up</option>
                </select>
              </div>
            </div>
          )}

          {/* Confirmation */}
          {step === 'confirm' && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                Review Your Appointment
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Patient</div>
                      <div className="font-medium">{patientName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Phone</div>
                      <div className="font-medium">{patientPhone || 'Not provided'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Department</div>
                      <div className="font-medium">{selectedDepartment}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Doctor</div>
                      <div className="font-medium">{selectedDoctor?.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Date</div>
                      <div className="font-medium">{selectedDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Time</div>
                      <div className="font-medium">{selectedTime}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Type</div>
                      <div className="font-medium">{appointmentType}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground uppercase">Priority</div>
                      <div className="font-medium">
                        {priority === '1' ? '🚨 Emergency' : priority === '2' ? '⚠️ Urgent' : priority === '3' ? '✓ Normal' : '📋 Follow-up'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  After booking, you'll receive a queue number. Please arrive 10 minutes early.
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {step !== 'department' && (
              <Button variant="outline" onClick={handleBack} disabled={loading}>
                Back
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => { resetForm(); onOpenChange(false); }}>
              Cancel
            </Button>
            {step !== 'confirm' ? (
              <Button onClick={handleNext} disabled={loading} className="btn-gradient">
                Next
              </Button>
            ) : (
              <Button onClick={handleConfirm} disabled={loading} className="btn-gradient">
                {loading ? 'Booking...' : 'Confirm Booking'}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

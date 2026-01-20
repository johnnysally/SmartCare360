import TelemedicineLayout from "@/components/TelemedicineLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock, User, Phone } from "lucide-react";

const TelemedicineSchedule = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      toast({ title: 'Session scheduled', description: 'Confirmation sent to patient' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to schedule session', variant: 'destructive' });
    }
  };

  return (
    <TelemedicineLayout title="Schedule Telemedicine Session">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Schedule Consultation</h1>
          <p className="text-gray-500">Book a new telemedicine session</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Consultation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Patient Name *</label>
                    <Input {...register('patientName', { required: true })} placeholder="Enter patient name" className="mt-2" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Patient Email *</label>
                    <Input {...register('patientEmail', { required: true })} type="email" placeholder="patient@example.com" className="mt-2" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Consultation Type *</label>
                    <select {...register('consultationType', { required: true })} className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md">
                      <option value="">Select type</option>
                      <option value="general">General Consultation</option>
                      <option value="followup">Follow-up Visit</option>
                      <option value="specialist">Specialist Consultation</option>
                      <option value="emergency">Urgent Care</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Date *</label>
                      <Input {...register('date', { required: true })} type="date" className="mt-2" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Time *</label>
                      <Input {...register('time', { required: true })} type="time" className="mt-2" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Duration (minutes) *</label>
                    <Input {...register('duration', { required: true })} type="number" placeholder="30" className="mt-2" />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Notes</label>
                    <textarea {...register('notes')} placeholder="Additional details..." className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md" rows={4} />
                  </div>

                  <Button type="submit" className="btn-gradient w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Scheduling...' : 'Schedule Session'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">Available Times</p>
                    <p className="text-gray-600">Mon-Fri: 9AM-5PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-green-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">Typical Duration</p>
                    <p className="text-gray-600">15-60 minutes</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-purple-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">Consultant</p>
                    <p className="text-gray-600">Auto-assigned</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 mt-1" />
                  <div className="text-sm">
                    <p className="font-medium">Connection</p>
                    <p className="text-gray-600">Video/Audio link sent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </TelemedicineLayout>
  );
};

export default TelemedicineSchedule;

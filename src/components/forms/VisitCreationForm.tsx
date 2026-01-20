import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DEPARTMENTS = [
  'General OPD',
  'Pediatrics',
  'Cardiology',
  'Orthopedics',
  'Surgery',
  'ENT',
  'Eye Care',
  'Dermatology'
];

const VISIT_TYPES = ['OPD', 'IPD', 'Emergency', 'Follow-up', 'Referral'];
const PRIORITIES = ['Low', 'Normal', 'High', 'Critical'];

interface VisitCreationFormProps {
  onSubmit: (data: any) => void;
}

export function VisitCreationForm({ onSubmit }: VisitCreationFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      patientId: '',
      visitType: 'OPD',
      department: 'General OPD',
      priority: 'Normal',
      reason: ''
    }
  });

  const visitType = watch('visitType');
  const department = watch('department');
  const priority = watch('priority');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        placeholder="Patient ID or Phone Number *" 
        {...register('patientId', { required: true })} 
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Visit Type *</label>
          <Select value={visitType} onValueChange={(value) => setValue('visitType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VISIT_TYPES.map(type => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Department *</label>
          <Select value={department} onValueChange={(value) => setValue('department', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEPARTMENTS.map(dept => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium block mb-2">Priority</label>
        <Select value={priority} onValueChange={(value) => setValue('priority', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map(p => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <textarea 
        placeholder="Reason for visit" 
        className="w-full p-2 border rounded-md text-sm"
        {...register('reason')}
        rows={3}
      />

      <Button type="submit" className="w-full">
        Create Visit
      </Button>
    </form>
  );
}

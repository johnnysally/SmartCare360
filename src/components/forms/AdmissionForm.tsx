import React from 'react';
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

const WARD_TYPES = [
  'General Ward',
  'Semi-Private',
  'Private',
  'ICU',
  'HDU',
  'Pediatric Ward',
  'Maternity Ward'
];

interface AdmissionFormProps {
  onSubmit: (data: any) => void;
}

export function AdmissionForm({ onSubmit }: AdmissionFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      patientId: '',
      wardType: 'General Ward',
      admissionDeposit: '',
      admissionReason: ''
    }
  });

  const wardType = watch('wardType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        placeholder="Patient ID or Phone Number *" 
        {...register('patientId', { required: true })} 
      />

      <div>
        <label className="text-sm font-medium block mb-2">Ward Type *</label>
        <Select value={wardType} onValueChange={(value) => setValue('wardType', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {WARD_TYPES.map(ward => (
              <SelectItem key={ward} value={ward}>{ward}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Input 
        type="number" 
        placeholder="Admission Deposit Amount (KES)" 
        {...register('admissionDeposit', { required: true })} 
      />

      <textarea 
        placeholder="Reason for Admission *" 
        className="w-full p-2 border rounded-md text-sm"
        {...register('admissionReason', { required: true })}
        rows={3}
      />

      <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900">
        <strong>Note:</strong> Patient will be assigned a bed number after admission. 
        Please inform patient of ward and visiting hours.
      </div>

      <Button type="submit" className="w-full">
        Admit Patient
      </Button>
    </form>
  );
}

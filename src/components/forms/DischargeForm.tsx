import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

interface DischargeFormProps {
  onSubmit: (data: any) => void;
}

export function DischargeForm({ onSubmit }: DischargeFormProps) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      admissionId: '',
      finalBalance: '',
      dischargeSummary: ''
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input 
        placeholder="Admission ID or Patient ID *" 
        {...register('admissionId', { required: true })} 
      />

      <Input 
        type="number" 
        placeholder="Final Balance to Collect (KES)" 
        {...register('finalBalance', { required: true })} 
      />

      <textarea 
        placeholder="Discharge Summary & Instructions *" 
        className="w-full p-2 border rounded-md text-sm"
        {...register('dischargeSummary', { required: true })}
        rows={4}
      />

      <div className="bg-green-50 p-3 rounded-md text-sm text-green-900">
        <strong>Discharge Checklist:</strong>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>Final settlement done</li>
          <li>Medications prescribed</li>
          <li>Follow-up appointment scheduled</li>
          <li>Patient copy of discharge provided</li>
        </ul>
      </div>

      <Button type="submit" className="w-full">
        Complete Discharge
      </Button>
    </form>
  );
}

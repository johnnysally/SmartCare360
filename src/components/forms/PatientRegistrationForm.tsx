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

interface PatientRegistrationFormProps {
  onSubmit: (data: any) => void;
}

export function PatientRegistrationForm({ onSubmit }: PatientRegistrationFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      age: '',
      gender: 'male',
      address: '',
      insuranceType: 'none'
    }
  });

  const gender = watch('gender');
  const insuranceType = watch('insuranceType');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Full Name *" {...register('fullName', { required: true })} />
        <Input placeholder="Phone Number *" {...register('phone', { required: true })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input type="email" placeholder="Email" {...register('email')} />
        <Input type="number" placeholder="Age" {...register('age')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Gender</label>
          <Select value={gender} onValueChange={(value) => setValue('gender', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Insurance Type</label>
          <Select value={insuranceType} onValueChange={(value) => setValue('insuranceType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Insurance</SelectItem>
              <SelectItem value="nhif">NHIF</SelectItem>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="company">Company</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Input placeholder="Address" {...register('address')} />

      <Button type="submit" className="w-full">
        Register Patient
      </Button>
    </form>
  );
}

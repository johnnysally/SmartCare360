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
      age: '',
      gender: 'male',
      address: '',
      insuranceType: 'none',
      patientType: 'OPD',
      patientSubType: '',
      paymentMethod: 'cash'
    }
  });

  const gender = watch('gender');
  const insuranceType = watch('insuranceType');
  const patientType = watch('patientType');
  const paymentMethod = watch('paymentMethod');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="Full Name *" {...register('fullName', { required: true })} />
        <Input placeholder="Phone Number *" {...register('phone', { required: true })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">Patient Type</label>
          <Select value={patientType} onValueChange={(value) => setValue('patientType', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPD">Outpatient (OPD)</SelectItem>
              <SelectItem value="IPD">Inpatient (IPD)</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
              <SelectItem value="FollowUp">Follow-Up</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Insurance">Insurance/Sponsored</SelectItem>
              <SelectItem value="Cash">Self-Pay / Cash</SelectItem>
              <SelectItem value="International">International</SelectItem>
              <SelectItem value="SpecialCare">Special Care</SelectItem>
              <SelectItem value="Chronic">Chronic Care</SelectItem>
              <SelectItem value="DayCare">Day-Care / Short-Stay</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium block mb-2">Payment Method</label>
          <Select value={paymentMethod} onValueChange={(value) => setValue('paymentMethod', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="mobile">Mobile Money</SelectItem>
              <SelectItem value="insurance">Insurance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Input placeholder="Patient Subtype (optional) e.g. Trauma, Maternity" {...register('patientSubType')} />
      </div>

      <Input placeholder="Address" {...register('address')} />

      <Button type="submit" className="w-full">
        Register Patient
      </Button>
    </form>
  );
}

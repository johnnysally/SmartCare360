import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const WARD_TYPES = [
  'General Ward',
  'Semi-Private',
  'Private',
  'ICU',
  'HDU',
  'Pediatric Ward',
  'Maternity Ward',
]

interface AdmissionFormProps {
  onSubmit?: (data: any) => void
}

export function AdmissionForm({ onSubmit }: AdmissionFormProps) {
  const { register, handleSubmit, watch, setValue, getValues } = useForm<any>({
    defaultValues: {
      patientId: '',
      uhid: '',
      patientName: '',
      dob: '',
      age: '',
      gender: 'male',
      phone: '',
      altPhone: '',
      county: '',
      city: '',
      country: '',
      wardType: WARD_TYPES[0],
      admittingDoctor: '',
      admissionType: 'Elective',
      admissionDatetime: '',
      expectedLengthOfStay: '',
      bedNumber: '',
      roomNumber: '',
      admissionDeposit: '',
      paymentMethod: 'cash',
      estimatedCharges: '',
      insuranceProvider: '',
      insurancePolicyNumber: '',
      preauthRequired: false,
      preauthNumber: '',
      surgeryPlanned: false,
      surgeonName: '',
      anesthesiaType: '',
      gravidity: '',
      parity: '',
      expectedDeliveryDate: '',
      guardianName: '',
      guardianPhone: '',
      consentObtained: false,
      billingName: '',
      provisionalDiagnosis: '',
      notes: '',
    },
  })

  const wardType = watch('wardType')
  const patientId = watch('patientId')
  const preauthRequired = watch('preauthRequired')
  const surgeryPlanned = watch('surgeryPlanned')
  const paymentMethod = watch('paymentMethod')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  async function submitToBackend(formData: any) {
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const res = await fetch('/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(body.error || `Server returned ${res.status}`)
        return
      }
      setSuccess('Admission created successfully')
      if (onSubmit) onSubmit(body)
    } catch (err: any) {
      setError(err?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const handleLocalSubmit = (data: any) => submitToBackend(data)

  React.useEffect(() => {
    if (!patientId) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch(`/patients/${patientId}`)
        if (!mounted) return
        if (res.ok) {
          const p = await res.json()
          if (p.name) setValue('patientName', p.name)
          if (p.uhid) setValue('uhid', p.uhid)
          if (p.dob) setValue('dob', p.dob)
          if (p.gender) setValue('gender', p.gender)
          if (p.phone) setValue('phone', p.phone)
          if (p.alt_phone) setValue('altPhone', p.alt_phone)
          if (p.county) setValue('county', p.county)
          if (p.city) setValue('city', p.city)
          if (p.country) setValue('country', p.country)
        }
      } catch (err) {
        // ignore
      }
    })()
    return () => {
      mounted = false
    }
  }, [patientId, setValue])

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-4">
      <form onSubmit={handleSubmit(handleLocalSubmit)} className="flex flex-col max-h-[75vh] h-[75vh]">
        {/* scrollable body */}
        <div className="flex-1 overflow-auto pr-3 pb-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-lg font-semibold">Patient</div>
              <Input className="w-full" placeholder="Patient ID or Phone Number *" {...register('patientId', { required: true })} />
              <Input className="w-full" placeholder="UHID / MRN" {...register('uhid')} />
              <Input className="w-full" placeholder="Full Name *" {...register('patientName', { required: true })} />
              <div className="grid grid-cols-2 gap-3">
                <Input className="w-full" placeholder="DOB (YYYY-MM-DD)" {...register('dob')} />
                <Input className="w-full" placeholder="Age" {...register('age')} />
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">Gender</label>
                <Select value={watch('gender') || 'male'} onValueChange={(v) => setValue('gender', v)}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" placeholder="Phone (primary) *" {...register('phone', { required: true })} />
                <Input className="w-full" placeholder="Alternate Phone" {...register('altPhone')} />
              </div>
            </div>

              <div className="space-y-3">
                <div className="text-lg font-semibold">Admission</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" placeholder="County" {...register('county')} />
                <Input className="w-full" placeholder="City" {...register('city')} />
              </div>
              <Input className="w-full" placeholder="Country" {...register('country')} />
              <div>
                <label className="text-sm font-medium block mb-2">Ward Type *</label>
                <Select value={wardType} onValueChange={(value) => setValue('wardType', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WARD_TYPES.map((ward) => (
                      <SelectItem key={ward} value={ward}>
                        {ward}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" placeholder="Admitting Doctor" {...register('admittingDoctor')} />
                <div>
                  <label className="text-sm font-medium block mb-2">Admission Type</label>
                  <Select value={watch('admissionType')} onValueChange={(v) => setValue('admissionType', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Elective">Elective</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" type="datetime-local" placeholder="Admission Date/Time" {...register('admissionDatetime')} />
                <Input className="w-full" type="number" placeholder="Expected Length of Stay (days)" {...register('expectedLengthOfStay')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" placeholder="Bed Number (optional)" {...register('bedNumber')} />
                <Input className="w-full" placeholder="Room Number (optional)" {...register('roomNumber')} />
              </div>

              <Input type="number" className="w-full" placeholder="Admission Deposit Amount (KES)" {...register('admissionDeposit', { required: true })} />
            </div>

            <div className="space-y-3">
              <div className="text-lg font-semibold">Billing & Admin</div>
              <Input className="w-full" placeholder="Full Name (for billing)" {...register('billingName')} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-2">Payment Method</label>
                  <Select value={paymentMethod} onValueChange={(v) => setValue('paymentMethod', v)}>
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
                <Input className="w-full" type="number" placeholder="Estimated Charges" {...register('estimatedCharges')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" placeholder="Insurance Provider" {...register('insuranceProvider')} />
                <Input className="w-full" placeholder="Insurance Policy Number" {...register('insurancePolicyNumber')} />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" {...register('preauthRequired')} id="preauth" />
                <label htmlFor="preauth" className="text-sm">Pre-authorization required</label>
              </div>
              {preauthRequired && (
                <Input className="w-full" placeholder="Pre-authorization Number" {...register('preauthNumber')} />
              )}

              <div className="flex items-center gap-3">
                <input type="checkbox" {...register('surgeryPlanned')} id="surgeryPlanned" />
                <label htmlFor="surgeryPlanned" className="text-sm">Surgery planned</label>
              </div>
              {surgeryPlanned && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input className="w-full" placeholder="Surgeon Name" {...register('surgeonName')} />
                  <Input className="w-full" placeholder="Anesthesia Type" {...register('anesthesiaType')} />
                </div>
              )}

              {wardType && wardType.toLowerCase().includes('matern') && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <Input className="w-full" placeholder="Gravidity" type="number" {...register('gravidity')} />
                  <Input className="w-full" placeholder="Parity" type="number" {...register('parity')} />
                  <Input className="w-full" type="date" placeholder="Expected Delivery Date" {...register('expectedDeliveryDate')} />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input className="w-full" placeholder="Guardian / Next of Kin Name" {...register('guardianName')} />
                <Input className="w-full" placeholder="Guardian Phone" {...register('guardianPhone')} />
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" {...register('consentObtained')} id="consent" />
                <label htmlFor="consent" className="text-sm">Consent obtained</label>
              </div>
            </div>
          </div>

          {/* Diagnosis & Notes */}
          <div className="mt-6">
            <div>
              <label className="text-sm font-medium block mb-2">Provisional Diagnosis *</label>
              <textarea placeholder="Provisional Diagnosis" className="w-full p-2 border rounded-md text-sm" {...register('provisionalDiagnosis', { required: true })} rows={3} />
            </div>
            <div className="mt-3">
              <label className="text-sm font-medium block mb-2">Notes</label>
              <textarea placeholder="Notes" className="w-full p-2 border rounded-md text-sm" {...register('notes')} rows={2} />
            </div>
          </div>
        </div>

        {/* footer with submit (placed at bottom of form) */}
          <div className="mt-3 bg-white dark:bg-slate-900 pt-3 pb-4">
          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-900 mb-3">
            <strong>Note:</strong> Patient will be assigned a bed number after admission. Please inform patient of ward and visiting hours.
          </div>
            {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
            {success && <div className="text-sm text-green-700 mb-2">{success}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Saving…' : 'Admit Patient'}</Button>
        </div>
      </form>
    </div>
  )
}

export default AdmissionForm


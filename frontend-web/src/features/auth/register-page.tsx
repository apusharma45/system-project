import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { api, getApiErrorMessage } from '../../lib/api'
import { useAuth } from './auth-context'

const roleSchema = z.enum(['PATIENT', 'DOCTOR', 'PHARMACY', 'DIAGNOSTIC'])
const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER'])

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.email('Provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(5, 'Phone is required'),
  address: z.string().min(5, 'Address is required'),
  role: roleSchema,
  patientProfile: z
    .object({
      gender: genderSchema.optional(),
      dateOfBirth: z.string().optional(),
      allergies: z.string().optional(),
      chronicConditions: z.string().optional(),
      currentMedications: z.string().optional(),
      emergencyContactName: z.string().optional(),
      emergencyContactPhone: z.string().optional(),
      emergencyContactRelation: z.string().optional(),
    })
    .optional(),
  professionalProfile: z
    .object({
      gender: genderSchema.optional(),
      dateOfBirth: z.string().optional(),
      licenseNumber: z.string().optional(),
      specialization: z.string().optional(),
      pharmacyName: z.string().optional(),
      labName: z.string().optional(),
      degrees: z.array(z.string()).optional(),
      certifications: z.array(z.string()).optional(),
      yearsOfExperience: z.number().int().min(0).optional(),
      licenseAuthority: z.string().optional(),
      accreditations: z.array(z.string()).optional(),
      availableTests: z.array(z.string()).optional(),
    })
    .optional(),
}).superRefine((data, ctx) => {
  const requireField = (condition: boolean, message: string, path: (string | number)[]) => {
    if (!condition) {
      ctx.addIssue({ code: 'custom', message, path })
    }
  }

  if (data.role === 'PATIENT') {
    requireField(!!data.patientProfile, 'Patient profile is required', ['patientProfile'])
    requireField(!!data.patientProfile?.gender, 'Gender is required for patient registration', ['patientProfile', 'gender'])
    requireField(
      !!data.patientProfile?.dateOfBirth,
      'Date of birth is required for patient registration',
      ['patientProfile', 'dateOfBirth'],
    )
  }

  if (data.role === 'DOCTOR') {
    requireField(!!data.professionalProfile, 'Professional profile is required', ['professionalProfile'])
    requireField(
      !!data.professionalProfile?.gender,
      'Gender is required for doctor registration',
      ['professionalProfile', 'gender'],
    )
    requireField(
      !!data.professionalProfile?.dateOfBirth,
      'Date of birth is required for doctor registration',
      ['professionalProfile', 'dateOfBirth'],
    )
    requireField(
      !!data.professionalProfile?.licenseNumber,
      'License number is required for doctor registration',
      ['professionalProfile', 'licenseNumber'],
    )
    requireField(
      !!data.professionalProfile?.specialization,
      'Specialization is required for doctor registration',
      ['professionalProfile', 'specialization'],
    )
  }

  if (data.role === 'PHARMACY') {
    requireField(!!data.professionalProfile, 'Professional profile is required', ['professionalProfile'])
    requireField(
      !!data.professionalProfile?.licenseNumber,
      'License number is required for pharmacy registration',
      ['professionalProfile', 'licenseNumber'],
    )
    requireField(
      !!data.professionalProfile?.pharmacyName,
      'Pharmacy name is required for pharmacy registration',
      ['professionalProfile', 'pharmacyName'],
    )
  }

  if (data.role === 'DIAGNOSTIC') {
    requireField(!!data.professionalProfile, 'Professional profile is required', ['professionalProfile'])
    requireField(
      !!data.professionalProfile?.licenseNumber,
      'License number is required for diagnostic registration',
      ['professionalProfile', 'licenseNumber'],
    )
    requireField(
      !!data.professionalProfile?.labName,
      'Lab name is required for diagnostic registration',
      ['professionalProfile', 'labName'],
    )
  }
})

type RegisterRole = z.infer<typeof roleSchema>
type RegisterPayload = z.infer<typeof registerSchema>

function parseCsv(value: string) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

export function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [role, setRole] = useState<RegisterRole>('PATIENT')
  const [patientGender, setPatientGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('')
  const [patientDateOfBirth, setPatientDateOfBirth] = useState('')
  const [allergies, setAllergies] = useState('')
  const [chronicConditions, setChronicConditions] = useState('')
  const [currentMedications, setCurrentMedications] = useState('')
  const [emergencyContactName, setEmergencyContactName] = useState('')
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('')
  const [emergencyContactRelation, setEmergencyContactRelation] = useState('')
  const [professionalGender, setProfessionalGender] = useState<'MALE' | 'FEMALE' | 'OTHER' | ''>('')
  const [professionalDateOfBirth, setProfessionalDateOfBirth] = useState('')
  const [licenseNumber, setLicenseNumber] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [pharmacyName, setPharmacyName] = useState('')
  const [labName, setLabName] = useState('')
  const [degreesCsv, setDegreesCsv] = useState('')
  const [certificationsCsv, setCertificationsCsv] = useState('')
  const [yearsOfExperience, setYearsOfExperience] = useState('')
  const [licenseAuthority, setLicenseAuthority] = useState('')
  const [accreditationsCsv, setAccreditationsCsv] = useState('')
  const [availableTestsCsv, setAvailableTestsCsv] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const fullNameLabel =
    role === 'PHARMACY'
      ? 'Requester Name (on behalf of Pharmacy)'
      : role === 'DIAGNOSTIC'
        ? 'Requester Name (on behalf of Lab)'
        : 'Full Name'

  const buildPayload = (): RegisterPayload => {
    const payload: RegisterPayload = {
      fullName,
      email,
      password,
      phone,
      address,
      role,
    }

    if (role === 'PATIENT') {
      payload.patientProfile = {
        gender: patientGender || undefined,
        dateOfBirth: patientDateOfBirth || undefined,
        allergies: allergies || undefined,
        chronicConditions: chronicConditions || undefined,
        currentMedications: currentMedications || undefined,
        emergencyContactName: emergencyContactName || undefined,
        emergencyContactPhone: emergencyContactPhone || undefined,
        emergencyContactRelation: emergencyContactRelation || undefined,
      }
    }

    if (role === 'DOCTOR' || role === 'PHARMACY' || role === 'DIAGNOSTIC') {
      payload.professionalProfile = {
        gender: professionalGender || undefined,
        dateOfBirth: professionalDateOfBirth || undefined,
        licenseNumber: licenseNumber || undefined,
        specialization: specialization || undefined,
        pharmacyName: pharmacyName || undefined,
        labName: labName || undefined,
        degrees: degreesCsv ? parseCsv(degreesCsv) : undefined,
        certifications: certificationsCsv ? parseCsv(certificationsCsv) : undefined,
        yearsOfExperience: yearsOfExperience ? Number(yearsOfExperience) : undefined,
        licenseAuthority: licenseAuthority || undefined,
        accreditations: accreditationsCsv ? parseCsv(accreditationsCsv) : undefined,
        availableTests: availableTestsCsv ? parseCsv(availableTestsCsv) : undefined,
      }
    }

    return payload
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)
    const parsed = registerSchema.safeParse(buildPayload())
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid registration payload')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post<{ access_token: string }>('/auth/register', parsed.data)
      await login(response.data.access_token)
      if (role === 'DOCTOR') navigate('/doctor')
      else if (role === 'PHARMACY') navigate('/pharmacy')
      else if (role === 'DIAGNOSTIC') navigate('/diagnostic')
      else navigate('/patient')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-shell">
      <form className="auth-card" onSubmit={onSubmit}>
        <h1>Create MedFlow Account</h1>
        <label htmlFor="role">Role</label>
        <select id="role" value={role} onChange={(e) => setRole(e.target.value as RegisterRole)}>
          <option value="PATIENT">PATIENT</option>
          <option value="DOCTOR">DOCTOR</option>
          <option value="PHARMACY">PHARMACY</option>
          <option value="DIAGNOSTIC">DIAGNOSTIC</option>
        </select>
        {role === 'PHARMACY' ? (
          <>
            <label htmlFor="pharmacyName">Pharmacy Name</label>
            <input id="pharmacyName" value={pharmacyName} onChange={(e) => setPharmacyName(e.target.value)} />
          </>
        ) : null}
        {role === 'DIAGNOSTIC' ? (
          <>
            <label htmlFor="labName">Lab Name</label>
            <input id="labName" value={labName} onChange={(e) => setLabName(e.target.value)} />
          </>
        ) : null}
        <label htmlFor="fullName">{fullNameLabel}</label>
        <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <label htmlFor="email">Email</label>
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="phone">Phone</label>
        <input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <label htmlFor="address">Address</label>
        <input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
        {role === 'PATIENT' ? (
          <>
            <label htmlFor="patientGender">Gender</label>
            <select
              id="patientGender"
              value={patientGender}
              onChange={(e) => setPatientGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | '')}
            >
              <option value="">Select gender</option>
              <option value="MALE">MALE</option>
              <option value="FEMALE">FEMALE</option>
              <option value="OTHER">OTHER</option>
            </select>
            <label htmlFor="patientDateOfBirth">Date of Birth</label>
            <input
              id="patientDateOfBirth"
              type="date"
              value={patientDateOfBirth}
              onChange={(e) => setPatientDateOfBirth(e.target.value)}
            />
            <label htmlFor="allergies">Allergies (Optional)</label>
            <input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} />
            <label htmlFor="chronicConditions">Chronic Conditions (Optional)</label>
            <input
              id="chronicConditions"
              value={chronicConditions}
              onChange={(e) => setChronicConditions(e.target.value)}
            />
            <label htmlFor="currentMedications">Current Medications (Optional)</label>
            <input
              id="currentMedications"
              value={currentMedications}
              onChange={(e) => setCurrentMedications(e.target.value)}
            />
            <label htmlFor="emergencyContactName">Emergency Contact Name (Optional)</label>
            <input
              id="emergencyContactName"
              value={emergencyContactName}
              onChange={(e) => setEmergencyContactName(e.target.value)}
            />
            <label htmlFor="emergencyContactPhone">Emergency Contact Phone (Optional)</label>
            <input
              id="emergencyContactPhone"
              value={emergencyContactPhone}
              onChange={(e) => setEmergencyContactPhone(e.target.value)}
            />
            <label htmlFor="emergencyContactRelation">Emergency Contact Relation (Optional)</label>
            <input
              id="emergencyContactRelation"
              value={emergencyContactRelation}
              onChange={(e) => setEmergencyContactRelation(e.target.value)}
            />
          </>
        ) : null}
        {role === 'DOCTOR' || role === 'PHARMACY' || role === 'DIAGNOSTIC' ? (
          <>
            {role === 'DOCTOR' ? (
              <>
                <label htmlFor="professionalGender">Gender</label>
                <select
                  id="professionalGender"
                  value={professionalGender}
                  onChange={(e) => setProfessionalGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | '')}
                >
                  <option value="">Select gender</option>
                  <option value="MALE">MALE</option>
                  <option value="FEMALE">FEMALE</option>
                  <option value="OTHER">OTHER</option>
                </select>
                <label htmlFor="professionalDateOfBirth">Date of Birth</label>
                <input
                  id="professionalDateOfBirth"
                  type="date"
                  value={professionalDateOfBirth}
                  onChange={(e) => setProfessionalDateOfBirth(e.target.value)}
                />
              </>
            ) : null}
            <label htmlFor="licenseNumber">License Number</label>
            <input
              id="licenseNumber"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
            {role === 'DOCTOR' ? (
              <>
                <label htmlFor="specialization">Specialization</label>
                <input
                  id="specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
                <label htmlFor="degreesCsv">Degrees (Optional, comma separated)</label>
                <input id="degreesCsv" value={degreesCsv} onChange={(e) => setDegreesCsv(e.target.value)} />
                <label htmlFor="certificationsCsv">Certifications (Optional, comma separated)</label>
                <input
                  id="certificationsCsv"
                  value={certificationsCsv}
                  onChange={(e) => setCertificationsCsv(e.target.value)}
                />
                <label htmlFor="yearsOfExperience">Years of Experience (Optional)</label>
                <input
                  id="yearsOfExperience"
                  type="number"
                  min={0}
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(e.target.value)}
                />
              </>
            ) : null}
            {role === 'PHARMACY' ? (
              <>
                <label htmlFor="licenseAuthority">License Authority (Optional)</label>
                <input
                  id="licenseAuthority"
                  value={licenseAuthority}
                  onChange={(e) => setLicenseAuthority(e.target.value)}
                />
              </>
            ) : null}
            {role === 'DIAGNOSTIC' ? (
              <>
                <label htmlFor="accreditationsCsv">Accreditations (Optional, comma separated)</label>
                <input
                  id="accreditationsCsv"
                  value={accreditationsCsv}
                  onChange={(e) => setAccreditationsCsv(e.target.value)}
                />
                <label htmlFor="availableTestsCsv">Available Tests (Optional, comma separated)</label>
                <input
                  id="availableTestsCsv"
                  value={availableTestsCsv}
                  onChange={(e) => setAvailableTestsCsv(e.target.value)}
                />
              </>
            ) : null}
          </>
        ) : null}
        {error ? <p className="error">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Account'}
        </button>
        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </div>
  )
}

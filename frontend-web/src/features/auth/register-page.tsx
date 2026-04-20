import { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Activity,
  AlertCircle,
  Calendar,
  ContactRound,
  Eye,
  EyeOff,
  FlaskConical,
  Heart,
  Home,
  Lock,
  Mail,
  Phone,
  PhoneCall,
  Pill,
  Stethoscope,
  User,
  UserCircle,
  Users,
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { api, getApiErrorMessage } from '../../lib/api'
import { useAuth } from './auth-context'

const roleSchema = z.enum(['PATIENT', 'DOCTOR', 'PHARMACY', 'DIAGNOSTIC'])
const genderSchema = z.enum(['MALE', 'FEMALE', 'OTHER'])

const registerSchema = z
  .object({
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
  })
  .superRefine((data, ctx) => {
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
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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

  const roleCopy = {
    PATIENT: {
      title: 'Patient Sign Up',
      label: 'Patient',
      icon: User,
    },
    DOCTOR: {
      title: 'Doctor Sign Up',
      label: 'Doctor',
      icon: Stethoscope,
    },
    PHARMACY: {
      title: 'Pharmacy Registration',
      label: 'Pharmacy',
      icon: Pill,
    },
    DIAGNOSTIC: {
      title: 'Diagnostic Lab Registration',
      label: 'Lab',
      icon: FlaskConical,
    },
  } satisfies Record<RegisterRole, { title: string; label: string; icon: typeof User }>

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

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

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

  const currentRole = roleCopy[role]

  return (
    <div className="auth-shell auth-shell-blue">
      <div className="auth-panel">
        <div className="auth-brand">
          <div className="auth-brand-mark" aria-hidden="true">
            <Heart size={28} />
          </div>
          <h1>MedFlow</h1>
          <p>Your Complete Healthcare Platform</p>
        </div>

        <div className="auth-hero-copy">
          <h2>Create Account</h2>
          <p>Create your account to access MedFlow</p>
        </div>

        <form className="auth-card auth-card-figma auth-card-register" onSubmit={onSubmit}>
          <fieldset className="auth-role-picker">
            <legend className="sr-only">Role</legend>
            {(Object.keys(roleCopy) as RegisterRole[]).map((roleOption) => {
              const RoleIcon = roleCopy[roleOption].icon
              const selected = role === roleOption
              return (
                <button
                  key={roleOption}
                  type="button"
                  className={`auth-role-option${selected ? ' active' : ''}`}
                  aria-pressed={selected}
                  onClick={() => setRole(roleOption)}
                >
                  <RoleIcon size={18} aria-hidden="true" />
                  <span>{roleCopy[roleOption].label}</span>
                </button>
              )
            })}
          </fieldset>

          <div className="auth-card-head">
            <h3>{currentRole.title}</h3>
            <p>All fields below are required.</p>
          </div>

          <div className="auth-form-grid">
            <label className="auth-field" htmlFor="fullName">
              <span className="auth-label">{fullNameLabel}</span>
              <span className="auth-input-wrap">
                <User className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="fullName"
                  className="auth-control auth-control-icon"
                  value={fullName}
                  placeholder="Enter full name"
                  onChange={(e) => setFullName(e.target.value)}
                />
              </span>
            </label>

            <label className="auth-field" htmlFor="email">
              <span className="auth-label">Email Address</span>
              <span className="auth-input-wrap">
                <Mail className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="email"
                  className="auth-control auth-control-icon"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </span>
            </label>

            <label className="auth-field" htmlFor="password">
              <span className="auth-label">Password</span>
              <span className="auth-input-wrap">
                <Lock className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="password"
                  className="auth-control auth-control-icon auth-control-icon-trailing"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  aria-label={showPassword ? 'Hide secret text' : 'Show secret text'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label className="auth-field" htmlFor="confirmPassword">
              <span className="auth-label">Confirm Password</span>
              <span className="auth-input-wrap">
                <Lock className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="confirmPassword"
                  className="auth-control auth-control-icon auth-control-icon-trailing"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="auth-input-toggle"
                  aria-label={showConfirmPassword ? 'Hide confirmed secret text' : 'Show confirmed secret text'}
                  onClick={() => setShowConfirmPassword((current) => !current)}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            <label className="auth-field" htmlFor="phone">
              <span className="auth-label">Phone</span>
              <span className="auth-input-wrap">
                <Phone className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="phone"
                  className="auth-control auth-control-icon"
                  type="tel"
                  placeholder="Enter phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </span>
            </label>

            <label className="auth-field" htmlFor="address">
              <span className="auth-label">Address</span>
              <span className="auth-input-wrap">
                <Home className="auth-input-icon" size={18} aria-hidden="true" />
                <input
                  id="address"
                  className="auth-control auth-control-icon"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </span>
            </label>

            {role === 'PHARMACY' ? (
              <label className="auth-field" htmlFor="pharmacyName">
                <span className="auth-label">Pharmacy Name</span>
                <input
                  id="pharmacyName"
                  className="auth-control"
                  placeholder="Enter pharmacy name"
                  value={pharmacyName}
                  onChange={(e) => setPharmacyName(e.target.value)}
                />
              </label>
            ) : null}

            {role === 'DIAGNOSTIC' ? (
              <label className="auth-field" htmlFor="labName">
                <span className="auth-label">Lab Name</span>
                <input
                  id="labName"
                  className="auth-control"
                  placeholder="Enter laboratory name"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                />
              </label>
            ) : null}

            {role === 'PATIENT' ? (
              <>
                <label className="auth-field" htmlFor="patientGender">
                  <span className="auth-label">Gender</span>
                  <span className="auth-input-wrap">
                    <UserCircle className="auth-input-icon" size={18} aria-hidden="true" />
                    <select
                      id="patientGender"
                      className="auth-control auth-control-icon"
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | '')}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </span>
                </label>

                <label className="auth-field" htmlFor="patientDateOfBirth">
                  <span className="auth-label">Date of Birth</span>
                  <span className="auth-input-wrap">
                    <Calendar className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="patientDateOfBirth"
                      className="auth-control auth-control-icon"
                      type="date"
                      value={patientDateOfBirth}
                      onChange={(e) => setPatientDateOfBirth(e.target.value)}
                    />
                  </span>
                </label>

                <label className="auth-field" htmlFor="allergies">
                  <span className="auth-label">Allergies (Optional)</span>
                  <input
                    id="allergies"
                    className="auth-control"
                    placeholder="Enter any allergies (e.g., Penicillin, Peanuts)"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                  />
                </label>

                <label className="auth-field" htmlFor="chronicConditions">
                  <span className="auth-label">Chronic Conditions (Optional)</span>
                  <input
                    id="chronicConditions"
                    className="auth-control"
                    placeholder="Enter chronic conditions (e.g., Diabetes, Hypertension)"
                    value={chronicConditions}
                    onChange={(e) => setChronicConditions(e.target.value)}
                  />
                </label>

                <label className="auth-field" htmlFor="currentMedications">
                  <span className="auth-label">Current Medications (Optional)</span>
                  <span className="auth-input-wrap">
                    <Activity className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="currentMedications"
                      className="auth-control auth-control-icon"
                      placeholder="Enter current medications"
                      value={currentMedications}
                      onChange={(e) => setCurrentMedications(e.target.value)}
                    />
                  </span>
                </label>

                <label className="auth-field" htmlFor="emergencyContactName">
                  <span className="auth-label">Emergency Contact Name (Optional)</span>
                  <span className="auth-input-wrap">
                    <ContactRound className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="emergencyContactName"
                      className="auth-control auth-control-icon"
                      placeholder="Enter contact name"
                      value={emergencyContactName}
                      onChange={(e) => setEmergencyContactName(e.target.value)}
                    />
                  </span>
                </label>

                <label className="auth-field" htmlFor="emergencyContactPhone">
                  <span className="auth-label">Emergency Contact Phone (Optional)</span>
                  <span className="auth-input-wrap">
                    <PhoneCall className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="emergencyContactPhone"
                      className="auth-control auth-control-icon"
                      type="tel"
                      placeholder="Enter contact phone"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    />
                  </span>
                </label>

                <label className="auth-field" htmlFor="emergencyContactRelation">
                  <span className="auth-label">Emergency Contact Relation (Optional)</span>
                  <span className="auth-input-wrap">
                    <Users className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="emergencyContactRelation"
                      className="auth-control auth-control-icon"
                      placeholder="Enter relation (e.g., Brother, Sister, Mother)"
                      value={emergencyContactRelation}
                      onChange={(e) => setEmergencyContactRelation(e.target.value)}
                    />
                  </span>
                </label>
              </>
            ) : null}

            {role === 'DOCTOR' ? (
              <>
                <label className="auth-field" htmlFor="professionalGender">
                  <span className="auth-label">Gender</span>
                  <span className="auth-input-wrap">
                    <UserCircle className="auth-input-icon" size={18} aria-hidden="true" />
                    <select
                      id="professionalGender"
                      className="auth-control auth-control-icon"
                      value={professionalGender}
                      onChange={(e) => setProfessionalGender(e.target.value as 'MALE' | 'FEMALE' | 'OTHER' | '')}
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </span>
                </label>

                <label className="auth-field" htmlFor="professionalDateOfBirth">
                  <span className="auth-label">Date of Birth</span>
                  <span className="auth-input-wrap">
                    <Calendar className="auth-input-icon" size={18} aria-hidden="true" />
                    <input
                      id="professionalDateOfBirth"
                      className="auth-control auth-control-icon"
                      type="date"
                      value={professionalDateOfBirth}
                      onChange={(e) => setProfessionalDateOfBirth(e.target.value)}
                    />
                  </span>
                </label>
              </>
            ) : null}

            {role === 'DOCTOR' || role === 'PHARMACY' || role === 'DIAGNOSTIC' ? (
              <label className="auth-field" htmlFor="licenseNumber">
                <span className="auth-label">License Number</span>
                <input
                  id="licenseNumber"
                  className="auth-control"
                  placeholder="Enter your license number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </label>
            ) : null}

            {role === 'DOCTOR' ? (
              <>
                <label className="auth-field" htmlFor="specialization">
                  <span className="auth-label">Specialization</span>
                  <input
                    id="specialization"
                    className="auth-control"
                    placeholder="Enter specialization (e.g., Cardiology, Neurology)"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                  />
                </label>

                <label className="auth-field" htmlFor="degreesCsv">
                  <span className="auth-label">Degrees (Optional, comma separated)</span>
                  <input
                    id="degreesCsv"
                    className="auth-control"
                    placeholder="e.g., MD, MBBS, DM"
                    value={degreesCsv}
                    onChange={(e) => setDegreesCsv(e.target.value)}
                  />
                  <span className="auth-hint">Enter multiple degrees separated by commas</span>
                </label>

                <label className="auth-field" htmlFor="certificationsCsv">
                  <span className="auth-label">Certifications (Optional, comma separated)</span>
                  <input
                    id="certificationsCsv"
                    className="auth-control"
                    placeholder="e.g., ICMR, ACS, Board Certification"
                    value={certificationsCsv}
                    onChange={(e) => setCertificationsCsv(e.target.value)}
                  />
                  <span className="auth-hint">Enter multiple certifications separated by commas</span>
                </label>

                <label className="auth-field" htmlFor="yearsOfExperience">
                  <span className="auth-label">Years of Experience (Optional)</span>
                  <input
                    id="yearsOfExperience"
                    className="auth-control"
                    type="number"
                    min={0}
                    placeholder="e.g., 10"
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                  />
                </label>
              </>
            ) : null}

            {role === 'PHARMACY' ? (
              <label className="auth-field" htmlFor="licenseAuthority">
                <span className="auth-label">License Authority (Optional)</span>
                <input
                  id="licenseAuthority"
                  className="auth-control"
                  placeholder="Enter license authority (e.g., State Board)"
                  value={licenseAuthority}
                  onChange={(e) => setLicenseAuthority(e.target.value)}
                />
              </label>
            ) : null}

            {role === 'DIAGNOSTIC' ? (
              <>
                <label className="auth-field" htmlFor="accreditationsCsv">
                  <span className="auth-label">Accreditations (Optional, comma separated)</span>
                  <input
                    id="accreditationsCsv"
                    className="auth-control"
                    placeholder="e.g., NABL, ISO 15189, CAP"
                    value={accreditationsCsv}
                    onChange={(e) => setAccreditationsCsv(e.target.value)}
                  />
                  <span className="auth-hint">Enter multiple accreditations separated by commas</span>
                </label>

                <label className="auth-field" htmlFor="availableTestsCsv">
                  <span className="auth-label">Available Tests (Optional, comma separated)</span>
                  <input
                    id="availableTestsCsv"
                    className="auth-control"
                    placeholder="e.g., Blood Test, CT Scan, Ultrasound"
                    value={availableTestsCsv}
                    onChange={(e) => setAvailableTestsCsv(e.target.value)}
                  />
                  <span className="auth-hint">Enter available tests separated by commas</span>
                </label>
              </>
            ) : null}

            {error ? (
              <div className="auth-error-banner" role="alert">
                <AlertCircle size={18} aria-hidden="true" />
                <p>{error}</p>
              </div>
            ) : null}

            <button className="auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Creating...' : 'Create Account'}
            </button>

            <p className="auth-switch-copy">
              <span>Already have an account? </span>
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

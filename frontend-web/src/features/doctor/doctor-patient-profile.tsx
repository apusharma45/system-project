import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDoctorPatientProfile } from './doctor-shared'

type TabKey = 'overview' | 'appointments' | 'labs' | 'prescriptions'

export function DoctorPatientProfilePage() {
  const { patientId } = useParams()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const profileQuery = useDoctorPatientProfile(patientId)
  const profile = profileQuery.data

  const tabs = useMemo<Array<{ key: TabKey; label: string }>>(
    () => [
      { key: 'overview', label: 'Overview' },
      { key: 'appointments', label: 'Appointments' },
      { key: 'labs', label: 'Labs' },
      { key: 'prescriptions', label: 'Prescriptions' },
    ],
    [],
  )

  return (
    <div className="page doctor-page doctor-patient-profile-page">
      <div className="page-head">
        <h1>Patient Profile</h1>
        <p>Complete patient context with medical profile and treatment history timeline.</p>
      </div>

      {profileQuery.isLoading ? <p className="state">Loading patient profile...</p> : null}
      {profileQuery.isError ? <p className="error">Failed to load patient profile.</p> : null}

      {profile ? (
        <>
          <section className="card">
            <div className="card-head">
              <h3>{profile.patient.fullName || 'Patient'}</h3>
              <p className="muted">{profile.patient.email}</p>
              <p className="muted">Patient ID: {profile.patient.id}</p>
            </div>
            <div className="kpi-grid kpi-three">
              <article className="kpi">
                <p>Appointments</p>
                <h3>{profile.summary.appointmentCount}</h3>
              </article>
              <article className="kpi">
                <p>Lab Orders</p>
                <h3>{profile.summary.labOrderCount}</h3>
              </article>
              <article className="kpi">
                <p>Prescriptions</p>
                <h3>{profile.summary.prescriptionCount}</h3>
              </article>
            </div>
          </section>

          <section className="card">
            <div className="actions">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={activeTab === tab.key ? 'primary-btn' : 'outline-btn'}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>

          {activeTab === 'overview' ? (
            <section className="card">
              <div className="stack">
                <p>
                  <strong>Date of Birth:</strong> {profile.patient.profile?.dateOfBirth ?? 'Not provided'}
                </p>
                <p>
                  <strong>Gender:</strong> {profile.patient.profile?.gender ?? 'Not provided'}
                </p>
                <p>
                  <strong>Phone:</strong> {profile.patient.profile?.phone ?? 'Not provided'}
                </p>
                <p>
                  <strong>Address:</strong> {profile.patient.profile?.address ?? 'Not provided'}
                </p>
                <p>
                  <strong>Allergies:</strong> {profile.patient.profile?.allergies ?? 'Not provided'}
                </p>
                <p>
                  <strong>Chronic Conditions:</strong> {profile.patient.profile?.chronicConditions ?? 'Not provided'}
                </p>
                <p>
                  <strong>Current Medications:</strong> {profile.patient.profile?.currentMedications ?? 'Not provided'}
                </p>
                <p>
                  <strong>Emergency Contact:</strong>{' '}
                  {profile.patient.profile?.emergencyContactName
                    ? `${profile.patient.profile.emergencyContactName} (${profile.patient.profile.emergencyContactRelation ?? 'relation not set'})`
                    : 'Not provided'}
                </p>
                <p>
                  <strong>Emergency Phone:</strong> {profile.patient.profile?.emergencyContactPhone ?? 'Not provided'}
                </p>
              </div>
            </section>
          ) : null}

          {activeTab === 'appointments' ? (
            <section className="card">
              <ul className="list">
                {profile.history.appointments.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.scheduledAt ? new Date(item.scheduledAt).toLocaleString() : 'Pending schedule'}</strong>
                      <p className="muted">
                        {item.status} #{item.id}
                      </p>
                    </div>
                  </li>
                ))}
                {profile.history.appointments.length === 0 ? <li className="empty">No appointments found.</li> : null}
              </ul>
            </section>
          ) : null}

          {activeTab === 'labs' ? (
            <section className="card">
              <ul className="list">
                {profile.history.labOrders.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.status}</strong>
                      <p className="muted">Order ID: {item.id}</p>
                      {item.labResult?.fileUrl ? (
                        <a className="quick-link" href={item.labResult.fileUrl} target="_blank" rel="noreferrer">
                          Open result
                        </a>
                      ) : null}
                    </div>
                  </li>
                ))}
                {profile.history.labOrders.length === 0 ? <li className="empty">No lab history found.</li> : null}
              </ul>
            </section>
          ) : null}

          {activeTab === 'prescriptions' ? (
            <section className="card">
              <ul className="list">
                {profile.history.prescriptions.map((item) => (
                  <li key={item.id}>
                    <div>
                      <strong>{item.status}</strong>
                      <p className="muted">Prescription ID: {item.id}</p>
                      <p className="muted">{item.notes}</p>
                    </div>
                  </li>
                ))}
                {profile.history.prescriptions.length === 0 ? (
                  <li className="empty">No prescription history found.</li>
                ) : null}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  )
}

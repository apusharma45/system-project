import { Navigate, Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Bell,
  CalendarClock,
  FileText,
  FlaskConical,
  Pill,
  ShieldCheck,
  Stethoscope,
  Users,
} from 'lucide-react'
import { useAuth } from '../auth/auth-context'

function homeByRole(role: string) {
  if (role === 'DOCTOR') return '/doctor'
  if (role === 'PATIENT') return '/patient'
  if (role === 'PHARMACY') return '/pharmacy'
  if (role === 'DIAGNOSTIC') return '/diagnostic'
  return '/login'
}

const statItems = [
  { value: '4', label: 'Connected workspaces', detail: 'Patient, doctor, pharmacy, diagnostic' },
  { value: '1', label: 'Unified workflow', detail: 'Appointments, prescriptions, labs, notifications' },
  { value: '24/7', label: 'Operational visibility', detail: 'Every status stays visible across the system' },
]

const roleCards = [
  {
    title: 'Patient Experience',
    description: 'Book appointments, track records, and receive live care updates in a calm dashboard.',
    icon: Activity,
    accent: 'patient',
  },
  {
    title: 'Doctor Workspace',
    description: 'Manage appointments, review patient context, issue prescriptions, and coordinate labs.',
    icon: Stethoscope,
    accent: 'doctor',
  },
  {
    title: 'Pharmacy Operations',
    description: 'Receive queued prescriptions, monitor readiness, and complete dispensing with clarity.',
    icon: Pill,
    accent: 'pharmacy',
  },
  {
    title: 'Diagnostic Coordination',
    description: 'Track assigned lab orders, upload reports, and keep result delivery moving quickly.',
    icon: FlaskConical,
    accent: 'diagnostic',
  },
]

const featureCards = [
  {
    title: 'Role-aware dashboards',
    description: 'Each team gets a tailored workspace without losing the shared system picture.',
    icon: Users,
  },
  {
    title: 'Realtime updates',
    description: 'Important workflow events surface through notifications as soon as they happen.',
    icon: Bell,
  },
  {
    title: 'Prescription and lab continuity',
    description: 'Doctors, pharmacies, and diagnostics stay connected through the same care journey.',
    icon: FileText,
  },
  {
    title: 'Safer operational visibility',
    description: 'Statuses, handoffs, and records remain visible across the full treatment lifecycle.',
    icon: ShieldCheck,
  },
]

const workflowSteps = [
  {
    title: 'Schedule and triage',
    description: 'Patients request visits and doctors manage scheduling and consultation flow.',
    icon: CalendarClock,
  },
  {
    title: 'Treat and prescribe',
    description: 'Clinical decisions move into prescriptions and lab orders without context switching.',
    icon: Stethoscope,
  },
  {
    title: 'Fulfill and report',
    description: 'Pharmacy and diagnostics complete the downstream work while everyone stays informed.',
    icon: FlaskConical,
  },
]

export function LandingPage() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="state landing-state">Loading MedFlow...</div>
  }

  if (user) {
    return <Navigate to={homeByRole(user.role)} replace />
  }

  return (
    <div className="landing-page">
      <div className="landing-shell">
        <header className="landing-header">
          <Link to="/" className="landing-brand">
            <span className="landing-brand-mark">+</span>
            <span>
              <strong>MedFlow</strong>
              <small>Connected Care Operating System</small>
            </span>
          </Link>
          <nav className="landing-nav">
            <a href="#roles">Roles</a>
            <a href="#workflow">Workflow</a>
            <a href="#why-medflow">Why MedFlow</a>
            <Link to="/login" className="landing-nav-link">
              Log In
            </Link>
            <Link to="/register" className="landing-nav-cta">
              Register
            </Link>
          </nav>
        </header>

        <main className="landing-main">
          <section className="landing-hero">
            <div className="landing-hero-copy">
              <p className="landing-eyebrow">End-to-End Health System</p>
              <h1>One platform for patients, doctors, pharmacies, and diagnostics.</h1>
              <p className="landing-lead">
                MedFlow turns fragmented healthcare handoffs into one connected digital journey, from
                appointment booking to prescription fulfillment and lab result delivery.
              </p>
              <div className="landing-hero-actions">
                <Link to="/register" className="landing-primary-cta">
                  Get Started
                  <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="landing-secondary-cta">
                  Log In
                </Link>
              </div>
              <div className="landing-stat-grid">
                {statItems.map((item) => (
                  <article key={item.label} className="landing-stat-card">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                    <small>{item.detail}</small>
                  </article>
                ))}
              </div>
            </div>

            <div className="landing-hero-panel">
              <div className="landing-signal-card landing-signal-primary">
                <div className="landing-signal-top">
                  <span className="landing-signal-label">Live Care Flow</span>
                  <span className="landing-signal-pill">Realtime</span>
                </div>
                <h3>MedFlow keeps every handoff moving.</h3>
                <p>
                  Patients request care, doctors consult, pharmacies dispense, and diagnostics report
                  results through one continuous system.
                </p>
              </div>

              <div className="landing-role-preview-grid">
                {roleCards.map((card) => (
                  <article key={card.title} className={`landing-role-preview ${card.accent}`}>
                    <card.icon size={18} />
                    <div>
                      <strong>{card.title}</strong>
                      <p>{card.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="landing-showcase" id="roles">
            <div className="landing-section-head">
              <p className="landing-section-kicker">Built For Every Role</p>
              <h2>Designed as one coordinated care system, not separate tools.</h2>
              <p>
                Every workspace is role-specific, but the experience stays connected from intake to
                outcome.
              </p>
            </div>

            <div className="landing-role-card-grid">
              {roleCards.map((card) => (
                <article key={card.title} className={`landing-role-card ${card.accent}`}>
                  <div className="landing-role-card-icon">
                    <card.icon size={20} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-features" id="why-medflow">
            <div className="landing-section-head">
              <p className="landing-section-kicker">Why MedFlow</p>
              <h2>Modern healthcare operations with a clearer digital backbone.</h2>
            </div>
            <div className="landing-feature-grid">
              {featureCards.map((card) => (
                <article key={card.title} className="landing-feature-card">
                  <div className="landing-feature-icon">
                    <card.icon size={18} />
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-workflow" id="workflow">
            <div className="landing-section-head">
              <p className="landing-section-kicker">Workflow</p>
              <h2>Three stages, one continuous care loop.</h2>
            </div>
            <div className="landing-workflow-grid">
              {workflowSteps.map((step, index) => (
                <article key={step.title} className="landing-workflow-card">
                  <div className="landing-workflow-badge">0{index + 1}</div>
                  <div className="landing-workflow-icon">
                    <step.icon size={18} />
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="landing-cta">
            <div>
              <p className="landing-section-kicker">Ready To Explore</p>
              <h2>Launch MedFlow and move care forward with one connected system.</h2>
            </div>
            <div className="landing-cta-actions">
              <Link to="/register" className="landing-primary-cta">
                Create Account
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="landing-secondary-cta">
                Sign In
              </Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

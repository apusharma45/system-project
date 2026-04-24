import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Bell,
  Building2,
  LayoutDashboard,
  Plug,
  Settings,
  Shield,
  Stethoscope,
  Users,
} from 'lucide-react'

export type AdminNavItem = {
  label: string
  path: string
  icon: LucideIcon
  badge?: number
}

export const adminNavItems: AdminNavItem[] = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard },
  { label: 'User Management', path: '/admin/users', icon: Users },
  { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
  { label: 'Pharmacies', path: '/admin/pharmacies', icon: Building2 },
  { label: 'Diagnostics', path: '/admin/diagnostics', icon: Activity },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Audit Logs', path: '/admin/audit', icon: Shield },
  { label: 'Integrations', path: '/admin/integrations', icon: Plug },
  { label: 'Admin Profile', path: '/admin/profile', icon: Settings },
]

export const adminKpiData = {
  totalUsers: { value: 45678, change: 12.5, trend: 'up' as const, subtitle: '+12% this week' },
  activeDoctors: { value: 1234, change: 8.3, trend: 'up' as const, subtitle: '+8% this week' },
  registeredPatients: { value: 38942, change: 15.2, trend: 'up' as const, subtitle: '+15% this week' },
  appointmentsToday: { value: 287, change: -3.5, trend: 'down' as const },
  pendingPrescriptions: { value: 156, change: 5.8, trend: 'up' as const },
  labReportsGenerated: { value: 892, change: 22.1, trend: 'up' as const },
  revenueSnapshot: { value: 284500, change: 18.7, trend: 'up' as const, subtitle: '+18% this month' },
  openSupportTickets: { value: 43, change: -12.3, trend: 'down' as const },
}

export const platformUsageData = [
  { date: 'Apr 1', users: 4200, appointments: 150, prescriptions: 89 },
  { date: 'Apr 5', users: 4500, appointments: 178, prescriptions: 102 },
  { date: 'Apr 10', users: 4800, appointments: 195, prescriptions: 125 },
  { date: 'Apr 15', users: 5200, appointments: 220, prescriptions: 148 },
  { date: 'Apr 20', users: 5600, appointments: 245, prescriptions: 167 },
  { date: 'Apr 24', users: 6100, appointments: 287, prescriptions: 189 },
]

export const appointmentsBySpecialty = [
  { specialty: 'Cardiology', count: 45 },
  { specialty: 'Neurology', count: 38 },
  { specialty: 'Orthopedics', count: 52 },
  { specialty: 'Pediatrics', count: 67 },
  { specialty: 'Dermatology', count: 34 },
  { specialty: 'General', count: 51 },
]

export const userRoleDistribution = [
  { role: 'Patients', value: 38942, fill: '#1e6fff' },
  { role: 'Doctors', value: 1234, fill: '#06b6d4' },
  { role: 'Pharmacies', value: 342, fill: '#10b981' },
  { role: 'Diagnostics', value: 156, fill: '#f59e0b' },
  { role: 'Admins', value: 24, fill: '#8b5cf6' },
]

export const revenueData = [
  { month: 'Oct', revenue: 185000 },
  { month: 'Nov', revenue: 210000 },
  { month: 'Dec', revenue: 235000 },
  { month: 'Jan', revenue: 248000 },
  { month: 'Feb', revenue: 262000 },
  { month: 'Mar', revenue: 271000 },
  { month: 'Apr', revenue: 284500 },
]

export const systemHealth = {
  apiUptime: { status: 'healthy', value: '99.98%' },
  storage: { status: 'healthy', value: '67%' },
  notifications: { status: 'healthy', value: '100%' },
  payments: { status: 'healthy', value: '99.95%' },
  cloudinary: { status: 'degraded', value: '95.2%' },
  database: { status: 'healthy', value: '99.99%' },
}

export const recentActivity = [
  { id: 1, user: 'Dr. Sarah Johnson', action: 'registered as a doctor', time: '2 minutes ago', avatar: 'SJ' },
  { id: 2, user: 'John Martinez', action: 'booked an appointment', time: '5 minutes ago', avatar: 'JM' },
  { id: 3, user: 'Dr. Michael Chen', action: 'created a prescription', time: '12 minutes ago', avatar: 'MC' },
  { id: 4, user: 'City Diagnostics', action: 'uploaded lab report', time: '18 minutes ago', avatar: 'CD' },
  { id: 5, user: 'Emma Wilson', action: 'submitted a support ticket', time: '25 minutes ago', avatar: 'EW' },
]

export const adminUsers = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@medflow.com',
    phone: '+1 (555) 123-4567',
    role: 'Doctor',
    status: 'active',
    verified: true,
    joined: '2024-01-15',
    lastActive: '2 hours ago',
    avatar: 'SJ',
    specialty: 'Cardiology',
  },
  {
    id: 2,
    name: 'John Martinez',
    email: 'john.martinez@email.com',
    phone: '+1 (555) 234-5678',
    role: 'Patient',
    status: 'active',
    verified: true,
    joined: '2024-03-22',
    lastActive: '1 day ago',
    avatar: 'JM',
  },
  {
    id: 3,
    name: 'Dr. Michael Chen',
    email: 'michael.chen@medflow.com',
    phone: '+1 (555) 345-6789',
    role: 'Doctor',
    status: 'active',
    verified: true,
    joined: '2023-11-08',
    lastActive: '30 minutes ago',
    avatar: 'MC',
    specialty: 'Neurology',
  },
  {
    id: 4,
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1 (555) 456-7890',
    role: 'Patient',
    status: 'active',
    verified: false,
    joined: '2024-04-10',
    lastActive: '3 hours ago',
    avatar: 'EW',
  },
  {
    id: 5,
    name: 'HealthPlus Pharmacy',
    email: 'contact@healthplus.com',
    phone: '+1 (555) 567-8901',
    role: 'Pharmacy',
    status: 'active',
    verified: true,
    joined: '2023-09-12',
    lastActive: '1 hour ago',
    avatar: 'HP',
  },
  {
    id: 6,
    name: 'City Diagnostics',
    email: 'info@citydiagnostics.com',
    phone: '+1 (555) 678-9012',
    role: 'Diagnostic',
    status: 'active',
    verified: true,
    joined: '2023-10-20',
    lastActive: '45 minutes ago',
    avatar: 'CD',
  },
  {
    id: 7,
    name: 'Dr. Lisa Anderson',
    email: 'lisa.anderson@medflow.com',
    phone: '+1 (555) 789-0123',
    role: 'Doctor',
    status: 'suspended',
    verified: true,
    joined: '2024-02-05',
    lastActive: '1 week ago',
    avatar: 'LA',
    specialty: 'Pediatrics',
  },
  {
    id: 8,
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    phone: '+1 (555) 890-1234',
    role: 'Patient',
    status: 'flagged',
    verified: true,
    joined: '2024-01-30',
    lastActive: '2 days ago',
    avatar: 'RT',
  },
]

export const doctors = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    rating: 4.9,
    patients: 342,
    verified: true,
    license: 'MD-12345-CA',
    hospital: 'City General Hospital',
    status: 'active',
  },
  {
    id: 2,
    name: 'Dr. Michael Chen',
    specialty: 'Neurology',
    rating: 4.8,
    patients: 298,
    verified: true,
    license: 'MD-67890-CA',
    hospital: 'Metropolitan Medical Center',
    status: 'active',
  },
  {
    id: 3,
    name: 'Dr. Lisa Anderson',
    specialty: 'Pediatrics',
    rating: 4.7,
    patients: 415,
    verified: true,
    license: 'MD-24680-CA',
    hospital: "Children's Hospital",
    status: 'suspended',
  },
  {
    id: 4,
    name: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    rating: 4.9,
    patients: 267,
    verified: false,
    license: 'MD-13579-CA',
    hospital: 'Sports Medicine Clinic',
    status: 'pending',
  },
]

export const appointments = [
  {
    id: 'APT-2024-001',
    patient: 'John Martinez',
    doctor: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    date: '2026-04-24',
    time: '10:30 AM',
    status: 'completed',
    type: 'in-person',
  },
  {
    id: 'APT-2024-002',
    patient: 'Emma Wilson',
    doctor: 'Dr. Michael Chen',
    specialty: 'Neurology',
    date: '2026-04-24',
    time: '2:00 PM',
    status: 'scheduled',
    type: 'video',
  },
  {
    id: 'APT-2024-003',
    patient: 'Robert Taylor',
    doctor: 'Dr. Lisa Anderson',
    specialty: 'Pediatrics',
    date: '2026-04-24',
    time: '11:15 AM',
    status: 'cancelled',
    type: 'in-person',
  },
  {
    id: 'APT-2024-004',
    patient: 'Maria Garcia',
    doctor: 'Dr. James Wilson',
    specialty: 'Orthopedics',
    date: '2026-04-25',
    time: '9:00 AM',
    status: 'scheduled',
    type: 'in-person',
  },
]

export const supportTickets = [
  {
    id: 'TKT-001',
    user: 'Emma Wilson',
    subject: 'Unable to book appointment',
    category: 'Technical',
    priority: 'high',
    status: 'open',
    created: '2026-04-24 09:30 AM',
    assigned: 'Admin Team',
  },
  {
    id: 'TKT-002',
    user: 'Dr. Sarah Johnson',
    subject: 'Prescription upload failed',
    category: 'Bug',
    priority: 'critical',
    status: 'in-progress',
    created: '2026-04-23 03:45 PM',
    assigned: 'Tech Support',
  },
  {
    id: 'TKT-003',
    user: 'John Martinez',
    subject: 'Payment not reflected',
    category: 'Billing',
    priority: 'medium',
    status: 'resolved',
    created: '2026-04-22 11:20 AM',
    assigned: 'Finance Team',
  },
]

export const placeholderPages = {
  patients: {
    title: 'Patient Management',
    description: 'Monitor patient history, profile quality, flagged cases, support load, and medical activity.',
    highlights: ['38,942 registered patients', '214 flagged cases require review', '96.2% profile completion'],
  },
  pharmacies: {
    title: 'Pharmacy Management',
    description: 'Control pharmacy verification, fulfillment performance, and medication delivery operations.',
    highlights: ['342 active pharmacies', '11 pending verifications', '97.4% fulfillment success rate'],
  },
  diagnostics: {
    title: 'Diagnostic Management',
    description: 'Track lab turnaround time, report delivery health, and diagnostic partner performance.',
    highlights: ['156 diagnostic labs onboarded', '95.2% Cloudinary delivery health', '18 delayed report cases'],
  },
  prescriptions: {
    title: 'Prescription Monitoring',
    description: 'Review prescription flows, unusual activity, and document delivery reliability.',
    highlights: ['156 pending prescriptions', '14 suspicious activity flags', '98.1% document delivery success'],
  },
  reports: {
    title: 'Reports Monitoring',
    description: 'Observe upload trends, patient downloads, and abnormal report delays from one central screen.',
    highlights: ['892 lab reports generated', '42 download retries', '7 failed uploads awaiting retry'],
  },
  notifications: {
    title: 'Notifications Center',
    description: 'Prepare broadcasts, emergency communications, and channel-level delivery monitoring.',
    highlights: ['5 unread critical alerts', '99.7% push delivery', '12 scheduled campaigns'],
  },
  payments: {
    title: 'Payments & Billing',
    description: 'Track revenue, refunds, payment failures, and financial risk signals across the platform.',
    highlights: ['$284.5K monthly revenue', '9 failed payments today', '3 refunds pending review'],
  },
  audit: {
    title: 'Audit Logs',
    description: 'Inspect sensitive admin actions, role changes, security-sensitive updates, and anomalies.',
    highlights: ['1,248 admin actions logged', '3 high-risk changes today', 'Export ready'],
  },
  roles: {
    title: 'Roles & Permissions',
    description: 'Manage admin roles, protected actions, and granular permission matrices for MedFlow operations.',
    highlights: ['6 active roles', '14 protected modules', '2 pending access reviews'],
  },
  cms: {
    title: 'CMS / Content',
    description: 'Manage platform copy, announcements, legal pages, and help content from one control layer.',
    highlights: ['24 managed content blocks', '3 pending approvals', '8 recent edits'],
  },
  settings: {
    title: 'System Settings',
    description: 'Configure platform-wide auth, onboarding, upload, and notification settings.',
    highlights: ['Auth policy active', 'Maintenance mode off', '12 integration switches available'],
  },
  integrations: {
    title: 'Integrations',
    description: 'Review external services, API bindings, and channel health for MedFlow infrastructure.',
    highlights: ['7 integrations connected', 'Cloudinary degraded', 'Railway backend healthy'],
  },
  security: {
    title: 'Security',
    description: 'Review suspicious login behavior, credential policies, and platform hardening controls.',
    highlights: ['0 active incidents', '21 failed logins today', 'MFA rollout not available right now'],
  },
} as const

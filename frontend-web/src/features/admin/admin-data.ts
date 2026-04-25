import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Bell,
  Building2,
  HeartPulse,
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
  { label: 'Patients', path: '/admin/patients', icon: HeartPulse },
  { label: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
  { label: 'Pharmacies', path: '/admin/pharmacies', icon: Building2 },
  { label: 'Diagnostics', path: '/admin/diagnostics', icon: Activity },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Audit Logs', path: '/admin/audit', icon: Shield },
  { label: 'Integrations', path: '/admin/integrations', icon: Plug },
  { label: 'Admin Profile', path: '/admin/profile', icon: Settings },
]

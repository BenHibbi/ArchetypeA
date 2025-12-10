import { LayoutDashboard, Users, Sparkles, Settings } from 'lucide-react'

export const STUDIO_NAV = [
  {
    title: 'Dashboard',
    href: '/studio',
    icon: LayoutDashboard,
  },
  {
    title: 'Clients',
    href: '/studio/clients',
    icon: Users,
  },
  {
    title: 'Prompts',
    href: '/studio/prompts',
    icon: Sparkles,
  },
  {
    title: 'Paramètres',
    href: '/studio/settings',
    icon: Settings,
  },
] as const

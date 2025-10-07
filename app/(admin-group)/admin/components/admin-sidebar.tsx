"use client"

import { useUser } from "@/lib/UserContext"
import { Calendar, Users, Scissors, Settings, BarChart3, UserCheck, Shield, Home, Tag, Star, Crown } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { can } from "@/lib/permissions"

export function AdminSidebar() {
  const { user } = useUser()
  const pathname = usePathname()

  const menuItems = [
    {
      title: "Tableau de Bord",
      url: "/admin",
      icon: Home,
      permission: "Voir Tableau de Bord",
    },
    {
      title: "Specialites",
      url: "/admin/specialites",
      icon: Star,
      permission: "Voir Specialites",
    },
    {
      title: "Catégories",
      url: "/admin/categories",
      icon: Tag,
      permission: "Voir Catégories",
    },
    {
      title: "Services",
      url: "/admin/services",
      icon: Scissors,
      permission: "Voir Services",
    },
    {
      title: "Clients",
      url: "/admin/users",
      icon: Users,
      permission: "Voir Clients",
    },
    {
      title: "Employés",
      url: "/admin/employees",
      icon: UserCheck,
      permission: "Voir Employés",
    },
    {
      title: "Rendez-vous",
      url: "/admin/appointments",
      icon: Calendar,
      permission: "Voir Rendez-vous",
    },
    {
      title: "Forfaits",
      url: "/admin/forfaits",
      icon: BarChart3,
      permission: "Voir Forfaits",
    },
    {
      title: "Rôles",
      url: "/admin/roles",
      icon: Crown,
      permission: "Voir Rôles",
    },
    {
      title: "Permissions",
      url: "/admin/permissions",
      icon: Shield,
      permission: "Voir Permissions",
    },
    {
      title: "Paramètres",
      url: "/admin/settings",
      icon: Settings,
      permission: "Voir Paramètres",
    },
  ]

  return (
    <Sidebar className="border-r border-[rgb(135,169,107)]/20">
      <SidebarHeader className="p-6 bg-gradient-to-r from-[rgb(135,169,107)] to-[rgb(135,169,107)]/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <Scissors className="w-6 h-6 text-[rgb(135,169,107)]" />
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">Beauty Salon</h2>
            <p className="text-white/80 text-sm">Administration</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[rgb(135,169,107)] font-semibold">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) =>
                can(user, item.permission) ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={cn(
                        "hover:bg-[rgb(135,169,107)]/10 hover:text-[rgb(135,169,107)]",
                        pathname === item.url && "bg-[rgb(135,169,107)]/15 text-[rgb(135,169,107)] font-medium",
                      )}
                    >
                      <Link href={item.url}>
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

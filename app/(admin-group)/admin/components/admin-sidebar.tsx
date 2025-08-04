"use client"

import { Calendar, Users, Scissors, Settings, BarChart3, UserCheck, Shield, Home, Tag } from "lucide-react"
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

const menuItems = [
  {
    title: "Tableau de Bord",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Clients",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Employés",
    url: "/admin/employees",
    icon: UserCheck,
  },
  {
    title: "Catégories",
    url: "/admin/categories",
    icon: Tag,
  },
  {
    title: "Services",
    url: "/admin/services",
    icon: Scissors,
  },
  {
    title: "Rendez-vous",
    url: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Forfaits",
    url: "/admin/forfaits",
    icon: BarChart3,
  },
  {
    title: "Rôles & Permissions",
    url: "/admin/roles",
    icon: Shield,
  },
  {
    title: "Paramètres",
    url: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

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
              {menuItems.map((item) => (
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
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

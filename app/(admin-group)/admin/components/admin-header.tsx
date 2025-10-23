"use client"

import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AdminHeader() {
  return (
    <header className="border-b border-[rgb(135,169,107)]/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3">
        {/* SECTION GAUCHE */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <SidebarTrigger />
          
          {/* Barre de recherche responsive */}
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Rechercher..."
              className="pl-10 w-full sm:w-64 md:w-80 border-[rgb(135,169,107)]/30 focus:border-[rgb(135,169,107)] transition-all"
            />
          </div>
        </div>

        {/* SECTION DROITE */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Icône notifications (facultatif) */}
          <Button variant="ghost" size="icon" className="hidden sm:flex relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          </Button>

          {/* Menu utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3">
                <div className="w-8 h-8 bg-[rgb(135,169,107)] rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="font-medium hidden sm:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Déconnexion</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

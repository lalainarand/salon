// components/CreateAppointmentDialog.tsx
"use client"

import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select"
import { useState } from "react"

export function CreateAppointmentDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rendez-vous
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Créer un nouveau rendez-vous</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer un nouveau rendez-vous
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="marie">Marie Dubois</SelectItem>
                <SelectItem value="jean">Jean Martin</SelectItem>
                <SelectItem value="anna">Anna Leroy</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coupe">Coupe + Brushing</SelectItem>
                <SelectItem value="coloration">Coloration</SelectItem>
                <SelectItem value="barbe">Barbe</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Employé</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sophie">Sophie Martin</SelectItem>
                <SelectItem value="marie">Marie Rousseau</SelectItem>
                <SelectItem value="pierre">Pierre Durand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" />
          </div>
          <div className="space-y-2">
            <Label>Heure</Label>
            <Input type="time" />
          </div>
          <div className="space-y-2">
            <Label>Durée</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Durée estimée" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 heure</SelectItem>
                <SelectItem value="90">1h30</SelectItem>
                <SelectItem value="120">2 heures</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Notes</Label>
            <Textarea placeholder="Notes additionnelles..." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Annuler
          </Button>
          <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
            Créer le rendez-vous
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

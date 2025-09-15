"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select"
import type { AppointmentFormType, User, Employees, Service } from "@/app/(admin-group)/admin/Types/appointment"



interface AddAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: AppointmentFormType | null
  onSubmit: (data: AppointmentFormType) => void
  mode?: "add" | "edit"
  services: Service[]
  users: User[]
  employees: Employees[]
}

export default function AddAppointmentDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode = "add",
  services,
  users,
  employees
}: AddAppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentFormType>(() => {
    if (mode === "edit" && initialData) {
      return initialData
    }

    // Pour le mode "add", on initialise avec des valeurs vides
    return {
      id: Date.now(),
      user: null,
      service: null,
      employee: null,
      date: "",
      time: "",
      duration: "60",
      status: "en_attente",
      notes: "",
    }
  })

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm(initialData)
      console.log('form edition', initialData)
    } else if (mode === "add") {
      // Reset le formulaire pour un nouveau rendez-vous
      setForm({
        id: Date.now(),
        user: null,
        service: null,
        employee: null,
        date: "",
        time: "",
        duration: "60",
        status: "en_attente",
        notes: "",
      })
    }
  }, [initialData, mode, open])

  const handleChange = <K extends keyof AppointmentFormType>(key: K, value: AppointmentFormType[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    console.log('form', form);
  }

  const handleSubmit = () => {
    if (!form.user || !form.service || !form.date || !form.time) {
      alert("Veuillez remplir tous les champs obligatoires")
      return
    }
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Modifier" : "Créer"} un rendez-vous</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les informations existantes"
              : "Remplissez les champs pour ajouter un rendez-vous"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">

          {/* Client */}
          <div className="space-y-2">
            <Label>Client *</Label>
            <Select
              value={form.user?.id ? form.user.id.toString() : ""}
              onValueChange={(value) => {
                const selected = users.find((u) => u.id.toString() === value)
                if (selected) {
                  handleChange("user", selected)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id.toString()}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Téléphone */}
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              value={form.user?.phone.toString() || ""}
              placeholder="Sélectionnez d'abord un client"
              readOnly
            />
          </div>

          {/* Service */}
          <div className="space-y-2">
            <Label>Service *</Label>
            <Select
              value={form.service?.id ? form.service.id.toString() : ""}
              onValueChange={(value) => {
                const selected = services.find((s) => s.id.toString() === value)
                if (selected) {
                  handleChange("service", selected) // met à jour le service sélectionné dans le form
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((serv) => (
                  <SelectItem key={serv.id} value={serv.id.toString()}>
                    {serv.nom} {/* ici on affiche le champ nom de l'API */}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Prix */}
          <div className="space-y-2">
            <Label>Prix (Ar)</Label>
            <Input
              type="number"
              value={form.service?.prix || ""}
              placeholder="Sélectionnez d'abord un service"
              readOnly
            />
          </div>


          <div className="space-y-2">
            <div className="space-y-2">
              <Label htmlFor="employee">Employé</Label>
              <Select
                value={form.employee?.id ? form.employee.id.toString() : ""}
                onValueChange={(value) => {
                  const selected = employees.find((u) => u.id.toString() === value)
                  if (selected) {
                    handleChange("employee", selected)
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee?.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

            </div>
          </div>

          <div className="space-y-2">
            <Label>Poste</Label>
            <Input
              type="text"
              value={
                form.employee?.employe?.poste
                  ? form.employee.employe.poste
                  : form.employee?.poste ?? ""
              }
              placeholder="Sélectionnez d'abord un employé"
              readOnly
            />
          </div>


          {/* Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          {/* Heure */}
          <div className="space-y-2">
            <Label>Heure *</Label>
            <Input
              type="time"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="col-span-2 space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={form.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Ajouter des notes optionnelles..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Modifier" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
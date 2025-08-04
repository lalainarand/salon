"use client"

import { useState, useEffect } from "react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem
} from "@/components/ui/select"


type AppointmentType = {
  id: number
  client: string
  phone: string
  service: string
  employee: string
  date: string
  time: string
  duration: string
  price: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "modified" | "rescheduled"
  notes?: string
}


interface AddAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: AppointmentType | null
  onSubmit: (data: AppointmentType) => void
  mode?: "add" | "edit"
  services: string[]
  employees: string[]
}


export default function AddAppointmentDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode = "add",
  services,
  employees,
}: AddAppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentType>({
    id: initialData?.id ?? Date.now(),
    client: initialData?.client ?? "",
    phone: initialData?.phone ?? "",
    service: initialData?.service ?? "",
    employee: initialData?.employee ?? "",
    date: initialData?.date ?? "",
    time: initialData?.time ?? "",
    duration: initialData?.duration ?? "60",
    price: initialData?.price ?? "0",
    notes: initialData?.notes ?? "",
    status: initialData?.status ?? "pending"
  })

  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData])

  const handleChange = (field: keyof AppointmentType, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSubmit(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Modifier" : "Créer"} un rendez-vous</DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "Modifiez les informations existantes" : "Remplissez les champs pour ajouter un rendez-vous"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Client</Label>
            <Input value={form.client} onChange={(e) => handleChange("client", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Service</Label>
            <Select
              value={form.service}
              onValueChange={(value) => handleChange("service", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((serv) => (
                  <SelectItem key={serv} value={serv}>{serv}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Employé</Label>
            <Select
              value={form.employee}
              onValueChange={(value) => handleChange("employee", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp} value={emp}>{emp}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Heure</Label>
            <Input type="time" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Durée</Label>
            <Select value={form.duration} onValueChange={(value) => handleChange("duration", value)}>
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
          <div className="space-y-2">
            <Label>Prix (€)</Label>
            <Input type="number" value={form.price} onChange={(e) => handleChange("price", e.target.value)} />
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Notes</Label>
            <Textarea value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90" onClick={handleSubmit}>
            {mode === "edit" ? "Modifier" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

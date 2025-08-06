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
  phone: number
  service: string
  employee: string
  date: string
  time: string
  duration: string
  price: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "modified" | "rescheduled"
  notes?: string
}

interface User {
  id: number
  name: string
  phone: number
}

interface Service {
  id: number
  name: string
  price: number
}




interface AddAppointmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: AppointmentType | null
  onSubmit: (data: AppointmentType) => void
  mode?: "add" | "edit"
  services: Service[]
  users: User[]

}


export default function AddAppointmentDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode = "add",
  services,
  users,
}: AddAppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentType>({
    id: initialData?.id ?? Date.now(),
    client: initialData?.client ?? "",
    phone: initialData?.phone ?? 0,
    service: initialData?.service ?? "",
    employee: initialData?.employee ?? "",
    date: initialData?.date ?? "",
    time: initialData?.time ?? "",
    duration: initialData?.duration ?? "60",
    price: initialData?.price ?? "0",
    notes: initialData?.notes ?? "",
    status: initialData?.status ?? "pending"
  })

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [phone, setPhone] = useState<number>(0)


  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData])

  useEffect(() => {
    const user = users.find((u) => u.id === selectedUserId)
    if (user) {
      setPhone(user.phone)
    }
  }, [selectedUserId, users])

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
            <Select
              value={form.client}
              onValueChange={(value) => {
                const selected = users.find((u) => u.name === value)
                if (selected) {
                  handleChange("client", selected.name)
                  handleChange("phone", String(selected.phone))
                  setSelectedUserId(selected.id)
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.name}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Service</Label>
            <Select
              value={form.service}
              onValueChange={(value) => {
                handleChange("service", value);
                const selected = services.find((s) => s.name === value);
                if (selected) {
                  handleChange("price", String(selected.price));
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((serv) => (
                  <SelectItem key={serv.id} value={serv.name}>
                    {serv.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>



          <div className="space-y-2">
            <Label>Prix (Ar)</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Input type="date" value={form.date} onChange={(e) => handleChange("date", e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Heure</Label>
            <Input type="time" value={form.time} onChange={(e) => handleChange("time", e.target.value)} />
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


"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: any
  roles: string[]
  specialties: string[]
  mode?: "add" | "edit"
}

export default function EmployeeFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  roles,
  specialties,
  mode = "add",
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    hireDate: "",
    schedule: "",
    specialties: [] as string[],
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role: initialData.role || "",
        hireDate: initialData.hireDate?.slice(0, 10) || "", // format yyyy-mm-dd
        schedule: initialData.schedule || "",
        specialties: initialData.specialties || [],
      })
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        role: "",
        hireDate: "",
        schedule: "",
        specialties: [],
      })
    }
  }, [initialData, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    const data = {
      ...form,
      id: initialData?.id, // utile pour édition
    }
    onSubmit(data)
    onOpenChange(false)
  }

  const handleSpecialtyToggle = (spec: string) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(spec)
        ? prev.specialties.filter((s) => s !== spec)
        : [...prev.specialties, spec],
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier l'employé" : "Ajouter un nouvel employé"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les informations de l'employé."
              : "Remplissez les informations du nouvel employé."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input name="name" value={form.name} onChange={handleChange} placeholder="Nom et prénom" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} placeholder="email@salon.com" />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} placeholder="06 12 34 56 78" />
          </div>
          <div className="space-y-2">
            <Label>Poste</Label>
            <Select value={form.role} onValueChange={(value) => setForm((p) => ({ ...p, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un poste" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role.toLowerCase()}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Date d'embauche</Label>
            <Input name="hireDate" type="date" value={form.hireDate} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Horaire</Label>
            <Select value={form.schedule} onValueChange={(v) => setForm((p) => ({ ...p, schedule: v }))}>
              <SelectTrigger>
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full-time">Temps plein</SelectItem>
                <SelectItem value="part-time">Temps partiel</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Spécialités</Label>
            <div className="grid grid-cols-3 gap-2">
              {specialties.map((s) => (
                <label key={s} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.specialties.includes(s)}
                    onChange={() => handleSpecialtyToggle(s)}
                  />
                  <span className="text-sm">{s}</span>
                </label>
              ))}
            </div>
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
            {mode === "edit" ? "Modifier" : "Créer l'employé"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

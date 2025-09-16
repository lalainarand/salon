"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Specialty = {
  id: number
  nom: string
  created_at?: string
  updated_at?: string
}

type Role = {
  id: number
  nom: string
  couleur?: string
  description?: string
}

type EmployeeFormData = {
  name: string
  email: string
  phone: string
  role_id: number | null
  hireDate: string
  schedule: string
  specialties: number[]
}

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => void
  initialData?: any
  roles: Role[]
  specialties: Specialty[]
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
  const [form, setForm] = useState<EmployeeFormData>({
    name: "",
    email: "",
    phone: "",
    role_id: null,
    hireDate: "",
    schedule: "",
    specialties: [],
  })

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        role_id: initialData.role?.id || null,
        hireDate: initialData.hireDate?.slice(0, 10) || "",
        schedule: initialData.schedule || "",
        specialties: initialData.specialties?.map((s: any) => s.id) || [],
      })
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        role_id: null,
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
    onSubmit({ ...form, id: initialData?.id })
    onOpenChange(false)
  }

  const handleSpecialtyToggle = (id: number) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(id)
        ? prev.specialties.filter((sId) => sId !== id)
        : [...prev.specialties, id],
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
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nom et prénom"
            />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email@salon.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="06 12 34 56 78"
            />
          </div>
          <div className="space-y-2">
            <Label>Poste</Label>
            <Select
              value={form.role_id?.toString() || ""}
              onValueChange={(value) =>
                setForm((prev) => ({
                  ...prev,
                  role_id: value ? parseInt(value) : null,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un poste" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date d'embauche</Label>
            <Input
              name="hireDate"
              type="date"
              value={form.hireDate}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label>Horaire</Label>
            <Select
              value={form.schedule}
              onValueChange={(v) => setForm((prev) => ({ ...prev, schedule: v }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Type de contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temps_plein">Temps plein</SelectItem>
                <SelectItem value="temps_partiel">Temps partiel</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2 space-y-2">
            <Label>Spécialités</Label>
            <div className="grid grid-cols-3 gap-2">
              {specialties.map((s) => (
                <label key={s.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={form.specialties.includes(s.id)}
                    onChange={() => handleSpecialtyToggle(s.id)}
                  />
                  <span className="text-sm">{s.nom}</span>
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

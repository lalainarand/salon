"use client"

import api from "@/lib/api";
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
import type {
  AppointmentFormType,
  User,
  Employees,
  Service
} from "@/app/(admin-group)/admin/Types/appointment"

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
    if (mode === "edit" && initialData) return initialData

    return {
      id: Date.now(),
      user: null,
      service: null,
      employee: null,
      date: "",
      time: "",
      duration: "",
      status: "en_attente",
      notes: "",
      newclient: "",
    }
  })

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<User[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [phone, setPhone] = useState("")

  useEffect(() => {
    if (mode === "edit" && initialData) {
      const selected =
        initialData.service
          ? { ...initialData.service, type: "service" as const }
          : initialData.forfait
            ? { ...initialData.forfait, type: "forfait" as const }
            : null

      setForm({
        ...initialData,
        service: selected,
        forfait: null,
      })

      setQuery(initialData.user?.name || "")
      setPhone(initialData.user?.phone || "")
    } else if (mode === "add") {
      setForm({
        id: Date.now(),
        user: null,
        service: null,
        employee: null,
        date: "",
        time: "",
        duration: "",
        status: "en_attente",
        notes: "",
        forfait: null,
        newclient: "",
      })
      setQuery("")
      setPhone("")
    }
  }, [initialData, mode, open])

  const handleChange = <K extends keyof AppointmentFormType>(
    key: K,
    value: AppointmentFormType[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  // 🔍 Recherche client existant
  useEffect(() => {
    if (query.length < 3) {
      setResults([])
      setShowDropdown(false)
      return
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await api.get(`/api/users/search?q=${query}`)
        setResults(res.data)
        setShowDropdown(true)
      } catch (error) {
        console.error("Erreur recherche client :", error)
      }
    }, 300)


    return () => clearTimeout(timeout)
  }, [query])

  const handleSelectUser = (user: User) => {
    handleChange("user", user)
    setQuery(user.name)
    setPhone(user.phone || "")
    setShowDropdown(false)
  }

  // ⚙️ Vérifie si le formulaire est complet
  const isFormValid =
    (form.user || (query.trim() && phone.trim())) &&
    form.service &&
    form.date &&
    form.time &&
    phone.trim().length >= 3

  const handleSubmit = () => {
    if (!isFormValid) return

    if (!form.user) {
      handleChange("newclient", query)
      form.user = {
        id: 0,
        name: query,
        phone,
      } as unknown as User
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
          {/* 👤 Client */}
          <div className="relative space-y-2">
            <Label>Client *</Label>
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setShowDropdown(true)
                handleChange("user", null)
              }}
              placeholder="Entrez le nom ou téléphone"
              autoComplete="off"
            />

            {showDropdown && results.length > 0 && (
              <ul className="absolute z-10 bg-white border rounded-md w-full shadow-md mt-1 max-h-48 overflow-auto">
                {results.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleSelectUser(user)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {user.name} — {user.phone}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* 📞 Téléphone */}
          <div className="space-y-2">
            <Label>Téléphone *</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Numéro de téléphone"
              readOnly={!!form.user} // lecture seule si client existant
              required
            />
          </div>

          {/* 🧴 Service */}
          <div className="space-y-2">
            <Label>Service ou Forfait *</Label>
            <Select
              value={form.service?.id?.toString() || ""}
              onValueChange={(value) => {
                const selected = services.find((s) => s.id.toString() === value)
                if (selected) handleChange("service", selected)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un service ou forfait" />
              </SelectTrigger>
              <SelectContent className="max-h-60 overflow-y-auto">
                {services.map((serv) => (
                  <SelectItem key={serv.id} value={serv.id.toString()}>
                    <span className="font-medium">{serv.nom}</span>{" "}
                    <span className="text-xs text-gray-400">
                      ({serv.type === "service" ? "Service" : "Forfait"})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 💰 Prix */}
          <div className="space-y-2">
            <Label>Prix (Ar)</Label>
            <Input
              type="number"
              value={form.service?.prix || ""}
              placeholder="Sélectionnez d'abord un service ou forfait"
              readOnly
            />
          </div>

          {/* 👩 Employé */}
          <div className="space-y-2">
            <Label>Employé</Label>
            <Select
              value={form.employee?.id?.toString() || ""}
              onValueChange={(value) => {
                const selected = employees.find((e) => e.id.toString() === value)
                if (selected) handleChange("employee", selected)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un employé" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id.toString()}>
                    {emp.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 📅 Date */}
          <div className="space-y-2">
            <Label>Date *</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          {/* ⏰ Heure */}
          <div className="space-y-2">
            <Label>Heure *</Label>
            <Input
              type="time"
              value={form.time}
              onChange={(e) => handleChange("time", e.target.value)}
            />
          </div>

          {/* 📝 Notes */}
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
            disabled={!isFormValid} // 🔒 désactivé tant que formulaire incomplet
          >
            {mode === "edit" ? "Modifier" : "Créer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

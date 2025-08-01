"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Plus } from "lucide-react"

export interface ClientData {
  id?: number // facultatif pour l’ajout
  name: string
  email: string
  phone: string
  birthdate: string
  address: string
}

interface AddClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: ClientData
  onSubmit: (data: ClientData) => void
  mode?: "add" | "edit"
  triggerButton?: React.ReactNode
}

export default function AddClientDialog({
  open,
  onOpenChange,
  initialData,
  onSubmit,
  mode = "add",
  triggerButton,
}: AddClientDialogProps) {
  const [formData, setFormData] = useState<ClientData>({
    name: "",
    email: "",
    phone: "",
    birthdate: "",
    address: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        birthdate: "",
        address: "",
      })
    }
  }, [initialData, open])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
    setFormData({
      name: "",
      email: "",
      phone: "",
      birthdate: "",
      address: "",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier le client" : "Ajouter un nouveau client"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Mettez à jour les informations du client"
              : "Remplissez les informations du nouveau client"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              name="name"
              placeholder="Nom et prénom"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              placeholder="email@exemple.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              name="phone"
              placeholder="06 12 34 56 78"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthdate">Date de naissance</Label>
            <Input
              name="birthdate"
              type="date"
              value={formData.birthdate}
              onChange={handleChange}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              name="address"
              placeholder="Adresse complète"
              value={formData.address}
              onChange={handleChange}
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
            {mode === "edit" ? "Mettre à jour" : "Créer le client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

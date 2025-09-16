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
import { Checkbox } from "@/components/ui/checkbox"

// Type des services avec id et nom pour manipulation côté API
export interface ServiceOption {
  id: number
  nom: string
}

export interface PackageType {
  id: number
  nom: string
  prix: number
  services: ServiceOption[]
  statut: boolean
}

interface AddPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<PackageType, "id" | "statut">) => void
  initialData?: PackageType | null
  mode?: "add" | "edit"
  allServices: ServiceOption[]
}

export default function AddPackageDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  mode = "add",
  allServices,
}: AddPackageDialogProps) {
  const [name, setName] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [selectedServices, setSelectedServices] = useState<ServiceOption[]>([])

  // Pré-remplir les champs si on édite
  useEffect(() => {
    if (initialData) {
      setName(initialData.nom)
      setPrice(initialData.prix)
      setSelectedServices(initialData.services)
    } else {
      setName("")
      setPrice(0)
      setSelectedServices([])
    }
  }, [initialData, open])

  const handleServiceToggle = (service: ServiceOption, checked: boolean) => {
    setSelectedServices((prev) =>
      checked
        ? [...prev, service]
        : prev.filter((s) => s.id !== service.id)
    )
  }

  const handleSubmit = () => {
    onSubmit({
      nom: name,
      prix: price,
      services: selectedServices,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier le forfait" : "Créer un nouveau forfait"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les informations du forfait."
              : "Remplissez les détails du nouveau forfait."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nom du forfait</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Forfait Détente"
            />
          </div>

          <div className="space-y-2">
            <Label>Prix (Ar)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              placeholder="Ex: 80"
            />
          </div>

          <div className="space-y-2">
            <Label>Services inclus</Label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
              {allServices.map((service) => (
                <div key={service.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={selectedServices.some((s) => s.id === service.id)}
                    onCheckedChange={(checked) =>
                      handleServiceToggle(service, checked as boolean)
                    }
                  />
                  <Label htmlFor={`service-${service.id}`} className="text-sm">
                    {service.nom}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button
            className="bg-[rgb(156,183,132)] hover:bg-[rgb(156,183,132)]/90"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Sauvegarder les modifications" : "Créer le forfait"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

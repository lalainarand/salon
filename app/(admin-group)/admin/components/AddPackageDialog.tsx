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

export type PackageType = {
  id: number
  name: string
  price: number
  services: string[]
  active: boolean
}

interface AddPackageDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Omit<PackageType, "id" | "active">) => void
  initialData?: PackageType | null
  mode?: "add" | "edit"
  allServices: string[]
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
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setPrice(initialData.price)
      setSelectedServices(initialData.services)
    } else {
      setName("")
      setPrice(0)
      setSelectedServices([])
    }
  }, [initialData, open])

  const handleServiceToggle = (service: string, checked: boolean) => {
    setSelectedServices((prev) =>
      checked ? [...prev, service] : prev.filter((s) => s !== service)
    )
  }

  const handleSubmit = () => {
    onSubmit({ name, price, services: selectedServices })
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
            <Label>Prix (€)</Label>
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
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={selectedServices.includes(service)}
                    onCheckedChange={(checked) =>
                      handleServiceToggle(service, checked as boolean)
                    }
                  />
                  <Label htmlFor={service} className="text-sm">
                    {service}
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

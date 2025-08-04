"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

export interface ServiceFormValues {
  name: string
  category: string
  duration: number
  price: number
  description: string
}

export interface ServiceType extends ServiceFormValues {
  id: number
  status: number
  popularity: number
}

interface AddServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: ServiceFormValues) => void
  categories: string[]
  mode?: "add" | "edit"
  initialData?: ServiceType | null
}

export const AddServiceDialog = ({
  open,
  onOpenChange,
  onSubmit,
  categories,
  mode = "add",
  initialData,
}: AddServiceDialogProps) => {
  const [formData, setFormData] = useState<ServiceFormValues>({
    name: "",
    category: "",
    duration: 0,
    price: 0,
    description: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        category: initialData.category || "",
        duration: initialData.duration || 0,
        price: initialData.price || 0,
        description: initialData.description || "",
      })
    } else {
      setFormData({
        name: "",
        category: "",
        duration: 0,
        price: 0,
        description: "",
      })
    }
  }, [initialData])

  const handleChange = (field: keyof ServiceFormValues, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: typeof value === "string" && field !== "description" ? value.trimStart() : value,
    }))
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Modifier le service" : "Créer un nouveau service"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les détails du service sélectionné."
              : "Ajoutez un nouveau service à votre catalogue."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du service</Label>
            <Input
              id="name"
              placeholder="Ex: Coupe + Brushing"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Durée (minutes)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="60"
              value={formData.duration}
              onChange={(e) => handleChange("duration", Number(e.target.value))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              placeholder="45"
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
          </div>
          <div className="col-span-2 space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description détaillée du service..."
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
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
            {mode === "edit" ? "Enregistrer les modifications" : "Créer le service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useEffect, useState } from "react"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

interface AddRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: {
    name: string
    color: string
    description: string
    permissions: string[]
  }) => void
  allPermissions: {
    category: string
    permissions: { key: string; label: string }[]
  }[]
  initialData?: {
    id: number
    name: string
    description: string
    usersCount: number
    permissions: string[]
    color: string
    createdAt: string
  } | null
  mode?: "add" | "edit"
}

export default function AddRoleDialog({
  open,
  onOpenChange,
  onSubmit,
  allPermissions,
  initialData,
  mode = "add"
}: AddRoleDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState("#059669")
  const [description, setDescription] = useState("")
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // Pré-remplissage lors de l'ouverture en mode édition
  useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setColor(initialData.color)
      setDescription(initialData.description)
      setSelectedPermissions(initialData.permissions)
    } else {
      setName("")
      setColor("#059669")
      setDescription("")
      setSelectedPermissions([])
    }
  }, [initialData, open])

  const handlePermissionToggle = (key: string, checked: boolean) => {
    setSelectedPermissions((prev) =>
      checked ? [...prev, key] : prev.filter((p) => p !== key)
    )
  }

  const handleSubmit = () => {
    onSubmit({ name, color, description, permissions: selectedPermissions })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Modifier un rôle" : "Créer un nouveau rôle"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Modifiez les détails du rôle existant"
              : "Définissez un nouveau rôle avec ses permissions"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nom du rôle</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Couleur</Label>
              <Input
                type="color"
                className="w-full h-10"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description du rôle et de ses responsabilités..."
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Permissions</Label>
            {allPermissions.map((category) => (
              <div key={category.category} className="space-y-3">
                <h4 className="font-medium text-sm text-gray-700 border-b pb-1">
                  {category.category}
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {category.permissions.map((permission) => (
                    <div key={permission.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.key}
                        checked={selectedPermissions.includes(permission.key)}
                        onCheckedChange={(checked) =>
                          handlePermissionToggle(permission.key, checked as boolean)
                        }
                      />
                      <Label
                        htmlFor={permission.key}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {permission.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
            {mode === "edit" ? "Sauvegarder les modifications" : "Créer le rôle"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

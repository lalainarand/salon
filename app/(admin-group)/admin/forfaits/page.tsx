"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import { Switch } from "@/components/ui/switch"
import AddPackageDialog from "@/app/(admin-group)/admin/components/AddPackageDialog"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

// ✅ Définition du type
type PackageType = {
  id: number
  name: string
  price: number
  services: string[]
  active: boolean
}

const initialPackages: PackageType[] = [
  {
    id: 1,
    name: "Forfait Détente",
    price: 80,
    services: ["Massage", "Spa", "Gommage"],
    active: true,
  },
  {
    id: 2,
    name: "Forfait Glamour",
    price: 120,
    services: ["Coiffure", "Manucure", "Maquillage"],
    active: true,
  },
  {
    id: 3,
    name: "Forfait Prestige",
    price: 180,
    services: ["Soin du visage", "Massage", "Pédicure"],
    active: false,
  },
]

const allServices = [
  "Massage Relaxant",
  "Soin du Visage",
  "Manucure",
  "Pédicure",
  "Épilation",
  "Shampoing & Brushing",
  "Coupe & Coiffure",
  "Coloration",
]

export default function ForfaitPage() {
  const [packages, setPackages] = useState<PackageType[]>(initialPackages)
  const [selectedPackage, setSelectedPackage] = useState<PackageType | null>(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openToggleDialog, setOpenToggleDialog] = useState(false)
  const [packageToDelete, setPackageToDelete] = useState<PackageType | null>(null)
  const [packageToToggle, setPackageToToggle] = useState<PackageType | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  const handleDeleteClick = (pkg: PackageType) => {
    setPackageToDelete(pkg)
    setOpenDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    if (!packageToDelete) return
    setPackages((prev) => prev.filter((p) => p.id !== packageToDelete.id))
    showSuccess(`Suppression de forfait succès`)
    setOpenDeleteDialog(false)
  }

  const handleToggleClick = (pkg: PackageType) => {
    setPackageToToggle(pkg)
    setOpenToggleDialog(true)
  }

  const handleConfirmToggle = () => {
    if (!packageToToggle) return
    setPackages((prev) =>
      prev.map((p) => (p.id === packageToToggle.id ? { ...p, active: !p.active } : p))
    )
    setOpenToggleDialog(false)
  }

  const handleSave = (data: Omit<PackageType, "id" | "active">) => {
    if (selectedPackage) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === selectedPackage.id ? { ...data, id: selectedPackage.id, active: selectedPackage.active } : p
        )
      )
      showSuccess(`Modification de  forfait ${data?.name} succès`)


    } else {
      setPackages((prev) => [
        ...prev,
        { ...data, id: Date.now(), active: true },
      ])
      showSuccess(`Création de nouveau forfait ${data?.name} succès`)
    }
    setOpenDialog(false)
    setSelectedPackage(null)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Forfaits</h1>
          <p className="text-gray-600">Créez et gérez les packs de services</p>
        </div>
        <Button
          className="bg-[rgb(156,183,132)] hover:bg-[rgb(156,183,132)]/90"
          onClick={() => {
            setSelectedPackage(null)
            setOpenDialog(true)
          }}
        >
          <Plus className="w-4 h-4 mr-2" /> Nouveau Forfait
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.id} className="hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{pkg.name}</CardTitle>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={pkg.active}
                    onCheckedChange={() => handleToggleClick(pkg)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedPackage(pkg)
                      setOpenDialog(true)
                    }}
                  >
                <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteClick(pkg)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <CardDescription className="mt-1 text-sm text-gray-600">
                Prix : {pkg.price}€
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {pkg.services.map((s) => (
                  <Badge key={s} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddPackageDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSubmit={handleSave}
        initialData={selectedPackage}
        mode={selectedPackage ? "edit" : "add"}
        allServices={allServices}
      />

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
        title="Supprimer ce forfait ?"
        description="Cette action est définitive."
        toastMessage="Forfait supprimé avec succès."
      />

      <ConfirmToggleDialog
        open={openToggleDialog}
        onOpenChange={setOpenToggleDialog}
        onConfirm={handleConfirmToggle}
        title="Changer le statut du forfait"
        description="Voulez-vous vraiment changer le statut de ce forfait ?"
      />


      {/* Composant de notification */}
      <SuccessNotification
        show={notification.show}
        message={notification.message}
        onClose={hideNotification}
        duration={4000} // 4 secondes
      />
    </div>
  )
}

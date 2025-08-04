"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import { AddServiceDialog } from "@/app/(admin-group)/admin/components/AddServiceDialog"
import { ServiceType, ServiceFormValues } from "@/app/(admin-group)/admin/components/AddServiceDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Scissors, Clock, Euro } from "lucide-react"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"

const services = [
  {
    id: 1,
    name: "Coupe Femme",
    category: "Coiffure",
    description: "Coupe personnalisée avec shampoing et brushing",
    duration: 60,
    price: 45,
    status: "active",
    popularity: 85,
  },
  {
    id: 2,
    name: "Coloration Complète",
    category: "Coloration",
    description: "Coloration complète avec soin nourrissant",
    duration: 120,
    price: 80,
    status: "active",
    popularity: 70,
  },
  {
    id: 3,
    name: "Brushing",
    category: "Coiffure",
    description: "Brushing professionnel avec produits de qualité",
    duration: 30,
    price: 25,
    status: "active",
    popularity: 60,
  },
  {
    id: 4,
    name: "Coupe Homme",
    category: "Coiffure",
    description: "Coupe moderne avec finition à la tondeuse",
    duration: 30,
    price: 25,
    status: "active",
    popularity: 90,
  },
  {
    id: 5,
    name: "Barbe + Moustache",
    category: "Barbier",
    description: "Taille et mise en forme de la barbe",
    duration: 45,
    price: 35,
    status: "active",
    popularity: 75,
  },
  {
    id: 6,
    name: "Mèches",
    category: "Coloration",
    description: "Mèches avec technique au bonnet ou papier",
    duration: 90,
    price: 65,
    status: "inactive",
    popularity: 40,
  },
]

const categories = ["Coiffure", "Coloration", "Barbier", "Soins", "Maquillage"]

const getStatusBadge = (status: string) => {
  return status === "active" ? (
    <Badge className="bg-green-100 text-green-800">Actif</Badge>
  ) : (
    <Badge className="bg-gray-100 text-gray-800">Inactif</Badge>
  )
}

const getPopularityColor = (popularity: number) => {
  if (popularity >= 80) return "text-green-600"
  if (popularity >= 60) return "text-yellow-600"
  return "text-red-600"
}

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
  const [pendingService, setPendingService] = useState<ServiceType | null>(null)
  const [originalStatus, setOriginalStatus] = useState<"active" | "inactive" | null>(null)


  const handleDeleteClick = (id: number) => {
    setSelectedServiceId(id)
    setOpenDeleteDialog(true)
  }

  const handleToggleStatus = (service: ServiceType) => {
    setPendingService(service)
    setOriginalStatus(service.status as "active" | "inactive")
    setToggleDialogOpen(true)
  }

  const confirmToggleStatus = async () => {
    if (!pendingService) return

    try {
      const newStatus = pendingService.status === "active" ? "inactive" : "active"

      // 🔥 Appel à ton API pour modifier le statut
      console.log("Changement de statut pour ID", pendingService.id, "=>", newStatus)

      // ✅ Optionnel : mise à jour locale ou revalidation
      // revalidate(), mutate(), ou mise à jour manuelle du state si besoin

    } catch (error) {
      console.error("Erreur lors du changement de statut :", error)
    } finally {
      setToggleDialogOpen(false)
      setPendingService(null)
      setOriginalStatus(null)
    }
  }



  const handleSaveService = async (data: ServiceFormValues) => {
    try {
      if (selectedService) {
        // mode edit
        console.log("Mise à jour du service", selectedService.id, data)
        // Appelle API update
      } else {
        // mode add
        console.log("Création du service", data)
        // Appelle API create
      }

      setIsCreateDialogOpen(false)
      setSelectedService(null)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error)
    }
  }


  const handleConfirmDelete = async () => {
    if (selectedServiceId === null) return
    try {
      // 🔥 Ici, appelle ta logique de suppression API ou mutation


      // Optionnel : rafraîchir la liste, revalidation, etc.
      // mutate(), fetch(), ou recharger depuis le parent
    } catch (err) {
      console.error("Erreur lors de la suppression", err)
    }
  }

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
          <p className="text-gray-600 mt-1">Gérez votre catalogue de services</p>
        </div>
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Service
          </Button>
        </div>

      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <Scissors className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Services Actifs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.filter((s) => s.status === "active").length}
                </p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Prix Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(services.reduce((acc, s) => acc + s.price, 0) / services.length)}€
                </p>
              </div>
              <Euro className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Durée Moyenne</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)}min
                </p>
              </div>
              <Clock className="w-8 h-8 text-[rgb(135,169,107)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Rechercher un service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Catalogue des Services</CardTitle>
          <CardDescription>{filteredServices.length} service(s) trouvé(s)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Durée</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Popularité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell className="font-medium">{service.price}€</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[rgb(135,169,107)] h-2 rounded-full"
                            style={{ width: `${service.popularity}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getPopularityColor(service.popularity)}`}>
                          {service.popularity}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        key={service.id + service.status}
                        checked={service.status === "active"}
                        onCheckedChange={() => handleToggleStatus(service)}
                      />

                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedService(service)
                            setIsCreateDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteClick(service.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              {/* 🗑️ Composant de confirmation de suppression */}
              <ConfirmDeleteDialog
                open={openDeleteDialog}
                onOpenChange={setOpenDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Supprimer ce service ?"
                description="Cette action est irréversible. Voulez-vous vraiment supprimer ce service ?"
                toastMessage="Service supprimé avec succès."
              />
            </Table>
            <AddServiceDialog
              open={isCreateDialogOpen}
              onOpenChange={(open) => {
                if (!open) setSelectedService(null)
                setIsCreateDialogOpen(open)
              }}
              categories={categories}
              mode={selectedService ? "edit" : "add"}
              initialData={selectedService}
              onSubmit={handleSaveService}
            />
            <ConfirmToggleDialog
              open={toggleDialogOpen}
              onOpenChange={(open) => {
                setToggleDialogOpen(open)
                if (!open && pendingService && originalStatus) {
                  // Revenir à l’état initial du switch si on a annulé
                  const updatedList = [...services] // ou filteredServices selon ton state
                  const index = updatedList.findIndex(s => s.id === pendingService.id)
                  if (index !== -1) {
                    updatedList[index].status = originalStatus
                    // Met à jour ton state si tu l’utilises
                  }
                }
              }}
              onConfirm={confirmToggleStatus}
            />



          </div>
        </CardContent>
      </Card>
    </div>
  )
}

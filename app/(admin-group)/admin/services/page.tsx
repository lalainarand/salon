"use client"

import api from "@/lib/api"
import React, { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import ConfirmDeleteDialog from "@/app/(admin-group)/admin/components/ConfirmDeleteDialog"
import { AddServiceDialog } from "@/app/(admin-group)/admin/components/AddServiceDialog"
import { ServiceFormValues } from "@/app/(admin-group)/admin/components/AddServiceDialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Edit, Trash2, Scissors, Clock, Euro } from "lucide-react"
import ConfirmToggleDialog from "@/app/(admin-group)/admin/components/ConfirmToggleDialog"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"

// --- Types ---
interface ServiceType {
  id: number
  nom: string
  description: string
  duree_minutes: number
  prix: string
  statut: number
  categorie_id: number
  categorie: {
    id: number
    nom: string
    description: string
    couleur: string
    statut: number
  }
  popularity?: number
}

interface CategoryType {
  id: number
  nom: string
  couleur?: string
}

// --- Helpers ---
const getPopularityColor = (popularity: number) => {
  if (popularity >= 80) return "text-green-600"
  if (popularity >= 60) return "text-yellow-600"
  return "text-red-600"
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [toggleDialogOpen, setToggleDialogOpen] = useState(false)
  const [pendingService, setPendingService] = useState<ServiceType | null>(null)
  const [originalStatus, setOriginalStatus] = useState<number | null>(null)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()
  const [categories, setCategories] = useState<{ id: number; nom: string }[]>([])

  // --- Pagination ---
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalServices, setTotalServices] = useState(0)
  const [totalActifs, setTotalActifs] = useState(0)
  const itemsPerPage = 10


  const fetchServices = async (page = 1) => {
    try {
      const { data } = await api.get(
        `/api/services/indexPaginate?page=${page}&per_page=${itemsPerPage}`
      )

      const mapped = data.data.map((s: any) => ({
        ...s,
        popularity: Math.floor(Math.random() * 100),
      }))

      setServices(mapped)
      setCurrentPage(page)
      setTotalPages(data.last_page || 1)
      setTotalServices(data.total_services || 0)
      setTotalActifs(data.total_actifs || 0)
    } catch (err) {
      console.error("Erreur lors de la récupération des services :", err)
    }
  }



  // --- Charger categories ---
  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/api/categories/index")
      console.log('listes des categories', data)
      setCategories(data)
    } catch (err) {
      console.error("Erreur lors du chargement des catégories", err)
    }
  }

  useEffect(() => {
    fetchServices()
    fetchCategories()
  }, [])

  // --- Toggle statut ---
  const confirmToggleStatus = async () => {
    if (!pendingService) return

    try {
      await api.put(`/api/services/changes/${pendingService.id}`)
      showSuccess("Statut changé avec succès.")
      fetchServices()
    } catch (error) {
      console.error("Erreur lors du changement de statut :", error)
    } finally {
      setToggleDialogOpen(false)
      setPendingService(null)
      setOriginalStatus(null)
    }
  }

  // --- Sauvegarde (ajout / modif) ---
  const handleSaveService = async (data: ServiceFormValues) => {
    try {
      if (selectedService) {
        await api.put(`/api/services/${selectedService.id}`, data)
        console.log('modification des services', data)
        showSuccess(`Modification du service succès`)
      } else {
        await api.post(`/api/services/`, data)
        console.log('creation des services', data)
        showSuccess(`Création du service  succès`)
      }

      fetchServices()
      setIsCreateDialogOpen(false)
      setSelectedService(null)
    } catch (error) {
      console.error("Erreur lors de la sauvegarde", error)
    }
  }

  // --- Suppression ---
  const handleConfirmDelete = async () => {
    if (selectedServiceId === null) return
    try {
      await api.delete(`/api/services/${selectedServiceId}`)
      showSuccess("Service supprimé avec succès")
      fetchServices()
    } catch (err) {
      console.error("Erreur lors de la suppression", err)
    }
  }

  // --- Filtrage ---
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || service.categorie.nom === categoryFilter
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
<p className="text-2xl font-bold text-gray-900">{totalServices}</p>
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
               <p className="text-2xl font-bold text-gray-900">{totalActifs}</p>

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
                  {services.length > 0
                    ? Math.round(services.reduce((acc, s) => acc + parseFloat(s.prix), 0) / services.length)
                    : 0}
                  Ar
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
                  {services.length > 0
                    ? Math.round(services.reduce((acc, s) => acc + s.duree_minutes, 0) / services.length)
                    : 0}
                  min
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
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.nom}>
                    {c.nom}
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
                        <p className="font-medium">{service.nom}</p>
                        <p className="text-sm text-gray-500">{service.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.categorie.nom}</Badge>
                    </TableCell>
                    <TableCell>{service.duree_minutes} min</TableCell>
                    <TableCell className="font-medium">{service.prix}Ar</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[rgb(135,169,107)] h-2 rounded-full"
                            style={{ width: `${service.popularity}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${getPopularityColor(service.popularity || 0)}`}>
                          {service.popularity}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        key={service.id + service.statut}
                        checked={service.statut === 1}
                        onCheckedChange={() => {
                          setPendingService(service)
                          setOriginalStatus(service.statut)
                          setToggleDialogOpen(true)
                        }}
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
                          <Edit className="h-4 w-4" style={{ color: "rgb(150,180,125)" }} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedServiceId(service.id)
                            setOpenDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                disabled={currentPage === 1}
                style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
                onClick={() => fetchServices(currentPage - 1)}
              >
                ←
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  style={{
                    backgroundColor: page === currentPage ? "rgb(155,183,131)" : "white",
                    color: page === currentPage ? "white" : "black",
                    border: "1px solid rgb(155,183,131)",
                  }}
                  onClick={() => fetchServices(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                disabled={currentPage === totalPages}
                style={{ backgroundColor: "rgb(155,183,131)", color: "white" }}
                onClick={() => fetchServices(currentPage + 1)}
              >
                →
              </Button>
            </div>


            {/* Dialogs */}
            <ConfirmDeleteDialog
              open={openDeleteDialog}
              onOpenChange={setOpenDeleteDialog}
              onConfirm={handleConfirmDelete}
              title="Supprimer ce service ?"
              description="Cette action est irréversible. Voulez-vous vraiment supprimer ce service ?"
              toastMessage="Service supprimé avec succès."
            />

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
                if (!open && pendingService && originalStatus !== null) {
                  const updatedList = [...services]
                  const index = updatedList.findIndex((s) => s.id === pendingService.id)
                  if (index !== -1) {
                    updatedList[index].statut = originalStatus
                    setServices(updatedList)
                  }
                }
              }}
              onConfirm={confirmToggleStatus}
            />

            {/* Notification */}
            <SuccessNotification
              show={notification.show}
              message={notification.message}
              onClose={hideNotification}
              duration={4000}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

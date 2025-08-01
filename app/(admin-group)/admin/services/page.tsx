"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Search, Edit, Trash2, Scissors, Clock, Euro } from "lucide-react"

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
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Créer un nouveau service</DialogTitle>
              <DialogDescription>Ajoutez un nouveau service à votre catalogue</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du service</Label>
                <Input placeholder="Ex: Coupe + Brushing" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category.toLowerCase()}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input type="number" placeholder="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (€)</Label>
                <Input type="number" placeholder="45" />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea placeholder="Description détaillée du service..." />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Annuler
              </Button>
              <Button className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90">Créer le service</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                    <TableCell>{getStatusBadge(service.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

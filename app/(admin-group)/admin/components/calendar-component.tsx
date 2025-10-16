"use client"

import api from "@/lib/api";
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import CreateAppointmentDialog from "@/app/(admin-group)/admin/components/AddAppointmentDialog"
import type { AppointmentFormType, User, Employees, Service } from "@/app/(admin-group)/admin/Types/appointment"
import SuccessNotification, { useSuccessNotification } from "@/app/(admin-group)/admin/components/SuccessNotification"


interface EventType {
  id: number
  title: string
  date: string
  time: string
  duration: string
  employee: string
  status: string
}



const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

export function CalendarComponent() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week">("day")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { notification, showSuccess, hideNotification } = useSuccessNotification()

  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentFormType | null>(null)
  const [services, setServices] = useState<Service[]>([]);
  const [employees, setEmployes] = useState<Employees[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<EventType[]>([])



  const fetchAppointments = async () => {
    try {
      const { data } = await api.get("/api/events")
      console.log("events from API:", data)

      const mapped = data.map((a: any) => ({
        id: a.id,
        title: `${a.client?.name || "Client"} - ${a.service?.nom || "Service"}`,
        date: a.date, // ex: "2025-08-01"
        time: a.heure, // ex: "09:00:00"
        duration: a.service?.duree_minutes
          ? `${a.service.duree_minutes} min`
          : "1h",
        employee: a.employe?.name || a.employe?.user?.name || "Non assignée",
        status: a.status,
      }))

      setEvents(mapped)

    } catch (err) {
      console.error("Erreur API rendez-vous:", err)
    }
  }

  useEffect(() => {
    // Récupère les services depuis l'API
    const fetchServices = async () => {
      try {
        const { data } = await api.get("/api/fusion/serviceforfaits");

        console.log("Services from API:", data);
        setServices(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des services:", err);
      }
    };

    const fetchEmployes = async () => {
      try {
        const { data } = await api.get("/api/employes");

        console.log("Employes from API:", data);
        setEmployes(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des employes:", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/api/clients");

        console.log("clients from API:", data);
        setUsers(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des :", err);
      }
    };

    fetchServices()
    fetchEmployes()
    fetchUsers()
    fetchAppointments()
  }, []);

  const handleSaveAppointment = async (data: AppointmentFormType) => {
    try {
      // Préparer uniquement les champs nécessaires pour l'API
      const filteredData = {
        service_id: data.service?.id,
        client_id: data.user?.id,
        employe_id: data.employee?.id ?? null,
        date: data.date,
        heure: data.time,
        note: data.notes || "",
        mode_paiement: 'especes', // ou data.mode_paiement
      };


      if (selectedAppointment) {
        console.log("Mise à jour du rendez-vous filterdata :", filteredData);
        // appel API pour modifier
        // data.id correspond à l'id du rendez-vous à modifier
        await api.put(`/api/appointments/${data.id}`, filteredData);

        showSuccess(`Rendez-vous de ${data.user?.name} modifié avec succès`);
      } else {
        console.log("Création d'un nouveau rendez-vous filterdata:", filteredData);
        // appel API pour ajouter
        await api.post("/api/appointments", filteredData);

        showSuccess(`Nouveau rendez-vous créé pour ${data.user?.name}`);
      }

      setSelectedAppointment(null);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde :", error);
      // Notification d'erreur possible ici
    }
  };


  const formatDate = (date: Date) =>
    date.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Non assignée":
        return "bg-green-100 text-green-800 border-green-200"
      case "en_attente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmé":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "terminé":
        return "bg-green-200 text-green-900 border-green-300"
      case "annulé":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(currentDate.getDate() - (view === "day" ? 1 : 7))
              setCurrentDate(newDate)
            }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold min-w-[200px] text-center">
            {formatDate(currentDate)}
          </h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(currentDate)
              newDate.setDate(currentDate.getDate() + (view === "day" ? 1 : 7))
              setCurrentDate(newDate)
            }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <Button
              variant={view === "day" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("day")}
              className={view === "day" ? "bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90" : ""}
            >
              Jour
            </Button>
            <Button
              variant={view === "week" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
              className={view === "week" ? "bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90" : ""}
            >
              Semaine
            </Button>
          </div>
          <Button
            className="bg-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)]/90"
            onClick={() => {
              setSelectedAppointment(null) // 👈 assure que c’est en mode ajout
              setIsDialogOpen(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau Rendez-vous
          </Button>

          <CreateAppointmentDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onSubmit={handleSaveAppointment}
            services={services}
            employees={employees}
            users={users}
            initialData={selectedAppointment}
            mode={selectedAppointment ? "edit" : "add"}
          />
          <div>
            {/* Votre contenu existant */}

            {/* Composant de notification */}
            <SuccessNotification
              show={notification.show}
              message={notification.message}
              onClose={hideNotification}
              duration={4000} // 4 secondes
            />
          </div>
        </div>
      </div>

      {/* Vue calendrier */}
      <div className="border rounded-lg bg-white">
        {view === "day" ? (
          <div className="grid grid-cols-1 divide-y">
            {timeSlots.map((time) => {
              const currentISODate = currentDate.toISOString().split("T")[0]
              const eventsAtTime = events.filter((event) => {
                return (
                  event.date === currentISODate &&
                  event.time.startsWith(time.split(":")[0]) // ex: "10" === "10"
                )
              })

              return (
                <div key={time} className="grid grid-cols-12 min-h-[60px]">
                  <div className="col-span-2 p-3 bg-gray-50 border-r flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{time}</span>
                  </div>
                  <div className="col-span-10 p-2 relative space-y-2">
                    {eventsAtTime.map((event) => (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border-l-4 border-l-[rgb(135,169,107)] ${getStatusColor(event.status)} cursor-pointer hover:shadow-md transition-shadow`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-sm">{event.title}</p>
                            <p className="text-xs opacity-75">
                              {event.time} • {event.employee} • {event.duration}
                            </p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border">
              <thead>
                <tr>
                  <th className="w-20 border-r bg-gray-100 text-sm p-2 text-left">Heure</th>
                  {[...Array(7)].map((_, i) => {
                    const date = new Date(currentDate)
                    date.setDate(date.getDate() - date.getDay() + i)
                    const iso = date.toISOString().split("T")[0]
                    return (
                      <th key={i} className="border-r text-sm p-2 text-center">
                        {date.toLocaleDateString("fr-FR", {
                          weekday: "short",
                          day: "numeric",
                        })}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="border-r text-sm text-center p-2 bg-gray-50">{time}</td>
                    {[...Array(7)].map((_, i) => {
                      const dayDate = new Date(currentDate)
                      dayDate.setDate(dayDate.getDate() - dayDate.getDay() + i)
                      const iso = dayDate.toISOString().split("T")[0]

                      const eventsAtTime = events.filter((event) => {
                        return (
                          event.date === iso &&
                          event.time.startsWith(time.split(":")[0])
                        )
                      })

                      return (
                        <td key={i} className="border-r h-16 p-2 space-y-1">
                          {eventsAtTime.map((event) => (
                            <div
                              key={event.id}
                              className={`p-2 rounded-md border-l-4 border-l-[rgb(135,169,107)] ${getStatusColor(event.status)} text-xs`}
                            >
                              <div className="flex justify-between">
                                <span>{event.title}</span>
                                <Badge variant="secondary" className="text-[10px]">
                                  {event.status}
                                </Badge>
                              </div>
                              <div className="opacity-70">
                                {event.time} • {event.employee}
                              </div>
                            </div>
                          ))}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>


      {/* Légende */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span>Confirmé</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
          <span>En attente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div>
          <span>Terminé</span>
        </div>
      </div>
    </div>
  )
}

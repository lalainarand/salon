"use client";

import api from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import SuccessNotification, {
  useSuccessNotification,
} from "@/app/(admin-group)/admin/components/SuccessNotification";

export default function MyAppointmentsModal({ isOpen, onClose, appointments }) {
  const [localAppointments, setLocalAppointments] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const { notification, showSuccess, hideNotification } =
    useSuccessNotification();

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleCancel = (appointment) => {
    const now = new Date();
    const date = new Date(appointment.date);
    const diffHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      alert("Annulation à moins de 24h — 50% du montant doit être payé.");
    } else {
      alert(`Rendez-vous "${appointment.service}" annulé avec succès.`);
      setLocalAppointments((prev) =>
        prev.filter((apt) => apt.id !== appointment.id)
      );
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(true);
    setNewDate(appointment.date.split("T")[0]);
    setNewTime(appointment.date.split("T")[1].slice(0, 5));
  };

  const handleSaveNewDate = () => {
    if (!newDate || !newTime || !selectedAppointment) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const updated = localAppointments.map((apt) =>
        apt.id === selectedAppointment.id
          ? { ...apt, date: `${newDate}T${newTime}:00` }
          : apt
      );
      const DataToSend = {
        newDate: newDate,
        newTime: newTime,
      };

      api.post(
        `/api/update/appointments/${selectedAppointment.id}`,
        DataToSend
      );

      setLocalAppointments(updated);
      setIsEditing(false);
      setSelectedAppointment(null);
      setNewDate("");
      setNewTime("");

      showSuccess(` Date de votre rendez-vous changé au ${newDate} à ${newTime}  success`);
    } catch (error) {
      console.error("Erreur lors du changement de statut", error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* FOND NOIR */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* MODAL PRINCIPAL */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-semibold text-center mb-6 text-[rgb(135,169,107)]">
                {isEditing ? "Modifier le rendez-vous" : "Mes rendez-vous"}
              </h2>

              {/* === LISTE DES RENDEZ-VOUS === */}
              {!isEditing ? (
                <>
                  {localAppointments.length > 0 ? (
                    <div className="space-y-3 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
                      {localAppointments.map((appointment, index) => (
                        <motion.div
                          key={appointment.id}
                          className="border border-gray-100 rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex justify-between items-start sm:items-center sm:flex-row flex-col gap-3">
                            <div className="flex-1">
                              <p className="font-semibold text-charcoal text-lg">
                                {appointment.service}
                              </p>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(appointment.date).toLocaleString(
                                  "fr-FR",
                                  {
                                    dateStyle: "full",
                                    timeStyle: "short",
                                  }
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <span
                                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
                                    appointment.status === "en_attente"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : appointment.status === "confirme"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {appointment.status.replace("_", " ")}
                                </span>
                              </div>
                            </div>

                            {appointment.status === "en_attente" && (
                              <div className="flex sm:flex-col flex-row sm:space-y-2 space-x-2 sm:space-x-0 sm:w-auto">
                                <button
                                  onClick={() => handleReschedule(appointment)}
                                  className="flex-1 sm:flex-none text-sm px-3 py-2 rounded-full border border-[rgb(135,169,107)] text-[rgb(135,169,107)] hover:bg-[rgb(135,169,107)] hover:text-white transition font-medium cursor-pointer"
                                >
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleCancel(appointment)}
                                  className="flex-1 sm:flex-none text-sm px-3 py-2 rounded-full border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-medium cursor-pointer"
                                >
                                  Annuler
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Vous n'avez aucun rendez-vous pour le moment.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                // === FORMULAIRE DE MODIFICATION ===
                selectedAppointment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-4"
                  >
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-blue-700">
                        {selectedAppointment.service}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-[rgb(135,169,107)]" />
                        Nouvelle date
                      </label>
                      <input
                        type="date"
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[rgb(135,169,107)] focus:ring-2 focus:ring-[rgb(135,169,107)]/20 transition cursor-pointer"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-[rgb(135,169,107)]" />
                        Nouvelle heure
                      </label>
                      <input
                        type="time"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[rgb(135,169,107)] focus:ring-2 focus:ring-[rgb(135,169,107)]/20 transition cursor-pointer"
                      />
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setSelectedAppointment(null);
                        }}
                        className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition font-medium cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleSaveNewDate}
                        className="bg-[rgb(135,169,107)] hover:bg-[rgb(120,150,90)] text-white px-5 py-2 rounded-full transition font-medium shadow-md cursor-pointer"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          </motion.div>
          <SuccessNotification
            show={notification.show}
            message={notification.message}
            onClose={hideNotification}
            duration={4000} // 4 secondes
          />
        </>
      )}
    </AnimatePresence>
  );
}

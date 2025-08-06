"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"

interface SuccessNotificationProps {
  show: boolean
  message: string
  onClose: () => void
  duration?: number
}

export default function SuccessNotification({
  show,
  message,
  onClose,
  duration = 4000
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setProgress(0)
      
      // Animation de la barre de progression
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / (duration / 50))
          if (newProgress >= 100) {
            clearInterval(progressInterval)
            return 100
          }
          return newProgress
        })
      }, 50)

      // Auto-close après la durée spécifiée
      const closeTimeout = setTimeout(() => {
        handleClose()
      }, duration)

      return () => {
        clearInterval(progressInterval)
        clearTimeout(closeTimeout)
      }
    }
  }, [show, duration])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      onClose()
    }, 300) // Délai pour l'animation de sortie
  }

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div
        className={`
          relative overflow-hidden
          bg-white border border-green-200 rounded-xl shadow-2xl
          min-w-[350px] max-w-[400px]
          transform transition-all duration-300 ease-out
          ${isVisible 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        {/* Barre de progression */}
        <div className="absolute top-0 left-0 h-1 bg-green-500 transition-all duration-75 ease-linear"
             style={{ width: `${progress}%` }} />
        
        {/* Contenu principal */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icône de succès avec animation */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="relative">
                <CheckCircle className="w-6 h-6 text-green-500" />
                {/* Animation de cercle qui s'étend */}
                <div className={`
                  absolute inset-0 rounded-full border-2 border-green-300
                  ${show ? 'animate-ping' : ''}
                `} />
              </div>
            </div>
            
            {/* Message */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-5">
                Opération réussie !
              </p>
              <p className="text-sm text-gray-600 mt-1 leading-5">
                {message}
              </p>
            </div>
            
            {/* Bouton de fermeture */}
            <button
              onClick={handleClose}
              className="
                flex-shrink-0 p-1 rounded-full
                hover:bg-gray-100 transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-green-300
              "
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Effet de brillance */}
        <div className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
          transform -skew-x-12 transition-transform duration-1000
          ${show ? 'translate-x-full' : '-translate-x-full'}
        `} />
      </div>
    </div>
  )
}

// Hook personnalisé pour gérer les notifications de succès
export function useSuccessNotification() {
  const [notification, setNotification] = useState<{
    show: boolean
    message: string
  }>({
    show: false,
    message: ""
  })

  const showSuccess = (message: string) => {
    setNotification({
      show: true,
      message
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({
      ...prev,
      show: false
    }))
  }

  return {
    notification,
    showSuccess,
    hideNotification
  }
}
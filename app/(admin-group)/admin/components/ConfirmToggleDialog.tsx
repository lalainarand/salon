"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

interface ConfirmToggleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => Promise<void> | void
  title?: string
  description?: string
  confirmLabel?: string
}

export default function ConfirmToggleDialog({
  open,
  onOpenChange,
  onConfirm,
  title = "Confirmer le changement de statut",
  description = "Souhaitez-vous vraiment changer le statut ?",
  confirmLabel = "Oui, changer",
}: ConfirmToggleDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    try {
      setLoading(true)
      await onConfirm()
      toast({
        title: "Statut mis à jour",
        description: "Le statut a été modifié avec succès.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du changement de statut.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">{description}</p>
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

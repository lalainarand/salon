"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { AlertTriangle } from "lucide-react"

interface ConfirmDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => Promise<void> | void
    title?: string
    description?: string
    toastMessage?: string
    isDangerous?: boolean
}

export default function ConfirmDeleteDialog({
    open,
    onOpenChange,
    onConfirm,
    title = "Supprimer cet élément ?",
    description = "Cette action est irréversible. Êtes-vous sûr(e) ?",
    toastMessage = "Élément supprimé avec succès.",
    isDangerous = true,
}: ConfirmDeleteDialogProps) {
    const { toast } = useToast()
    const [loading, setLoading] = useState(false)

    const handleConfirm = async () => {
        try {
            setLoading(true)
            await onConfirm()
            toast({
                title: "Suppression réussie",
                description: toastMessage,
                variant: "default",
            })
            onOpenChange(false)
        } catch (error) {
            toast({
                title: "Erreur lors de la suppression",
                description: "Une erreur est survenue.",
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
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        {isDangerous && <AlertTriangle className="w-5 h-5" />}
                        {title}
                    </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600">{description}</p>
                <DialogFooter className="mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Annuler
                    </Button>
                    <Button
                        variant={isDangerous ? "destructive" : "default"}
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? "Suppression..." : "Supprimer"}
                    </Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

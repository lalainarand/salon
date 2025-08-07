
export interface User {
  id: number
  name: string
  phone: number
  email?: string
  status?: string
  createdAt?: string
}

export interface Employees {
  id: number
  name: string
  phone: number
  email?: string
  status?: string
  createdAt?: string
  poste: string
}

export interface Service {
  id: number
  name: string
  price: number
  description?: string
  duration?: string
  categoryId?: number
  status?: string
}

export type AppointmentFormType = {
  id: number
  user: User | null
  service: Service | null
  employee: Employees | null
  date: string
  time: string
  duration: string
  status: "pending" | "confirmed" | "completed" | "cancelled" | "modified" | "rescheduled"
  notes?: string
}

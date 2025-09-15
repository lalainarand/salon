
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
  email: string
  createdAt?: string
  phone: number
  role_id: number
  created_at: string
  updated_at: string
  status: string
  employe?: {
    id: number
    user_id: number
    date_embauche: string
    poste: string
    horaire: string
  } | null
}


export interface Service {
  id: number
  nom: string
  prix: number
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
  status: string
  notes?: string
}

"use client"

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface RevenueData {
  month: number | string
  total: number
}

interface ServiceData {
  name: string
  value: number
  color?: string
}

interface StatsChartProps {
  type: "revenue" | "services"
  data: any[] // caChart ou serviceChart depuis le backend
}

export function StatsChart({ type, data }: StatsChartProps) {
  if (type === "revenue") {
    const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû", "Sep", "Oct", "Nov", "Déc"]

    // Créer un tableau complet de 12 mois avec total 0 par défaut
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: monthLabels[i],
      revenue: 0,
    }))

    // Remplir les mois avec les données du backend
    data.forEach((item: RevenueData) => {
      const index = Number(item.month) - 1
      if (allMonths[index]) {
        allMonths[index].revenue = item.total
      }
    })

    // 🔥 Calcul dynamique des 6 derniers mois par rapport au mois actuel
    const currentMonth = new Date().getMonth() // 0 = Janvier
    const startIndex = currentMonth - 5 < 0 ? 0 : currentMonth - 5
    const last6Months = allMonths.slice(startIndex, currentMonth + 1)

    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last6Months}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} Ar`, "Chiffre d'affaires"]} labelStyle={{ color: "#374151" }} />
            <Bar dataKey="revenue" fill="rgb(135,169,107)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  // Partie services (inchangée)
  const defaultColors = [
    "rgb(135,169,107)",
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
    "#FFBB28",
    "#FF6699",
  ]

  const servicesData = data.length
    ? data.map((item: ServiceData, index: number) => ({
        ...item,
        color: item.color || defaultColors[index % defaultColors.length],
      }))
    : []

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={servicesData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {servicesData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Nombre de RDV"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

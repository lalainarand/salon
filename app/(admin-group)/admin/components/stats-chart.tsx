"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from "recharts"

const revenueData = [
  { month: "Jan", revenue: 8400 },
  { month: "Fév", revenue: 9200 },
  { month: "Mar", revenue: 10100 },
  { month: "Avr", revenue: 11500 },
  { month: "Mai", revenue: 10800 },
  { month: "Jun", revenue: 12450 },
]

const servicesData = [
  { name: "Coupe", value: 35, color: "rgb(135,169,107)" },
  { name: "Coloration", value: 25, color: "rgb(248,246,241)" },
  { name: "Brushing", value: 20, color: "#8884d8" },
  { name: "Barbe", value: 15, color: "#82ca9d" },
  { name: "Autres", value: 5, color: "#ffc658" },
]

interface StatsChartProps {
  type: "revenue" | "services"
}

export function StatsChart({ type }: StatsChartProps) {
  if (type === "revenue") {
    return (
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`€${value}`, "Chiffre d'affaires"]} labelStyle={{ color: "#374151" }} />
            <Bar dataKey="revenue" fill="rgb(135,169,107)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

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
          <Tooltip formatter={(value) => [`${value}%`, "Pourcentage"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

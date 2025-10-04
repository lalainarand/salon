"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

interface ServicesChartProps {
  data: { name: string; count: number }[]
}

export function ServicesChart({ data }: ServicesChartProps) {
  // Palette de couleurs améliorée (plus visible)
  const defaultColors = [
    "#87a96b", // vert doux
    "#FF6B6B", // rouge vif
    "#8884d8", // violet
    "#82ca9d", // vert
    "#ffc658", // jaune/orange
    "#FF8042", // orange vif
    "#FFBB28", // jaune
    "#0088FE", // bleu vif
    "#00C49F", // turquoise
    "#FF6699", // rose vif
  ]

  // Préparer les données pour le PieChart
  const chartData = data.map((entry, index) => ({
    name: entry.name,
    value: entry.count,
    color: defaultColors[index % defaultColors.length],
  }))

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, "Nombre de RDV"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

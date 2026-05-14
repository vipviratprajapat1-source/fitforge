"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const colors = ["#6ea8ff", "#22e4b7", "#ff9d60", "#ff6e93"];

export function WeeklyActivityChart({
  data,
}: {
  data: { day: string; calories: number; steps: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="caloriesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6ea8ff" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#6ea8ff" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(144,162,194,0.12)" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} width={34} />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(144,162,194,0.14)",
              background: "rgba(6, 9, 22, 0.92)",
              color: "#f5f9ff",
            }}
          />
          <Area
            type="monotone"
            dataKey="calories"
            stroke="#6ea8ff"
            fill="url(#caloriesGradient)"
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MacroBreakdownChart({
  data,
}: {
  data: { name: string; value: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={70}
            outerRadius={100}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(144,162,194,0.14)",
              background: "rgba(6, 9, 22, 0.92)",
              color: "#f5f9ff",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressTrendChart({
  data,
}: {
  data: { date: string; weight: number; waist: number }[];
}) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid vertical={false} stroke="rgba(144,162,194,0.12)" />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={10} />
          <YAxis tickLine={false} axisLine={false} width={34} />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(144,162,194,0.14)",
              background: "rgba(6, 9, 22, 0.92)",
              color: "#f5f9ff",
            }}
          />
          <Bar dataKey="weight" fill="#22e4b7" radius={[12, 12, 0, 0]} />
          <Bar dataKey="waist" fill="#ff9d60" radius={[12, 12, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LeaderboardChart({
  data,
}: {
  data: { name: string; xp: number }[];
}) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 18 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            tickLine={false}
            axisLine={false}
            width={74}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 18,
              border: "1px solid rgba(144,162,194,0.14)",
              background: "rgba(6, 9, 22, 0.92)",
              color: "#f5f9ff",
            }}
          />
          <Bar dataKey="xp" radius={[0, 14, 14, 0]} fill="#6ea8ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

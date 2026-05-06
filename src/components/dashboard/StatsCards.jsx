import { FileText, Video, BookMarked, TrendingUp } from "lucide-react";

export default function StatsCards({ resources }) {
  const apuntes = resources.filter((r) => r.type === "apunte").length;
  const videos = resources.filter((r) => r.type === "video").length;
  const guias = resources.filter((r) => r.type === "guia").length;

  const stats = [
    { label: "Total Recursos", value: resources.length, icon: TrendingUp, color: "bg-primary/10 text-primary" },
    { label: "Apuntes", value: apuntes, icon: FileText, color: "bg-blue-500/10 text-blue-400" },
    { label: "Videos", value: videos, icon: Video, color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Guías", value: guias, icon: BookMarked, color: "bg-amber-500/10 text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          <p className="text-2xl font-heading font-bold">{stat.value}</p>
          <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
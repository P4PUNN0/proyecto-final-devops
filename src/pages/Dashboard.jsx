import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import StatsCards from "../components/dashboard/StatsCards";
import ResourceCard from "../components/dashboard/ResourceCard";
import ResourceFilters from "../components/dashboard/ResourceFilters";
import EmptyState from "../components/dashboard/EmptyState";

export default function Dashboard() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    setLoading(true);
    const data = await base44.entities.Resource.list("-created_date", 100);
    setResources(data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await base44.entities.Resource.delete(id);
    setResources((prev) => prev.filter((r) => r.id !== id));
    toast({ title: "Recurso eliminado", description: "El recurso se eliminó correctamente." });
  };

  const filtered = resources.filter((r) => {
    const matchesSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Mis Recursos</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus apuntes, videos y guías de estudio</p>
        </div>
        <Button asChild size="lg" className="shadow-lg shadow-primary/20">
          <Link to="/edu/upload">
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Recurso
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <StatsCards resources={resources} />

      {/* Filters */}
      <ResourceFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        typeFilter={typeFilter}
        setTypeFilter={setTypeFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Grid */}
      {filtered.length === 0 && resources.length === 0 ? (
        <EmptyState />
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No se encontraron recursos con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
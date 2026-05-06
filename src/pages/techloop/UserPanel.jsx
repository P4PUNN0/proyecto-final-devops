import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { PlusCircle, Trash2, Pause, Play, Tag, ArrowLeftRight, Heart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

const txIcons = { venta: Tag, intercambio: ArrowLeftRight, donacion: Heart };
const txColors = {
  venta: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  intercambio: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  donacion: "bg-primary/10 text-primary border-primary/20",
};
const statusColors = {
  activo: "bg-emerald-500/10 text-emerald-400",
  pausado: "bg-amber-500/10 text-amber-400",
  completado: "bg-muted text-muted-foreground",
};

export default function UserPanel() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.email) return;
    base44.entities.Product.filter({ created_by: user.email }, "-created_date", 50).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [user]);

  const toggleStatus = async (product) => {
    const newStatus = product.status === "activo" ? "pausado" : "activo";
    await base44.entities.Product.update(product.id, { status: newStatus });
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, status: newStatus } : p));
    toast({ title: `Publicación ${newStatus === "activo" ? "activada" : "pausada"}` });
  };

  const deleteProduct = async (id) => {
    await base44.entities.Product.delete(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Producto eliminado" });
  };

  const active = products.filter((p) => p.status === "activo");
  const paused = products.filter((p) => p.status === "pausado");
  const completed = products.filter((p) => p.status === "completado");

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Mi Panel</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus publicaciones en TechLoop</p>
        </div>
        <Button asChild className="shadow-lg shadow-primary/20">
          <Link to="/publish"><PlusCircle className="h-4 w-4 mr-2" />Nueva publicación</Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Activas", value: active.length, color: "text-primary" },
          { label: "Pausadas", value: paused.length, color: "text-amber-400" },
          { label: "Completadas", value: completed.length, color: "text-muted-foreground" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-heading font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Products list */}
      {products.length === 0 ? (
        <div className="text-center py-16">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/20 mb-4" />
          <h3 className="font-heading font-semibold mb-2">Sin publicaciones aún</h3>
          <p className="text-muted-foreground text-sm mb-6">Empieza publicando equipo que ya no uses</p>
          <Button asChild><Link to="/publish">Publicar mi primer equipo</Link></Button>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map((p) => {
            const TxIcon = txIcons[p.transaction_type] || Tag;
            return (
              <div key={p.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-border/80 transition-colors">
                {/* Image or emoji */}
                <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">💻</span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm truncate">{p.title}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs border ${txColors[p.transaction_type]}`}>
                      <TxIcon className="h-3 w-3" />
                      {p.transaction_type === "venta" ? `$${p.price?.toLocaleString()} MXN` : p.transaction_type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-xs ${statusColors[p.status]}`}>{p.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.status !== "completado" && (
                    <Button variant="ghost" size="sm" onClick={() => toggleStatus(p)} className="h-8 w-8 p-0">
                      {p.status === "activo" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => deleteProduct(p.id)} className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
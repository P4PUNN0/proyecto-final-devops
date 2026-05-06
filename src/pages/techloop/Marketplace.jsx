import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { PlusCircle, Zap, Heart, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "../../components/techloop/ProductCard";
import MarketFilters from "../../components/techloop/MarketFilters";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [txFilter, setTxFilter] = useState("all");
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [catFilter, setCatFilter] = useState(params.get("category") || "all");

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const cat = p.get("category");
    if (cat) setCatFilter(cat);
  }, [location.search]);

  useEffect(() => {
    base44.entities.Product.list("-created_date", 100).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  const filtered = products.filter((p) => {
    if (p.status === "completado") return false;
    const q = search.toLowerCase();
    const matchesSearch = !search || p.title?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchesTx = txFilter === "all" || p.transaction_type === txFilter;
    const matchesCat = catFilter === "all" || p.category === catFilter;
    return matchesSearch && matchesTx && matchesCat;
  });

  const donations = products.filter((p) => p.transaction_type === "donacion" && p.status !== "completado").length;
  const exchanges = products.filter((p) => p.transaction_type === "intercambio" && p.status !== "completado").length;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-card via-muted to-card border border-border p-8 sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(0,255,128,0.08),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">♻️ Electrónica Circular</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold tracking-tight mb-3">
            Dale una segunda vida<br />
            <span className="text-primary">al hardware</span>
          </h1>
          <p className="text-muted-foreground max-w-lg mb-6">
            Compra, vende, intercambia o dona equipo electrónico. Reduce la basura tecnológica y conecta con tu comunidad.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20 font-semibold">
              <Link to="/publish"><PlusCircle className="h-5 w-5 mr-2" />Publicar equipo</Link>
            </Button>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Heart className="h-4 w-4 text-primary" />{donations} donaciones</span>
              <span className="flex items-center gap-1"><ArrowLeftRight className="h-4 w-4 text-cyan-400" />{exchanges} intercambios</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <MarketFilters
        search={search} setSearch={setSearch}
        txFilter={txFilter} setTxFilter={setTxFilter}
        catFilter={catFilter} setCatFilter={setCatFilter}
      />

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Zap className="h-10 w-10 mx-auto mb-3 opacity-20" />
          <p>No hay productos con esos filtros.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{filtered.length} productos encontrados</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </div>
  );
}
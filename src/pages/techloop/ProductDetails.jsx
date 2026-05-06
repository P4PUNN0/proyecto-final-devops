import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { MapPin, Tag, ArrowLeftRight, Heart, Loader2, ChevronLeft } from "lucide-react";

const transactionConfig = {
  venta: { label: "Venta", icon: Tag, className: "bg-blue-500/10 text-blue-400 border border-blue-500/20" },
  intercambio: { label: "Intercambio", icon: ArrowLeftRight, className: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" },
  donacion: { label: "Donación", icon: Heart, className: "bg-primary/10 text-primary border border-primary/20" },
};

const conditionConfig = {
  nuevo: { label: "Nuevo", className: "bg-emerald-500/10 text-emerald-400" },
  usado: { label: "Usado", className: "bg-amber-500/10 text-amber-400" },
  refaccionar: { label: "Para refaccionar", className: "bg-red-500/10 text-red-400" },
};

const categoryEmoji = {
  laptop: "💻", componente: "🔧", periferico: "🖱️",
  consola: "🎮", gadget: "📱", otro: "📦",
};

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.Product.get(id).then((data) => {
      setProduct(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>Producto no encontrado.</p>
        <Link to="/" className="text-primary mt-4 inline-block">← Volver al Marketplace</Link>
      </div>
    );
  }

  const tx = transactionConfig[product.transaction_type];
  const cond = conditionConfig[product.condition];
  const TxIcon = tx?.icon;

  return (
    <div className="space-y-6">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ChevronLeft className="h-4 w-4" />
        Volver al Marketplace
      </Link>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="aspect-video md:aspect-auto md:min-h-[360px] bg-muted flex items-center justify-center overflow-hidden">
            {product.image_url ? (
              <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl">{categoryEmoji[product.category] || "📦"}</span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col gap-4">
            <div className="flex flex-wrap gap-2">
              {tx && (
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${tx.className}`}>
                  {TxIcon && <TxIcon className="h-3 w-3" />}
                  {tx.label}
                </span>
              )}
              {cond && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${cond.className}`}>
                  {cond.label}
                </span>
              )}
            </div>

            <h1 className="font-heading text-2xl md:text-3xl font-bold">{product.title}</h1>

            {(product.brand || product.model) && (
              <p className="text-muted-foreground">{[product.brand, product.model].filter(Boolean).join(" · ")}</p>
            )}

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="border-t border-border pt-4 mt-auto">
              {product.transaction_type === "venta" && product.price > 0 && (
                <p className="text-3xl font-heading font-bold text-primary mb-4">${product.price.toLocaleString()} MXN</p>
              )}
              {product.transaction_type === "intercambio" && product.exchange_for && (
                <p className="text-sm text-cyan-400 flex items-center gap-2 mb-4">
                  <ArrowLeftRight className="h-4 w-4" />
                  Quiero a cambio: <span className="font-semibold">{product.exchange_for}</span>
                </p>
              )}
              {product.transaction_type === "donacion" && (
                <p className="text-sm text-primary flex items-center gap-2 mb-4">
                  <Heart className="h-4 w-4" />
                  Gratis — Donación
                </p>
              )}

              {product.location && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
                  <MapPin className="h-3.5 w-3.5" />
                  {product.location}
                </div>
              )}

              <Button size="lg" className="w-full shadow-lg shadow-primary/20 font-semibold">
                💬 Contactar al Vendedor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
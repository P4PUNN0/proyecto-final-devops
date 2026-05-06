import { MapPin, Tag, ArrowLeftRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";

const transactionConfig = {
  venta: { label: "Venta", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  intercambio: { label: "Intercambio", className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  donacion: { label: "Donación", className: "bg-primary/10 text-primary border-primary/20" },
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

export default function ProductCard({ product }) {
  const tx = transactionConfig[product.transaction_type] || transactionConfig.venta;
  const cond = conditionConfig[product.condition] || conditionConfig.usado;

  return (
    <Link to={`/product/${product.id}`}>
    <div className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">
            {categoryEmoji[product.category] || "📦"}
          </div>
        )}
        {/* Transaction badge overlay */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm ${tx.className}`}>
            {product.transaction_type === "intercambio" && <ArrowLeftRight className="h-3 w-3" />}
            {product.transaction_type === "donacion" && <Heart className="h-3 w-3" />}
            {product.transaction_type === "venta" && <Tag className="h-3 w-3" />}
            {tx.label}
          </span>
        </div>
        {/* Condition */}
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${cond.className}`}>
            {cond.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-heading font-semibold text-sm mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {product.title}
        </h3>
        {(product.brand || product.model) && (
          <p className="text-xs text-muted-foreground mb-2">{[product.brand, product.model].filter(Boolean).join(" · ")}</p>
        )}
        {product.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{product.description}</p>
        )}

        {/* Price / exchange info */}
        <div className="mt-auto">
          {product.transaction_type === "venta" && product.price > 0 && (
            <p className="text-lg font-heading font-bold text-primary">${product.price.toLocaleString()} MXN</p>
          )}
          {product.transaction_type === "intercambio" && product.exchange_for && (
            <p className="text-xs text-cyan-400 flex items-center gap-1">
              <ArrowLeftRight className="h-3 w-3" />
              Quiero: {product.exchange_for}
            </p>
          )}
          {product.transaction_type === "donacion" && (
            <p className="text-xs text-primary flex items-center gap-1">
              <Heart className="h-3 w-3" />
              Gratis — Impacto social
            </p>
          )}
        </div>

        {product.location && (
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3" />
            {product.location}
          </div>
        )}
      </div>
    </div>
    </Link>
  );
}
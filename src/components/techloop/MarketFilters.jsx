import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

const txTypes = [
  { value: "all", label: "Todo" },
  { value: "venta", label: "Venta" },
  { value: "intercambio", label: "Intercambio" },
  { value: "donacion", label: "Donación" },
];

const categories = [
  { value: "all", label: "Todas las categorías" },
  { value: "laptop", label: "💻 Laptops" },
  { value: "componente", label: "🔧 Componentes" },
  { value: "periferico", label: "🖱️ Periféricos" },
  { value: "consola", label: "🎮 Consolas" },
  { value: "gadget", label: "📱 Gadgets" },
];

const txColors = {
  all: "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
  venta: "border-blue-500/30 text-blue-400 hover:bg-blue-500/10",
  intercambio: "border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10",
  donacion: "border-primary/30 text-primary hover:bg-primary/10",
};

const txActiveColors = {
  all: "bg-primary/10 border-primary text-primary",
  venta: "bg-blue-500/20 border-blue-400 text-blue-300",
  intercambio: "bg-cyan-500/20 border-cyan-400 text-cyan-300",
  donacion: "bg-primary/20 border-primary text-primary",
};

export default function MarketFilters({ search, setSearch, txFilter, setTxFilter, catFilter, setCatFilter }) {
  const hasFilters = txFilter !== "all" || catFilter !== "all" || search;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar laptops, teclados, GPUs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-muted border-border h-11"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {/* Transaction type pills */}
      <div className="flex flex-wrap gap-2">
        {txTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setTxFilter(t.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
              txFilter === t.value ? txActiveColors[t.value] : txColors[t.value]
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.value}
            onClick={() => setCatFilter(c.value)}
            className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
              catFilter === c.value
                ? "bg-muted border-primary/50 text-foreground"
                : "border-border text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={() => { setSearch(""); setTxFilter("all"); setCatFilter("all"); }}
          className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
        >
          <X className="h-3 w-3" /> Limpiar filtros
        </button>
      )}
    </div>
  );
}
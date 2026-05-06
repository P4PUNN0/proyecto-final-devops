import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, PlusCircle, User, Repeat2, Menu, X, Zap, ChevronDown, Laptop, Cpu, Mouse, Gamepad2, Smartphone } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

const navItems = [
  { path: "/", label: "Marketplace", icon: Home },
  { path: "/publish", label: "Publicar", icon: PlusCircle },
  { path: "/panel", label: "Mi Panel", icon: User },
];

const categories = [
  { label: "Laptops", value: "laptop", icon: Laptop },
  { label: "Componentes", value: "componente", icon: Cpu },
  { label: "Periféricos", value: "periferico", icon: Mouse },
  { label: "Consolas", value: "consola", icon: Gamepad2 },
  { label: "Gadgets", value: "gadget", icon: Smartphone },
];

export default function TechLoopLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Repeat2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-lg tracking-tight">
              Tech<span className="text-primary">Loop</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            {/* Categories dropdown */}
            <div className="hidden md:block relative">
              <button
                onClick={() => setCatOpen(!catOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all border border-border"
              >
                Categorías
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                  {categories.map((cat) => (
                    <Link
                      key={cat.value}
                      to={`/?category=${cat.value}`}
                      onClick={() => setCatOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <cat.icon className="h-4 w-4 text-primary" />
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                {user?.full_name?.charAt(0) || "U"}
              </div>
              <span className="text-sm text-muted-foreground">{user?.full_name?.split(" ")[0] || "Usuario"}</span>
            </div>
            <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 pb-1">
              <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Categorías</p>
              {categories.map((cat) => (
                <Link
                  key={cat.value}
                  to={`/?category=${cat.value}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <cat.icon className="h-4 w-4 text-primary" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      <footer className="border-t border-border py-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Zap className="h-4 w-4 text-primary" />
          <span>TechLoop — Electrónica circular para un planeta más limpio</span>
        </div>
      </footer>
    </div>
  );
}
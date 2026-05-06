import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Tag, ArrowLeftRight, Heart, Loader2, Upload, CheckCircle, PlusCircle } from "lucide-react";

const txOptions = [
  { value: "venta", label: "💰 Venta", desc: "Establece un precio en MXN", icon: Tag, color: "border-blue-500/50 bg-blue-500/5 text-blue-400" },
  { value: "intercambio", label: "🔄 Intercambio", desc: "Cambia por otro equipo", icon: ArrowLeftRight, color: "border-cyan-500/50 bg-cyan-500/5 text-cyan-400" },
  { value: "donacion", label: "💚 Donación", desc: "Regálalo sin costo", icon: Heart, color: "border-primary/50 bg-primary/5 text-primary" },
];

export default function PublishProduct() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [form, setForm] = useState({
    title: "", description: "", category: "", transaction_type: "", condition: "",
    price: "", exchange_for: "", brand: "", model: "", location: "", image_url: "", status: "activo"
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    set("image_url", file_url);
    setUploadedFile(file.name);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category || !form.transaction_type || !form.condition) {
      toast({ title: "Campos requeridos", description: "Completa título, categoría, tipo de transacción y estado.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await base44.entities.Product.create({ ...form, price: form.price ? Number(form.price) : undefined });
    toast({ title: "¡Producto publicado!", description: "Ya aparece en el marketplace." });
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Volver al marketplace
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold">Publicar equipo</h1>
        <p className="text-muted-foreground mt-1">Elige cómo quieres mover tu hardware</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction type selector */}
        <div>
          <Label className="text-sm font-semibold mb-3 block">¿Qué quieres hacer con este equipo? *</Label>
          <div className="grid grid-cols-3 gap-3">
            {txOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("transaction_type", opt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.transaction_type === opt.value ? opt.color + " ring-2 ring-offset-2 ring-offset-background" : "border-border hover:border-border/80 hover:bg-muted"
                }`}
              >
                <p className="font-semibold text-sm mb-0.5">{opt.label}</p>
                <p className="text-xs text-muted-foreground leading-tight">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="title">Nombre del producto *</Label>
              <Input id="title" placeholder="Ej: Laptop Dell XPS 13 i7" value={form.title} onChange={(e) => set("title", e.target.value)} className="mt-1.5 bg-muted border-border" />
            </div>
            <div>
              <Label>Categoría *</Label>
              <Select value={form.category} onValueChange={(v) => set("category", v)}>
                <SelectTrigger className="mt-1.5 bg-muted border-border"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptop">💻 Laptop</SelectItem>
                  <SelectItem value="componente">🔧 Componente PC</SelectItem>
                  <SelectItem value="periferico">🖱️ Periférico</SelectItem>
                  <SelectItem value="consola">🎮 Consola</SelectItem>
                  <SelectItem value="gadget">📱 Gadget</SelectItem>
                  <SelectItem value="otro">📦 Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Estado del equipo *</Label>
              <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
                <SelectTrigger className="mt-1.5 bg-muted border-border"><SelectValue placeholder="Selecciona" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">✨ Nuevo / Como nuevo</SelectItem>
                  <SelectItem value="usado">🔄 Usado — Buen estado</SelectItem>
                  <SelectItem value="refaccionar">🔩 Para refaccionar</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="brand">Marca</Label>
              <Input id="brand" placeholder="Dell, Apple, Logitech..." value={form.brand} onChange={(e) => set("brand", e.target.value)} className="mt-1.5 bg-muted border-border" />
            </div>
            <div>
              <Label htmlFor="model">Modelo</Label>
              <Input id="model" placeholder="XPS 13, MX Master 3..." value={form.model} onChange={(e) => set("model", e.target.value)} className="mt-1.5 bg-muted border-border" />
            </div>

            {form.transaction_type === "venta" && (
              <div>
                <Label htmlFor="price">Precio (MXN)</Label>
                <Input id="price" type="number" placeholder="3500" value={form.price} onChange={(e) => set("price", e.target.value)} className="mt-1.5 bg-muted border-border" />
              </div>
            )}
            {form.transaction_type === "intercambio" && (
              <div className="sm:col-span-2">
                <Label htmlFor="exchange_for">¿Qué quieres a cambio?</Label>
                <Input id="exchange_for" placeholder="Ej: Mouse mecánico gaming, Teclado 60%" value={form.exchange_for} onChange={(e) => set("exchange_for", e.target.value)} className="mt-1.5 bg-muted border-border" />
              </div>
            )}

            <div className="sm:col-span-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" placeholder="Describe el estado, especificaciones, accesorios incluidos..." value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className="mt-1.5 bg-muted border-border resize-none" />
            </div>
            <div>
              <Label htmlFor="location">Ciudad</Label>
              <Input id="location" placeholder="CDMX, Monterrey, Guadalajara..." value={form.location} onChange={(e) => set("location", e.target.value)} className="mt-1.5 bg-muted border-border" />
            </div>
          </div>

          {/* Image upload */}
          <div>
            <Label>Foto del producto</Label>
            <div className="mt-1.5 relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Subiendo imagen...</p>
                </div>
              ) : uploadedFile ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle className="h-8 w-8 text-primary" />
                  <p className="text-sm font-medium">{uploadedFile}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">Sube una foto de tu equipo</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" asChild><Link to="/">Cancelar</Link></Button>
          <Button type="submit" disabled={saving} className="shadow-lg shadow-primary/20 font-semibold">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <PlusCircle className="h-4 w-4 mr-2" />}
            {saving ? "Publicando..." : "Publicar ahora"}
          </Button>
        </div>
      </form>
    </div>
  );
}
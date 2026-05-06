import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Upload, CheckCircle } from "lucide-react";

const subjects = [
  "Matemáticas", "Física", "Programación", "Bases de Datos", "Redes",
  "Inteligencia Artificial", "Estadística", "Inglés", "Administración",
  "Contabilidad", "Derecho", "Economía", "Otra"
];

export default function ResourceForm() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "",
    subject: "",
    semester: "",
    tags: "",
    status: "publicado",
    file_url: "",
  });

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedFile });
    updateField("file_url", file_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.type || !form.subject) {
      toast({ title: "Campos requeridos", description: "Completa título, tipo y materia.", variant: "destructive" });
      return;
    }
    setSaving(true);
    await base44.entities.Resource.create(form);
    toast({ title: "¡Recurso creado!", description: "Tu recurso se guardó exitosamente." });
    navigate("/edu");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            placeholder="Ej: Apuntes de Cálculo Integral - Unidad 3"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
            className="mt-1.5 bg-background"
          />
        </div>

        <div>
          <Label>Tipo de recurso *</Label>
          <Select value={form.type} onValueChange={(v) => updateField("type", v)}>
            <SelectTrigger className="mt-1.5 bg-background">
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apunte">📝 Apunte</SelectItem>
              <SelectItem value="video">🎬 Video</SelectItem>
              <SelectItem value="guia">📖 Guía</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Materia *</Label>
          <Select value={form.subject} onValueChange={(v) => updateField("subject", v)}>
            <SelectTrigger className="mt-1.5 bg-background">
              <SelectValue placeholder="Selecciona materia" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Semestre</Label>
          <Select value={form.semester} onValueChange={(v) => updateField("semester", v)}>
            <SelectTrigger className="mt-1.5 bg-background">
              <SelectValue placeholder="Selecciona semestre" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 10 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>Semestre {i + 1}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Estado</Label>
          <Select value={form.status} onValueChange={(v) => updateField("status", v)}>
            <SelectTrigger className="mt-1.5 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="publicado">Publicado</SelectItem>
              <SelectItem value="borrador">Borrador</SelectItem>
              <SelectItem value="archivado">Archivado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="description">Descripción</Label>
          <Textarea
            id="description"
            placeholder="Describe brevemente el contenido de este recurso..."
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            rows={3}
            className="mt-1.5 bg-background resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="tags">Etiquetas</Label>
          <Input
            id="tags"
            placeholder="Ej: cálculo, integrales, derivadas (separadas por coma)"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
            className="mt-1.5 bg-background"
          />
        </div>

        <div className="sm:col-span-2">
          <Label>Archivo adjunto</Label>
          <div className="mt-1.5 border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Subiendo archivo...</p>
              </div>
            ) : file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-8 w-8 text-accent" />
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">Archivo subido correctamente</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">Arrastra un archivo o haz clic para seleccionar</p>
                <p className="text-xs text-muted-foreground/70">PDF, DOCX, MP4, PPTX, etc.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={() => navigate("/")}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saving} className="shadow-lg shadow-primary/20">
          {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          {saving ? "Guardando..." : "Guardar Recurso"}
        </Button>
      </div>
    </form>
  );
}
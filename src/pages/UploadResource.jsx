import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import ResourceForm from "../components/upload/ResourceForm";

export default function UploadResource() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link to="/edu" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Subir Nuevo Recurso</h1>
        <p className="text-muted-foreground mt-1">Completa el formulario para registrar un recurso educativo</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 sm:p-8">
        <ResourceForm />
      </div>
    </div>
  );
}
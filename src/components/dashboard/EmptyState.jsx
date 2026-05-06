import { FolderOpen, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
        <FolderOpen className="h-10 w-10 text-muted-foreground/50" />
      </div>
      <h3 className="font-heading font-semibold text-lg mb-2">Sin recursos aún</h3>
      <p className="text-muted-foreground text-sm max-w-sm mb-6">
        Comienza subiendo tus apuntes, videos o guías para organizarlos en un solo lugar.
      </p>
      <Button asChild>
        <Link to="/edu/upload">
          <Upload className="h-4 w-4 mr-2" />
          Subir primer recurso
        </Link>
      </Button>
    </div>
  );
}
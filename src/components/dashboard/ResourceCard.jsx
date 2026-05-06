import { FileText, Video, BookMarked, MoreVertical, Trash2, ExternalLink, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import moment from "moment";

const typeConfig = {
  apunte: { icon: FileText, label: "Apunte", gradient: "from-blue-500 to-blue-600" },
  video: { icon: Video, label: "Video", gradient: "from-emerald-500 to-emerald-600" },
  guia: { icon: BookMarked, label: "Guía", gradient: "from-amber-500 to-amber-600" },
};

const statusConfig = {
  publicado: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  borrador: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  archivado: "bg-muted text-muted-foreground border-border",
};

export default function ResourceCard({ resource, onDelete }) {
  const config = typeConfig[resource.type] || typeConfig.apunte;
  const Icon = config.icon;

  return (
    <div className="group bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden">
      {/* Color stripe */}
      <div className={`h-1.5 bg-gradient-to-r ${config.gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-lg hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {resource.file_url && (
                <DropdownMenuItem onClick={() => window.open(resource.file_url, "_blank")}>
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Abrir archivo
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(resource.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="font-heading font-semibold text-base mb-1.5 line-clamp-2">{resource.title}</h3>
        {resource.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{resource.description}</p>
        )}

        <div className="flex items-center flex-wrap gap-2 mb-3">
          <Badge variant="outline" className={statusConfig[resource.status] || statusConfig.borrador}>
            {resource.status || "borrador"}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {config.label}
          </Badge>
          {resource.semester && (
            <Badge variant="secondary" className="text-xs">
              Sem. {resource.semester}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">{resource.subject}</span>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {moment(resource.created_date).fromNow()}
          </div>
        </div>
      </div>
    </div>
  );
}
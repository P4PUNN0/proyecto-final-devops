import { ExternalLink, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BookCard({ book }) {
  const coverId = book.cover_i;
  const coverUrl = coverId
    ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    : null;

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-300 group">
      <div className="aspect-[3/4] bg-muted relative overflow-hidden">
        {coverUrl ? (
          <img src={coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-heading font-semibold text-sm line-clamp-2 mb-1">{book.title}</h3>
        {book.author_name && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
            {book.author_name.slice(0, 2).join(", ")}
          </p>
        )}
        <div className="flex items-center justify-between">
          {book.first_publish_year && (
            <Badge variant="secondary" className="text-xs">{book.first_publish_year}</Badge>
          )}
          <a
            href={`https://openlibrary.org${book.key}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
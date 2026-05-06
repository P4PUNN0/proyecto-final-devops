import { useState } from "react";
import { Search, Loader2, BookOpen, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BookCard from "../components/explore/BookCard";

const SUGGESTIONS = ["Calculus", "Physics", "Machine Learning", "Data Science", "Economics", "Statistics"];

export default function ExploreAPI() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchBooks = async (searchQuery) => {
    const q = searchQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=12`);
    const data = await res.json();
    setBooks(data.docs || []);
    setLoading(false);
  };

  const handleSuggestion = (suggestion) => {
    setQuery(suggestion);
    searchBooks(suggestion);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight">Explorar Biblioteca</h1>
        <p className="text-muted-foreground mt-1">
          Busca libros en la API de Open Library para complementar tus estudios
        </p>
      </div>

      {/* Search */}
      <div className="bg-card rounded-xl border border-border p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            searchBooks();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Busca por título, autor o tema..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-background"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Buscar</span>
          </Button>
        </form>

        {/* Suggestions */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Sparkles className="h-4 w-4 text-muted-foreground mt-0.5" />
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => handleSuggestion(s)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Buscando libros...</p>
          </div>
        </div>
      ) : books.length > 0 ? (
        <div>
          <p className="text-sm text-muted-foreground mb-4">{books.length} resultados encontrados</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {books.map((book) => (
              <BookCard key={book.key} book={book} />
            ))}
          </div>
        </div>
      ) : searched ? (
        <div className="text-center py-16">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground">No se encontraron resultados. Intenta con otro término.</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-6">
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="font-heading font-semibold text-lg mb-2">Descubre recursos académicos</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Usa el buscador o las sugerencias para encontrar libros y materiales que complementen tus materias.
          </p>
        </div>
      )}
    </div>
  );
}
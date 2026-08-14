"use client";

import { useState, useCallback, useRef, type FormEvent } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void | Promise<void>;
  isLoading?: boolean;
  placeholder?: string;
}

/**
 * Search input with debounce-ready pattern and submit button.
 */
export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = 'Search products (e.g., "SKF 6205-2Z")',
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (trimmed.length > 0) {
        onSearch(trimmed);
      }
    },
    [query, onSearch]
  );

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none">
            🔍
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full rounded-lg border border-foreground/15 bg-background pl-10 pr-4 py-2.5 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-foreground/30 disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || query.trim().length === 0}
          className="rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Searching…
            </span>
          ) : (
            "Research"
          )}
        </button>
      </div>
    </form>
  );
}

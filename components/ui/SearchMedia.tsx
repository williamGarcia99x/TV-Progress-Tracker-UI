"use client";

import { useState } from "react";

interface SearchMediaProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchMedia({
  onSearch,
  placeholder = "Search TV shows or movies...",
  className,
}: SearchMediaProps) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder}
        className="border rounded px-3 py-2 w-full"
        aria-label="Search TV shows or movies"
      />
      <button type="submit" className="hidden">
        Search
      </button>
    </form>
  );
}

export default SearchMedia;

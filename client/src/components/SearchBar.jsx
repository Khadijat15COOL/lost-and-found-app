import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function SearchBar({ placeholder, onSearch }) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto group">
      <div className="relative flex items-center">
        <Search className="absolute left-4 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
        <Input
          type="text"
          placeholder={placeholder || "Search for laptops, IDs, keys..."}
          className="h-14 w-full rounded-2xl border-white/20 bg-white/10 pl-12 pr-32 text-lg backdrop-blur-md transition-all placeholder:text-white/60 focus:bg-white focus:text-slate-900 focus:placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 shadow-xl"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute right-2">
          <Button 
            type="submit" 
            size="lg"
            className="rounded-xl bg-white text-blue-600 hover:bg-blue-50"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
}

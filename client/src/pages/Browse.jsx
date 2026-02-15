import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';


export default function Browse() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [filterType, setFilterType] = useState('all');
  const [category, setCategory] = useState('All Categories');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => apiRequest('/api/items'),
  });

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase());

    // Logic: if filterType is 'all', show 'lost' or 'found'. 
    // If filterType is 'lost', 'found', or 'claimed', show only that type.
    let matchesType = false;
    if (filterType === 'all') {
      matchesType = item.status === 'lost' || item.status === 'found';
    } else {
      matchesType = item.status === filterType;
    }

    const matchesCategory = category === 'All Categories' ? true : item.category === category;

    return matchesSearch && matchesType && matchesCategory;
  });


  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">

          {/* Sidebar Filters */}
          <div className="hidden lg:block">
            <FilterBar
              currentFilter={filterType}
              onFilterChange={setFilterType}
              currentCategory={category}
              onCategoryChange={setCategory}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">

            {/* Mobile Filter & Search */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by keyword..."
                    className="pl-9 bg-white"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">Search</Button>
              </div>

              {/* Mobile Filter Toggles (simplified for mobile) */}
              <div className="flex gap-2 overflow-x-auto pb-2 lg:hidden">
                <Button
                  size="sm"
                  variant={filterType === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilterType('all')}
                >
                  All
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'lost' ? 'default' : 'outline'}
                  onClick={() => setFilterType('lost')}
                >
                  Lost
                </Button>
                <Button
                  size="sm"
                  variant={filterType === 'found' ? 'default' : 'outline'}
                  onClick={() => setFilterType('found')}
                >
                  Found
                </Button>
              </div>
            </div>

            {/* Results Grid */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="rounded-full bg-slate-100 p-6 mb-4">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">No items found</h3>
                <p className="mt-2 text-slate-500">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button
                  variant="link"
                  className="mt-4 text-blue-600"
                  onClick={() => {
                    setQuery('');
                    setFilterType('all');
                    setCategory('All Categories');
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

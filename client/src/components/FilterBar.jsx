import React from 'react';
import { Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function FilterBar({ currentFilter, onFilterChange, currentCategory, onCategoryChange }) {
  const filters = ['all', 'lost', 'found', 'claimed'];
  const categories = ['All Categories', 'Electronics', 'Books', 'Bags', 'Bottles', 'Accessories', 'Other'];

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm sticky top-20">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filters</h3>
        <Filter className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Type</label>
          <div className="flex flex-col gap-2">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={currentFilter === filter ? 'default' : 'outline'}
                className={`w-full justify-start ${currentFilter === filter ? 'bg-blue-600' : ''}`}
                onClick={() => onFilterChange(filter)}
              >
                {filter === 'all' ? 'All Items' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Items`}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">Category</label>
          <Select value={currentCategory} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

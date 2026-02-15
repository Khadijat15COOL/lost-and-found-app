import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function ItemCard({ item }) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-card transition-all hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3">
          <Badge
            className={`${item.status === 'lost'
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
              } text-white border-0 shadow-sm`}
          >
            {item.status.toUpperCase()}
          </Badge>
        </div>
        {item.status === 'claimed' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
            <span className="rotate-[-10deg] rounded-md border-4 border-white px-4 py-2 text-2xl font-bold uppercase tracking-widest text-white shadow-xl">
              Claimed
            </span>
          </div>
        )}

      </div>
      <CardContent className="p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {item.category}
        </div>
        <h3 className="mb-3 line-clamp-1 text-lg font-bold text-foreground group-hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0" />
            <span>{item.date}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50/50 p-4">
        <Link to={`/item/${item.id}`} className="w-full">
          <Button variant="ghost" className="w-full justify-between text-blue-600 hover:bg-blue-50 hover:text-blue-700">
            View Details
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

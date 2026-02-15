import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ItemCard from '../components/ItemCard';
import SearchBar from '../components/SearchBar';
import { campusImage } from '../data/mockItems';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';


export default function Home() {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => apiRequest('/api/items'),
  });

  // Show top 4 recent items that are NOT claimed
  const recentItems = items
    .filter(item => item.status !== 'claimed')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);


  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] flex-col justify-center overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={campusImage}
            alt="University Campus"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Lost something on campus?
            <br />
            <span className="text-blue-400">We'll help you find it.</span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl">
            The Bells University official FindIt portal. Report lost items,
            browse found inventory, and reclaim your belongings securely.
          </p>

          <div className="mb-12">
            <SearchBar onSearch={(q) => window.location.href = `/browse?q=${q}`} />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/report">
              <Button size="lg" className="h-14 rounded-full border border-white/20 bg-white/10 px-8 text-lg backdrop-blur-sm hover:bg-white/20">
                I Lost Something
              </Button>
            </Link>
            <Link to="/report?type=found">
              <Button size="lg" className="h-14 rounded-full border border-white/20 bg-white/10 px-8 text-lg backdrop-blur-sm hover:bg-white/20">
                I Found Something
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Secure Verification',
                desc: 'Items are verified by student affairs before being listed to prevent spam.'
              },
              {
                icon: Clock,
                title: 'Real-time Updates',
                desc: 'Get notified instantly when a matching item is reported on campus.'
              },
              {
                icon: Users,
                title: 'Campus Wide',
                desc: 'Connected network across all lecture halls, hostels, and recreational areas.'
              }
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-6 rounded-full bg-blue-50 p-4 text-blue-600">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">Recent Activity</h2>
              <p className="mt-2 text-slate-600">Latest lost and found reports from around campus</p>
            </div>
            <Link to="/browse">
              <Button variant="ghost" className="hidden sm:flex group">
                View All Items
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {recentItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {recentItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-500">No recent activity found.</p>
            </div>
          )}

          <div className="mt-8 sm:hidden">
            <Link to="/browse">
              <Button className="w-full" variant="outline">
                View All Items
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

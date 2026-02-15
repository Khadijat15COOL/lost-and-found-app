import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, MessageSquare, ChevronLeft, Mail, CheckCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';


export default function ItemDetail() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const { toast } = useToast();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['/api/items'],
    queryFn: () => apiRequest('/api/items'),
  });

  const item = items.find((i) => i.id === id);

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;


  if (!item) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Item not found</h2>
        <Link to="/browse">
          <Button className="mt-4">Back to Browse</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link to="/browse" className="mb-6 inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-2">
          {/* Image Section */}
          <div className="relative h-96 bg-slate-100 lg:h-auto">
            <img
              src={item.image}
              alt={item.name}
              className="h-full w-full object-cover"
            />
            {item.status === 'claimed' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <span className="rotate-[-10deg] rounded-lg border-4 border-white px-8 py-4 text-4xl font-bold uppercase tracking-widest text-white shadow-2xl">
                  CLAIMED
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex flex-col p-8 lg:p-12">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant="outline" className="uppercase tracking-wider">
                    {item.category}
                  </Badge>
                  <span className="text-sm text-slate-400">ID: #{item.id}</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">{item.name}</h1>
              </div>
              <Badge
                className={`px-3 py-1 text-sm ${item.status === 'lost'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-emerald-500 hover:bg-emerald-600'
                  } text-white border-0`}
              >
                {item.status.toUpperCase()}
              </Badge>
            </div>

            {item.status === 'claimed' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-bold">This item has been successfully resolved/claimed.</span>
              </div>
            )}

            <div className="mb-8 space-y-4">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">Location</p>
                  <p className="font-medium text-slate-900">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-slate-500">Date Reported</p>
                  <p className="font-medium text-slate-900">{item.date}</p>
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            <div className="mb-8 font-medium">
              <h3 className="mb-3 text-lg font-bold text-slate-900">Description</h3>
              <p className="text-lg leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>

            {item.status === 'claimed' && (
              <div className="mt-auto p-6 bg-blue-50 border border-blue-100 rounded-xl text-center">
                <h3 className="text-sm font-bold uppercase tracking-wide text-blue-600 mb-2">Item Holder Information</h3>
                <p className="text-slate-700 font-medium mb-4">This item is currently with: <span className="text-blue-700 font-bold">{item.holderInfo}</span></p>
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                  onClick={() => toast({ title: "Holder Contact", description: item.holderInfo })}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Holder
                </Button>
                <p className="mt-2 text-xs text-slate-500 italic">Case resolved on {item.claimedAt ? new Date(item.claimedAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            )}


            {item.status !== 'claimed' && (
              <div className="mt-auto rounded-xl bg-slate-50 p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                  Reporter Information
                </h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                    {item.reporterName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{item.reporterName}</p>
                    <p className="text-sm text-slate-500">Verified Student</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 font-bold"
                    onClick={() => {
                      toast({ title: "Reporter Contact", description: item.reporterContact || 'student@bells.edu' });
                    }}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full font-bold"
                    onClick={async () => {
                      if (!currentUser) {
                        toast({ title: "Login required", description: "Please log in to contact the reporter.", variant: "destructive" });
                        return;
                      }
                      if (currentUser.id === item.reporterId) {
                        toast({ title: "Action not allowed", description: "You cannot report your own item.", variant: "destructive" });
                        return;
                      }
                      if (!item.reporterId) {
                        toast({ title: "Error", description: "This item cannot be reported (missing owner info).", variant: "destructive" });
                        return;
                      }
                      try {
                        await apiRequest("/api/notifications", {
                          method: "POST",
                          body: JSON.stringify({
                            userId: item.reporterId,
                            message: `${currentUser.fullName} wants to talk to you about the ${item.name} you reported`
                          })
                        });
                        toast({ title: "Message Sent", description: "The owner has been notified that you want to talk." });
                      } catch (err) {
                        toast({ title: "Failed to notify", description: err.message, variant: "destructive" });
                      }
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Report
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

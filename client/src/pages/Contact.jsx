import React from 'react';
import { MapPin, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export default function Contact() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900">Contact Support</h1>
          <p className="mt-4 text-lg text-slate-600">
            Have questions about the Lost & Found system? Found a bug? Or need help reclaiming an item? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Student Affairs Office</h3>
                <p className="text-slate-600">The Bells University, Ota</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Email Us</h3>
                <p className="mt-1 text-slate-600">student-affairs@bells.edu.ng</p>
                <p className="text-slate-600">support@findit.edu.ng</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Call Us</h3>
                <p className="mt-1 text-slate-600">+234 703 318 0831 BELLS UNI</p>
                <p className="text-slate-600">Mon - Fri, 8am - 4pm</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Send a Message</h2>
              <p className="text-slate-500 mb-8 -mt-4">We typically respond within 24 hours.</p>

              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your name" className="bg-slate-50" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Your email" className="bg-slate-50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" className="bg-slate-50" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-[150px] bg-slate-50"
                  />
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="rounded-lg bg-blue-600 p-1.5 text-white">
                <Search className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FindIt
              </span>
            </div>
            <p className="max-w-xs text-sm leading-6 text-slate-400">
              The Bells University Lost & Found portal helps the campus community recover lost belongings efficiently and securely.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Quick Links</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link to="/" className="text-sm hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/browse" className="text-sm hover:text-white transition-colors">Browse Items</Link>
              </li>
              <li>
                <Link to="/report" className="text-sm hover:text-white transition-colors">Report Lost Item</Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm hover:text-white transition-colors">Student Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Support</h3>
            <ul role="list" className="mt-6 space-y-4">
              <li>
                <Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Admin</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 text-center">
          <p className="text-xs leading-5 text-slate-500">
            &copy; 2026 The Bells University. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

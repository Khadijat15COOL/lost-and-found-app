import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Upload, Search, Gift, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';


export default function ReportItem() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const initialType = searchParams.get('type') || 'lost';
  const [type, setType] = useState(initialType);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    contact: ''
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Image too large",
          description: "Please upload an image smaller than 2MB.",
          variant: "destructive"
        });
        return;
      }
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a report.",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    try {
      const payload = {
        ...formData,
        status: type,
        image: imagePreview || null,
        reporterName: user.fullName,
        reporterContact: user.gmail || formData.contact || 'student@bells.edu',
      };

      await apiRequest("/api/items", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      queryClient.invalidateQueries({ queryKey: ["/api/items"] });

      toast({
        title: "Report Submitted",
        description: "Your report has been successfully submitted and is now live.",
      });

      navigate('/browse');
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-slate-900">Report an Item</h1>
          <p className="mt-2 text-slate-600">
            Submit a lost or found item to the Bells University network.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Type Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Item Details</Label>
              <p className="text-sm text-slate-500">Provide as much information as possible to help identify the item.</p>

              <div className="grid grid-cols-2 gap-4">
                <div
                  className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${type === 'lost'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                  onClick={() => setType('lost')}
                >
                  <Search className={`mx-auto mb-2 h-6 w-6 ${type === 'lost' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${type === 'lost' ? 'text-blue-900' : 'text-slate-600'}`}>Lost Item</span>
                </div>
                <div
                  className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${type === 'found'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                  onClick={() => setType('found')}
                >
                  <Gift className={`mx-auto mb-2 h-6 w-6 ${type === 'found' ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className={`font-semibold ${type === 'found' ? 'text-blue-900' : 'text-slate-600'}`}>Found Item</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="name">What is it?</Label>
                <Input
                  id="name"
                  placeholder="e.g. Blue Hydro Flask, iPhone 13, Wallet"
                  required
                  className="bg-slate-50"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select required value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Bags">Bags</SelectItem>
                    <SelectItem value="Bottles">Bottles</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Select required value={formData.location} onValueChange={(val) => setFormData({ ...formData, location: val })}>
                  <SelectTrigger className="bg-slate-50">
                    <SelectValue placeholder="Where was it?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ELT">ELT</SelectItem>
                    <SelectItem value="Buft LT">Buft LT</SelectItem>
                    <SelectItem value="Adenuga building">Adenuga building</SelectItem>
                    <SelectItem value="Uptown">Uptown</SelectItem>
                    <SelectItem value="Downtown">Downtown</SelectItem>
                    <SelectItem value="Campus Field">Campus Field</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  required
                  className="bg-slate-50"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide distinguishing features like scratches, stickers, contents, etc."
                  className="min-h-[120px] bg-slate-50"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Upload Photo</Label>
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center rounded-lg border-2 border-dashed border-slate-300 px-6 py-10 hover:bg-slate-50 transition-colors">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-slate-300" />
                      <div className="mt-4 flex text-sm leading-6 text-slate-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500">
                          <span>Click to upload</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs leading-5 text-slate-500">Max size 2MB (JPG, PNG, GIF)</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contact">Contact Number (Optional)</Label>
                <Input
                  id="contact"
                  placeholder="+234..."
                  className="bg-slate-50"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
                <p className="text-xs text-slate-500">Only visible to verified users.</p>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 font-bold">
              Submit Report
            </Button>

          </form>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, ProtectedRoute } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import {
    Mail,
    Edit3,
    Save,
    Loader2,
    Shield,
    Bell,
    FileText,
    CheckSquare,
    PlusCircle,
    Settings as SettingsIcon,
    Trash2
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';

function DashboardContent() {
    const { user, updateProfile, isUpdatePending, logout } = useAuth();
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState('my-reports');
    const [isEditing, setIsEditing] = useState(false);

    // Notifications and reports will be fetched from API
    const { data: items = [], isLoading: itemsLoading } = useQuery({
        queryKey: ['/api/items'],
        queryFn: () => apiRequest('/api/items'),
    });

    const { data: fetchedNotifications = [], isLoading: noticesLoading } = useQuery({
        queryKey: ['/api/notifications'],
        queryFn: () => apiRequest('/api/notifications'),
    });

    const myReports = items.filter(item => item.reporterId === user?.id && item.status !== 'claimed');
    const myResolvedReports = items.filter(item => item.reporterId === user?.id && item.status === 'claimed');

    const [formData, setFormData] = useState({
        fullName: '',
        department: '',
        level: '',
        phoneNumber: '',
        notifications: true,
        privacyMode: false,
    });

    const resolveMutation = useMutation({
        mutationFn: async ({ id, holderInfo }) => {
            return apiRequest(`/api/items/${id}/resolve`, {
                method: "POST",
                body: JSON.stringify({ holderInfo }),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/items'] });
            toast({
                title: "Item Resolved",
                description: "The item has been marked as claimed.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id) => {
            return apiRequest(`/api/items/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/items'] });
            toast({
                title: "Report Deleted",
                description: "The report has been removed.",
            });
        },
        onError: (error) => {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    });

    const deleteNotifMutation = useMutation({
        mutationFn: async (id) => {
            return apiRequest(`/api/notifications/${id}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
        },
    });


    // Initialize form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                fullName: user.fullName || '',
                department: user.department || '',
                level: user.level || '',
                phoneNumber: user.phoneNumber || '',
                notifications: true,
                privacyMode: false,
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {
            await updateProfile(formData);
            setIsEditing(false);
            toast({
                title: "Profile updated!",
                description: "Your profile changes have been saved successfully.",
            });
        } catch (error) {
            toast({
                title: "Update failed",
                description: error.message || "Could not update profile",
                variant: "destructive",
            });
        }
    };

    const removeNotification = (id) => {
        deleteNotifMutation.mutate(id);
    };

    const markAsResolved = (id) => {
        const holderInfo = prompt("Please enter the contact info of the person who holds the item (or school number):");
        if (holderInfo === null) return; // Cancelled
        if (!holderInfo.trim()) {
            toast({
                title: "Information required",
                description: "You must provide holder information to resolve the item.",
                variant: "destructive"
            });
            return;
        }
        resolveMutation.mutate({ id, holderInfo });
    };

    const deleteReport = (id) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            deleteMutation.mutate(id);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            toast({
                title: "Logged out",
                description: "You have been logged out successfully.",
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
    };



    const departments = [
        'Computer Science', 'Information Technology', 'Software Engineering', 'Cyber Security',
        'Data Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
        'Business Administration', 'Accounting', 'Economics', 'Mass Communication', 'Law',
        'Medicine', 'Nursing', 'Pharmacy', 'Other'
    ];

    const levels = ['100', '200', '300', '400', '500', '600'];

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-5xl mx-auto space-y-8">

                {/* Profile Header Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-blue-500/20">
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-3xl font-extrabold text-slate-900">{user?.fullName || 'John Student'}</h1>
                            <p className="text-slate-500 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {user?.gmail || 'student@bells.edu'}
                            </p>
                            <div className="flex gap-2 mt-2">
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full uppercase tracking-wider">STUDENT</span>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">Verified Student</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="rounded-xl border-slate-200 text-slate-700 font-bold px-6"
                            onClick={() => setActiveTab('settings')}
                        >
                            <SettingsIcon className="w-4 h-4 mr-2" />
                            Settings
                        </Button>
                        <Link to="/report">
                            <Button className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 shadow-lg shadow-blue-500/25">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                New Report
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-4 border-b border-slate-200 pb-px overflow-x-auto">
                    {[
                        { id: 'my-reports', name: 'My Reports', icon: FileText },
                        { id: 'notifications', name: 'Notifications', count: fetchedNotifications.length },
                        { id: 'claim-requests', name: 'Claim Requests', icon: CheckSquare, count: myResolvedReports.length },
                        { id: 'settings', name: 'Profile Settings', icon: SettingsIcon },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative whitespace-nowrap ${activeTab === tab.id
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50 rounded-t-xl'
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            {tab.icon && <tab.icon className="w-4 h-4" />}
                            {tab.name}
                            {tab.count > 0 && (
                                <span className="ml-1 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'my-reports' && (
                        <div className="space-y-6">
                            {myReports.length > 0 ? (
                                myReports.map((item) => (
                                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center">
                                        <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        {item.date} • {item.location}
                                                    </p>
                                                    <p className="text-slate-600 mt-2 line-clamp-2">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${item.status === 'claimed' ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                                                    {item.status === 'claimed' ? 'RESOLVED' : 'OPEN'}
                                                </span>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                {item.status !== 'claimed' && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-lg h-10 px-6 font-bold text-slate-600"
                                                            onClick={() => toast({ title: "Edit logic", description: "Edit form would open here (Simulation)" })}
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="rounded-lg h-10 px-6 font-bold text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                                                            onClick={() => markAsResolved(item.id)}
                                                        >
                                                            Mark as Resolved
                                                        </Button>
                                                    </>
                                                )}
                                                {item.status === 'claimed' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-slate-400 hover:text-red-500"
                                                        onClick={() => deleteReport(item.id)}
                                                    >
                                                        Remove Report
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">You haven't reported any items yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-4">
                            {fetchedNotifications.length > 0 ? (
                                fetchedNotifications.map((notif) => (
                                    <div key={notif.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:bg-blue-50/20">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <Bell className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-bold">{notif.message}</p>
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {new Date(notif.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => removeNotification(notif.id)}
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No new notifications.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'claim-requests' && (
                        <div className="space-y-6">
                            {myResolvedReports.length > 0 ? (
                                myResolvedReports.map((item) => (
                                    <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 flex flex-col md:flex-row gap-6 items-center bg-emerald-50/30">
                                        <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale" />
                                        </div>
                                        <div className="flex-grow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900">{item.name}</h3>
                                                    <p className="text-sm text-slate-500 mt-1">
                                                        Resolved on {item.claimedAt ? new Date(item.claimedAt).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                    <p className="text-emerald-700 font-medium mt-2">
                                                        Holder: {item.holderInfo}
                                                    </p>
                                                </div>
                                                <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase bg-emerald-100 text-emerald-600">
                                                    RESOLVED
                                                </span>
                                            </div>
                                            <div className="flex gap-3 mt-4">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-slate-400 hover:text-red-500"
                                                    onClick={() => deleteReport(item.id)}
                                                >
                                                    Remove Archived Report
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-slate-500 font-medium">No resolved items yet. Mark your reports as resolved to see them here.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <Card className="bg-white border-slate-200 shadow-sm rounded-2xl">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl text-slate-900 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-blue-600" />
                                        Profile Information
                                    </CardTitle>
                                    <CardDescription>
                                        {isEditing ? 'Edit your profile details below' : 'View and manage your personal information'}
                                    </CardDescription>
                                </div>
                                {!isEditing ? (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditing(true)}
                                        className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold"
                                    >
                                        <Edit3 className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-slate-500">
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={handleSave}
                                            disabled={isUpdatePending}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                        >
                                            {isUpdatePending ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-6 pt-4">
                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-slate-500">Full Name</Label>
                                        <Input
                                            value={formData.fullName}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            disabled={!isEditing}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-500">Phone Number</Label>
                                        <Input
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            disabled={!isEditing}
                                            className="bg-slate-50 border-slate-200"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-500">Department</Label>
                                        <Select
                                            value={formData.department}
                                            onValueChange={(value) => setFormData({ ...formData, department: value })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select department" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {departments.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-500">Level</Label>
                                        <Select
                                            value={formData.level}
                                            onValueChange={(value) => setFormData({ ...formData, level: value })}
                                            disabled={!isEditing}
                                        >
                                            <SelectTrigger className="bg-slate-50 border-slate-200">
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {levels.map((level) => (
                                                    <SelectItem key={level} value={level}>{level} Level</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-900">Email Notifications</p>
                                        <p className="text-sm text-slate-500">Receive alerts when someone talks to you about your items</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={formData.notifications}
                                        disabled={!isEditing}
                                        onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                                        className="w-5 h-5 accent-blue-600 rounded"
                                    />
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600 hover:bg-red-50 font-medium">
                                        Log Out Account
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Dashboard() {
    return (
        <ProtectedRoute>
            <DashboardContent />
        </ProtectedRoute>
    );
}

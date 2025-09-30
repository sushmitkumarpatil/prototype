'use client';

export const dynamic = 'force-dynamic';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Calendar, Plus, Search, Edit, Trash2, Eye, MapPin, Clock, Users, RefreshCw, CheckCircle, XCircle, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAllEvents, approveEvent, rejectEvent } from "@/lib/api/admin";
import { motion } from "framer-motion";

interface Event {
    id: number;
    title: string;
    description?: string;
    location?: string;
    start_time: string;
    end_time?: string;
    approval_status: string;
    author: {
        id: number;
        full_name: string;
        email: string;
        role: string;
    };
    tenant?: {
        name: string;
        subdomain: string;
    };
    created_at: string;
    approval_status?: string;
}

export default function AdminEventsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<Event[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
    });

    useEffect(() => {
        loadEvents();
    }, []);

    const loadEvents = async (page: number = 1, search?: string) => {
        try {
            setLoading(true);
            const response = await getAllEvents(page, 20, search);

            if (response.success) {
                setEvents(response.events);
                setPagination(response.pagination);
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load events',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveEvent = async (eventId: number) => {
        try {
            await approveEvent(eventId);
            toast({
                title: 'Success',
                description: 'Event approved successfully',
                variant: 'success',
            });
            loadEvents(pagination.page, searchTerm);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve event',
                variant: 'destructive',
            });
        }
    };

    const handleRejectEvent = async (eventId: number) => {
        try {
            await rejectEvent(eventId);
            toast({
                title: 'Success',
                description: 'Event rejected successfully',
                variant: 'success',
            });
            loadEvents(pagination.page, searchTerm);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject event',
                variant: 'destructive',
            });
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        loadEvents(1, value);
    };

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            event.author.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const totalEvents = pagination.total;
    const pendingEvents = events.filter(event => event.approval_status === 'PENDING').length;
    const approvedEvents = events.filter(event => event.approval_status === 'APPROVED').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
                <p className="text-muted-foreground">
                    Review and manage event submissions from users.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            All events
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Events</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Events</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedEvents}</div>
                        <p className="text-xs text-muted-foreground">
                            Already approved
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Filtered Results</CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{filteredEvents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Matching search criteria
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Event Management */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CalendarDays className="h-5 w-5" />
                                Event Management
                            </CardTitle>
                            <CardDescription>
                                Review and manage all event submissions from users.
                            </CardDescription>
                        </div>
                        <Button onClick={() => loadEvents(pagination.page, searchTerm)} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search events by title, location, author..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading events...</span>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Event</TableHead>
                                        <TableHead>Date & Time</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredEvents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No events found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredEvents.map((event) => (
                                            <TableRow key={event.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{event.title}</div>
                                                        {event.description && (
                                                            <div className="text-sm text-muted-foreground line-clamp-2">
                                                                {event.description.substring(0, 100)}...
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {new Date(event.start_time).toLocaleDateString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        {event.location || 'No location specified'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium">{event.author.full_name}</div>
                                                        {event.author.is_verified && (
                                                            <CheckCircle className="h-4 w-4 text-success" />
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={event.approval_status === 'APPROVED' ? 'default' :
                                                                event.approval_status === 'PENDING' ? 'secondary' : 'destructive'}
                                                        className={event.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                  event.approval_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                  'bg-red-100 text-red-800'}
                                                    >
                                                        {event.approval_status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(event.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {event.approval_status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-success border-success hover:bg-success/10"
                                                                    onClick={() => handleApproveEvent(event.id)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-destructive border-destructive hover:bg-destructive/10"
                                                                    onClick={() => handleRejectEvent(event.id)}
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-1" />
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}

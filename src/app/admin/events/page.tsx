'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { events, users } from "@/lib/mock-data";
import { Calendar, Plus, Search, Edit, Trash2, Eye, MapPin, Clock, Users, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function AdminEventsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterLocation, setFilterLocation] = useState('all');
    const [filterDate, setFilterDate] = useState('all');

    const getAuthor = (authorId: number) => users.find((user) => user.id === authorId);

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = filterLocation === 'all' || event.location === filterLocation;
        
        // Date filtering logic
        let matchesDate = true;
        if (filterDate !== 'all') {
            const eventDate = new Date(event.date);
            const now = new Date();
            if (filterDate === 'upcoming') {
                matchesDate = eventDate > now;
            } else if (filterDate === 'past') {
                matchesDate = eventDate < now;
            } else if (filterDate === 'today') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);
                matchesDate = eventDate >= today && eventDate < tomorrow;
            }
        }
        
        return matchesSearch && matchesLocation && matchesDate;
    });

    const upcomingEvents = events.filter(event => new Date(event.date) > new Date()).length;
    const pastEvents = events.filter(event => new Date(event.date) < new Date()).length;
    const todayEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return eventDate >= today && eventDate < tomorrow;
    }).length;

    const totalEvents = events.length;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getEventStatus = (dateString: string) => {
        const eventDate = new Date(dateString);
        const now = new Date();
        
        if (eventDate < now) {
            return { status: 'Past', variant: 'secondary' as const };
        } else if (eventDate.getTime() - now.getTime() < 24 * 60 * 60 * 1000) { // Within 24 hours
            return { status: 'Today', variant: 'destructive' as const };
        } else {
            return { status: 'Upcoming', variant: 'default' as const };
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
                <p className="text-muted-foreground">
                    Manage events, monitor registrations, and track event performance.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalEvents}</div>
                        <p className="text-xs text-muted-foreground">+3 since last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingEvents}</div>
                        <p className="text-xs text-muted-foreground">Scheduled events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Events</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayEvents}</div>
                        <p className="text-xs text-muted-foreground">Events happening today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Past Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pastEvents}</div>
                        <p className="text-xs text-muted-foreground">Completed events</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Actions */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle>Event Management</CardTitle>
                            <CardDescription>
                                Manage and monitor all events in the system.
                            </CardDescription>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Create New Event
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search events by title, description, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Select value={filterLocation} onValueChange={setFilterLocation}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Location" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Locations</SelectItem>
                                <SelectItem value="Online">Online</SelectItem>
                                <SelectItem value="College Auditorium">College Auditorium</SelectItem>
                                <SelectItem value="Conference Room">Conference Room</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={filterDate} onValueChange={setFilterDate}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Date Filter" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Dates</SelectItem>
                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                <SelectItem value="today">Today</SelectItem>
                                <SelectItem value="past">Past</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Events Table */}
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map((event) => {
                                const author = getAuthor(event.authorId);
                                const eventStatus = getEventStatus(event.date);
                                return (
                                    <TableRow key={event.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-lg bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{event.title}</div>
                                                    <div className="text-sm text-muted-foreground line-clamp-2">
                                                        {event.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                {formatDate(event.date)}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                                {event.location}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={eventStatus.variant}>
                                                {eventStatus.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm">
                                                {author?.name}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-8">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">No events found</h3>
                            <p className="text-muted-foreground">
                                Try adjusting your search criteria or create a new event.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

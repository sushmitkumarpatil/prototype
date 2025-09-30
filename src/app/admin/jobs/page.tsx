'use client';

export const dynamic = 'force-dynamic';

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Plus, Search, Edit, Trash2, Eye, MapPin, Building2, Clock, Users, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { getAllJobs, approveJob, rejectJob } from "@/lib/api/admin";

interface Job {
    id: number;
    title: string;
    company_name: string;
    location?: string;
    description: string;
    job_type: string;
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
}

export default function AdminJobsPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        pages: 0,
        hasNext: false,
        hasPrev: false,
    });

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async (page: number = 1, search?: string, jobType?: string) => {
        try {
            setLoading(true);
            const response = await getAllJobs(page, 20, search, jobType);

            if (response.success) {
                setJobs(response.jobs);
                setPagination(response.pagination);
            }
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load jobs',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveJob = async (jobId: number) => {
        try {
            await approveJob(jobId);
            toast({
                title: 'Success',
                description: 'Job approved successfully',
                variant: 'success',
            });
            loadJobs(pagination.page, searchTerm);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to approve job',
                variant: 'destructive',
            });
        }
    };

    const handleRejectJob = async (jobId: number) => {
        try {
            await rejectJob(jobId);
            toast({
                title: 'Success',
                description: 'Job rejected successfully',
                variant: 'success',
            });
            loadJobs(pagination.page, searchTerm);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to reject job',
                variant: 'destructive',
            });
        }
    };

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        loadJobs(1, value);
    };

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            job.author.full_name.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const totalJobs = pagination.total;
    const pendingJobs = jobs.filter(job => job.approval_status === 'PENDING').length;
    const approvedJobs = jobs.filter(job => job.approval_status === 'APPROVED').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Job Management</h1>
                <p className="text-muted-foreground">
                    Review and manage all job postings from users.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            All jobs
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingJobs}</div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Approved Jobs</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{approvedJobs}</div>
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
                        <div className="text-2xl font-bold">{filteredJobs.length}</div>
                        <p className="text-xs text-muted-foreground">
                            Matching search criteria
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Job Management */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5" />
                                Job Management
                            </CardTitle>
                            <CardDescription>
                                Review and manage all job postings from users.
                            </CardDescription>
                        </div>
                        <Button onClick={() => loadJobs(pagination.page, searchTerm)} variant="outline" size="sm">
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
                                placeholder="Search jobs by title, company, author..."
                                value={searchTerm}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading jobs...</span>
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Position</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Posted</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredJobs.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                                No jobs found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredJobs.map((job) => (
                                            <TableRow key={job.id}>
                                                <TableCell>
                                                    <div className="font-medium">{job.title}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                                        {job.company_name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                                        {job.location || 'Not specified'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-medium">{job.author.full_name}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={job.approval_status === 'APPROVED' ? 'default' :
                                                                job.approval_status === 'PENDING' ? 'secondary' : 'destructive'}
                                                        className={job.approval_status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                                  job.approval_status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                                  'bg-red-100 text-red-800'}
                                                    >
                                                        {job.approval_status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {job.approval_status === 'PENDING' && (
                                                            <>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-success border-success hover:bg-success/10"
                                                                    onClick={() => handleApproveJob(job.id)}
                                                                >
                                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                                    Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="text-destructive border-destructive hover:bg-destructive/10"
                                                                    onClick={() => handleRejectJob(job.id)}
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
        </div>
    );
}

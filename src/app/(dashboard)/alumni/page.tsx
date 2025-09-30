'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FollowButton } from "@/components/FollowButton";
import { FollowCounts } from "@/components/FollowCounts";
import { Building, Linkedin, MessageSquare, Search, Users, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRecentlyActiveUsers, getUserDirectory, type DirectoryUser, type DirectoryFilters } from "@/lib/api/directory";
import { useToast } from "@/hooks/use-toast";

const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
}

// Helper function to get the correct image URL
const getImageUrl = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return undefined;
  // If it's already a full URL (external), return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // If it's a relative path (upload), prepend the backend URL
  if (imageUrl.startsWith('/uploads/')) {
    return `http://localhost:8000${imageUrl}`;
  }
  return imageUrl;
};

const AlumniCard = ({ user }: { user: DirectoryUser }) => {
  const router = useRouter();

  const handleMessage = () => {
    router.push('/messages');
  };

  const formatLastSeen = (lastLogin: string, createdAt: string) => {
    const lastSeenDate = new Date(lastLogin || createdAt);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `Active ${diffInHours}h ago`;
    if (diffInHours < 168) return `Active ${Math.floor(diffInHours / 24)}d ago`;
    return `Active ${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <Card className="text-center hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <Avatar className="mx-auto h-20 w-20">
          <AvatarImage src={getImageUrl(user.profile?.profile_picture_url)} alt={user.full_name} />
          <AvatarFallback className="text-2xl">{getInitials(user.full_name)}</AvatarFallback>
        </Avatar>
        <h3 className="mt-4 font-headline text-lg font-semibold">{user.full_name}</h3>
        <p className="text-sm text-muted-foreground">{user.profile?.job_title || 'Student'}</p>
        {user.profile?.company && (
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5">
            <Building className="h-3 w-3" />
            {user.profile.company}
          </p>
        )}
        <div className="mt-2 flex flex-wrap gap-1 justify-center">
          {user.profile?.batch_year && (
            <Badge variant="outline">Batch of {user.profile.batch_year}</Badge>
          )}
          {user.role === 'ALUMNUS' && (
            <Badge variant="secondary">Alumni</Badge>
          )}
        </div>

        {/* Last seen indicator */}
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {formatLastSeen(user.last_login, user.created_at)}
        </div>

        {/* Follow counts */}
        <FollowCounts userId={user.id} className="mt-3 justify-center" />

        {/* Follow and message buttons */}
        <div className="mt-4 flex flex-col gap-2">
          <FollowButton
            userId={user.id}
            userName={user.full_name}
            showMessageButton={true}
            onMessage={handleMessage}
            size="sm"
          />
          {user.profile?.linkedin_url && (
            <Button variant="ghost" size="sm" asChild>
              <a href={user.profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function AlumniPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<DirectoryFilters>({
    page: 1,
    limit: 8, // Show 8 items per page
    role: 'ALL'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<string>('all');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 8,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    loadUsers();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      // Load recently active users by default, or filtered users if filters are applied
      const hasActiveFilters = filters.search ||
        (filters.course && filters.course !== 'all') ||
        (filters.batch_year && filters.batch_year !== 'all');

      const response = hasActiveFilters
        ? await getUserDirectory(filters)
        : await getUserDirectory(filters); // Always use getUserDirectory for consistent pagination

      if (response.success) {
        setUsers(response.data);
        // Set pagination info if available
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            ...response.pagination,
            page: filters.page || 1
          }));
        } else {
          // Fallback pagination calculation
          const total = response.data?.length || 0;
          setPagination(prev => ({
            ...prev,
            page: filters.page || 1,
            total,
            pages: Math.ceil(total / filters.limit!),
            hasNext: (filters.page || 1) < Math.ceil(total / filters.limit!),
            hasPrev: (filters.page || 1) > 1
          }));
        }
      }
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchTerm,
      course: selectedCourse === 'all' ? undefined : selectedCourse,
      batch_year: selectedBatch === 'all' ? undefined : selectedBatch ? parseInt(selectedBatch) : undefined,
      page: 1
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCourse('all');
    setSelectedBatch('all');
    setFilters({
      page: 1,
      limit: 8,
      role: 'ALL'
    });
  };

  return (
     <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col items-start gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold">Find Alumni</h1>
          <p className="text-muted-foreground">Network with experienced professionals from your college.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Showing recently active users</span>
        </div>
      </div>

       <Card className="mb-6">
        <CardContent className="p-4">
           <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, company..."
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                    <SelectTrigger><SelectValue placeholder="Filter by Course" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                        <SelectItem value="Electronics & Communication">Electronics & Communication</SelectItem>
                        <SelectItem value="Information Science">Information Science</SelectItem>
                        <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger><SelectValue placeholder="Filter by Batch" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2022">2022</SelectItem>
                        <SelectItem value="2021">2021</SelectItem>
                        <SelectItem value="2020">2020</SelectItem>
                        <SelectItem value="2019">2019</SelectItem>
                        <SelectItem value="2018">2018</SelectItem>
                        <SelectItem value="2017">2017</SelectItem>
                        <SelectItem value="2016">2016</SelectItem>
                        <SelectItem value="2015">2015</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button onClick={handleSearch} disabled={loading}>
                    Apply Filters
                  </Button>
                  <Button variant="outline" onClick={clearFilters} disabled={loading}>
                    Clear
                  </Button>
                </div>
           </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No users found</h3>
          <p className="text-muted-foreground">Try adjusting your search filters or check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
            {users.map(user => <AlumniCard key={user.id} user={user} />)}
          </div>

          {/* Pagination Controls */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-muted-foreground">
                Showing {((filters.page! - 1) * filters.limit!) + 1} to {Math.min(filters.page! * filters.limit!, pagination.total)} of {pagination.total} users
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, prev.page! - 1) }))}
                  disabled={filters.page === 1 || loading}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(pagination.pages - 4, filters.page! - 2)) + i;
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === filters.page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilters(prev => ({ ...prev, page: pageNum }))}
                        disabled={loading}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, page: Math.min(pagination.pages, prev.page! + 1) }))}
                  disabled={filters.page === pagination.pages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

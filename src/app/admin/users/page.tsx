'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorDisplay } from '@/components/ErrorDisplay';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllUsers } from '@/lib/api/admin';

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (user && (user.role === 'TENANT_ADMIN' || user.role === 'SUPER_ADMIN')) {
      loadUsers();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const usersResponse = await getAllUsers(1, 50);
      if (usersResponse.success && usersResponse.users) {
        setUsers(usersResponse.users);
      } else {
        setUsers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusUpdate = async (userId: number, status: string) => {
    try {
      // Get auth token from localStorage or cookies
      const authToken = localStorage.getItem('authToken') || document.cookie
        .split('; ')
        .find(row => row.startsWith('authToken='))
        ?.split('=')[1];

      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Call the actual API to update user status
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user status');
      }

      const result = await response.json();

      toast({
        title: 'User Status Updated',
        description: result.message || `User status has been updated to ${status}.`,
      });

      // Reload users to reflect changes
      await loadUsers();
    } catch (err: any) {
      toast({
        title: 'Update Failed',
        description: err.message || 'Failed to update user status',
        variant: 'destructive',
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.account_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading users..." />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="Failed to load users"
        onRetry={loadUsers}
      />
    );
  }

  if (!user || (user.role !== 'TENANT_ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <ErrorDisplay
        error="You do not have permission to access this page."
        title="Access Denied"
        showRetry={false}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage user accounts, permissions, and approval status.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 px-3 py-1">
            {filteredUsers.length} users
          </Badge>
          <div className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-xl"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
        <CardHeader className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-gray-900 dark:text-white text-xl">
                  Users ({filteredUsers.length})
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage user accounts and permissions
                </p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
              Export Users
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                        {user.full_name?.charAt(0) || 'U'}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                        user.account_status === 'APPROVED' ? 'bg-green-500' :
                        user.account_status === 'PENDING' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{user.full_name}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <Badge variant="outline" className="text-xs font-medium">
                          {user.role}
                        </Badge>
                        <Badge
                          variant={
                            user.account_status === 'APPROVED' ? 'default' :
                            user.account_status === 'PENDING' ? 'secondary' :
                            'destructive'
                          }
                          className="text-xs font-medium"
                        >
                          {user.account_status}
                        </Badge>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {user.account_status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleUserStatusUpdate(user.id, 'APPROVED')}
                          className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all"
                        >
                          <UserCheck className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUserStatusUpdate(user.id, 'REJECTED')}
                          className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {user.account_status === 'APPROVED' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUserStatusUpdate(user.id, 'PENDING')}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
                      >
                        Suspend
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No users found</h3>
                <p className="text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

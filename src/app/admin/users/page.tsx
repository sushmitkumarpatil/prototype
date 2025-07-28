'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { users } from "@/lib/mock-data";
import { MoreHorizontal, Search } from "lucide-react";

const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('');
}

export default function AdminUsersPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View, manage, and moderate all portal users.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by name, email, or USN..." className="pl-9" />
                    </div>
                    <Button>Search</Button>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatar} />
                                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">{user.usn || 'N/A'}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell><Badge variant={user.role === 'alumnus' ? "secondary" : "outline"}>{user.role}</Badge></TableCell>
                                <TableCell>{user.batch}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                     <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem>Deactivate User</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete User</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}

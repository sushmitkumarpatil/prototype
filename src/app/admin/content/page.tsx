'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthor, posts, jobs, events } from "@/lib/mock-data";
import { MoreHorizontal, Search } from "lucide-react";

export default function AdminContentPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
                <CardDescription>Review, edit, and manage all user-generated content.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="mb-4 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search by content, author..." className="pl-9" />
                    </div>
                    <Button>Search</Button>
                </div>
                <Tabs defaultValue="posts">
                    <TabsList>
                        <TabsTrigger value="posts">General Posts ({posts.length})</TabsTrigger>
                        <TabsTrigger value="jobs">Job Posts ({jobs.length})</TabsTrigger>
                        <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
                    </TabsList>
                    <TabsContent value="posts" className="mt-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Content</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {posts.map(post => {
                                    const author = getAuthor(post.authorId);
                                    return (
                                        <TableRow key={`post-${post.id}`}>
                                            <TableCell className="max-w-sm">
                                                <p className="font-medium truncate">{post.title || "Post"}</p>
                                                <p className="text-sm text-muted-foreground truncate">{post.content}</p>
                                            </TableCell>
                                            <TableCell>{author?.name}</TableCell>
                                            <TableCell>{post.postedAt}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">View & Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="jobs" className="mt-4">
                        <Table>
                           <TableHeader>
                                <TableRow>
                                    <TableHead>Job Title</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                 {jobs.map(job => {
                                    const author = getAuthor(job.authorId);
                                    return (
                                        <TableRow key={`job-${job.id}`}>
                                            <TableCell className="font-medium">{job.title}</TableCell>
                                            <TableCell>{job.company}</TableCell>
                                            <TableCell>{author?.name}</TableCell>
                                            <TableCell>{job.postedAt}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">View & Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TabsContent>
                    <TabsContent value="events" className="mt-4">
                        <Table>
                           <TableHeader>
                                <TableRow>
                                    <TableHead>Event Title</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map(event => {
                                    const author = getAuthor(event.authorId);
                                    return (
                                        <TableRow key={`event-${event.id}`}>
                                            <TableCell className="font-medium">{event.title}</TableCell>
                                            <TableCell>{event.location}</TableCell>
                                            <TableCell>{author?.name}</TableCell>
                                            <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                <Button variant="outline" size="sm">View & Edit</Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

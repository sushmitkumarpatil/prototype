'use client';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAuthor, posts } from "@/lib/mock-data";

const reports = [
    { id: 1, type: 'post', contentId: 2, reason: 'Inappropriate language', reportedBy: 3, status: 'Pending' },
    { id: 2, type: 'user', contentId: 4, reason: 'Spamming job board', reportedBy: 1, status: 'Resolved' },
]

export default function AdminReportsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>Review and manage user-submitted reports.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Reported Item</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reports.map((report) => {
                            const reportedUser = getAuthor(report.contentId);
                            const reporter = getAuthor(report.reportedBy);
                            
                            return (
                                <TableRow key={report.id}>
                                    <TableCell>
                                        <div className="font-medium">{reportedUser?.name}</div>
                                        <div className="text-sm text-muted-foreground">Reported by {reporter?.name}</div>
                                    </TableCell>
                                    <TableCell><Badge variant="secondary">{report.type}</Badge></TableCell>
                                    <TableCell>{report.reason}</TableCell>
                                    <TableCell><Badge variant={report.status === 'Pending' ? 'destructive' : 'default'}>{report.status}</Badge></TableCell>
                                    <TableCell>
                                        <Button variant="outline" size="sm" className="mr-2">View Details</Button>
                                         <Button size="sm">Take Action</Button>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

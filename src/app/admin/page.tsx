'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the admin dashboard
        router.replace('/admin/dashboard');
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardContent className="flex items-center justify-center p-8">
                    <div className="flex items-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        <span className="text-gray-900 dark:text-white">Redirecting to admin dashboard...</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

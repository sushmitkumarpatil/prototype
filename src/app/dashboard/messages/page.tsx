'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { users } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Paperclip, Search, Send } from "lucide-react";
import { useState } from "react";

const getInitials = (name: string) => {
  return name.split(' ').map((n) => n[0]).join('');
}

export default function MessagesPage() {
    const conversations = users.filter(u => u.role === 'alumnus').slice(0, 4);
    const [selectedConversation, setSelectedConversation] = useState(conversations[0]);

    const messages = [
        { from: 'me', text: 'Hello! I am a final year CS student and I am very interested in your work at Innovate Corp. Could I ask you a few questions about frontend development?' },
        { from: 'other', text: 'Hi Anjali, of course! Happy to help. What would you like to know?' },
        { from: 'me', text: 'Thank you! I was wondering what key skills are most in-demand right now for a frontend role?' },
    ]

  return (
    <div className="h-[calc(100vh-theme(spacing.24))]">
    <Card className="h-full w-full grid grid-cols-[300px_1fr]">
        <div className="flex flex-col border-r">
            <CardHeader className="p-4">
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                </div>
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                {conversations.map(conv => (
                    <button key={conv.id} onClick={() => setSelectedConversation(conv)} className={cn("flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted", selectedConversation.id === conv.id && 'bg-muted')}>
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={conv.avatar} />
                            <AvatarFallback>{getInitials(conv.name)}</AvatarFallback>
                        </Avatar>
                        <div className="w-full overflow-hidden">
                            <p className="font-semibold truncate">{conv.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{conv.id % 2 === 0 ? 'You: Sure, let me check...' : 'Thanks for the advice!'}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">2h</span>
                    </button>
                ))}
                </div>
            </ScrollArea>
        </div>
        <div className="flex flex-col h-full">
            {selectedConversation && (
            <>
            <div className="flex items-center gap-3 border-b p-4">
                <Avatar>
                    <AvatarImage src={selectedConversation.avatar} />
                    <AvatarFallback>{getInitials(selectedConversation.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{selectedConversation.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedConversation.jobTitle} at {selectedConversation.company}</p>
                </div>
            </div>
            <ScrollArea className="flex-1 p-6">
                <div className="space-y-4">
                {messages.map((msg, i) => (
                    <div key={i} className={cn("flex", msg.from === 'me' ? 'justify-end' : 'justify-start')}>
                        <div className={cn("max-w-xs rounded-lg px-4 py-2 text-sm lg:max-w-md", msg.from === 'me' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                </div>
            </ScrollArea>
             <div className="border-t p-4">
                <div className="relative">
                    <Input placeholder="Type a message..." className="pr-24" />
                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
                        <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                        <Button size="sm" className="bg-accent hover:bg-accent/90">Send <Send className="ml-2 h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            </>
            )}
        </div>
    </Card>
    </div>
  );
}

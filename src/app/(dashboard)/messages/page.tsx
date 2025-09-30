'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Paperclip, Search, Send, MessageSquare, Users, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getFollowing } from "@/lib/api/follows";
import { useMessaging } from "@/contexts/MessagingContext";
import { getMessages, type Message, getOrCreateConversation } from "@/lib/api/messaging";
import { MutualFriendsDropdown } from "@/components/MutualFriendsDropdown";
import { useToast } from "@/hooks/use-toast";

const getInitials = (name: string) => {
  return name.split(' ').map((n) => n[0]).join('');
}

export default function MessagesPage() {
    const { user } = useAuth();
    const { conversations, messages, sendMessage, markAsRead, refreshConversations, isLoading, setActiveConversation, loadConversationMessages } = useMessaging();
    const [selectedConversation, setSelectedConversation] = useState<any>(null);
    const [newMessage, setNewMessage] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        refreshConversations();
    }, []);

    useEffect(() => {
        if (selectedConversation) {
            // Set as active conversation for real-time updates
            setActiveConversation(selectedConversation);
            // Load conversation messages
            loadConversationMessages(selectedConversation.id);
            markAsRead(selectedConversation.id);
        }
    }, [selectedConversation]);

    // Get messages for the current conversation
    const conversationMessages = selectedConversation ? messages.filter(msg =>
        (msg.senderId === selectedConversation.participantA_id || msg.senderId === selectedConversation.participantB_id) &&
        (msg.receiverId === selectedConversation.participantA_id || msg.receiverId === selectedConversation.participantB_id)
    ) : [];



    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation) return;

        const otherParticipantId = selectedConversation.participantA_id === user?.id
            ? selectedConversation.participantB_id
            : selectedConversation.participantA_id;

        try {
            await sendMessage(otherParticipantId, newMessage);
            setNewMessage('');
            // Real-time updates will handle showing the new message via socket
        } catch (error) {
            console.error('Error sending message:', error);
            toast({
                title: 'Error',
                description: 'Failed to send message',
                variant: 'destructive',
            });
        }
    };

    const handleStartConversation = async (userId: number, userName: string) => {
        try {
            const response = await getOrCreateConversation(userId);
            if (response.success) {
                // Refresh conversations to show the new one
                await refreshConversations();

                // Find and select the conversation
                const newConversation = conversations.find(conv =>
                    (conv.participantA_id === userId || conv.participantB_id === userId) &&
                    (conv.participantA_id === user?.id || conv.participantB_id === user?.id)
                );

                if (newConversation) {
                    setSelectedConversation(newConversation);
                }

                toast({
                    title: 'Conversation Started',
                    description: `You can now message ${userName}`,
                });
            }
        } catch (error) {
            console.error('Error starting conversation:', error);
            toast({
                title: 'Error',
                description: 'Failed to start conversation. Make sure you both follow each other.',
                variant: 'destructive',
            });
        }
    };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-theme(spacing.24))]">
    <Card className="h-full w-full grid grid-cols-[300px_1fr]">
        <div className="flex flex-col border-r">
            <CardHeader className="p-4 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search messages..." className="pl-9" />
                </div>
                <MutualFriendsDropdown
                    onStartConversation={handleStartConversation}
                    className="w-full"
                />
            </CardHeader>
            <ScrollArea className="flex-1">
                <div className="space-y-1 p-2">
                {conversations.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="font-medium">No conversations yet</p>
                        <p className="text-sm mb-3">Start messaging your mutual friends!</p>
                        <div className="text-xs bg-muted/50 rounded-lg p-3 text-left">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4" />
                                <span className="font-medium">How to start messaging:</span>
                            </div>
                            <ol className="space-y-1 text-xs">
                                <li>1. Use the "Mutual Friends" button above</li>
                                <li>2. Or find someone on the Alumni page</li>
                                <li>3. Send them a follow request</li>
                                <li>4. Wait for them to follow you back</li>
                                <li>5. Once you follow each other, you can message!</li>
                            </ol>
                        </div>
                    </div>
                ) : (
                    conversations.map(conv => {
                        const otherParticipant = conv.participant;
                        return (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setSelectedConversation(conv);
                                }}
                                className={cn("flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-muted", selectedConversation?.id === conv.id && 'bg-muted')}
                            >
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={otherParticipant?.profile?.profile_picture_url} />
                                    <AvatarFallback>{getInitials(otherParticipant?.full_name || 'User')}</AvatarFallback>
                                </Avatar>
                                <div className="w-full overflow-hidden">
                                    <p className="font-semibold truncate">{otherParticipant?.full_name || 'Unknown User'}</p>
                                    <p className="text-sm text-muted-foreground truncate">
                                        {conv.lastMessage?.content || 'No messages yet'}
                                    </p>
                                </div>
                                {conv.unreadCount > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                        {conv.unreadCount}
                                    </Badge>
                                )}
                            </button>
                        );
                    })
                )}
                </div>
            </ScrollArea>
        </div>
        <div className="flex flex-col h-full">
            {selectedConversation ? (
            <>
            <div className="flex items-center gap-3 border-b p-4">
                <Avatar>
                    <AvatarImage src={selectedConversation.participant?.profile?.profile_picture_url} />
                    <AvatarFallback>{getInitials(selectedConversation.participant?.full_name || 'User')}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{selectedConversation.participant?.full_name || 'Unknown User'}</p>
                    <p className="text-sm text-muted-foreground">Online</p>
                </div>
            </div>
            <ScrollArea className="flex-1 p-6">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                ) : conversationMessages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                        <div className="text-center">
                            <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {conversationMessages.map((message) => (
                            <div key={message.id} className={cn("flex", message.senderId === user?.id ? 'justify-end' : 'justify-start')}>
                                <div className={cn("max-w-xs rounded-lg px-4 py-2 text-sm lg:max-w-md", message.senderId === user?.id ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    <p>{message.content}</p>
                                    <p className="text-xs opacity-70 mt-1">
                                        {(() => {
                                            const date = new Date(message.timestamp);
                                            return isNaN(date.getTime()) ? 'Just now' : date.toLocaleTimeString();
                                        })()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
             <div className="border-t p-4">
                <div className="relative">
                    <Input
                        placeholder="Type a message..."
                        className="pr-24"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <div className="absolute right-2 top-1/2 flex -translate-y-1/2 gap-2">
                        <Button variant="ghost" size="icon"><Paperclip className="h-4 w-4" /></Button>
                        <Button
                            size="sm"
                            className="bg-accent hover:bg-accent/90"
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                        >
                            Send <Send className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
            </>
            ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm">Choose a conversation from the sidebar</p>
                    </div>
                </div>
            )}
        </div>
    </Card>
    </div>
  );
}

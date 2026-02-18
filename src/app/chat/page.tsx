'use client';

import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from "@/components/dashboard-layout";
import { Search, Plus, Send, MoreVertical, Phone, Video, Info, User, Shield, Users as UsersIcon, X, Loader2, ChevronLeft, Mic, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [chats, setChats] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [peopleSearchQuery, setPeopleSearchQuery] = useState('');
    const [showNewChat, setShowNewChat] = useState(false);
    const [employees, setEmployees] = useState<any[]>([]);
    const [creatingRoom, setCreatingRoom] = useState(false);
    const [showContactInfo, setShowContactInfo] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
    const [groupName, setGroupName] = useState('');
    const [isGroupMode, setIsGroupMode] = useState(false);

    // Call States
    const [callStatus, setCallStatus] = useState<'calling' | 'active' | 'ended' | null>(null);
    const [callType, setCallType] = useState<'voice' | 'video' | null>(null);
    const [callTime, setCallTime] = useState(0);
    const [activeCall, setActiveCallState] = useState<any>(null);
    const [incomingCall, setIncomingCall] = useState<any>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);

    const ringtoneRef = useRef<HTMLAudioElement | null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initUser = async () => {
            const storedUser = localStorage.getItem('user');
            const role = localStorage.getItem('userRole');
            let userObj = null;

            if (role === 'admin') {
                try {
                    const res = await fetch('/api/employees');
                    const emps = await res.json();
                    let adminEmp = emps.find((e: any) => e.role.toLowerCase().includes('admin') || e.name === 'HR Admin');

                    if (!adminEmp) {
                        const createRes = await fetch('/api/employees', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                name: 'HR Admin',
                                role: 'Administrator',
                                email: 'admin@taskey.com',
                                avatar: 'H',
                                department: 'Administration'
                            })
                        });
                        adminEmp = await createRes.json();
                    }
                    userObj = adminEmp;
                    setCurrentUser(adminEmp);
                    localStorage.setItem('user', JSON.stringify(adminEmp));
                } catch (err) {
                    console.error('Error initializing admin user:', err);
                }
            } else if (storedUser) {
                userObj = JSON.parse(storedUser);
                setCurrentUser(userObj);
            }

            if (userObj?._id) {
                fetchChats(userObj._id);
            }
        };

        initUser();
        fetchEmployees();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (activeChat) {
            fetchMessages(activeChat._id);
            interval = setInterval(() => {
                fetchMessages(activeChat._id);
                fetchChats();
            }, 3000);
        } else {
            interval = setInterval(() => {
                fetchChats();
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [activeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (callStatus === 'active') {
            timer = setInterval(() => {
                setCallTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [callStatus]);

    // Polling for incoming calls
    useEffect(() => {
        if (!currentUser) return;

        const pollInterval = setInterval(async () => {
            if (callStatus || incomingCall) return; // Don't poll if already in a call or have an incoming call

            try {
                const res = await fetch(`/api/calls?userId=${currentUser._id}&poll=true`);
                const data = await res.json();
                if (data && data._id && (!incomingCall || incomingCall._id !== data._id)) {
                    setIncomingCall(data);
                    playRingtone();
                }
            } catch (err) {
                console.error('Error polling calls:', err);
            }
        }, 4000);

        return () => clearInterval(pollInterval);
    }, [currentUser, callStatus, incomingCall]);

    // Polling for active call status (Sync end call)
    useEffect(() => {
        if (!activeCall || !callStatus || activeCall.isGroup) return;

        const syncInterval = setInterval(async () => {
            try {
                const res = await fetch(`/api/calls?callId=${activeCall._id}`);
                const data = await res.json();
                if (data && (data.status === 'ended' || data.status === 'rejected')) {
                    endCall(true); // End locally
                }
            } catch (err) {
                console.error('Error syncing call status:', err);
            }
        }, 3000);

        return () => clearInterval(syncInterval);
    }, [activeCall, callStatus]);

    // Camera Access for Active Video Call
    useEffect(() => {
        if (callStatus === 'active' && callType === 'video') {
            startCamera();
        } else if (callStatus !== 'active') {
            stopCamera();
        }
    }, [callStatus, callType]);

    const playRingtone = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            const audioCtx = new AudioContext();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // A4

            // Pulsing effect
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 1);

            // Loop while incomingCall exists
            const ringInterval = setInterval(() => {
                if (!incomingCall && !callStatus) {
                    clearInterval(ringInterval);
                    return;
                }
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, audioCtx.currentTime);
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 1);
            }, 1500);
        } catch (err) {
            console.error('Audio context error:', err);
        }
    };

    const stopRingtone = () => {
        // Handled by interval check
    }

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            setLocalStream(stream);
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
        } catch (err: any) {
            console.error('Camera access error:', err);
            if (err.name === 'NotReadableError') {
                alert("Camera Error: The camera is already in use by another application or tab. Please close other apps using the camera and try again.");
            } else if (err.name === 'NotAllowedError') {
                alert("Camera Permission Denied: Please enable camera access in your browser settings.");
            } else {
                alert("Could not start video: " + err.message);
            }
            endCall(); // Reset call state if hardware fails
        }
    };

    const stopCamera = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchChats = async (forceUserId?: string) => {
        const idToUse = forceUserId || currentUser?._id;
        if (!idToUse) return;

        try {
            const res = await fetch(`/api/chats?userId=${idToUse}`);
            const data = await res.json();
            if (res.ok) setChats(data);
        } catch (err) {
            console.error('Error fetching chats:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch('/api/employees');
            const data = await res.json();
            if (res.ok) setEmployees(data);
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    const fetchMessages = async (chatId: string) => {
        try {
            const res = await fetch(`/api/messages?chatId=${chatId}`);
            const data = await res.json();
            if (res.ok) setMessages(data);
        } catch (err) {
            console.error('Error fetching messages:', err);
        }
    };

    const toggleParticipant = (id: string) => {
        if (selectedParticipants.includes(id)) {
            setSelectedParticipants(selectedParticipants.filter(p => p !== id));
        } else {
            setSelectedParticipants([...selectedParticipants, id]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedParticipants.length === 0 || !currentUser) return;
        setCreatingRoom(true);
        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participants: [currentUser._id, ...selectedParticipants],
                    isGroup: true,
                    name: groupName.trim()
                })
            });
            const data = await res.json();
            if (res.ok) {
                setChats([data, ...chats.filter(c => c._id !== data._id)]);
                setActiveChat(data);
                setShowNewChat(false);
                setIsGroupMode(false);
                setSelectedParticipants([]);
                setGroupName('');
            }
        } catch (err) {
            console.error('Error creating group chat:', err);
        } finally {
            setCreatingRoom(false);
        }
    };

    const createChat = async (participantId: string) => {
        if (!currentUser || !currentUser._id) return;
        setCreatingRoom(true);
        try {
            const res = await fetch('/api/chats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    participants: [currentUser._id, participantId],
                    isGroup: false
                })
            });
            const data = await res.json();
            if (res.ok) {
                // Add to chats if not already there, and set as active
                setChats(prev => {
                    const exists = prev.find(c => c._id === data._id);
                    if (exists) return [data, ...prev.filter(c => c._id !== data._id)];
                    return [data, ...prev];
                });
                setActiveChat(data);
                setShowNewChat(false);
            } else {
                console.error('Failed to create chat:', data.error);
                alert('Could not start chat: ' + data.error);
            }
        } catch (err) {
            console.error('Error creating chat:', err);
        } finally {
            setCreatingRoom(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat || !currentUser) return;

        setSending(true);
        try {
            const res = await fetch(`/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: activeChat._id,
                    sender: currentUser._id,
                    senderName: currentUser.name,
                    content: newMessage.trim()
                })
            });
            const data = await res.json();
            if (res.ok) {
                setMessages([...messages, data]);
                setNewMessage('');
                fetchChats(); // Refresh order
            }
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSending(false);
        }
    };

    const startCall = async (type: 'voice' | 'video') => {
        if (!activeChat || !currentUser) return;

        const otherParticipant = activeChat.participants.find((p: any) => p._id !== currentUser._id);
        if (!otherParticipant) return;

        setCallType(type);
        setCallStatus('calling');
        setCallTime(0);

        try {
            const res = await fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    from: currentUser._id,
                    to: otherParticipant._id,
                    type,
                    chatId: activeChat._id,
                    isGroup: activeChat.isGroup
                })
            });
            const data = await res.json();
            if (res.ok) {
                setActiveCallState({ ...data, isGroup: activeChat.isGroup });

                // Poll for acceptance
                const checkStatus = setInterval(async () => {
                    const statusRes = await fetch(`/api/calls?userId=${otherParticipant._id}&poll=true`); // Simplified check
                    // In a real app we'd use a specific call status check
                    // For now, after 5 seconds simplify to active for demo
                }, 3000);

                setTimeout(() => {
                    clearInterval(checkStatus);
                    setCallStatus('active');
                }, 4000);
            }
        } catch (err) {
            console.error('Error starting call:', err);
        }
    };

    const acceptCall = async () => {
        if (!incomingCall) return;
        stopRingtone();
        try {
            await fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'accept', callId: incomingCall._id })
            });
            setCallType(incomingCall.type);
            setCallStatus('active');
            setActiveCallState(incomingCall);
            setIncomingCall(null);
        } catch (err) {
            console.error('Error accepting call:', err);
        }
    };

    const rejectCall = async () => {
        if (!incomingCall) return;
        stopRingtone();
        try {
            await fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reject', callId: incomingCall._id })
            });
            setIncomingCall(null);
        } catch (err) {
            console.error('Error rejecting call:', err);
        }
    };

    const endCall = async (localOnly: boolean = false) => {
        setCallStatus('ended');
        if (activeCall && !localOnly) {
            await fetch('/api/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'end', callId: activeCall._id })
            });
        }
        stopCamera();
        setTimeout(() => {
            setCallStatus(null);
            setCallType(null);
            setCallTime(0);
            setActiveCallState(null);
        }, 1500);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getChatName = (chat: any) => {
        if (chat.isGroup) return chat.name;
        const other = chat.participants.find((p: any) => p._id !== currentUser?._id);
        return other?.name || 'Unknown User';
    };

    const getChatImage = (chat: any) => {
        if (chat.isGroup) return null;
        const other = chat.participants.find((p: any) => p._id !== currentUser?._id);
        return other?.image;
    };

    const getChatAvatar = (chat: any) => {
        if (chat.isGroup) return 'G';
        const other = chat.participants.find((p: any) => p._id !== currentUser?._id);
        return other?.avatar || other?.name?.charAt(0) || '?';
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                    <Loader2 className="animate-spin text-primary" size={40} />
                    <p className="text-muted-foreground font-medium">Connecting to secure chat server...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="flex bg-card md:rounded-2xl md:border-2 md:border-primary/5 shadow-2xl overflow-hidden h-[calc(100vh-130px)] md:h-[calc(100vh-140px)] relative">
                {/* Sidebar */}
                <div className={cn(
                    "w-full md:w-80 border-r flex flex-col bg-secondary/10 transition-all duration-300",
                    activeChat ? "hidden md:flex" : "flex"
                )}>
                    <div className="p-4 border-b space-y-4 bg-card">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Messages</h2>
                            <button
                                onClick={() => setShowNewChat(true)}
                                className="p-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search conversations..."
                                className="w-full bg-secondary border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {chats.length === 0 ? (
                            <div className="p-8 text-center space-y-4">
                                <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
                                    <MessageSquare size={32} />
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">No conversations yet. Start a new chat to connect with your team.</p>
                            </div>
                        ) : (
                            chats
                                .filter(chat => getChatName(chat).toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((chat) => (
                                    <div
                                        key={chat._id}
                                        onClick={() => setActiveChat(chat)}
                                        className={cn(
                                            "p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-primary/5",
                                            activeChat?._id === chat._id ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-secondary/30"
                                        )}
                                    >
                                        <div className="w-12 h-12 rounded-2xl bg-card text-primary border-2 border-primary/10 flex items-center justify-center font-bold shadow-sm overflow-hidden shrink-0">
                                            {getChatImage(chat) ? (
                                                <img src={getChatImage(chat)} className="w-full h-full object-cover" />
                                            ) : (
                                                getChatAvatar(chat)
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-2">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h3 className="text-sm font-bold truncate">{getChatName(chat)}</h3>
                                                <span className="text-[10px] text-muted-foreground">
                                                    {chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Now'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {chat.lastMessage?.content || 'Started a new conversation'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={cn(
                    "flex-1 flex flex-col bg-card transition-all duration-300",
                    !activeChat ? "hidden md:flex" : "flex"
                )}>
                    {activeChat ? (
                        <>
                            {/* Header */}
                            <div className="p-3 md:p-4 border-b flex items-center justify-between shadow-sm z-20 bg-card/80 backdrop-blur-md sticky top-0">
                                <div className="flex items-center gap-2 md:gap-4">
                                    <button
                                        onClick={() => setActiveChat(null)}
                                        className="md:hidden p-2 -ml-2 text-muted-foreground hover:bg-secondary rounded-lg"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold overflow-hidden shrink-0">
                                        {getChatImage(activeChat) ? (
                                            <img src={getChatImage(activeChat)} className="w-full h-full object-cover" />
                                        ) : (
                                            getChatAvatar(activeChat)
                                        )}
                                    </div>
                                    <div onClick={() => setShowContactInfo(true)} className="cursor-pointer">
                                        <h3 className="font-bold text-sm leading-none">{getChatName(activeChat)}</h3>
                                        <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => startCall('voice')}
                                        className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                                    >
                                        <Phone size={18} />
                                    </button>
                                    <button
                                        onClick={() => startCall('video')}
                                        className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                                    >
                                        <Video size={18} />
                                    </button>
                                    <button
                                        onClick={() => setShowContactInfo(!showContactInfo)}
                                        className={cn("p-2 rounded-lg transition-colors", showContactInfo ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary")}
                                    >
                                        <Info size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-secondary/[0.02]">
                                {messages.map((msg, i) => {
                                    const isMe = msg.sender?._id === currentUser?._id;
                                    return (
                                        <div key={i} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                            {!isMe && <span className="text-[10px] font-bold text-primary mb-1 ml-1">{msg.senderName}</span>}
                                            <div className={cn(
                                                "max-w-[70%] px-4 py-3 rounded-2xl shadow-sm text-sm break-words",
                                                isMe
                                                    ? "bg-primary text-primary-foreground rounded-tr-none"
                                                    : "bg-secondary text-foreground rounded-tl-none border border-primary/5"
                                            )}>
                                                {msg.content}
                                            </div>
                                            <span className="text-[10px] text-muted-foreground mt-1.5 px-1 font-medium">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Footer */}
                            <form onSubmit={sendMessage} className="p-4 border-t bg-card">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        className="flex-1 bg-secondary border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                            <div className="w-24 h-24 bg-primary/5 text-primary/40 rounded-full flex items-center justify-center animate-pulse">
                                <MessageSquare size={48} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold">Your Conversations</h2>
                                <p className="text-muted-foreground max-w-xs mx-auto">Select a chat from the left or start a new conversation to begin messaging.</p>
                            </div>
                            <button
                                onClick={() => setShowNewChat(true)}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-xl shadow-primary/20 hover:opacity-90 hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} /> Start New Chat
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Panel: Contact Info / Group Info */}
                {showContactInfo && activeChat && (
                    <div className="absolute inset-0 z-50 md:relative md:inset-auto md:z-10 w-full md:w-80 border-l flex flex-col bg-card animate-in slide-in-from-right duration-300">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h2 className="font-bold">{activeChat.isGroup ? 'Group Details' : 'Contact Info'}</h2>
                            <button onClick={() => setShowContactInfo(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="text-center">
                                <div className="w-24 h-24 rounded-3xl bg-primary/10 text-primary mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-xl overflow-hidden">
                                    {getChatImage(activeChat) ? (
                                        <img src={getChatImage(activeChat)} className="w-full h-full object-cover" />
                                    ) : (
                                        getChatAvatar(activeChat)
                                    )}
                                </div>
                                <h3 className="text-lg font-bold">{getChatName(activeChat)}</h3>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {activeChat.isGroup ? `${activeChat.participants.length} Members` : 'HR Professional'}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">About Details</h4>
                                <div className="space-y-3">
                                    <div className="flex flex-col p-3 bg-secondary/30 rounded-xl gap-1">
                                        <span className="text-[10px] text-muted-foreground font-bold uppercase">Department</span>
                                        <span className="text-sm font-semibold">Engineering & Product</span>
                                    </div>
                                    {!activeChat.isGroup && (
                                        <div className="flex flex-col p-3 bg-secondary/30 rounded-xl gap-1">
                                            <span className="text-[10px] text-muted-foreground font-bold uppercase">Status</span>
                                            <span className="text-sm font-semibold text-emerald-500">Available</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {activeChat.isGroup && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Participants</h4>
                                    <div className="space-y-2">
                                        {activeChat.participants.map((p: any) => (
                                            <div key={p._id} className="flex items-center gap-3 p-2 hover:bg-secondary/30 rounded-xl cursor-default transition-colors border border-primary/5">
                                                <div className="w-8 h-8 rounded-lg bg-card text-primary flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden">
                                                    {p.image ? (
                                                        <img src={p.image} className="w-full h-full object-cover" />
                                                    ) : (
                                                        p.avatar || p.name.charAt(0)
                                                    )}
                                                </div>
                                                <span className="text-sm font-semibold">{p.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {showNewChat && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => { setShowNewChat(false); setIsGroupMode(false); setSelectedParticipants([]); }}></div>
                    <div className="bg-card w-full max-w-md rounded-2xl border-2 border-primary/5 shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b flex items-center justify-between">
                            <h3 className="font-bold">{isGroupMode ? 'Create New Group' : 'New Message'}</h3>
                            <button onClick={() => { setShowNewChat(false); setIsGroupMode(false); setSelectedParticipants([]); }} className="p-1 hover:bg-secondary rounded-lg transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-4 space-y-4">
                            {isGroupMode && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Group Name</label>
                                    <input
                                        type="text"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="e.g. Design Team, Project Zenith..."
                                        className="w-full bg-secondary border-none rounded-xl py-3 px-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={peopleSearchQuery}
                                    onChange={(e) => setPeopleSearchQuery(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="w-full bg-secondary border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                />
                            </div>
                            <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                                {employees
                                    .filter(e => e._id !== currentUser?._id)
                                    .filter(e =>
                                        e.name.toLowerCase().includes(peopleSearchQuery.toLowerCase()) ||
                                        e.email?.toLowerCase().includes(peopleSearchQuery.toLowerCase())
                                    )
                                    .map((emp) => (
                                        <div
                                            key={emp._id}
                                            onClick={() => isGroupMode ? toggleParticipant(emp._id) : createChat(emp._id)}
                                            className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border group",
                                                selectedParticipants.includes(emp._id)
                                                    ? "bg-primary/10 border-primary/20 shadow-inner"
                                                    : "hover:bg-primary/5 border-transparent hover:border-primary/10"
                                            )}
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-card text-primary border-2 border-primary/5 flex items-center justify-center font-bold shadow-sm overflow-hidden group-hover:border-primary/20">
                                                {emp.image ? (
                                                    <img src={emp.image} className="w-full h-full object-cover" />
                                                ) : (
                                                    emp.avatar || emp.name.charAt(0)
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold leading-none">{emp.name}</p>
                                                <p className="text-[10px] text-muted-foreground mt-1">{emp.role}</p>
                                            </div>
                                            {isGroupMode && (
                                                <div className={cn(
                                                    "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                                                    selectedParticipants.includes(emp._id) ? "bg-primary border-primary" : "border-muted-foreground/30"
                                                )}>
                                                    {selectedParticipants.includes(emp._id) && <X size={12} className="text-primary-foreground rotate-45" />}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="p-4 bg-secondary/20 border-t">
                            {isGroupMode ? (
                                <button
                                    onClick={handleCreateGroup}
                                    disabled={!groupName.trim() || selectedParticipants.length === 0 || creatingRoom}
                                    className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all disabled:opacity-50"
                                >
                                    {creatingRoom ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Create Group Chat'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setIsGroupMode(true)}
                                    className="w-full flex items-center justify-center gap-2 py-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-xl transition-all"
                                >
                                    <UsersIcon size={16} /> New Group Chat
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Call Overlay - Full Screen */}
            {callStatus && activeChat && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
                    <div className="fixed inset-0 bg-background/95 backdrop-blur-3xl"></div>

                    <div className="relative z-10 w-full h-full bg-card flex flex-col items-center justify-center text-center">
                        {/* Background for Video - Premium blurred avatar */}
                        {callType === 'video' && (
                            <div className="absolute inset-0 bg-black overflow-hidden">
                                {getChatImage(activeChat) ? (
                                    <img
                                        src={getChatImage(activeChat)}
                                        className="w-full h-full object-cover opacity-50 blur-2xl scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-primary/5 flex items-center justify-center text-[20vw] font-bold text-white/5 opacity-20">
                                        {getChatAvatar(activeChat)}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
                            </div>
                        )}

                        <div className="relative z-20 space-y-8 flex flex-col items-center">
                            <div className={cn(
                                "rounded-[3rem] bg-primary/10 text-primary flex items-center justify-center text-4xl font-bold shadow-2xl relative transition-all duration-700",
                                callType === 'video' ? "w-32 h-32 border-4 border-white/20" : "w-64 h-64",
                                callStatus === 'calling' ? "animate-bounce" : "scale-110"
                            )}>
                                {getChatImage(activeChat) ? (
                                    <img src={getChatImage(activeChat)} className="w-full h-full object-cover rounded-[3rem]" />
                                ) : (
                                    getChatAvatar(activeChat)
                                )}
                                {callStatus === 'calling' && (
                                    <div className="absolute -inset-8 border-4 border-primary/30 rounded-[3.5rem] animate-ping"></div>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-6xl md:text-9xl font-bold tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                    {getChatName(activeChat)}
                                </h2>
                                <p className={cn(
                                    "text-xl font-bold uppercase tracking-[0.6em] transition-colors drop-shadow-lg",
                                    callStatus === 'calling' ? "text-primary animate-pulse" : "text-emerald-400"
                                )}>
                                    {callStatus === 'calling' ? 'Connecting...' : callStatus === 'ended' ? 'Call Ended' : `${callType}ing...`}
                                </p>
                                {callStatus === 'active' && (
                                    <div className="text-4xl font-mono mt-12 text-white/90 font-bold bg-white/10 backdrop-blur-md border border-white/20 px-10 py-4 rounded-full inline-block shadow-2xl">
                                        {formatTime(callTime)}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Controls Bar */}
                        <div className="absolute bottom-24 z-30 flex items-center gap-8 md:gap-16">
                            <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10 shadow-xl">
                                <Mic size={32} />
                            </button>

                            <button
                                onClick={() => endCall(false)}
                                className="w-28 h-28 rounded-[3rem] bg-red-500 text-white flex items-center justify-center shadow-2xl shadow-red-500/50 hover:bg-red-600 hover:scale-110 active:scale-95 transition-all group"
                            >
                                <X size={48} className="group-hover:rotate-90 transition-transform" />
                            </button>

                            {callType === 'video' ? (
                                <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10 shadow-xl">
                                    <Video size={32} />
                                </button>
                            ) : (
                                <button className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-2xl hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-110 border border-white/10 shadow-xl">
                                    <Volume2 size={32} />
                                </button>
                            )}
                        </div>

                        {/* Local Feed Picture-in-Picture */}
                        {callType === 'video' && callStatus === 'active' && (
                            <div className="absolute top-12 right-12 w-64 md:w-80 aspect-[3/4] bg-black rounded-[2.5rem] overflow-hidden border-2 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-40 group hover:scale-105 transition-transform">
                                <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover scale-x-[-1]"
                                />
                                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white/80 uppercase tracking-tighter border border-white/10">
                                    You
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Incoming Call Popup */}
            {incomingCall && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4">
                    <div className="bg-card/80 backdrop-blur-xl border-2 border-primary/20 rounded-3xl p-4 shadow-2xl animate-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center font-bold text-xl overflow-hidden shrink-0 animate-pulse">
                                {incomingCall.from.image ? (
                                    <img src={incomingCall.from.image} className="w-full h-full object-cover" />
                                ) : (
                                    incomingCall.from.avatar || incomingCall.from.name.charAt(0)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold truncate">{incomingCall.from.name}</h4>
                                <p className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">Incoming {incomingCall.type} Call...</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={rejectCall}
                                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                                >
                                    <X size={20} />
                                </button>
                                <button
                                    onClick={acceptCall}
                                    className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 animate-bounce"
                                >
                                    {incomingCall.type === 'video' ? <Video size={20} /> : <Phone size={20} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

// Helper icons
function MessageSquare({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
    );
}

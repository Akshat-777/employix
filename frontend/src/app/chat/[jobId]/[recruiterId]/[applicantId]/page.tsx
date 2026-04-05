"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { JOB_API_END_POINT, USER_API_END_POINT } from "@/utils/constant";
import { io, Socket } from "socket.io-client";
import { Send, Paperclip, Briefcase, User, Info, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MESSAGE_API_ENDPOINT = `${API_URL}/api/v1/messages`;

const ChatPage = () => {
    const params = useParams();
    const jobId = params.jobId as string;
    const recruiterId = params.recruiterId as string;
    const applicantId = params.applicantId as string;

    const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [media, setMedia] = useState<File | null>(null);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [userDetails, setUserDetails] = useState<any>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setLoggedInUserId(localStorage.getItem("userId"));
    }, []);

    const isRecruiter = loggedInUserId === recruiterId;
    const senderId = loggedInUserId;
    const receiverId = isRecruiter ? applicantId : recruiterId;

    // Socket Setup
    useEffect(() => {
        if (!senderId) return;

        const newSocket = io(API_URL, {
            query: { userId: senderId },
            transports: ["websocket"]
        });

        setSocket(newSocket);

        // Tell the server this user is online and ready to receive messages
        newSocket.emit("joinRoom", senderId);

        newSocket.on("receiveMessage", (message: any) => {
            // Only add if it belongs to this conversation
            if (message.jobId === jobId && 
                ((message.senderId === senderId && message.receiverId === receiverId) ||
                 (message.senderId === receiverId && message.receiverId === senderId))) {
                setMessages((prev) => {
                    // Prevent duplicate messages if any
                    if (prev.some((msg) => msg._id === message._id)) return prev;
                    return [...prev, message];
                });
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
            }
        });

        return () => {
            newSocket.close();
        };
    }, [senderId, receiverId, jobId]);

    // Fetch Details
    useEffect(() => {
        const fetchJobAndUser = async () => {
            try {
                if (jobId) {
                    const jobRes = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                        withCredentials: true,
                    });
                    setJobDetails(jobRes.data.job);
                }

                const userIdToFetch = isRecruiter ? applicantId : recruiterId;
                if (userIdToFetch) {
                    const userRes = await axios.get(`${USER_API_END_POINT}/${userIdToFetch}`, {
                        withCredentials: true,
                    });
                    setUserDetails(userRes.data.user);
                }
            } catch (err) {
                console.error("Failed to fetch job/user details:", err);
            }
        };

        if (loggedInUserId) {
            fetchJobAndUser();
        }
    }, [jobId, applicantId, recruiterId, isRecruiter, loggedInUserId]);

    // Fetch Messages
    useEffect(() => {
        if (!senderId || !receiverId || !jobId) return;

        const fetchMessages = async () => {
            try {
                const res = await axios.get(`${MESSAGE_API_ENDPOINT}/getMessages`, {
                    params: { senderId, receiverId, jobId },
                });
                setMessages(res.data.data);
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 200);
            } catch (err) {
                console.error("Failed to load messages:", err);
            }
        };

        fetchMessages();
    }, [senderId, receiverId, jobId]);

    const sendMessage = async () => {
        if (!content && !media) return;
        if (!senderId || !receiverId || !jobId) return;

        const formData = new FormData();
        formData.append("senderId", senderId);
        formData.append("receiverId", receiverId);
        formData.append("jobId", jobId);
        if (content) formData.append("content", content);
        if (media) formData.append("media", media);

        try {
            const res = await axios.post(`${MESSAGE_API_ENDPOINT}/sendMessage`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            
            // Add the newly created message to our own screen instantly
            setMessages((prev) => [...prev, res.data.data]); 
            
            // Emit to the other person so they see it instantly without refreshing
            socket?.emit("sendMessage", res.data.data);
            
            setContent("");
            setMedia(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        } catch (err) {
            console.error("Failed to send message:", err);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-[#fdfbff] text-slate-900 border-t border-slate-100">
            <div className="flex flex-1 overflow-hidden">
                {/* Main Chat Area */}
                <main className="flex-1 flex flex-col min-w-0 border-r border-slate-100">
                    {/* Header */}
                    <div className="h-20 border-b border-slate-100 px-6 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <ArrowLeft size={20} />
                                </Button>
                            </Link>
                            <Avatar className="h-10 w-10 ring-2 ring-indigo-50 transition hover:ring-indigo-100">
                                <AvatarImage src={userDetails?.profile?.profilePhoto} />
                            </Avatar>
                            <div className="min-w-0">
                                <h3 className="font-bold text-slate-900 truncate">
                                    {userDetails?.fullname || "Loading..."}
                                </h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-tight">Active Now</span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Messages Scroll Area */}
                    <ScrollArea className="flex-1 p-6 bg-[#f9fafd]">
                        <div className="space-y-6">
                            {messages.map((msg: any) => {
                                const isSender = msg.senderId?.toString() === senderId;
                                return (
                                    <div
                                        key={msg._id}
                                        className={`flex ${isSender ? "justify-end" : "justify-start"} items-end gap-2 group animate-chatEntry`}
                                    >
                                        {!isSender && (
                                            <Avatar className="h-8 w-8 mb-1">
                                                <AvatarImage src={userDetails?.profile?.profilePhoto} />
                                            </Avatar>
                                        )}
                                        <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                                            <div
                                                className={`px-4 py-3 rounded-2xl shadow-sm relative transition-all duration-200 ${
                                                    isSender
                                                        ? "bg-indigo-600 text-white rounded-br-none"
                                                        : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                                                }`}
                                            >
                                                {msg.content && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>}
                                                {msg.mediaUrl && (
                                                    <a
                                                        href={`${API_URL}${msg.mediaUrl}`}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className={`block mt-2 text-xs font-bold p-2 rounded-lg bg-black/5 hover:bg-black/10 transition flex items-center gap-2 ${isSender ? 'text-white' : 'text-indigo-600'}`}
                                                    >
                                                        <Paperclip size={14} /> View Attachment
                                                    </a>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 font-medium px-1 uppercase letter-spacing-wide">
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} className="h-2" />
                        </div>
                    </ScrollArea>

                    {/* Chat Input */}
                    <div className="p-6 bg-white border-t border-slate-50">
                        <div className="flex flex-col gap-2">
                             {media && (
                                <div className="flex items-center gap-2 bg-indigo-50 p-2 rounded-lg w-fit animate-slideUp">
                                    <Paperclip size={14} className="text-indigo-600" />
                                    <span className="text-xs font-semibold text-indigo-700 truncate max-w-xs">{media.name}</span>
                                    <button onClick={() => setMedia(null)} className="text-indigo-600 hover:text-indigo-900 ml-2">×</button>
                                </div>
                            )}
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-slate-400 hover:text-indigo-600 rounded-xl"
                                >
                                    <Paperclip size={20} />
                                </Button>
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => setMedia(e.target.files ? e.target.files[0] : null)}
                                    ref={fileInputRef}
                                />
                                <div className="flex-1 relative">
                                    <Input
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                        placeholder="Type your message..."
                                        className="h-12 bg-slate-50 border-none rounded-xl focus-visible:ring-2 focus-visible:ring-indigo-100 transition-all text-slate-900"
                                    />
                                </div>
                                <Button
                                    onClick={sendMessage}
                                    disabled={!content && !media}
                                    className="h-12 w-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-200 disabled:shadow-none"
                                >
                                    <Send size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </main>

                {/* Info Sidebar (Desktop Only) */}
                <aside className="hidden lg:flex w-80 flex-col bg-white overflow-y-auto border-l border-slate-50">
                    <div className="p-6 flex flex-col items-center text-center border-b border-slate-50">
                        <Avatar className="h-20 w-20 mb-4 ring-4 ring-indigo-50">
                            <AvatarImage src={userDetails?.profile?.profilePhoto} />
                        </Avatar>
                        <h3 className="text-lg font-bold text-slate-900">{userDetails?.fullname}</h3>
                        <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest mt-1">
                            {isRecruiter ? "Candidate" : "Recruiter"}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Briefcase size={14} /> Job Context
                            </h4>
                            <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100">
                                <h5 className="font-bold text-slate-800 leading-tight">{jobDetails?.title}</h5>
                                <Badge className="mt-2 bg-white text-indigo-700 border-indigo-100 hover:bg-white">{jobDetails?.company?.name}</Badge>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Info size={14} /> Quick Actions
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        if (isRecruiter) {
                                            if (userDetails?.profile?.resume) {
                                                window.open(userDetails.profile.resume, "_blank");
                                            } else {
                                                toast.info("This candidate hasn't uploaded a resume yet.", {
                                                    description: "Redirecting to applicants list..."
                                                });
                                                setTimeout(() => {
                                                    window.location.href = `/admin/jobs/${jobId}/applicants`;
                                                }, 1500);
                                            }
                                        } else {
                                            toast.info(`${userDetails?.fullname} is a Verified Recruiter.`, {
                                                description: `Associated with ${jobDetails?.company?.name || 'their company'}.`
                                            });
                                        }
                                    }}
                                    className="w-full justify-start gap-2 border-slate-100 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-100 transition-all"
                                >
                                    <User size={16} /> View Profile
                                </Button>
                                 <Link href={`/description/${jobId}`}>
                                     <Button variant="outline" className="w-full justify-start gap-2 border-slate-100 hover:bg-slate-50 transition-all">
                                        <Info size={16} /> Job Details
                                    </Button>
                                 </Link>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>

            <style>{`
                @keyframes chatEntry {
                    from { opacity: 0; transform: translateY(10px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-chatEntry {
                    animation: chatEntry 0.3s ease-out forwards;
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(5px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideUp {
                    animation: slideUp 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ChatPage;

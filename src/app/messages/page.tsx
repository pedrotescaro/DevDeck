"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/Sidebar";
import { EmptyState } from "@/components/motion/EmptyState";
import { TypingIndicator } from "@/components/motion/TypingIndicator";
import { 
  Search, 
  Settings, 
  Send, 
  Plus, 
  X, 
  Smile, 
  Image as ImageIcon 
} from "lucide-react";

interface ChatItem {
  partnerId: string;
  lastMessage: string;
  lastMessageTime: string;
  lastSenderId: string;
  partner: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface UserListItem {
  id: string;
  username: string;
  avatar_url: string | null;
}

export default function MessagesPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  
  // Conversations & Messages states
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageText, setNewMessageText] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showTypingPreview, setShowTypingPreview] = useState(false);

  // Search/Filter states
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  
  // New conversation modal states
  const [newChatModalOpen, setNewChatModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<UserListItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersSearchQuery, setUsersSearchQuery] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          router.push("/login");
          return;
        }

        const resUser = await fetch("/api/users/me");
        if (resUser.ok) {
          const userData = await resUser.json();
          setUser(userData);
        }

        // Fetch active chats
        const resChats = await fetch("/api/messages/chats");
        if (resChats.ok) {
          const data = await resChats.json();
          setChats(data);
        }
      } catch (err) {
        console.error("Error fetching messages page data:", err);
      } finally {
        setLoadingChats(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Fetch message history for active chat
  useEffect(() => {
    if (!activeChat) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages?receiver_id=${activeChat.partnerId}`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
        }
      } catch (err) {
        console.error("Error fetching message history:", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeChat]);

  useEffect(() => {
    if (!activeChat) return;
    setShowTypingPreview(true);
    const timer = setTimeout(() => setShowTypingPreview(false), 1200);
    return () => clearTimeout(timer);
  }, [activeChat]);

  // Scroll messages to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loadingMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChat || !newMessageText.trim() || !user) return;

    const textToSend = newMessageText.trim();
    setNewMessageText("");

    // Optimistic UI update
    const tempMessage: Message = {
      id: Math.random().toString(),
      sender_id: user.id,
      receiver_id: activeChat.partnerId,
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiver_id: activeChat.partnerId,
          content: textToSend,
        }),
      });

      if (res.ok) {
        // Refetch active chats to update list/order
        const resChats = await fetch("/api/messages/chats");
        if (resChats.ok) {
          const data = await resChats.json();
          setChats(data);
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleOpenNewChatModal = async () => {
    setNewChatModalOpen(true);
    setLoadingUsers(true);
    try {
      // Find all users in the system to choose from
      const res = await fetch("/api/users/search?q=");
      if (res.ok) {
        const data = await res.json();
        // filter out current user
        setAllUsers(data.filter((u: any) => u.id !== user?.id));
      }
    } catch (err) {
      console.error("Failed to fetch users list:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSearchUsers = async (query: string) => {
    setUsersSearchQuery(query);
    setLoadingUsers(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setAllUsers(data.filter((u: any) => u.id !== user?.id));
      }
    } catch (err) {
      console.error("Failed to search users:", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleStartConversation = (targetUser: UserListItem) => {
    setNewChatModalOpen(false);
    setUsersSearchQuery("");

    // Check if chat already exists in list
    const existingChat = chats.find(c => c.partnerId === targetUser.id);
    if (existingChat) {
      setActiveChat(existingChat);
    } else {
      // Create a temporary ChatItem structure to mount
      const tempChat: ChatItem = {
        partnerId: targetUser.id,
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        lastSenderId: user?.id || "",
        partner: {
          id: targetUser.id,
          username: targetUser.username,
          avatar_url: targetUser.avatar_url,
        },
      };
      setChats(prev => [tempChat, ...prev]);
      setActiveChat(tempChat);
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const hrs = date.getHours().toString().padStart(2, "0");
    const mins = date.getMinutes().toString().padStart(2, "0");
    return `${hrs}:${mins}`;
  };

  const formatChatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / 3600000;
    
    if (diffHours < 24) {
      return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `Há ${diffDays}d`;
    return `${date.getDate()}/${date.getMonth() + 1}`;
  };

  // Filter local chats sidebar by search input
  const filteredChats = chats.filter(c => 
    c.partner.username.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(chatSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-dd-bg text-dd-text antialiased">
      <Sidebar user={user} />

      <div className="flex-grow flex min-w-0 bg-dd-bg">
        <div className="flex w-full min-h-screen">
          
          {/* Left Panel: Conversation List Sidebar (Matching image 4) */}
          <div className="w-80 md:w-96 border-r border-dd-border/60 flex flex-col shrink-0">
            {/* Header */}
            <div className="p-4 pb-2 flex items-center justify-between">
              <h1 className="text-lg font-black tracking-tight text-dd-text">Bate-papo</h1>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-dd-surface/60 rounded-full text-dd-text transition-colors">
                  <Settings className="w-4.5 h-4.5" />
                </button>
                <button 
                  onClick={handleOpenNewChatModal}
                  className="p-2 hover:bg-dd-surface/60 rounded-full text-dd-text transition-colors"
                  title="Novo Chat"
                >
                  <Plus className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Local Search Input */}
            <div className="p-4 pt-1">
              <div className="relative">
                <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 w-4 h-4 text-dd-muted" />
                <input
                  type="text"
                  placeholder="Buscar conversas"
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full rounded-full bg-dd-surface/80 border border-transparent focus:border-orange-500/50 focus:bg-dd-bg py-2 pl-11 pr-4 text-xs font-semibold text-dd-text placeholder-dd-muted/70 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Conversation Partners Scroll */}
            <div className="flex-grow overflow-y-auto divide-y divide-dd-border/40">
              {loadingChats ? (
                <div className="flex flex-col items-center py-10 gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  <p className="text-[10px] text-dd-muted">Buscando chats...</p>
                </div>
              ) : filteredChats.length === 0 ? (
                <div className="p-8 text-center space-y-2">
                  <p className="text-xs text-dd-muted font-bold">Nenhum bate-papo iniciado</p>
                  <button 
                    onClick={handleOpenNewChatModal}
                    className="text-xs text-orange-400 font-extrabold hover:underline"
                  >
                    Iniciar nova conversa
                  </button>
                </div>
              ) : (
                filteredChats.map((chat) => {
                  const isActive = activeChat?.partnerId === chat.partnerId;
                  const initials = chat.partner.username.slice(0, 2).toUpperCase();
                  
                  return (
                    <button
                      key={chat.partnerId}
                      onClick={() => setActiveChat(chat)}
                      className={`w-full p-4 flex gap-3 text-left transition-colors duration-150 relative ${
                        isActive ? "bg-dd-surface/40 border-r-2 border-orange-500" : "hover:bg-dd-surface/20"
                      }`}
                    >
                      {/* Avatar */}
                      {chat.partner.avatar_url ? (
                        <img
                          src={chat.partner.avatar_url}
                          alt={chat.partner.username}
                          className="w-11 h-11 rounded-full object-cover border border-dd-border shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10 shrink-0">
                          {initials}
                        </div>
                      )}

                      {/* Content Info */}
                      <div className="flex-grow min-w-0 space-y-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <p className="text-xs font-extrabold text-dd-text truncate">
                            {chat.partner.username}
                          </p>
                          <span className="text-[9.5px] text-dd-muted shrink-0 font-medium">
                            {formatChatTime(chat.lastMessageTime)}
                          </span>
                        </div>
                        <p className="text-xs text-dd-muted truncate leading-relaxed">
                          {chat.lastSenderId === user?.id && <span className="text-orange-400/80 mr-0.5">Você:</span>}
                          {chat.lastMessage || "Nenhuma mensagem enviada."}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Chat Active Viewport OR Empty State (Matching image 4) */}
          <div className="flex-1 flex flex-col bg-dd-bg min-h-screen">
            {activeChat ? (
              // Active Conversation Screen
              <>
                {/* Active Header */}
                <div className="p-4 border-b border-dd-border/60 bg-dd-bg flex items-center gap-3">
                  {activeChat.partner.avatar_url ? (
                    <img
                      src={activeChat.partner.avatar_url}
                      alt={activeChat.partner.username}
                      className="w-10 h-10 rounded-full object-cover border border-dd-border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10">
                      {activeChat.partner.username.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xs font-black text-dd-text">@{activeChat.partner.username}</h3>
                    <p className="text-[9.5px] text-dd-muted font-bold tracking-wide mt-0.5">Ativo recentemente</p>
                  </div>
                </div>

                {/* Messages Body */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-dd-surface/10">
                  {loadingMessages ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-dd-muted">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                      <p className="text-[10px]">Buscando mensagens...</p>
                    </div>
                  ) : (
                    <>
                    {messages.map((msg, index) => {
                      const isCurrentUser = msg.sender_id === user?.id;
                      
                      return (
                        <motion.div 
                          key={msg.id}
                          initial={{ opacity: 0, x: isCurrentUser ? 12 : -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.03, duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className={`flex flex-col max-w-[75%] space-y-1 ${
                            isCurrentUser ? "ml-auto items-end" : "mr-auto items-start"
                          }`}
                        >
                          <div 
                            className={`rounded-2xl px-4 py-2 text-xs leading-relaxed font-semibold shadow-sm ${
                              isCurrentUser 
                                ? "bg-orange-500 text-white rounded-br-none" 
                                : "bg-dd-surface text-dd-text rounded-bl-none border border-dd-border/60"
                            }`}
                          >
                            <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                          </div>
                          <span className="text-[9px] text-dd-muted px-1.5 font-medium">
                            {formatMessageTime(msg.created_at)}
                          </span>
                        </motion.div>
                      );
                    })}
                    {showTypingPreview && <TypingIndicator username={activeChat.partner.username} />}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Messages Input Bar */}
                <div className="p-4 border-t border-dd-border/60 bg-dd-bg">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                    <button 
                      type="button" 
                      className="p-2 text-dd-muted hover:text-dd-text rounded-full transition-colors shrink-0"
                    >
                      <ImageIcon className="w-4.5 h-4.5" />
                    </button>
                    <button 
                      type="button" 
                      className="p-2 text-dd-muted hover:text-dd-text rounded-full transition-colors shrink-0"
                    >
                      <Smile className="w-4.5 h-4.5" />
                    </button>
                    
                    <input
                      type="text"
                      placeholder="Enviar uma mensagem..."
                      value={newMessageText}
                      onChange={(e) => setNewMessageText(e.target.value)}
                      className="flex-1 rounded-full bg-dd-surface/80 border border-transparent focus:border-orange-500/50 focus:bg-dd-bg py-2.5 px-4 text-xs font-semibold text-dd-text placeholder-dd-muted/65 focus:outline-none transition-colors"
                    />
                    
                    <button
                      type="submit"
                      disabled={!newMessageText.trim()}
                      className="p-2.5 bg-orange-500 text-white rounded-full transition-all shrink-0 hover:bg-orange-600 disabled:opacity-50 disabled:bg-dd-surface disabled:text-dd-muted active:scale-95 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              // Empty State Screen (Matching image 4)
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-dd-bg">
                <EmptyState type="dm" />
                <button 
                  onClick={handleOpenNewChatModal}
                  className="bg-white hover:bg-slate-200 text-black text-xs font-black py-2.5 px-5 rounded-full transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  Novo chat
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* New Chat Selection Modal */}
      {newChatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setNewChatModalOpen(false)}
          />
          
          <div className="relative w-full max-w-md bg-dd-surface border border-dd-border rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-up font-sans flex flex-col max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-dd-border">
              <h3 className="font-extrabold text-sm text-dd-text">Iniciar conversa</h3>
              <button 
                onClick={() => setNewChatModalOpen(false)}
                className="p-1 text-dd-muted hover:text-dd-text rounded-md transition-colors"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Search bar inside modal */}
            <div className="p-4 border-b border-dd-border/50">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dd-muted" />
                <input
                  type="text"
                  placeholder="Pesquisar pessoas"
                  value={usersSearchQuery}
                  onChange={(e) => handleSearchUsers(e.target.value)}
                  className="w-full rounded-full bg-dd-bg border border-dd-border py-2 pl-11 pr-4 text-xs font-semibold text-dd-text focus:border-orange-500/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Scrollable list of users */}
            <div className="flex-1 overflow-y-auto divide-y divide-dd-border/30 p-2">
              {loadingUsers ? (
                <div className="flex items-center justify-center py-10 gap-2 text-dd-muted">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                  <p className="text-xs">Buscando desenvolvedores...</p>
                </div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-10 text-xs text-dd-muted font-semibold">
                  Nenhum desenvolvedor encontrado.
                </div>
              ) : (
                allUsers.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleStartConversation(item)}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-dd-bg text-left transition-colors"
                  >
                    {item.avatar_url ? (
                      <img 
                        src={item.avatar_url} 
                        alt={item.username} 
                        className="w-9 h-9 rounded-full object-cover border border-dd-border" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/10">
                        {item.username.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-extrabold text-dd-text">{item.username}</p>
                      <p className="text-[10px] text-dd-muted font-bold">@{item.username.toLowerCase()}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

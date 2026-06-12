import React, { useState, useRef } from "react";
import { ChatSession } from "../types";
import GarudaLogo from "./GarudaLogo";
import { 
  MessageSquare, 
  Trash2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ExternalLink 
} from "lucide-react";

interface SidebarLeftProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onCreateSession: () => void;
  onDeleteSession: (id: string) => void;
}

export default function SidebarLeft({
  sessions,
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
}: SidebarLeftProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showDeleteConfirmId, setShowDeleteConfirmId] = useState<string | null>(null);
  const pressTimerRef = useRef<any>(null);

  const startLongPress = (id: string) => {
    if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
    pressTimerRef.current = setTimeout(() => {
      setShowDeleteConfirmId(id);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 600);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const getRemainingTimeText = (createdAt: number) => {
    const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
    const elapsed = Date.now() - createdAt;
    const remaining = sevenDaysInMs - elapsed;
    
    if (remaining <= 0) return "Expiring soon";
    
    const remainingDays = Math.ceil(remaining / (24 * 60 * 60 * 1000));
    if (remainingDays === 1) return "Expiring tomorrow";
    return `Expires in ${remainingDays} days`;
  };

  return (
    <div 
      className={`relative h-full flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 bg-slate-950/90 backdrop-blur-md z-40 ${
        isOpen ? "w-80" : "w-16"
      }`}
      id="left-sidebar"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer z-50"
        title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        id="sidebar-toggle-btn"
      >
        {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
      </button>

      <div 
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-3 p-4 border-b border-slate-800/60 cursor-pointer hover:bg-slate-900/40 transition-all ${
          !isOpen ? "justify-center" : ""
        }`}
        id="sidebar-brand-header"
      >
        <GarudaLogo size={isOpen ? 36 : 28} animate={isOpen} />
        {isOpen && (
          <div className="flex flex-col">
            <h1 className="text-xl font-display font-bold tracking-tight bg-gradient-to-r from-amber-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Garuda AI
            </h1>
          </div>
        )}
      </div>

      <div className="p-3 border-b border-slate-800/40">
        <a
          href="https://t.me/garudaai1"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center gap-3 rounded-xl py-3 px-4 transition-all duration-300 font-medium ${
            isOpen 
              ? "bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/35 hover:border-cyan-400 text-cyan-300 hover:text-cyan-100 hover:shadow-[0_0_12px_rgba(6,182,212,0.15)]" 
              : "bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400"
          }`}
          title="Join Telegram Channel"
          id="tg-channel-link"
        >
          <svg className="w-5 h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-.99.53-1.42.52-.47-.01-1.37-.27-2.03-.49-.82-.27-1.47-.42-1.41-.88.03-.24.37-.49 1.03-.75 4.04-1.76 6.74-2.92 8.09-3.48 3.85-1.6 4.64-1.88 5.17-1.89.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.03.22z"/>
          </svg>
          {isOpen && (
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold tracking-wide">Telegram Channel</span>
              <span className="text-[10px] text-cyan-400/75 flex items-center gap-1">
                @garudaai1 <ExternalLink size={8} />
              </span>
            </div>
          )}
        </a>
      </div>

      <div className="p-3">
        <button
          onCreateSession
          onClick={onCreateSession}
          className={`w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700 hover:border-amber-400 hover:bg-slate-900/60 py-2.5 px-3 text-slate-300 hover:text-amber-300 transition-all font-medium cursor-pointer ${
            !isOpen ? "px-0" : ""
          }`}
          title="New Garuda AI Chat"
          id="new-chat-btn"
        >
          <Plus size={18} />
          {isOpen && <span className="text-sm">New Chat</span>}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1.5" id="chat-history-container">
        {isOpen && (
          <div className="px-2 pt-2 pb-1 flex items-center justify-between text-slate-500 font-mono text-[10px] tracking-wider uppercase">
            <span>Chat History</span>
            <span className="flex items-center gap-1 text-amber-500/80">
              <Clock size={10} /> 7 Days Retention
            </span>
          </div>
        )}

        {sessions.length === 0 ? (
          isOpen && (
            <p className="text-center text-slate-600 text-xs py-10 px-4">
              Your conversations will show up here
            </p>
          )
        ) : (
          sessions.map((sess) => {
            const isActive = sess.id === currentSessionId;
            return (
              <div
                key={sess.id}
                className={`group relative flex items-center gap-2.5 rounded-xl p-2.5 transition-all text-left cursor-pointer select-none ${
                  isActive
                    ? "bg-slate-900 border border-slate-700/80 text-white"
                    : "hover:bg-slate-900/40 border border-transparent text-slate-400 hover:text-slate-200"
                }`}
                onClick={() => onSelectSession(sess.id)}
                onMouseDown={() => startLongPress(sess.id)}
                onMouseUp={cancelLongPress}
                onMouseLeave={cancelLongPress}
                onTouchStart={() => startLongPress(sess.id)}
                onTouchEnd={cancelLongPress}
                id={`session-item-${sess.id}`}
                title="Click to select | Long press to delete"
              >
                <MessageSquare size={16} className={isActive ? "text-amber-400" : "text-slate-500"} />
                
                {isOpen ? (
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-sm font-medium truncate leading-tight">
                      {sess.title || "Untitled Conversation"}
                    </p>
                    <span className="text-[9px] font-mono text-slate-500 block mt-0.5">
                      {getRemainingTimeText(sess.createdAt)}
                    </span>
                  </div>
                ) : null}

                {isOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(sess.id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 hover:text-red-400 text-slate-500 p-1 rounded-md hover:bg-slate-800 transition-all cursor-pointer"
                    title="Delete Conversation"
                    id={`delete-btn-${sess.id}`}
                  >
                    <Trash2 size={13} />
                  </button>
                )}

                {isOpen && showDeleteConfirmId === sess.id && (
                  <div className="absolute inset-0 bg-red-950 border border-red-800 rounded-xl flex items-center justify-between px-3 z-35 animate-fade-in backdrop-blur-md">
                    <span className="text-[10px] font-bold text-red-200 uppercase tracking-wider font-mono">Delete?</span>
                    <div className="flex gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(sess.id);
                          setShowDeleteConfirmId(null);
                        }}
                        className="bg-red-500 hover:bg-red-400 text-white text-[10px] font-bold px-2.5 py-1 rounded transition-all cursor-pointer shadow-md"
                        id={`confirm-del-yes-${sess.id}`}
                      >
                        Yes
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDeleteConfirmId(null);
                        }}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded border border-slate-700 transition-all cursor-pointer"
                        id={`confirm-del-no-${sess.id}`}
                      >
                        No
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isOpen && (
        <div className="p-3 border-t border-slate-800/50 bg-slate-950/50 text-[10px] text-slate-500 leading-relaxed text-center">
          ⚡ Garuda system automatically purges chats and attachments exactly 7 days after creation.
        </div>
      )}
    </div>
  );
        }

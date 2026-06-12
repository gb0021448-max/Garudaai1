import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Send, 
  Mic, 
  Paperclip, 
  Image, 
  Video, 
  Sparkles, 
  User, 
  ExternalLink, 
  X, 
  Cpu, 
  Clock, 
  ArrowDownCircle, 
  AlertTriangle,
  Lightbulb,
  Radio,
  FileText,
  Database,
  Check,
  Copy,
  CloudUpload,
  CloudDownload,
  RefreshCw
} from "lucide-react";
import SidebarLeft from "./components/SidebarLeft";
import ProfileRight from "./components/ProfileRight";
import VoiceInputSim from "./components/VoiceInputSim";
import SponsorAds from "./components/SponsorAds";
import GarudaLogo from "./components/GarudaLogo";
import { ChatSession, Message, UserProfile, Attachment } from "./types";
import { supabase, isSupabaseConfigured } from "./lib/supabase";

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [voiceOverlayOpen, setVoiceOverlayOpen] = useState(false);

  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("garuda_user");
    if (saved) return JSON.parse(saved);
    return {
      email: "gb0021448@gmail.com",
      displayName: "Garuda User26",
      provider: "google"
    };
  });

  const [inputValue, setInputValue] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const [systemPrompt, setSystemPrompt] = useState(
    "You are Garuda AI, an advanced, polite and highly knowledgeable AI assistant. You are helpful, fast, and replies back with clear, visually highlighted markdown and bulleted plans."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [speechEnabled, setSpeechEnabled] = useState(false);
  
  const [draftAlert, setDraftAlert] = useState("");
  const [alertType, setAlertType] = useState<"info" | "warning">("info");

  const [databaseSetupComplete, setDatabaseSetupComplete] = useState(() => {
    return localStorage.getItem("garuda_database_setup_complete") === "true";
  });
  const [supabaseTableMissing, setSupabaseTableMissing] = useState(() => {
    return localStorage.getItem("garuda_database_setup_complete") !== "true";
  });
  const [supabasePermissionError, setSupabasePermissionError] = useState(false);
  const [showSqlSetupModal, setShowSqlSetupModal] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);
  const [rlsCopied, setRlsCopied] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [syncMessage, setSyncMessage] = useState("");

  const [showEditMenuId, setShowEditMenuId] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const pressTimerRef = useRef<any>(null);

  const startLongPressTimer = (msgId: string) => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
    }
    pressTimerRef.current = setTimeout(() => {
      setShowEditMenuId(msgId);
      if (navigator.vibrate) {
        navigator.vibrate(55);
      }
    }, 600);
  };

  const cancelLongPressTimer = () => {
    if (pressTimerRef.current) {
      clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleCopyMessageText = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  useEffect(() => {
    const loadSessions = async () => {
      let parsedSessions: ChatSession[] = [];
      const userEmail = user?.email || "gb0021448@gmail.com";

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from("chats")
            .select("*")
            .eq("user_id", userEmail)
            .order("updated_at", { ascending: false });

          if (error) {
            const isPermissionError = error.message.toLowerCase().includes("permission") || 
                                     error.message.toLowerCase().includes("denied") || 
                                     error.message.includes("42501");
            const isTableMissing = !isPermissionError && (
              error.message.includes("Could not find the table") || 
              error.message.includes("relation") || 
              error.message.includes("chats")
            );

            if (isPermissionError) {
              setSupabasePermissionError(true);
            } else if (isTableMissing && !databaseSetupComplete) {
              setSupabaseTableMissing(true);
            }
            const savedSessions = localStorage.getItem("garuda_sessions");
            parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
          } else if (data && data.length > 0) {
            parsedSessions = data.map((row: any) => ({
              id: row.id,
              title: row.title || "Conversation ⚡",
              messages: Array.isArray(row.message) ? row.message : (typeof row.message === "string" ? JSON.parse(row.message) : []),
              createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
              updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
            }));
          } else {
            const savedSessions = localStorage.getItem("garuda_sessions");
            parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
          }
        } catch (dbErr) {
          const savedSessions = localStorage.getItem("garuda_sessions");
          parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
        }
      } else {
        const savedSessions = localStorage.getItem("garuda_sessions");
        parsedSessions = savedSessions ? JSON.parse(savedSessions) : [];
      }

      // 7-DAY HARD RETENTION AUTOMATIC PURGE LOGIC
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const nowStamp = Date.now();
      const validSessions = parsedSessions.filter((sess) => {
        const elapsed = nowStamp - (sess.createdAt || nowStamp);
        return elapsed < sevenDaysInMs;
      });

      const purgedCount = parsedSessions.length - validSessions.length;
      if (purgedCount > 0) {
        setDraftAlert(`Garuda Vault purged ${purgedCount} session(s) older than 7 days to protect details.`);
        setAlertType("warning");
        setTimeout(() => setDraftAlert(""), 8000);
      }

      setSessions(validSessions);

      if (validSessions.length > 0) {
        setCurrentSessionId(validSessions[0].id);
      } else {
        const defaultSess: ChatSession = {
          id: "session_" + Math.random().toString(36).substring(2, 9),
          title: "Initial Consultation ⚡",
          messages: [
            {
              id: "welcome_m",
              role: "assistant",
              content: "Welcome to Garuda AI, your advanced portal. Ask me anything, speak via the microphone, or upload photos/videos for rich analysis. (To preserve user security, chats and assets automatically expire exactly 7 days after creation).",
              timestamp: Date.now()
            }
          ],
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        setSessions([defaultSess]);
        setCurrentSessionId(defaultSess.id);
      }
    };

    loadSessions();

    const lastDraft = localStorage.getItem("garuda_input_draft");
    if (lastDraft) {
      setInputValue(lastDraft);
      setDraftAlert("Restored your unsubmitted prompt from previous session!");
      setAlertType("info");
      setTimeout(() => setDraftAlert(""), 4500);
    }
  }, [user]);

  const saveSessionsToStorage = async (updatedList: ChatSession[]) => {
    setSessions(updatedList);
    
    const sanitizedList = updatedList.map(session => ({
      ...session,
      messages: session.messages.map(message => {
        if (!message.attachments) return message;
        return {
          ...message,
          attachments: message.attachments.map(att => {
            if (att.url && att.url.startsWith("data:") && att.url.length > 20000) {
              return {
                ...att,
                url: `data:text/plain;placeholder=true,${att.type}:${att.name}`
              };
            }
            return att;
          })
        };
      })
    }));

    try {
      localStorage.setItem("garuda_sessions", JSON.stringify(sanitizedList));
    } catch (err) {
      const aggressiveList = updatedList.map(session => ({
        ...session,
        messages: session.messages.map(message => {
          if (!message.attachments) return message;
          return {
            ...message,
            attachments: message.attachments.map(att => {
              if (att.url && att.url.startsWith("data:")) {
                return {
                  ...att,
                  url: `data:text/plain;placeholder=true,${att.type}:${att.name}`
                };
              }
              return att;
            })
          };
        })
      }));
      localStorage.setItem("garuda_sessions", JSON.stringify(aggressiveList));
    }

    if (isSupabaseConfigured && supabase) {
      const userEmail = user?.email || "gb0021448@gmail.com";
      for (const session of sanitizedList) {
        try {
          const { error } = await supabase
            .from("chats")
            .upsert({
              id: session.id,
              user_id: userEmail,
              title: session.title,
              message: session.messages,
              updated_at: new Date(session.updatedAt).toISOString(),
              created_at: new Date(session.createdAt).toISOString()
            }, { onConflict: "id" });

          if (error) {
            const isPermissionError = error.message.toLowerCase().includes("permission") || 
                                     error.message.toLowerCase().includes("denied") || 
                                     error.message.includes("42501");
            const isTableMissing = !isPermissionError && (
              error.message.includes("Could not find the table") || 
              error.message.includes("relation") || 
              error.message.includes("chats")
            );

            if (isPermissionError) {
              setSupabasePermissionError(true);
            } else if (isTableMissing && !databaseSetupComplete) {
              setSupabaseTableMissing(true);
            }
          }
        } catch (upsertErr) {}
      }
    }
  };

  const manualSaveToSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setDraftAlert("Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY!");
      setAlertType("warning");
      setTimeout(() => setDraftAlert(""), 5000);
      return;
    }

    setSyncStatus("syncing");
    setSyncMessage("Pushing secure sessions to user Supabase database...");

    const sanitizedList = sessions.map(session => ({
      ...session,
      messages: session.messages.map(message => {
        if (!message.attachments) return message;
        return {
          ...message,
          attachments: message.attachments.map(att => {
            if (att.url && att.url.startsWith("data:") && att.url.length > 20000) {
              return {
                ...att,
                url: `data:text/plain;placeholder=true,${att.type}:${att.name}`
              };
            }
            return att;
          })
        };
      })
    }));

    const userEmail = user?.email || "gb0021448@gmail.com";
    let successfulCount = 0;

    try {
      for (const session of sanitizedList) {
        const { error } = await supabase
          .from("chats")
          .upsert({
            id: session.id,
            user_id: userEmail,
            title: session.title,
            message: session.messages,
            updated_at: new Date(session.updatedAt).toISOString(),
            created_at: new Date(session.createdAt).toISOString()
          }, { onConflict: "id" });

        if (error) throw error;
        successfulCount++;
      }

      setSyncStatus("success");
      setSyncMessage(`Synced ${successfulCount} logs to your Supabase cloud successfully!`);
      setSupabaseTableMissing(false);
      setDraftAlert(`Saved ${successfulCount} chats to Supabase!`);
      setAlertType("info");
      setTimeout(() => {
        setSyncStatus("idle");
        setDraftAlert("");
      }, 4000);
    } catch (error: any) {
      setSyncStatus("error");
      setSyncMessage(`Save failed: ${error.message || error}`);
      if (error.message?.includes("relation") || error.message?.includes("chats") || error.message?.includes("Could not find the table")) {
        setSupabaseTableMissing(true);
      }
      setTimeout(() => setSyncStatus("idle"), 5000);
    }
  };

  const manualLoadFromSupabase = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setDraftAlert("Supabase is not configured yet. Configure variables!");
      setAlertType("warning");
      setTimeout(() => setDraftAlert(""), 5000);
      return;
    }

    setSyncStatus("syncing");
    setSyncMessage("Downloading conversations from Supabase cloud database...");
    const userEmail = user?.email || "gb0021448@gmail.com";

    try {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("user_id", userEmail)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const parsedSessions: ChatSession[] = data.map((row: any) => ({
          id: row.id,
          title: row.title || "Conversation ⚡",
          messages: Array.isArray(row.message) ? row.message : (typeof row.message === "string" ? JSON.parse(row.message) : []),
          createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
          updatedAt: row.updated_at ? new Date(row.updated_at).getTime() : Date.now(),
        }));

        setSessions(parsedSessions);
        if (parsedSessions.length > 0) {
          setCurrentSessionId(parsedSessions[0].id);
        }
        localStorage.setItem("garuda_sessions", JSON.stringify(parsedSessions));

        setSyncStatus("success");
        setSyncMessage(`Restored ${data.length} chats from Supabase!`);
        setSupabaseTableMissing(false);
        setDraftAlert(`Successfully synced and loaded ${data.length} chats from your Supabase table!`);
        setAlertType("info");
        setTimeout(() => {
          setSyncStatus("idle");
          setDraftAlert("");
        }, 4000);
      } else {
        setSyncStatus("success");
        setSyncMessage("No chats exist in your cloud database repository.");
        setDraftAlert("No chats discovered on Supabase cloud yet.");
        setAlertType("info");
        setTimeout(() => {
          setSyncStatus("idle");
          setDraftAlert("");
        }, 5000);
      }
    } catch (error: any) {
      setSyncStatus("error");
      setSyncMessage(`Load failed: ${error.message || error}`);
      if (error.message?.includes("relation") || error.message?.includes("chats") || error.message?.includes("Could not find the table")) {
        setSupabaseTableMissing(true);
      }
      setTimeout(() => setSyncStatus("idle"), 5000);
    }
  };

  useEffect(() => {
    localStorage.setItem("garuda_input_draft", inputValue);
  }, [inputValue]);

  useEffect(() => {
    const handleExitAutoSave = () => {
      if (inputValue.trim()) {
        localStorage.setItem("garuda_input_draft", inputValue);
      }
    };
    window.addEventListener("blur", handleExitAutoSave);
    window.addEventListener("beforeunload", handleExitAutoSave);
    return () => {
      window.removeEventListener("blur", handleExitAutoSave);
      window.removeEventListener("beforeunload", handleExitAutoSave);
    };
  }, [inputValue]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [currentSessionId, isTyping, scrollToBottom]);

  const activeSession = sessions.find((s) => s.id === currentSessionId) || null;

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    scrollToBottom();
  };

  const handleCreateSession = () => {
    const newSess: ChatSession = {
      id: "session_" + Math.random().toString(36).substring(2, 9),
      title: "New Conversation ⚡",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    const updated = [newSess, ...sessions];
    saveSessionsToStorage(updated);
    setCurrentSessionId(newSess.id);
  };

  const handleDeleteSession = async (id: string) => {
    const filtered = sessions.filter((s) => s.id !== id);
    saveSessionsToStorage(filtered);
    if (currentSessionId === id) {
      if (filtered.length > 0) {
        setCurrentSessionId(filtered[0].id);
      } else {
        setCurrentSessionId(null);
      }
    }

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("chats").delete().eq("id", id);
      } catch (dbErr) {}
    }
  };

  const handleUserLogin = (email: string) => {
    const profile: UserProfile = {
      email,
      displayName: email.split("@")[0],
      provider: "google"
    };
    setUser(profile);
    localStorage.setItem("garuda_user", JSON.stringify(profile));
    setDraftAlert(`Verified & Synchronized Gmail: ${email}`);
    setAlertType("info");
    setTimeout(() => setDraftAlert(""), 4000);
  };

  const handleUserLogout = () => {
    setUser(null);
    localStorage.removeItem("garuda_user");
    setDraftAlert("Account signed out successfully. Continuing as Guest.");
    setAlertType("warning");
    setTimeout(() => setDraftAlert(""), 4000);
  };

  const handleToggleDatabaseSetup = (complete: boolean) => {
    setDatabaseSetupComplete(complete);
    localStorage.setItem("garuda_database_setup_complete", complete ? "true" : "false");
    if (complete) {
      setSupabaseTableMissing(false);
      setSupabasePermissionError(false);
      setDraftAlert("Supabase database marked as successfully configured!");
      setAlertType("info");
    } else {
      setSupabaseTableMissing(true);
      setDraftAlert("Supabase database setup status reset to pending.");
      setAlertType("warning");
    }
    setTimeout(() => setDraftAlert(""), 4000);
  };

  const handleForceResetStateMemory = () => {
    localStorage.clear();
    localStorage.setItem("garuda_database_setup_complete", "true");
    setDatabaseSetupComplete(true);
    setSupabaseTableMissing(false);
    setSupabasePermissionError(false);
    setShowSqlSetupModal(false);

    setUser({
      email: "gb0021448@gmail.com",
      displayName: "Garuda User",
      provider: "google"
    });
    setInputValue("");
    setAttachments([]);
    setIsTyping(false);
    setSystemPrompt(
      "You are Garuda AI, an advanced, polite and highly knowledgeable AI assistant. You are helpful, fast, and replies back with clear, visually highlighted markdown and bulleted plans."
    );
    setTemperature(0.7);
    setSpeechEnabled(false);

    const defaultSess: ChatSession = {
      id: "session_" + Math.random().toString(36).substring(2, 9),
      title: "Initial Consultation ⚡",
      messages: [
        {
          id: "welcome_m",
          role: "assistant",
          content: "Welcome to Garuda AI, your advanced portal. Ask me anything, speak via the microphone, or upload photos/videos for rich analysis. (To preserve user security, chats and assets automatically expire exactly 7 days after creation).",
          timestamp: Date.now()
        }
      ],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSes

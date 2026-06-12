import React, { useState } from "react";
import { UserProfile } from "../types";
import { 
  X, 
  Settings, 
  LogOut, 
  UserPlus, 
  ShieldCheck, 
  Sliders, 
  User, 
  Database,
  RefreshCw,
  Check,
  AlertTriangle,
  Volume2,
  VolumeX
} from "lucide-react";

interface ProfileRightProps {
  user: UserProfile | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  temperature: number;
  setTemperature: (temp: number) => void;
  speechEnabled: boolean;
  setSpeechEnabled: (enabled: boolean) => void;
  onClose: () => void;
  databaseSetupComplete: boolean;
  onToggleDatabaseSetup: (complete: boolean) => void;
  onForceResetStateMemory: () => void;
}

export default function ProfileRight({
  user,
  onLogin,
  onLogout,
  systemPrompt,
  setSystemPrompt,
  temperature,
  setTemperature,
  speechEnabled,
  setSpeechEnabled,
  onClose,
  databaseSetupComplete,
  onToggleDatabaseSetup,
  onForceResetStateMemory,
}: ProfileRightProps) {
  const [newEmail, setNewEmail] = useState("");
  const [showSwitchForm, setShowSwitchForm] = useState(false);
  const [error, setError] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newEmail.includes("@")) {
      setError("Please enter a valid Gmail / Email address");
      return;
    }
    setError("");
    onLogin(newEmail);
    setNewEmail("");
    setShowSwitchForm(false);
  };

  return (
    <div 
      className="fixed inset-y-0 right-0 w-80 md:w-96 bg-slate-950 border-l border-slate-800 shadow-2xl z-50 flex flex-col transition-all duration-300 ease-in-out glass-panel"
      id="profile-panel"
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-800" id="profile-panel-header">
        <div className="flex items-center gap-2">
          <Settings className="text-amber-400 animate-spin" style={{ animationDuration: "12s" }} size={20} />
          <h2 className="text-lg font-display font-semibold text-white">
            Garuda AI Profile
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
          title="Close drawer"
          id="profile-panel-close-btn"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6" id="profile-panel-body">
        
        <div className="space-y-3">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <User size={12} /> Logged In User
          </h3>

          {!user ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center space-y-3">
              <p className="text-xs text-slate-400">
                You are currently running with a guest/fallback session. Log in with your Gmail to sync chats.
              </p>
              <button
                onClick={() => setShowSwitchForm(true)}
                className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-semibold py-2 px-3 rounded-lg transition-all shadow-md cursor-pointer"
                id="login-btn-sidebar"
              >
                Log In / SignUp
              </button>
            </div>
          ) : (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1.5 bg-cyan-500/10 text-cyan-400 rounded-bl-xl border-l border-b border-cyan-500/20 text-[9px] font-mono tracking-wider font-semibold uppercase">
                Active Gmail
              </div>
              <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-amber-400 to-cyan-500 flex items-center justify-center text-slate-950 font-display font-bold text-lg shadow-lg">
                {user.displayName.substring(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">
                  {user.displayName}
                </p>
                <p className="text-xs text-slate-400 truncate font-mono">
                  {user.email}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {!showSwitchForm ? (
            <button
              onClick={() => setShowSwitchForm(true)}
              className="w-full flex items-center justify-center gap-2 border border-slate-800 hover:border-slate-700 bg-slate-900/30 hover:bg-slate-900/60 text-xs font-medium text-slate-300 py-2.5 px-3 rounded-xl transition-all cursor-pointer"
              id="switch-account-trigger"
            >
              <UserPlus size={14} className="text-amber-400" />
              <span>Login Another account</span>
            </button>
          ) : (
            <form onSubmit={handleLoginSubmit} className="bg-slate-900 border border-slate-800/80 rounded-2xl p-3.5 space-y-3 animate-fade-in">
              <h4 className="text-xs font-semibold text-slate-200">
                Switch Gmail Account
              </h4>
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="name@gmail.com"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setError("");
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-all font-mono"
                  id="gmail-input"
                />
                {error && <span className="text-[10px] text-red-400 block font-mono">{error}</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-semibold py-1.5 px-2.5 rounded-lg transition-all cursor-pointer"
                  id="gmail-submit-btn"
                >
                  Verify Gmail
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSwitchForm(false);
                    setError("");
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs py-1.5 px-2.5 rounded-lg transition-all cursor-pointer"
                  id="gmail-cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sliders size={12} /> AI Parameters
          </h3>
          
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Garuda AI System Instructions
              </label>
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={3}
                placeholder="Modify default rules or persona for Garuda AI..."
                className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 transition-all leading-relaxed resize-none"
                id="system-prompt-textarea"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-300">
                <span>Creativity (Temperature)</span>
                <span className="font-mono text-cyan-400">{temperature}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                id="temperature-slider"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/40">
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200">Speak AI Answers (TTS)</span>
                <span className="text-[10px] text-slate-500">Enable automatic text-to-speech voice replies</span>
              </div>
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                className={`p-2 rounded-xl transition-all cursor-pointer ${
                  speechEnabled 
                    ? "bg-amber-400/10 text-amber-300 border border-amber-500/30" 
                    : "bg-slate-800 text-slate-500"
                }`}
                title={speechEnabled ? "Voice Speech Enabled" : "Voice Speech Muted"}
                id="tts-toggle-btn"
              >
                {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <Database size={12} /> Database & Storage Setup
          </h3>
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200">Database Setup Status</span>
                <span className="text-[10px] text-slate-500">Chats table & RLS policies enabled</span>
              </div>
              <button
                onClick={() => onToggleDatabaseSetup(!databaseSetupComplete)}
                className={`text-xs px-3 py-1.5 rounded-xl border font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1 ${
                  databaseSetupComplete 
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/35" 
                    : "bg-amber-500/10 text-amber-300 border-amber-500/30 animate-pulse"
                }`}
                id="db-setup-toggle-btn"
              >
                {databaseSetupComplete ? <Check size={12} /> : <AlertTriangle size={12} />}
                <span>{databaseSetupComplete ? "Complete" : "Pending Action"}</span>
              </button>
            </div>

            <div className="pt-3 border-t border-slate-800/40">
              <p className="text-[10px] text-slate-500 mb-2.5 leading-normal">
                Clear all active text drafts, local conversations, session key locks, and force-reset state memory directly.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm("क्या आप वाकई सभी लोकल डेटा और स्टेट मेमोरी को बलपूर्वक रीसेट (Force-Reset) करना चाहते हैं? इससे सभी वार्तालाप रीसेट हो जाएंगे और डेटाबेस सेटअप पूर्ण चिन्हित हो जाएगा।")) {
                    onForceResetStateMemory();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-500/25 border border-red-500/30 hover:border-red-400/50 text-red-350 py-2 rounded-xl transition-all font-semibold tracking-wide text-xs cursor-pointer"
                id="force-reset-memory-btn"
              >
                <RefreshCw size={12} className="animate-spin" style={{ animationDuration: "12s" }} />
                <span>Force-Reset State Memory</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck size={12} /> Privacy Protocols
          </h3>
          <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-900/20 border border-slate-800/30 rounded-xl p-3 space-y-1.5">
            <p>🔒 256-bit secure end-to-end sandbox operations.</p>
            <p>⏳ Standard chat and telemetry auto-expire in exactly 7 days.</p>
            <p>🚫 Data never shared with third-party advertising companies.</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="p-4 border-t border-slate-800/60 bg-slate-950" id="profile-panel-footer">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-500/20 border border-red-500/30 hover:border-red-400 text-red-300 py-3 rounded-xl transition-all font-semibold tracking-wide text-sm cursor-pointer"
            id="logout-btn"
          >
            <LogOut size={16} />
            <span>Sign Out Current Account</span>
          </button>
        </div>
      )}
    </div>
  );
                      }

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Square, Volume2 } from "lucide-react";

interface VoiceInputSimProps {
  onTranscriptCaptured: (text: string) => void;
  onClose: () => void;
}

export default function VoiceInputSim({
  onTranscriptCaptured,
  onClose,
}: VoiceInputSimProps) {
  const [status, setStatus] = useState<"initializing" | "listening" | "processing" | "unsupported" | "error">("initializing");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const [waveAmplitudes, setWaveAmplitudes] = useState<number[]>([15, 20, 15, 30, 15, 20, 15]);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "listening") {
      interval = setInterval(() => {
        setWaveAmplitudes(Array.from({ length: 12 }, () => Math.floor(Math.random() * 50) + 12));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [status]);

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setStatus("unsupported");
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = "en-US";

      rec.onstart = () => {
        setStatus("listening");
        setInterimTranscript("");
        setFinalTranscript("");
      };

      rec.onresult = (event: any) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          setFinalTranscript((prev) => prev + " " + final);
        }
        setInterimTranscript(interim);
      };

      rec.onerror = (err: any) => {
        if (err.error === "not-allowed") {
          setStatus("error");
        } else {
          setStatus("listening");
        }
      };

      rec.onend = () => {
        setStatus("processing");
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      setStatus("error");
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, []);

  const handleStopAndSubmit = () => {
    const speechText = (finalTranscript + " " + interimTranscript).trim();
    if (speechText) {
      onTranscriptCaptured(speechText);
    } else {
      onClose();
    }
  };

  const handleSimulatedOption = (promptText: string) => {
    onTranscriptCaptured(promptText);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md"
      id="voice-visualizer-overlay"
    >
      <div className="w-[450px] max-w-full mx-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-6 shadow-2xl animate-fade-in neon-glow-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-40"></div>

        <div className="space-y-1 relative z-10">
          <h3 className="text-xl font-display font-bold bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">
            Garuda Speech Sync
          </h3>
          <p className="text-xs text-slate-400">
            {status === "listening" && "🎧 Listening... Speak your prompt clearly"}
            {status === "processing" && "⌛ Syncing speech streams with Garuda AI..."}
            {status === "unsupported" && "ℹ️ Microphone restricted inside sandbox iframe mode"}
            {status === "error" && "⚠️ Microphone permission denied inside iframe"}
            {status === "initializing" && "⚡ Calibrating audio decibels..."}
          </p>
        </div>

        <div className="h-24 flex items-center justify-center gap-1.5 relative z-10">
          {status === "listening" ? (
            waveAmplitudes.map((amp, idx) => (
              <span
                key={idx}
                className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-blue-400 transition-all duration-100 ease-in-out"
                style={{ height: `${amp}%` }}
              ></span>
            ))
          ) : (
            <div className="h-16 w-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center animate-pulse">
              <MicOff size={24} className="text-cyan-400" />
            </div>
          )}
        </div>

        {(status === "listening" || status === "processing") && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 min-h-[90px] text-sm text-left max-h-[150px] overflow-y-auto font-mono text-slate-300 relative leading-relaxed">
            {finalTranscript || interimTranscript ? (
              <>
                <span className="text-slate-100">{finalTranscript}</span>
                <span className="text-cyan-400 animate-pulse">{interimTranscript}</span>
              </>
            ) : (
              <span className="text-slate-600 italic">No speech detected yet...</span>
            )}
          </div>
        )}

        {(status === "unsupported" || status === "error") && (
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-left space-y-3 relative z-10">
            <p className="text-xs leading-relaxed text-slate-400">
              Your browser iframe blocks standard microphone permissions. To make sure you can completely test Garuda AI, you can select one of these highly interactive pre-formed speech requests:
            </p>
            <div className="flex flex-wrap gap-2 pt-1 font-sans">
              {[
                "Hi Garuda, what is 7 days database retention?",
                "Can you review my crypto visualizer dashboard?",
                "Create a step-by-step startup marketing strategy for Garuda AI",
              ].map((recText, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSimulatedOption(recText)}
                  className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500 text-xs text-slate-300 hover:text-cyan-200 py-2 px-3 rounded-xl text-left transition-all w-full cursor-pointer"
                >
                  🎙️ "{recText}"
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3 pt-2 relative z-10">
          {(status === "listening" || status === "processing") && (
            <button
              onClick={handleStopAndSubmit}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md focus:outline-none cursor-pointer flex items-center gap-1.5"
              id="speech-stop-btn"
            >
              <Square size={14} fill="#0f172a" />
              Stop & Send to AI
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-sm rounded-xl transition-all focus:outline-none cursor-pointer"
            id="speech-close-btn"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
                                }

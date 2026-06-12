import React, { useState, useEffect } from "react";
import { SPONSOR_ADS } from "../ads";
import { DirectAd } from "../types";
import { ExternalLink, X, Compass, Radio } from "lucide-react";

interface SponsorAdsProps {
  layout?: "sidebar" | "banner";
  maxAds?: number;
}

export default function SponsorAds({ layout = "banner", maxAds = 1 }: SponsorAdsProps) {
  const [activeAds, setActiveAds] = useState<DirectAd[]>([]);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    const shuffled = [...SPONSOR_ADS].sort(() => 0.5 - Math.random());
    setActiveAds(shuffled.slice(0, maxAds));
  }, [maxAds]);

  if (closed || activeAds.length === 0) return null;

  if (layout === "banner") {
    return (
      <div 
        className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 overflow-hidden shadow-lg glass-card relative"
        id="sponsor-ads-banner-container"
      >
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-mono tracking-wider font-semibold uppercase">
            <Radio size={10} className="animate-pulse" /> Direct Garuda Sponsor Ad
          </div>
          <button
            onClick={() => setClosed(true)}
            className="text-slate-500 hover:text-white p-0.5 rounded transition-all cursor-pointer"
            title="Dismiss Ad"
          >
            <X size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeAds.map((ad) => (
            <a
              key={ad.id}
              href={ad.targetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 hover:border-amber-400/50 rounded-xl p-3 select-none cursor-pointer transition-all duration-300 group"
              id={`ad-link-${ad.id}`}
            >
              <img
                src={ad.imageUrl}
                alt={ad.title}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-xl object-cover border border-white/[0.04] group-hover:scale-105 transition-all flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 justify-between">
                  <span className="text-xs font-mono text-cyan-400/80 uppercase font-bold tracking-widest text-[9px]">
                    {ad.tag}
                  </span>
                  <ExternalLink size={10} className="text-slate-500 group-hover:text-amber-400" />
                </div>
                <h4 className="text-xs font-semibold text-slate-100 mt-0.5 group-hover:text-amber-300 transition-colors truncate">
                  {ad.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {ad.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 bg-slate-900/40 border border-slate-800/40 rounded-2xl relative" id="sponsor-ads-sidebar-container">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-mono text-amber-500 tracking-widest font-bold uppercase">
          Sponsor Hub
        </span>
        <button
          onClick={() => setClosed(true)}
          className="text-slate-600 hover:text-white p-0.5 rounded cursor-pointer"
        >
          <X size={10} />
        </button>
      </div>

      {activeAds.map((ad) => (
        <a
          key={ad.id}
          href={ad.targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 group"
        >
          <img
            src={ad.imageUrl}
            alt={ad.title}
            referrerPolicy="no-referrer"
            className="w-full h-24 object-cover group-hover:opacity-90 transition-all border-b border-slate-800"
          />
          <div className="p-3 text-left">
            <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-0.5">
              {ad.tag}
            </span>
            <h5 className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
              {ad.title}
            </h5>
            <p className="text-[10px] text-slate-400 leading-normal line-clamp-2 mt-1">
              {ad.description}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}

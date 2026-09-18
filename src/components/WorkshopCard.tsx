import React from 'react';
import { createPortal } from 'react-dom';
import { Check, Clock, ArrowRight, Play, X } from 'lucide-react';
import { BASE_URL } from '../utils/urls';
import { detectVideoUrl, getYouTubeId } from '../utils/videoUtils';

const mediaSrc = (url?: string) => !url ? '' : url.startsWith('uploads/') ? `${BASE_URL}/${url}` : url;

export default function WorkshopCard({ workshop, onDetails, preview = false }: { workshop: any; onDetails?: () => void; preview?: boolean }) {
  const [isVideoOpen, setIsVideoOpen] = React.useState(false);
  const source = mediaSrc(workshop.mediaUrl);
  const video = detectVideoUrl(source);
  const youtubeId = getYouTubeId(source);

  React.useEffect(() => {
    if (!isVideoOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && setIsVideoOpen(false);
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isVideoOpen]);

  const videoModal = isVideoOpen && source ? createPortal(
    <div role="dialog" aria-modal="true" aria-label={`${workshop.title} video preview`} className="fixed inset-0 z-[300] flex items-center justify-center bg-[#08030f]/90 p-4 backdrop-blur-md" onMouseDown={() => setIsVideoOpen(false)}>
      <div className="relative w-full max-w-6xl" onMouseDown={event => event.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between gap-4 text-white">
          <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">Workshop video</p><h3 className="truncate text-lg font-bold sm:text-2xl">{workshop.title}</h3></div>
          <button type="button" onClick={() => setIsVideoOpen(false)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/10 transition-colors hover:bg-white/20" aria-label="Close video"><X size={22} /></button>
        </div>
        <div className="aspect-video max-h-[78vh] overflow-hidden rounded-2xl bg-black shadow-2xl ring-1 ring-white/10">
          {video.type === 'direct' ? <video className="h-full w-full" src={source} autoPlay controls playsInline /> : video.canEmbed ? <iframe title={`${workshop.title} video`} className="h-full w-full" src={video.embedUrl || ''} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : <div className="grid h-full place-items-center p-8 text-center text-white">This video cannot be embedded.</div>}
        </div>
      </div>
    </div>, document.body
  ) : null;

  return (
    <><article className="bg-white rounded-[22px] border border-[#dfe5ee] border-t-4 border-t-[#7417ff] shadow-sm p-5 flex flex-col min-h-[440px] text-left">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-block rounded-md bg-[#f0eaff] px-2.5 py-1 text-[10px] font-extrabold uppercase text-[#6617ee]">{workshop.category || 'CATEGORY'}</span>
          {(workshop.categoryTags || []).map((tag: string, index: number) => <span key={`${tag}-${index}`} className="ml-1.5 inline-block rounded-md border border-violet-200 bg-white px-2.5 py-1 text-[10px] font-extrabold uppercase text-violet-700">{tag}</span>)}
          {workshop.demandTag && <span className="block w-fit rounded-md border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-fuchsia-600">{workshop.demandTag}</span>}
          {(workshop.demandTags || []).map((tag: string, index: number) => <span key={`${tag}-${index}`} className="mr-1.5 inline-block rounded-md border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-1 text-[10px] font-extrabold uppercase text-fuchsia-600">{tag}</span>)}
        </div>
        <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase text-slate-600"><Clock size={12} /> {workshop.duration}</span>
      </div>

      <h3 className="mt-4 text-xl font-extrabold leading-tight text-[#160044]">{workshop.title || 'Workshop title'}</h3>
      <div className="mt-4 grid grid-cols-[1fr_126px] gap-4 items-start">
        <ul className="space-y-2 min-w-0">
          {(workshop.pillars || []).map((item: string, index: number) => <li key={`${item}-${index}`} className="flex gap-2 text-xs font-semibold text-slate-700"><span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-violet-50 text-violet-600"><Check size={11} strokeWidth={3} /></span>{item}</li>)}
        </ul>
        <button type="button" onClick={() => source && setIsVideoOpen(true)} disabled={!source} aria-label={source ? `Open ${workshop.title} video` : 'No video available'} className="group relative h-[96px] overflow-hidden rounded-xl bg-[#130b22] disabled:cursor-default">
          {source ? (video.type === 'direct' ? <video className="pointer-events-none h-full w-full object-cover" src={source} muted playsInline preload="metadata" /> : youtubeId ? <img className="h-full w-full object-cover" src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} alt="" /> : <div className="grid h-full place-items-center text-white/70"><Play size={24} /></div>) : <div className="grid h-full place-items-center text-white/70"><Play size={24} /></div>}
          {source && <span className="absolute inset-0 grid place-items-center bg-black/15 transition-colors group-hover:bg-black/35"><span className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-violet-700 shadow-lg transition-transform group-hover:scale-110"><Play size={18} fill="currentColor" /></span></span>}
        </button>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3">
        <p className="text-[10px] font-bold text-violet-600">{workshop.studioLabel || 'You can work at studios like...'}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">{(workshop.studios || []).map((studio: string) => <span key={studio} className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[9px] font-extrabold uppercase text-slate-800">{studio}</span>)}</div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-violet-100">{workshop.expertAvatarUrl ? <img src={workshop.expertAvatarUrl} className="h-full w-full object-cover" alt="" /> : <span className="grid h-full place-items-center font-bold text-violet-700">{workshop.expertName?.[0] || 'E'}</span>}</div>
          <div className="min-w-0"><p className="truncate text-xs font-extrabold text-[#160044]">{workshop.expertName || 'Expert name'}</p><p className="truncate text-[10px] text-slate-500">{workshop.expertTitle}</p><p className="text-[9px] font-semibold text-violet-400">{workshop.expertExperience}</p></div>
        </div>
        <button type="button" onClick={onDetails} disabled={!onDetails} className="shrink-0 rounded-xl border border-violet-600 px-4 py-2 text-[10px] font-extrabold uppercase text-violet-700 disabled:cursor-default">Details <ArrowRight className="inline" size={12} /></button>
      </div>
    </article>{videoModal}</>
  );
}

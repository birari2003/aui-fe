import React from 'react';
import { createPortal } from 'react-dom';
import { ArrowRight, Award, Building2, Clock, Globe2, Play, Video, X, Zap } from 'lucide-react';
import { BASE_URL } from '../utils/urls';
import { detectVideoUrl, getYouTubeId } from '../utils/videoUtils';

const sourceFor = (url?: string) => !url ? '' : url.startsWith('uploads/') ? `${BASE_URL}/${url}` : url;
const isImageSource = (url: string) => /\.(avif|gif|jpe?g|png|svg|webp)(?:\?|#|$)/i.test(url);
const items = (value: any) => Array.isArray(value) ? value : [];

export default function WorkshopDetailsDrawer({ workshop, onClose, onBook, requestStatus }: { workshop: any | null; onClose: () => void; onBook: (workshop: any) => void; requestStatus?: 'pending' | 'approved' | 'rejected' }) {
  const [playing, setPlaying] = React.useState(false);
  React.useEffect(() => {
    if (!workshop) return;
    setPlaying(false);
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', close);
    const old = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', close); document.body.style.overflow = old; };
  }, [workshop, onClose]);
  if (!workshop) return null;

  const source = sourceFor(workshop.mediaUrl);
  const media = detectVideoUrl(source);
  const youtubeId = getYouTubeId(source);
  const isImage = isImageSource(source);
  const guidance = items(workshop.abroadGuidance);
  const included = items(workshop.includedItems);
  const modules = items(workshop.curriculumModules);
  const benefits = items(workshop.programBenefits);
  const studioDetails = items(workshop.studioDetails);

  return createPortal(
    <div className="fixed inset-0 z-[250] bg-slate-950/55 backdrop-blur-sm" onMouseDown={onClose}>
      <aside role="dialog" aria-modal="true" aria-label={`${workshop.title} details`} onMouseDown={e => e.stopPropagation()} className="absolute inset-y-0 right-0 flex w-full max-w-[780px] flex-col bg-white shadow-2xl animate-[slideIn_.25s_ease-out]">
        <button onClick={onClose} className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200" aria-label="Close details"><X size={20} /></button>
        <div className="flex-1 overflow-y-auto px-5 pb-40 pt-8 sm:px-8 lg:px-10">
          <div className="pr-12">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-extrabold uppercase">
              <span className="rounded-md bg-violet-50 px-3 py-1.5 text-violet-700">{workshop.category}</span>
              {(workshop.categoryTags || []).map((tag: string, index: number) => <span key={`${tag}-${index}`} className="rounded-md border border-violet-200 px-3 py-1 text-violet-700">{tag}</span>)}
              <span className="flex items-center gap-1 text-slate-500"><Clock size={12} /> {workshop.duration} live program</span>
              {workshop.demandTag && <span className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-600">{workshop.demandTag}</span>}
              {(workshop.demandTags || []).map((tag: string, index: number) => <span key={`${tag}-${index}`} className="rounded-md border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-fuchsia-600">{tag}</span>)}
            </div>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-[1fr_210px] sm:items-start">
            <div><h2 className="text-3xl font-black tracking-tight text-[#17003c]">{workshop.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{workshop.detailDescription || workshop.outcome}</p></div>
            <button disabled={!source} onClick={() => source && setPlaying(true)} className="group relative aspect-video overflow-hidden rounded-2xl bg-[#14051f] disabled:cursor-default">
              {isImage ? <img src={source} className="h-full w-full object-cover" alt={workshop.title || 'Workshop'} /> : youtubeId ? <img src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`} className="h-full w-full object-cover" alt="" /> : source && media.type === 'direct' ? <video src={source} muted preload="metadata" className="pointer-events-none h-full w-full object-cover" /> : null}
              {!isImage && <span className="absolute inset-0 grid place-items-center bg-black/20"><span className="grid h-11 w-11 place-items-center rounded-full bg-white text-violet-700 shadow-xl group-hover:scale-110"><Play size={18} fill="currentColor" /></span></span>}
            </button>
          </div>

          {playing && source && <div className={`${isImage ? 'flex max-h-[70vh] items-center justify-center' : 'aspect-video'} mt-5 overflow-hidden rounded-2xl bg-black`}>{isImage ? <img src={source} alt={workshop.title || 'Workshop'} className="max-h-[70vh] max-w-full object-contain" /> : media.type === 'direct' ? <video src={source} autoPlay controls playsInline className="h-full w-full" /> : media.canEmbed ? <iframe src={media.embedUrl || ''} className="h-full w-full" title="Workshop video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : null}</div>}

          <Section title="You will learn"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{items(workshop.pillars).map((x: string) => <Tile key={x} icon={<Zap size={17} />} title={x} />)}</div></Section>

          <Section title="You can work at studios like..."><div className="flex flex-wrap gap-2">{(studioDetails.length ? studioDetails : items(workshop.studios).map((name: string) => ({ name }))).map((x: any, i: number) => <div key={`${x.name}-${i}`} className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-extrabold text-[#17003c]"><Building2 size={15} className="text-violet-600" />{x.name}{x.project && <span className="text-[9px] font-medium uppercase text-slate-400">({x.project})</span>}</div>)}</div></Section>

          {guidance.length > 0 && <Section title="We guide you to work abroad"><div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">{guidance.map((x: any, i: number) => <Tile key={i} icon={<Globe2 size={17} />} title={x.title} description={x.description} />)}</div></Section>}
          {included.length > 0 && <Section title="Included with this program"><div className="grid gap-3 sm:grid-cols-3">{included.map((x: any, i: number) => <Tile key={i} horizontal icon={<Building2 size={17} />} title={x.title} description={x.description} />)}</div></Section>}
          {modules.length > 0 && <Section title="Studio pipeline curriculum"><div className="grid gap-3 sm:grid-cols-2">{modules.map((x: any, i: number) => <div key={i} className="rounded-2xl border border-slate-200 p-4"><div className="flex justify-between gap-3 text-[9px] font-extrabold uppercase"><span className="rounded-md bg-violet-50 px-2 py-1 text-violet-700">{x.label || `Module ${i + 1}`}</span><span className="text-slate-500">{x.category}</span></div><h4 className="mt-3 text-sm font-extrabold text-[#17003c]">{x.title}</h4><p className="mt-2 text-xs leading-5 text-slate-500">{x.description}</p></div>)}</div></Section>}
          {workshop.expertAbout && <Section title={`About ${workshop.expertName?.split(' ')[0] || 'the mentor'}`}><p className="rounded-2xl border border-violet-100 bg-violet-50/50 p-4 text-sm leading-6 text-slate-600">{workshop.expertAbout}</p></Section>}
          {workshop.expertTalentCode && <a href={`/talent/${encodeURIComponent(workshop.expertTalentCode)}`} className="mt-5 inline-flex items-center gap-2 rounded-xl border border-violet-600 px-5 py-3 text-xs font-extrabold uppercase text-violet-700 transition-colors hover:bg-violet-50">View mentor profile <ArrowRight size={14} /></a>}
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-fuchsia-100 bg-[#fff5ff]/95 px-5 py-4 shadow-[0_-12px_30px_rgba(30,0,60,.08)] backdrop-blur sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-3"><div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-2 border-violet-600 bg-violet-100 text-lg font-bold text-violet-700">{workshop.expertAvatarUrl ? <img src={workshop.expertAvatarUrl} className="h-full w-full object-cover" alt="" /> : workshop.expertName?.[0] || 'E'}</div><div className="min-w-0"><p className="text-[9px] font-bold uppercase tracking-widest text-violet-600">Mentor</p><p className="font-extrabold text-[#17003c]">{workshop.expertName || 'Industry Expert'}</p><p className="truncate text-[10px] text-slate-600">{workshop.expertTitle} · {workshop.expertExperience}</p>{workshop.mentorWorkedAt && <p className="truncate text-[10px] font-semibold text-fuchsia-600">Worked at {workshop.mentorWorkedAt}</p>}</div></div>
            <div className="shrink-0"><p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Program fee</p><p className="text-2xl font-black text-[#17003c]">{workshop.programFee || workshop.rate}<span className="ml-1 text-[10px] font-medium text-slate-500">{workshop.feeUnit}</span></p></div>
            {requestStatus ? <div className={`flex shrink-0 items-center justify-center gap-2 rounded-xl border px-7 py-4 text-xs font-extrabold uppercase tracking-wide ${requestStatus === 'approved' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : requestStatus === 'rejected' ? 'border-rose-200 bg-rose-50 text-rose-700' : 'border-amber-200 bg-amber-50 text-amber-700'}`}><span className={`h-2 w-2 rounded-full ${requestStatus === 'approved' ? 'bg-emerald-500' : requestStatus === 'rejected' ? 'bg-rose-500' : 'bg-amber-500'}`} />{requestStatus}</div> : <button onClick={() => onBook(workshop)} className="flex shrink-0 items-center justify-center gap-3 rounded-xl bg-violet-700 px-7 py-4 text-xs font-extrabold uppercase tracking-wide text-white shadow-lg shadow-violet-300 hover:bg-violet-800">Book workshop <ArrowRight size={16} /></button>}
          </div>
          {benefits.length > 0 && <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-fuchsia-100 pt-3">{benefits.map((x: string, i: number) => <span key={i} className="flex items-center gap-2 text-[10px] font-semibold text-slate-600">{i % 2 ? <Award size={14} className="text-violet-600" /> : <Video size={14} className="text-violet-600" />}{x}</span>)}</div>}
        </div>
      </aside>
    </div>, document.body
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="mt-9"><h3 className="mb-3 text-xs font-extrabold uppercase tracking-[0.12em] text-slate-600">{title}</h3>{children}</section>; }
function Tile({ icon, title, description, horizontal = false }: { icon: React.ReactNode; title: string; description?: string; horizontal?: boolean }) { return <div className={`rounded-2xl border border-slate-200 bg-slate-50/60 p-3 ${horizontal ? 'flex gap-3' : ''}`}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-700">{icon}</span><div className={horizontal ? '' : 'mt-2'}><h4 className="text-[11px] font-extrabold leading-tight text-[#17003c]">{title}</h4>{description && <p className="mt-1 line-clamp-3 text-[10px] leading-4 text-slate-500">{description}</p>}</div></div>; }

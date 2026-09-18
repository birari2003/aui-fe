import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { ArrowDown, X } from 'lucide-react';
import { BASE_URL } from '../utils/urls';

const imageSource = (url: string) => !url ? '' : /^https?:\/\//.test(url) ? url : `${BASE_URL}/${url}`;

export default function StudioPortfolioPreview({ portfolio, onClose }: { portfolio: any | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!portfolio) return;
    const previous = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); document.addEventListener('keydown', close);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', close); };
  }, [portfolio, onClose]);
  if (!portfolio) return null;
  return createPortal(<div className="fixed inset-0 z-[400] bg-black text-white">
    <div className="pointer-events-none fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-gradient-to-b from-black/75 to-transparent px-5 pb-12 pt-5 sm:px-9">
      <div><p className="text-[9px] font-bold uppercase tracking-[.32em] text-white/60">Studio portfolio</p><h2 className="mt-1 text-lg font-black sm:text-2xl">{portfolio.studioName}</h2></div>
      <button onClick={onClose} className="pointer-events-auto grid h-12 w-12 place-items-center rounded-full border border-white/20 bg-black/25 backdrop-blur-xl transition-colors hover:bg-white hover:text-black" aria-label="Close portfolio preview"><X size={22}/></button>
    </div>
    <main className="h-screen snap-y snap-mandatory overflow-y-auto scroll-smooth">
      {(portfolio.projects || []).map((project: any, index: number) => <section key={project.id || index} className="relative h-screen snap-start snap-always overflow-hidden bg-slate-950">
        <motion.img initial={{ scale: 1.08 }} whileInView={{ scale: 1 }} viewport={{ amount: .55 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} src={imageSource(project.imageUrl)} alt={project.projectName} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,.08)_40%,rgba(0,0,0,.62))]" />
        <div className="relative z-10 grid h-full place-items-center px-6 text-center"><motion.div initial={{ opacity: 0, y: 45, filter: 'blur(12px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ amount: .65 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}><p className="mb-4 text-[10px] font-bold uppercase tracking-[.38em] text-white/70">Project {String(index + 1).padStart(2, '0')}</p><h3 className="max-w-5xl text-4xl font-black leading-tight tracking-tight drop-shadow-2xl sm:text-6xl lg:text-8xl">{project.projectName}</h3></motion.div></div>
        <div className="absolute bottom-7 left-7 z-10 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-[10px] font-bold tracking-widest backdrop-blur-xl">{index + 1} / {portfolio.projects.length}</div>
        {index < portfolio.projects.length - 1 && <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.7 }} className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-center"><ArrowDown size={22}/><span className="mt-1 block text-[8px] font-bold uppercase tracking-widest">Scroll</span></motion.div>}
      </section>)}
    </main>
  </div>, document.body);
}

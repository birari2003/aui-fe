import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Share2, ExternalLink, Play, User, Film, Tag, Facebook, Twitter, Linkedin, Mail, Link as LinkIcon, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO';
import Badge from '../components/Badge';
import { fetchShowreelById } from '../services/showreelServices';
import { detectVideoUrl, getYouTubeId, getVimeoId } from '../utils/videoUtils';
import { BASE_URL } from '../utils/urls';

const ShowcasePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [reel, setReel] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [platformToast, setPlatformToast] = React.useState('');
  const [thumbnailUrl, setThumbnailUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadReel = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const res = await fetchShowreelById(id);
        const data = await res.json();
        if (data.success && data.data) {
          let videoUrl = data.data.videoUrl || '';
          if (videoUrl && !videoUrl.startsWith('http') && !videoUrl.startsWith('blob:')) {
            videoUrl = `${BASE_URL}/${videoUrl.replace(/^\//, '')}`;
          }
          setReel({ ...data.data, videoUrl });
        } else {
          setError('Showcase not found.');
        }
      } catch (err) {
        console.error('Failed to load showcase:', err);
        setError('Failed to load showcase.');
      } finally {
        setLoading(false);
      }
    };
    loadReel();
  }, [id]);

  React.useEffect(() => {
    if (!reel?.videoUrl) return;

    if (reel.thumbnail) {
      const fullUrl = reel.thumbnail.startsWith('http') || reel.thumbnail.startsWith('data:')
        ? reel.thumbnail
        : `${BASE_URL}/${reel.thumbnail.replace(/^\//, "").replace(/\\/g, "/")}`;
      setThumbnailUrl(fullUrl);
      return;
    }

    const ytId = getYouTubeId(reel.videoUrl);
    if (ytId) {
      setThumbnailUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
      return;
    }

    const vimeoId = getVimeoId(reel.videoUrl);
    if (vimeoId) {
      fetch(`https://vimeo.com/api/v2/video/${vimeoId}.json`)
        .then(res => res.json())
        .then(data => {
          if (data && data[0] && data[0].thumbnail_large) {
            setThumbnailUrl(data[0].thumbnail_large);
          }
        })
        .catch(err => console.error('Failed to fetch Vimeo thumbnail:', err));
    }
  }, [reel]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          <div className="w-14 h-14 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm font-semibold tracking-wider uppercase">Loading showcase...</p>
        </div>
      </div>
    );
  }

  if (error || !reel) {
    return (
      <div className="min-h-screen bg-brand-primary flex items-center justify-center overflow-hidden">
        <div className="text-center space-y-6 max-w-md mx-auto px-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
            <Film size={32} className="text-white/40" />
          </div>
          <h1 className="text-3xl font-bold text-white">Showcase Not Found</h1>
          <p className="text-white/60 text-lg">{error || 'The requested showcase could not be found.'}</p>
          <button 
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 bg-brand-accent text-brand-primary px-8 py-4 rounded-2xl font-bold hover:bg-brand-accent/90 transition-all"
          >
            <ArrowLeft size={18} /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  const videoInfo = detectVideoUrl(reel.videoUrl);
  const shareUrl = reel?.slug 
    ? `${window.location.origin}/showcase/${reel.slug}` 
    : `${window.location.origin}/showcase/${id}`;
  const displayName = reel.title || reel.name || 'Featured Showcase';

  const handleShare = async () => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `AUI Showcase - ${displayName}`,
          text: `Check out ${displayName}'s featured showcase on AUI.`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error('Error sharing:', err);
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSimpleOptionClick = async (e: React.MouseEvent, opt: { name: string; url: string }) => {
    setPlatformToast(`Opening ${opt.name}...`);
    setTimeout(() => setPlatformToast(""), 4000);
  };

  const simpleShareOptions = [
    { name: 'WhatsApp', icon: MessageCircle, color: '#25D366', bg: '#e8fdf0', url: `https://wa.me/?text=${encodeURIComponent(`Check out this featured showcase on AUI: ${shareUrl}`)}` },
    { name: 'LinkedIn', icon: Linkedin, color: '#0A66C2', bg: '#e8f0fb', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'X', icon: Twitter, color: '#000', bg: '#f0f0f0', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this featured showcase on AUI:`)}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: Facebook, color: '#1877F2', bg: '#e8f0fc', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Email', icon: Mail, color: '#EA4335', bg: '#fef0ee', url: `mailto:?subject=${encodeURIComponent(`AUI Showcase: ${displayName}`)}&body=${encodeURIComponent(`Watch this featured showcase on AUI: ${shareUrl}`)}` },
  ];

  return (
    <div className="h-screen w-screen bg-brand-primary text-white overflow-hidden relative">
      <SEO 
        title={displayName}
        description={reel.description || `Watch ${reel.artistName || 'creator'}'s showcase on AUI - Animation Industry Network`}
        keywords={`${reel.artistName || ''}, ${reel.category || ''}, animation, showcase, showreel, AUI`}
        ogTitle={displayName}
        ogDescription={reel.description || `Watch ${reel.artistName || 'creator'}'s showcase on AUI - Animation Industry Network`}
        ogImage={thumbnailUrl || undefined}
        ogUrl={shareUrl}
        ogType="video.other"
      />

      {/* Floating Action Button (Go Back only) */}
      <div className="absolute top-6 left-6 z-50 pointer-events-auto">
        <button 
          onClick={() => navigate(-1)}
          className="p-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white hover:bg-black/60 transition-all shadow-lg active:scale-95 flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Unified Layout Container: Row on Desktop, Column on Mobile */}
      <div className="flex flex-col md:flex-row h-full w-full">
        
        {/* Video Player Section (Takes top 50% on mobile, left 50% on desktop) */}
        <div className="h-1/2 md:h-full w-full md:w-1/2 bg-black relative flex items-center justify-center overflow-hidden shrink-0">
          {videoInfo.canEmbed ? (
            <iframe
              src={videoInfo.embedUrl!}
              className="w-full h-full absolute inset-0 border-0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : videoInfo.type === 'direct' ? (
            <video 
              src={reel.videoUrl} 
              className="w-full h-full object-contain" 
              controls 
              autoPlay 
            />
          ) : (
            <div className="text-center p-6 md:p-12 space-y-4 md:space-y-6">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Play size={32} className="text-white/80" />
              </div>
              <p className="text-base md:text-xl font-semibold text-white/80">External Video Platform</p>
              <a
                href={reel.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-accent text-brand-primary px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-bold hover:bg-brand-accent/90 transition-all text-xs md:text-sm"
              >
                Watch on {videoInfo.platformLabel} <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        {/* Info Panel (Takes bottom 50% on mobile, right 50% on desktop) */}
        <div className="h-1/2 md:h-full w-full md:w-1/2 overflow-y-auto bg-brand-primary flex flex-col justify-start">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="p-6 md:p-12 lg:p-16 space-y-6 md:space-y-10 text-left flex-1 flex flex-col justify-start max-w-2xl mx-auto w-full pt-10 md:pt-24 pb-10 md:pb-16"
          >
            {/* Badges and Categories */}
            <div className="space-y-4">
              <div className="flex items-center justify-between md:block md:space-y-4">
                <Badge 
                  variant={reel.category === 'professional' ? 'info' : reel.category === 'institute' ? 'warning' : 'success'} 
                  className="bg-white/5 border-white/10 text-white capitalize px-3 py-1 md:px-4 md:py-1.5 text-[10px] md:text-xs font-semibold"
                >
                  {reel.category || 'Featured'}
                </Badge>
                
                {(reel.topic || reel.role) && (
                  <p className="text-[10px] md:text-xs font-bold text-brand-accent uppercase tracking-[0.2em] md:tracking-[0.3em] font-display md:mt-2">
                    {reel.topic || reel.role}
                  </p>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-white">
                {displayName}
              </h1>

              {/* Artist Name */}
              {reel.artistName && (
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-10 h-10 bg-brand-accent/20 rounded-full flex items-center justify-center shrink-0">
                    <User size={18} className="text-brand-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">By {reel.artistName}</p>
                    <p className="text-xs text-white/50 capitalize">{reel.category || 'Creator'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10 w-full" />

            {/* Description */}
            <div className="space-y-3">
              <h2 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/40 font-display">About this Showcase</h2>
              <p className="text-white/70 text-sm md:text-base lg:text-lg leading-relaxed font-medium whitespace-pre-line break-words font-sans">
                {reel.description || 'No description provided.'}
              </p>
            </div>

            {/* Metadata Tags */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {reel.category && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-white/40">
                    <Tag size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Category</span>
                  </div>
                  <p className="text-white font-semibold text-sm capitalize">{reel.category}</p>
                </div>
              )}
              {(reel.topic || reel.role) && (
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                  <div className="flex items-center gap-2 text-white/40">
                    <Film size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Topic</span>
                  </div>
                  <p className="text-white font-semibold text-sm">{reel.topic || reel.role}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 w-full mt-auto">
              {reel.publicUrl ? (
                <a
                  href={reel.publicUrl.startsWith('/') ? reel.publicUrl : (reel.publicUrl.startsWith('http') ? reel.publicUrl : `https://${reel.publicUrl}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-white hover:bg-gray-100 text-brand-primary py-3.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold transition-all shadow-sm active:scale-[0.99]"
                >
                  View Profile
                </a>
              ) : (
                <button 
                  className="w-full py-3.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
                  disabled
                >
                  No Profile Available
                </button>
              )}

              {reel.longMovieUrl && (
                <a
                  href={reel.longMovieUrl.startsWith('http') ? reel.longMovieUrl : `https://${reel.longMovieUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full text-center bg-brand-accent hover:bg-brand-accent/90 text-brand-primary py-3.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold items-center justify-center gap-1.5 transition-all shadow-md active:scale-[0.99]"
                >
                  Watch Full Movie <ExternalLink size={14} />
                </a>
              )}

              {/* Share button below Watch Full Movie */}
              <button
                onClick={handleShare}
                className="flex w-full text-center bg-brand-accent/20 hover:bg-brand-accent/30 text-brand-accent hover:text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] border border-brand-accent/30"
              >
                Share Showcase <Share2 size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* TalentID Style Share Modal */}
      {isShareModalOpen && (
        <div 
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div 
            className="bg-white rounded-[28px] w-full max-w-md shadow-2xl overflow-hidden border border-gray-100"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e1b4b] to-[#2563EB] px-6 py-5 flex items-center justify-between">
              <div className="text-left">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200">
                  Share Showcase
                </p>
                <h3 className="text-lg font-black text-white mt-0.5">{displayName}</h3>
              </div>
              <button 
                onClick={() => setIsShareModalOpen(false)} 
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors font-bold text-lg"
              >
                ×
              </button>
            </div>
            {/* Platform Grid */}
            <div className="p-6 space-y-5 text-left">
              {platformToast && (
                <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3">
                  <span className="text-emerald-500 text-base">📋</span>
                  <p className="text-xs font-bold text-emerald-800">{platformToast}</p>
                </div>
              )}
              <div className="grid grid-cols-5 gap-3">
                {simpleShareOptions.map(opt => (
                  <a 
                    key={opt.name} 
                    href={opt.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => handleSimpleOptionClick(e, opt)}
                    className="flex flex-col items-center gap-2 group cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: opt.bg }}>
                      <opt.icon size={22} style={{ color: opt.color }} />
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{opt.name}</span>
                  </a>
                ))}
              </div>
              {/* Copy Link */}
              <div className="flex items-center gap-2 bg-[#F8F9FB] border border-[#E5E7EB] rounded-2xl p-3">
                <LinkIcon size={14} className="text-gray-400 shrink-0" />
                <p className="text-xs text-[#374151] font-medium flex-1 truncate">{shareUrl}</p>
                <button
                  onClick={copyToClipboard}
                  className={`shrink-0 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    copied ? 'bg-emerald-500 text-white' : 'bg-[#111827] text-white hover:bg-gray-800'
                  }`}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowcasePage;

export interface VideoInfo {
  type: 'youtube' | 'vimeo' | 'googledrive' | 'dailymotion' | 'streamable' | 'direct' | 'external';
  embedUrl: string | null;
  originalUrl: string;
  platformLabel: string;
  canEmbed: boolean;
}

export const getYouTubeId = (url: string): string => {
  if (!url) return '';
  const value = url.trim();
  try {
    const parsed = new URL(value.startsWith('http') ? value : `https://${value}`);
    const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0] || '';
      return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : '';
    }
    if (host === 'youtube.com' || host.endsWith('.youtube.com')) {
      const queryId = parsed.searchParams.get('v') || '';
      if (/^[a-zA-Z0-9_-]{11}$/.test(queryId)) return queryId;
      const parts = parsed.pathname.split('/').filter(Boolean);
      if (['embed', 'shorts', 'live', 'v'].includes(parts[0]) && /^[a-zA-Z0-9_-]{11}$/.test(parts[1] || '')) return parts[1];
    }
  } catch {
    // Fall through to the permissive matcher for pasted partial URLs.
  }
  const match = value.match(/(?:youtu\.be\/|embed\/|shorts\/|live\/|watch\?(?:.*&)?v=|[?&]v=)([a-zA-Z0-9_-]{11})/);
  return match?.[1] || '';
};

export const getVimeoId = (url: string): string => {
  if (!url) return '';
  const standardMatch = url.match(
    /(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|ondemand\/[^/]+\/|showcase\/\d+\/video\/)(\d+)(?:$|\/|\?)/
  );
  if (standardMatch) return standardMatch[1];
  const simpleMatch = url.match(/vimeo\.com\/(\d+)(?:$|\/|\?)/);
  if (simpleMatch) return simpleMatch[1];
  return '';
};

export const getGoogleDriveId = (url: string): string => {
  if (!url) return '';
  const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : '';
};

export const getDailymotionId = (url: string): string => {
  if (!url) return '';
  const match = url.match(/dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
};

export const getStreamableCode = (url: string): string => {
  if (!url) return '';
  const match = url.match(/streamable\.com\/([a-zA-Z0-9]+)/);
  return match ? match[1] : '';
};

export const isDirectVideoUrl = (url: string): boolean => {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov|avi|mkv|m4v|flv|3gp)(\?.*)?$/i.test(url) || url.startsWith('uploads/');
};

export const detectVideoUrl = (url: string): VideoInfo => {
  if (!url) return { type: 'external', embedUrl: null, originalUrl: url, platformLabel: 'Video', canEmbed: false };

  // YouTube
  const ytId = getYouTubeId(url);
  if (ytId) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: url,
      platformLabel: 'YouTube',
      canEmbed: true,
    };
  }

  // Vimeo
  const vimeoId = getVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`,
      originalUrl: url,
      platformLabel: 'Vimeo',
      canEmbed: true,
    };
  }

  // Google Drive
  const driveId = getGoogleDriveId(url);
  if (url.includes('drive.google.com') && driveId) {
    return {
      type: 'googledrive',
      embedUrl: `https://drive.google.com/file/d/${driveId}/preview`,
      originalUrl: url,
      platformLabel: 'Google Drive',
      canEmbed: true,
    };
  }

  // Dailymotion
  const dmId = getDailymotionId(url);
  if (dmId) {
    return {
      type: 'dailymotion',
      embedUrl: `https://www.dailymotion.com/embed/video/${dmId}?autoplay=1`,
      originalUrl: url,
      platformLabel: 'Dailymotion',
      canEmbed: true,
    };
  }

  // Streamable
  const streamCode = getStreamableCode(url);
  if (streamCode) {
    return {
      type: 'streamable',
      embedUrl: `https://streamable.com/e/${streamCode}?autoplay=1`,
      originalUrl: url,
      platformLabel: 'Streamable',
      canEmbed: true,
    };
  }

  // Direct video file
  if (isDirectVideoUrl(url)) {
    return {
      type: 'direct',
      embedUrl: null,
      originalUrl: url,
      platformLabel: 'Video',
      canEmbed: false,
    };
  }

  return {
    type: 'external',
    embedUrl: null,
    originalUrl: url,
    platformLabel: 'External Video',
    canEmbed: false,
  };
};

export const getEmbedUrl = (url: string) => {
  const info = detectVideoUrl(url);
  return info.embedUrl || url;
};

export const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const getInstagramVideoId = (url: string): string | null => {
  if (!url) return null;

  // Handle Instagram video URLs
  const patterns = [
    /instagram\.com\/(?:p|reel|tv)\/([^/?#&]+)/,
    /instagram\.com\/stories\/[^/?#&]+\/([^/?#&]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

export const getVideoPreview = (url: string): { type: 'youtube' | 'instagram' | null; id: string | null } => {
  const youtubeId = getYouTubeVideoId(url);
  if (youtubeId) {
    return { type: 'youtube', id: youtubeId };
  }

  const instagramId = getInstagramVideoId(url);
  if (instagramId) {
    return { type: 'instagram', id: instagramId };
  }

  return { type: null, id: null };
};

import { useEffect, useRef, useState } from 'react';

// Adds the YouTube IFrame API script dynamically
function loadYouTubeAPI() {
  return new Promise<void>((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.onload = () => {
      // The API calls global onYouTubeIframeAPIReady when ready, but we can also poll or wait.
    };
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // YouTube requires exactly this global function name
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };
  });
}

// Ensure TypeScript knows about window.YT
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YoutubeAudioPlayerProps {
  videoId: string | null;
  isPlaying: boolean;
  onStateChange?: (state: 'playing' | 'paused' | 'ended') => void;
}

export default function YoutubeAudioPlayer({ videoId, isPlaying, onStateChange }: YoutubeAudioPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    loadYouTubeAPI().then(() => setIsApiReady(true));
  }, []);

  useEffect(() => {
    if (!isApiReady || !containerRef.current) return;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player(containerRef.current, {
        height: '0',
        width: '0',
        videoId: videoId || '',
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          autoplay: isPlaying ? 1 : 0
        },
        events: {
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) onStateChange?.('playing');
            else if (event.data === window.YT.PlayerState.PAUSED) onStateChange?.('paused');
            else if (event.data === window.YT.PlayerState.ENDED) onStateChange?.('ended');
          }
        }
      });
    } else if (videoId) {
      const currentVideoUrl = playerRef.current.getVideoUrl?.();
      // If we are changing tracks
      if (!currentVideoUrl || !currentVideoUrl.includes(videoId)) {
        playerRef.current.loadVideoById(videoId);
      }
    }
  }, [isApiReady, videoId]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying]);

  return <div ref={containerRef} style={{ position: 'absolute', width: 0, height: 0, top: '-9999px', left: '-9999px' }} />;
}

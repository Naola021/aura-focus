interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(v: number): void;
  loadVideoById(id: string): void;
  loadPlaylist(opts: { list: string; listType: "playlist"; index?: number }): void;
  nextVideo(): void;
  previousVideo(): void;
  setLoop(loop: boolean): void;
  getVideoData(): { title: string; video_id: string };
  destroy(): void;
}

interface YTPlayerEvent {
  target: YTPlayer;
  data: number;
}

interface Window {
  YT?: {
    Player: new (
      el: HTMLElement,
      opts: {
        videoId?: string;
        width?: string | number;
        height?: string | number;
        playerVars?: Record<string, number | string>;
        events?: {
          onReady?: (e: YTPlayerEvent) => void;
          onStateChange?: (e: YTPlayerEvent) => void;
          onError?: (e: YTPlayerEvent) => void;
        };
      }
    ) => YTPlayer;
    PlayerState: { UNSTARTED: number; ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number; CUED: number };
  };
  onYouTubeIframeAPIReady?: () => void;
}

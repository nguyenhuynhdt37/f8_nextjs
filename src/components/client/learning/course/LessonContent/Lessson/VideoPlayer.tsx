import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getVideoIdFromUrl } from '@/Utils/functions';
import { setTimeout } from 'timers';
import confetti from 'canvas-confetti';
import { FaPlay, FaPause, FaForward } from 'react-icons/fa';

const VideoIframe: React.FC<any> = ({
  data,
  isCompleted,
  setIsCompleted,
}: any) => {
  const playerRef = useRef<YT.Player | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [watchTime, setWatchTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [previousTime, setPreviousTime] = useState(0);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const duration = data?.lessonVideo?.duration || 0;

  useEffect(() => {
    // Check system preference for dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    // Listen for changes in system preference
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (watchTime / duration >= 0.75 && !isCompleted?.isCompleted) {
      setIsCompleted({
        ...isCompleted,
        isCompleted: true,
      });
      if (!isCompleted?.isOldCompleted) {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: {
            x: 0.8,
            y: 1,
          },
        });
      }
    }
  }, [watchTime]);

  useEffect(() => {
    const loadYouTubeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);

      (window as any).onYouTubeIframeAPIReady = () => {
        const videoId = getVideoIdFromUrl(data?.lessonVideo?.videoLink);
        if (!videoId) return;

        playerRef.current = new YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
            cc_load_policy: 1,
          },
          events: {
            onReady: handlePlayerReady,
            onStateChange: handlePlayerStateChange,
          },
        });
      };
    };

    if (!window['YT']) {
      loadYouTubeAPI();
    } else {
      const videoId = getVideoIdFromUrl(data?.lessonVideo?.videoLink);
      if (!videoId) return;

      playerRef.current = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          modestbranding: 1,
          rel: 0,
          cc_load_policy: 1,
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
        },
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data?.lessonVideo?.videoLink]);

  const handlePlayerReady = (event: any) => {
    setIsReady(true);
  };

  const handlePlayerStateChange = useCallback(
    (event: YT.OnStateChangeEvent) => {
      const player = playerRef.current;
      if (event.data === YT.PlayerState.PLAYING) {
        setIsPaused(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        const currentTime = player?.getCurrentTime() || 0;
        handleFastForwardDetection(currentTime);
        const newIntervalId = setInterval(() => {
          setWatchTime(pre => pre + 1);
        }, 1000);
        intervalRef.current = newIntervalId;
      }

      if (
        event.data === YT.PlayerState.PAUSED ||
        event.data === YT.PlayerState.ENDED
      ) {
        setIsPaused(true);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    },
    [],
  );

  const handleFastForwardDetection = (currentTime: number) => {
    const timeDifference = currentTime - previousTime;

    if (timeDifference > 10 && !isFastForwarding) {
      setIsFastForwarding(true);
      setPreviousTime(currentTime);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        setIsFastForwarding(false);
      }, 3000);

      setTimeoutId(newTimeoutId);
    } else if (timeDifference <= 10 && isFastForwarding) {
      setIsFastForwarding(false);
    }
  };

  const formatProgress = () => {
    if (duration === 0) return '0%';
    const progress = (watchTime / duration) * 100;
    return `${Math.min(progress, 100).toFixed(0)}%`;
  };

  return (
    <div className={`relative w-full h-[75vh] aspect-video ${isDarkMode ? 'bg-gray-900' : 'bg-black'}`}>
      <div id="youtube-player" className="w-full h-full"></div>

      {isFastForwarding && (
        <div className={`absolute top-4 left-4 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-red-900/80' : 'bg-red-600'
          } text-white font-medium flex items-center shadow-lg animate-pulse`}>
          <FaForward className="mr-2" />
          <span>Đang tua video quá nhanh!</span>
        </div>
      )}

      {isReady && (
        <div className={`absolute bottom-0 left-0 right-0 h-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
          }`}>
          <div
            className="h-full bg-red-600 transition-all duration-1000"
            style={{ width: formatProgress() }}
          ></div>
        </div>
      )}

      {isCompleted?.isCompleted && (
        <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
          Đã hoàn thành
        </div>
      )}
    </div>
  );
};

export default memo(VideoIframe);

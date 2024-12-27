import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { getVideoIdFromUrl } from '@/Utils/functions';
import { setTimeout } from 'timers';

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
  const duration = data?.lessonVideo?.duration || 0;
  console.log('watch', watchTime / duration, isCompleted?.isCompleted);
  useEffect(() => {
    if (watchTime / duration >= 0.75 && !isCompleted?.isCompleted) {
      setIsCompleted({
        ...isCompleted,
        isCompleted: true,
      });
    }
  }, [watchTime]);
  useEffect(() => {
    const loadYouTubeAPI = () => {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(script);

      (window as any).onYouTubeIframeAPIReady = () => {
        const videoId = getVideoIdFromUrl(data?.lessonVideo?.videoLink);
        playerRef.current = new YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: videoId,
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
      playerRef.current = new YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
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

  return (
    <div className="h-[65rem] border-r-5 relative">
      <div id="youtube-player" className="w-full h-full"></div>
      {isFastForwarding && (
        <div className="absolute top-0 left-0 text-[1.4rem] bg-red-500 text-white p-2">
          Đang tua video quá nhanh!
        </div>
      )}
    </div>
  );
};

export default memo(VideoIframe);
